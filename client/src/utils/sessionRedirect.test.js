import {
  handleAxiosUnauthorized,
  isUnauthorizedStatus,
  redirectIfUnauthorizedResponse,
  redirectToSignIn,
} from "./sessionRedirect";

describe("sessionRedirect", () => {
  beforeEach(() => {
    localStorage.clear();
    delete window.location;
    window.location = { replace: vi.fn() };
  });

  it("treats 401 and 403 as unauthorized statuses", () => {
    expect(isUnauthorizedStatus(401)).toBe(true);
    expect(isUnauthorizedStatus(403)).toBe(true);
    expect(isUnauthorizedStatus(500)).toBe(false);
  });

  it("redirects customers to sign in and clears customer session", () => {
    localStorage.setItem("user", '{"role":"customer"}');
    localStorage.setItem("token", "abc");

    redirectToSignIn("customer");

    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(window.location.replace).toHaveBeenCalledWith("/sign-in");
  });

  it("redirects sellers to seller login and clears seller token", () => {
    localStorage.setItem("sellerToken", "seller-abc");

    redirectToSignIn("seller");

    expect(localStorage.getItem("sellerToken")).toBeNull();
    expect(window.location.replace).toHaveBeenCalledWith("/seller/login");
  });

  it("redirectIfUnauthorizedResponse redirects and returns true for unauthorized responses", () => {
    const result = redirectIfUnauthorizedResponse({ status: 403 }, "customer");

    expect(result).toBe(true);
    expect(window.location.replace).toHaveBeenCalledWith("/sign-in");
  });

  it("handleAxiosUnauthorized returns false for non-unauthorized errors", () => {
    const result = handleAxiosUnauthorized({ response: { status: 500 } }, "customer");

    expect(result).toBe(false);
    expect(window.location.replace).not.toHaveBeenCalled();
  });
});

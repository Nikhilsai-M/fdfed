import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

describe("Footer", () => {
  const renderFooter = () =>
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

  it("renders the brand and sustainability copy", () => {
    renderFooter();
    expect(
      screen.getByRole("heading", { name: /smart exchange/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/reduce e-waste/i)).toBeInTheDocument();
  });

  it("renders service links", () => {
    renderFooter();
    expect(screen.getByRole("link", { name: /sell phone/i })).toHaveAttribute(
      "href",
      "/sell-phone"
    );
    expect(screen.getByRole("link", { name: /buy laptop/i })).toHaveAttribute(
      "href",
      "/buylaptops"
    );
  });

  it("renders quick links and seller links", () => {
    renderFooter();
    expect(screen.getByRole("link", { name: /about us/i })).toHaveAttribute(
      "href",
      "/about_us"
    );
    expect(
      screen.getByRole("link", { name: /seller login/i })
    ).toHaveAttribute("href", "/seller/login");
  });

  it("renders social links and copyright text", () => {
    renderFooter();
    expect(screen.getByLabelText(/facebook/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/youtube/i)).toBeInTheDocument();
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
  });
});

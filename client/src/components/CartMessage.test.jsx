import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CartMessage from "./CartMessage";

describe("CartMessage", () => {
  const renderMessage = () =>
    render(
      <MemoryRouter>
        <CartMessage message="Added successfully" onClose={() => {}} />
      </MemoryRouter>
    );

  it("renders the provided message", () => {
    renderMessage();
    expect(screen.getByText(/added successfully/i)).toBeInTheDocument();
  });

  it("renders a link to the cart page", () => {
    renderMessage();
    expect(screen.getByRole("link", { name: /view cart/i })).toHaveAttribute(
      "href",
      "/cart"
    );
  });

  it("keeps the message container visible", () => {
    renderMessage();
    expect(screen.getByText(/added successfully/i).closest("div")).toBeInTheDocument();
  });
});

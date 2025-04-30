import React from "react";
import { render, screen } from "@testing-library/react";
import Hello from "./Hello";

describe("Hello", () => {
  it("renders greeting with the provided person name", () => {
    const personName = "World";
    render(<Hello person={personName} />);
    expect(screen.getByText(`Hello ${personName}`)).toBeInTheDocument();
  });
  
  it("applies correct class to the greeting element", () => {
    render(<Hello person="Alice" />);
    const heading = screen.getByRole('heading', { name: 'Hello Alice' });
    expect(heading).toHaveClass('hello-greeting');
  });
});

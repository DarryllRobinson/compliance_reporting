// test-utils.js
import { render as rtlRender, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

export function render(ui) {
  return rtlRender(<MemoryRouter>{ui}</MemoryRouter>);
}

export { screen };
export * from "@testing-library/react";

import { render, screen } from "./test-utils";
import Contact from "../../src/components/common/Contact";

test("renders contact form fields", () => {
  render(<Contact />);
  expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();
});

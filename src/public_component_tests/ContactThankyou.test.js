import { render, screen } from "./test-utils";
import ContactThankyou from "../../src/components/common/ContactThankyou";

test("renders contact confirmation", () => {
  render(<ContactThankyou />);
  expect(screen.getByText(/thank you/i, { exact: false })).toBeTruthy();
});

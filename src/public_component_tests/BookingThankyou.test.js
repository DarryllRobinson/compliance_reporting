import { render, screen } from "./test-utils";
import BookingThankyou from "../../src/components/common/BookingThankyou";

test("renders booking confirmation message", () => {
  render(<BookingThankyou />);
  expect(screen.getByText(/your booking is confirmed/i)).toBeInTheDocument();
});

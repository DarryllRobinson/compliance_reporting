import "@testing-library/jest-dom";
import { render, screen } from "./test-utils";
import Booking from "../components/common/Booking";

jest.spyOn(console, "error").mockImplementation(() => {});

global.fetch = jest.fn((url) => {
  if (url === "/api/bookings") {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    });
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  });
});

test("renders booking form", () => {
  render(<Booking />);
  expect(screen.getByText(/book an appointment/i)).toBeInTheDocument();
});

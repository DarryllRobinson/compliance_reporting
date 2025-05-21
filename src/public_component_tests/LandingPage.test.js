import { render, screen } from "./test-utils";
import LandingPage from "../../src/components/common/LandingPage";

test("renders landing headline", () => {
  render(<LandingPage />);
  expect(screen.getByText(/payment times reporting/i)).toBeInTheDocument();
});

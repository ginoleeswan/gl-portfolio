import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle, { nextTheme } from "./ThemeToggle";

test("nextTheme flips the value", () => {
  expect(nextTheme("dark")).toBe("light");
  expect(nextTheme("light")).toBe("dark");
});

test("clicking toggles the documentElement theme", () => {
  document.documentElement.dataset.theme = "dark";
  render(<ThemeToggle />);
  fireEvent.click(screen.getByRole("button"));
  expect(document.documentElement.dataset.theme).toBe("light");
});

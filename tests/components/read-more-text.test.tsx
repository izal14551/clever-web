// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReadMoreText } from "@/app/components/ReadMoreText";

describe("ReadMoreText", () => {
  it("truncates long text and expands on demand", () => {
    render(<ReadMoreText text="Satu dua tiga empat lima" maxChars={10} />);

    expect(screen.getByText("Satu dua t...")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Baca selengkapnya" }));
    expect(screen.getByText("Satu dua tiga empat lima")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Tampilkan lebih sedikit" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("does not render a toggle for short text", () => {
    render(<ReadMoreText text="Singkat" maxChars={10} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("fs/promises", () => ({
  mkdir: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
}));

import { readFile, writeFile } from "fs/promises";
import {
  addServiceRecommendation,
  getServiceRecommendation,
  removeServiceRecommendation,
} from "@/app/lib/serviceRecommendations";
import {
  addTestimonialReaction,
  getTestimonialReaction,
  getTestimonialReactions,
  removeTestimonialReaction,
} from "@/app/lib/testimonialReactions";

describe("local interaction stores", () => {
  beforeEach(() => {
    vi.stubEnv("APPS_SCRIPT_URL", "");
    vi.stubEnv("APPS_SCRIPT_API_KEY", "");
    vi.stubEnv("NETLIFY", "");
    vi.stubEnv("VERCEL", "");
    vi.mocked(readFile).mockReset();
    vi.mocked(writeFile).mockReset();
  });

  it("reads recommendation summaries and deduplicates local users", async () => {
    vi.mocked(readFile).mockResolvedValue(
      JSON.stringify({ "service-1": ["u1", "u1", "u2", 3] }) as never,
    );

    await expect(getServiceRecommendation("service-1", "u2")).resolves.toEqual({
      serviceId: "service-1",
      recommendationCount: 2,
      recommendedByCurrentUser: true,
    });
  });

  it("adds and removes local recommendations", async () => {
    vi.mocked(readFile)
      .mockResolvedValueOnce(JSON.stringify({ "service-1": ["u1"] }) as never)
      .mockResolvedValueOnce(JSON.stringify({ "service-1": ["u1", "u2"] }) as never);

    await expect(
      addServiceRecommendation({ serviceId: "service-1", userId: "u2" }),
    ).resolves.toEqual({
      serviceId: "service-1",
      recommendationCount: 2,
      recommendedByCurrentUser: true,
    });
    await expect(
      removeServiceRecommendation({ serviceId: "service-1", userId: "u2" }),
    ).resolves.toEqual({
      serviceId: "service-1",
      recommendationCount: 1,
      recommendedByCurrentUser: false,
    });
    expect(writeFile).toHaveBeenCalledTimes(2);
  });

  it("fills missing testimonial summaries and supports local add/remove", async () => {
    vi.mocked(readFile)
      .mockResolvedValueOnce(JSON.stringify({ t1: ["u1"] }) as never)
      .mockResolvedValueOnce(JSON.stringify({ t1: ["u1"] }) as never)
      .mockResolvedValueOnce(JSON.stringify({ t1: ["u1", "u2"] }) as never);

    await expect(getTestimonialReactions(["t1", "t2", "t1"], "u1")).resolves.toEqual([
      { testimonialId: "t1", reactionCount: 1, reactedByCurrentUser: true },
      { testimonialId: "t2", reactionCount: 0, reactedByCurrentUser: false },
    ]);
    await expect(
      addTestimonialReaction({ testimonialId: "t1", userId: "u2" }),
    ).resolves.toEqual({
      testimonialId: "t1",
      reactionCount: 2,
      reactedByCurrentUser: true,
    });
    await expect(
      removeTestimonialReaction({ testimonialId: "t1", userId: "u2" }),
    ).resolves.toEqual({
      testimonialId: "t1",
      reactionCount: 1,
      reactedByCurrentUser: false,
    });
  });

  it("returns direct testimonial summary from local storage", async () => {
    vi.mocked(readFile).mockResolvedValue(JSON.stringify({ t1: ["u1"] }) as never);

    await expect(getTestimonialReaction("t1", "u1")).resolves.toEqual({
      testimonialId: "t1",
      reactionCount: 1,
      reactedByCurrentUser: true,
    });
  });

  it("fails writes on read-only deployments when remote storage is unavailable", async () => {
    vi.stubEnv("VERCEL", "1");
    vi.mocked(readFile).mockResolvedValue(JSON.stringify({}) as never);

    await expect(
      addServiceRecommendation({ serviceId: "service-1", userId: "u1" }),
    ).rejects.toThrow("Service recommendation storage is not configured.");
    await expect(
      addTestimonialReaction({ testimonialId: "t1", userId: "u1" }),
    ).rejects.toThrow("Testimonial reaction storage is not configured.");
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/app/lib/memberSync", () => ({
  updateMemberUsername: vi.fn(),
}));

vi.mock("@/app/lib/serviceComments", () => ({
  addServiceComment: vi.fn(),
  addServiceCommentLike: vi.fn(),
  removeServiceCommentLike: vi.fn(),
}));

vi.mock("@/app/lib/serviceRecommendations", () => ({
  addServiceRecommendation: vi.fn(),
  removeServiceRecommendation: vi.fn(),
}));

vi.mock("@/app/lib/testimonialReactions", () => ({
  addTestimonialReaction: vi.fn(),
  getTestimonialReaction: vi.fn(),
  removeTestimonialReaction: vi.fn(),
}));

import { getServerSession } from "next-auth";
import { GET as healthGet } from "@/app/api/healthz/route";
import { POST as usernamePost } from "@/app/api/member/username/route";
import { POST as commentPost } from "@/app/api/service-comments/route";
import { POST as likePost } from "@/app/api/service-comments/like/route";
import { POST as recommendationPost } from "@/app/api/service-recommendations/route";
import {
  GET as testimonialGet,
  POST as testimonialPost,
} from "@/app/api/testimonial-reactions/route";
import { updateMemberUsername } from "@/app/lib/memberSync";
import {
  addServiceComment,
  addServiceCommentLike,
} from "@/app/lib/serviceComments";
import { addServiceRecommendation } from "@/app/lib/serviceRecommendations";
import {
  addTestimonialReaction,
  getTestimonialReaction,
} from "@/app/lib/testimonialReactions";

describe("api routes", () => {
  beforeEach(() => {
    vi.mocked(getServerSession).mockResolvedValue(null);
  });

  it("returns health status", async () => {
    const response = await healthGet();
    await expect(response.json()).resolves.toMatchObject({ status: "ok" });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("rejects unauthorized username updates", async () => {
    const response = await usernamePost(
      new Request("http://localhost/api/member/username", {
        method: "POST",
        body: JSON.stringify({ name: "Mom" }),
      }),
    );

    expect(response.status).toBe(401);
  });

  it("updates username for authenticated users", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "u1", email: "mom@example.com" },
    } as never);

    const response = await usernamePost(
      new Request("http://localhost/api/member/username", {
        method: "POST",
        body: JSON.stringify({ name: "  Mom Hebat  " }),
      }),
    );

    expect(response.status).toBe(200);
    expect(updateMemberUsername).toHaveBeenCalledWith({
      userId: "u1",
      email: "mom@example.com",
      name: "Mom Hebat",
    });
  });

  it("rejects too-short usernames", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "u1", email: "mom@example.com" },
    } as never);

    const response = await usernamePost(
      new Request("http://localhost/api/member/username", {
        method: "POST",
        body: JSON.stringify({ name: "ab" }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it("stores authenticated comments", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "u1", name: "Mom Rani" },
    } as never);
    vi.mocked(addServiceComment).mockResolvedValue({
      id: "c1",
      serviceId: "baby-massage",
      author: "Mom Rani",
      message: "Bagus",
      createdAt: "2026-05-15T00:00:00.000Z",
      likeCount: 0,
      likedByCurrentUser: false,
    });

    const response = await commentPost(
      new Request("http://localhost/api/service-comments", {
        method: "POST",
        body: JSON.stringify({
          serviceId: " baby-massage ",
          message: " Bagus ",
          authorMode: "account",
        }),
      }),
    );

    expect(response.status).toBe(201);
    expect(addServiceComment).toHaveBeenCalledWith({
      serviceId: "baby-massage",
      author: "Mom Rani",
      message: "Bagus",
      userId: "u1",
      authorMode: "account",
    });
  });

  it("rejects invalid comment payloads", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: "u1", name: "Mom Rani" },
    } as never);

    const response = await commentPost(
      new Request("http://localhost/api/service-comments", {
        method: "POST",
        body: JSON.stringify({
          serviceId: "",
          message: "",
          authorMode: "misterius",
        }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it("processes likes and recommendations for authenticated users", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u1" } } as never);
    vi.mocked(addServiceCommentLike).mockResolvedValue({
      commentId: "c1",
      likeCount: 1,
      likedByCurrentUser: true,
    });
    vi.mocked(addServiceRecommendation).mockResolvedValue({
      serviceId: "s1",
      recommendationCount: 1,
      recommendedByCurrentUser: true,
    });

    const likeResponse = await likePost(
      new Request("http://localhost/api/service-comments/like", {
        method: "POST",
        body: JSON.stringify({ commentId: " c1 " }),
      }),
    );
    const recommendationResponse = await recommendationPost(
      new Request("http://localhost/api/service-recommendations", {
        method: "POST",
        body: JSON.stringify({ serviceId: " s1 " }),
      }),
    );

    expect(likeResponse.status).toBe(200);
    expect(recommendationResponse.status).toBe(200);
  });

  it("serves and stores testimonial reactions", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u1" } } as never);
    vi.mocked(getTestimonialReaction).mockResolvedValue({
      testimonialId: "t1",
      reactionCount: 3,
      reactedByCurrentUser: true,
    });
    vi.mocked(addTestimonialReaction).mockResolvedValue({
      testimonialId: "t1",
      reactionCount: 4,
      reactedByCurrentUser: true,
    });

    const getResponse = await testimonialGet(
      new Request("http://localhost/api/testimonial-reactions?testimonialId=t1"),
    );
    const postResponse = await testimonialPost(
      new Request("http://localhost/api/testimonial-reactions", {
        method: "POST",
        body: JSON.stringify({ testimonialId: "t1" }),
      }),
    );

    expect(getResponse.status).toBe(200);
    expect(postResponse.status).toBe(200);
  });

  it("rejects testimonial requests without ids", async () => {
    const response = await testimonialGet(
      new Request("http://localhost/api/testimonial-reactions"),
    );

    expect(response.status).toBe(400);
  });
});

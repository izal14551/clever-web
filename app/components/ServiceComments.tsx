"use client";

import { FormEvent, useMemo, useState } from "react";
import { Heart, SendHorizonal } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ProgressLink as Link, useRouteProgress } from "./RouteProgress";
import type { ServiceComment } from "../lib/serviceComments";
import { formatCommentTimeAgo } from "../lib/commentTime";
import type { TestimonialData } from "../types/landing";

interface ServiceCommentsProps {
  serviceId: string;
  testimonials: TestimonialData[];
  comments: ServiceComment[];
}

type CommentCardItem =
  | {
      id: string;
      author: string;
      timeAgo: string;
      title: string;
      message: string;
      reactionCount: number;
      source: "testimonial";
    }
  | {
      id: string;
      author: string;
      timeAgo: string;
      title: string;
      message: string;
      reactionCount: number;
      likedByCurrentUser: boolean;
      source: "comment";
    };

export function ServiceComments({
  serviceId,
  testimonials,
  comments,
}: ServiceCommentsProps) {
  const pathname = usePathname();
  const { data: session, status: sessionStatus } = useSession();
  const routeProgress = useRouteProgress();
  const [message, setMessage] = useState("");
  const [authorMode, setAuthorMode] = useState<"anonymous" | "account">(
    "account",
  );
  const [localComments, setLocalComments] = useState<ServiceComment[]>(comments);
  const [likingCommentId, setLikingCommentId] = useState<string | null>(null);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = useMemo<CommentCardItem[]>(() => {
    const userComments = localComments.map((comment) => ({
      id: comment.id,
      author: comment.author,
      timeAgo: formatCommentTimeAgo(comment.createdAt),
      title: "Komentar Mom",
      message: comment.message,
      reactionCount: comment.likeCount,
      likedByCurrentUser: comment.likedByCurrentUser,
      source: "comment" as const,
    }));

    const testimonialItems = testimonials.map((testimonial) => ({
      id: `testimonial-${testimonial.id}`,
      author: testimonial.author,
      timeAgo: testimonial.timeAgo,
      title: testimonial.title,
      message: testimonial.message,
      reactionCount: testimonial.reactionCount,
      source: "testimonial" as const,
    }));

    return [...userComments, ...testimonialItems];
  }, [localComments, testimonials]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextMessage = message.trim();

    if (sessionStatus !== "authenticated") {
      setStatus({
        type: "error",
        message: "Silakan login terlebih dahulu untuk mengirim komentar.",
      });
      return;
    }

    if (!nextMessage) {
      setStatus({
        type: "error",
        message: "Komentar wajib diisi.",
      });
      return;
    }

    routeProgress.start();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/service-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          message: nextMessage,
          authorMode,
        }),
      });
      const payload: unknown = await response.json();

      if (!response.ok || !isCommentPayload(payload)) {
        const errorMessage =
          isMessagePayload(payload) && payload.message
            ? payload.message
            : "Komentar belum bisa dikirim.";
        throw new Error(errorMessage);
      }

      setLocalComments((current) => [payload.comment, ...current]);
      setMessage("");
      setStatus({
        type: "success",
        message: "Komentar berhasil dikirim.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Komentar belum bisa dikirim.",
      });
    } finally {
      setIsSubmitting(false);
      routeProgress.finish();
    }
  };

  const handleLike = async (commentId: string) => {
    if (sessionStatus !== "authenticated") {
      setStatus({
        type: "error",
        message: "Silakan login terlebih dahulu untuk memberi like.",
      });
      return;
    }

    const targetComment = localComments.find(
      (comment) => comment.id === commentId,
    );
    if (!targetComment) {
      return;
    }

    const willLike = !targetComment.likedByCurrentUser;
    routeProgress.start();
    setLikingCommentId(commentId);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/service-comments/like", {
        method: willLike ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId }),
      });
      const payload: unknown = await response.json();

      if (!response.ok || !isLikePayload(payload)) {
        const errorMessage =
          isMessagePayload(payload) && payload.message
            ? payload.message
            : willLike
              ? "Like belum bisa disimpan."
              : "Like belum bisa dibatalkan.";
        throw new Error(errorMessage);
      }

      setLocalComments((current) =>
        current.map((comment) =>
          comment.id === payload.like.commentId
            ? {
                ...comment,
                likeCount: payload.like.likeCount,
                likedByCurrentUser: payload.like.likedByCurrentUser,
              }
            : comment,
        ),
      );
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : willLike
              ? "Like belum bisa disimpan."
              : "Like belum bisa dibatalkan.",
      });
    } finally {
      setLikingCommentId(null);
      routeProgress.finish();
    }
  };

  return (
    <section className="bg-[#fff7ee] px-4 py-5 border-b border-[#f1e5d8]">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#1f1f1f]">Komentar Mom</h2>
          <p className="mt-1 text-sm text-[#7b6b5b]">
            Bagikan pengalaman Mom. Like berarti bantu Mom lain memahami komentar itu.
          </p>
        </div>
        <span className="shrink-0 text-sm font-semibold text-[#a68b6d]">
          {items.length}
        </span>
      </div>

      {sessionStatus === "authenticated" ? (
        <form
          onSubmit={handleSubmit}
          className="mb-5 rounded-[20px] border border-[#eadbc9] bg-white p-4 shadow-[0_10px_28px_rgba(166,139,109,0.08)]"
        >
          <div>
            <p className="text-sm font-semibold text-[#5f4c39]">
              Tampilkan komentar sebagai
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAuthorMode("account")}
                className={`h-11 rounded-md border text-sm font-semibold transition ${
                  authorMode === "account"
                    ? "border-[#a68b6d] bg-[#fff4e8] text-[#7f6243]"
                    : "border-[#eadbc9] bg-[#fffdf9] text-[#7b6b5b]"
                }`}
              >
                {session?.user?.name?.trim() || "Akun Mom"}
              </button>
              <button
                type="button"
                onClick={() => setAuthorMode("anonymous")}
                className={`h-11 rounded-md border text-sm font-semibold transition ${
                  authorMode === "anonymous"
                    ? "border-[#a68b6d] bg-[#fff4e8] text-[#7f6243]"
                    : "border-[#eadbc9] bg-[#fffdf9] text-[#7b6b5b]"
                }`}
              >
                Anonymous
              </button>
            </div>
          </div>

          <label className="mt-4 block text-sm font-semibold text-[#5f4c39]">
            Komentar
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={600}
              rows={4}
              className="mt-2 w-full resize-none rounded-md border border-[#eadbc9] bg-[#fffdf9] px-3 py-3 text-sm font-normal leading-6 text-[#3f3228] outline-none transition focus:border-[#a68b6d]"
              placeholder="Tulis komentar Mom di sini"
            />
          </label>

          <div className="mt-3 flex items-center justify-between gap-3">
            <p
              className={`min-h-5 text-xs ${
                status.type === "error" ? "text-[#c05c4c]" : "text-[#7b6b5b]"
              }`}
            >
              {status.message}
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-[#a68b6d] px-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-[#cdbba8]"
            >
              <SendHorizonal size={16} />
              {isSubmitting ? "Mengirim" : "Kirim"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-5 rounded-[20px] border border-[#eadbc9] bg-white p-4 shadow-[0_10px_28px_rgba(166,139,109,0.08)]">
          <p className="text-sm font-semibold text-[#5f4c39]">
            Login dulu untuk menulis komentar
          </p>
          <p className="mt-2 text-sm leading-6 text-[#7b6b5b]">
            Setelah masuk, Mom bisa memilih tampil sebagai anonymous atau
            memakai username akun.
          </p>
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(pathname || "/services")}`}
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-[#a68b6d] px-4 text-sm font-semibold text-white"
          >
            Masuk untuk komentar
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-[20px] border border-[#eadbc9] bg-white p-4 shadow-[0_10px_28px_rgba(166,139,109,0.08)]"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3e6d6] font-bold text-[#a68b6d]">
                  {item.author.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#3f3228]">
                    {item.author}
                  </p>
                  <p className="text-xs text-[#9b8977]">{item.timeAgo}</p>
                </div>
              </div>
              {item.source === "testimonial" ? (
                <div className="flex shrink-0 items-center gap-1 text-[#d27a6a]">
                  <Heart size={16} className="fill-red-500" />
                  <span className="text-xs font-semibold">
                    {item.reactionCount}
                  </span>
                </div>
              ) : (
                <span className="shrink-0 rounded-full bg-[#fff4e8] px-2.5 py-1 text-[11px] font-semibold text-[#a68b6d]">
                  Baru
                </span>
              )}
            </div>
            <p className="mb-2 text-sm font-semibold text-[#6f6255]">
              {item.title}
            </p>
            <p className="text-sm leading-7 text-[#5f4c39]">{item.message}</p>
            {item.source === "comment" ? (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleLike(item.id)}
                  disabled={likingCommentId === item.id}
                  className={`inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${
                    item.likedByCurrentUser
                      ? "border-[#f1c8c1] bg-[#fff2ef] text-[#c65f51] hover:border-[#d27a6a] hover:bg-[#ffe8e3]"
                      : "border-[#eadbc9] bg-[#fffdf9] text-[#7b6b5b] hover:border-[#d27a6a] hover:text-[#c65f51]"
                  }`}
                  aria-pressed={item.likedByCurrentUser}
                  aria-label={
                    item.likedByCurrentUser
                      ? "Batalkan bantuan untuk komentar ini"
                      : "Bantu Mom lain dengan komentar ini"
                  }
                >
                  <Heart
                    size={15}
                    className={
                      item.likedByCurrentUser ? "fill-current" : undefined
                    }
                  />
                  <span>{item.reactionCount}</span>
                  <span>
                    {likingCommentId === item.id
                      ? "Memproses"
                      : item.likedByCurrentUser
                        ? "Sudah Bantu"
                        : "Bantu Mom lain"}
                  </span>
                </button>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function isCommentPayload(value: unknown): value is { comment: ServiceComment } {
  return (
    isRecord(value) &&
    isRecord(value.comment) &&
    typeof value.comment.id === "string" &&
    typeof value.comment.serviceId === "string" &&
    typeof value.comment.author === "string" &&
    typeof value.comment.message === "string" &&
    typeof value.comment.createdAt === "string" &&
    typeof value.comment.likeCount === "number" &&
    typeof value.comment.likedByCurrentUser === "boolean"
  );
}

function isLikePayload(value: unknown): value is {
  like: {
    commentId: string;
    likeCount: number;
    likedByCurrentUser: boolean;
  };
} {
  return (
    isRecord(value) &&
    isRecord(value.like) &&
    typeof value.like.commentId === "string" &&
    typeof value.like.likeCount === "number" &&
    typeof value.like.likedByCurrentUser === "boolean"
  );
}

function isMessagePayload(value: unknown): value is { message: string } {
  return isRecord(value) && typeof value.message === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

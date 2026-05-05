import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import {
  addServiceCommentLike,
  removeServiceCommentLike,
} from "@/app/lib/serviceComments";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleCommentLikeRequest(request, "add");
}

export async function DELETE(request: Request) {
  return handleCommentLikeRequest(request, "remove");
}

async function handleCommentLikeRequest(
  request: Request,
  operation: "add" | "remove",
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message:
            operation === "add"
              ? "Silakan login terlebih dahulu untuk memberi like."
              : "Silakan login terlebih dahulu untuk membatalkan like.",
        },
        { status: 401 },
      );
    }

    const payload: unknown = await request.json();
    if (!isRecord(payload)) {
      return NextResponse.json(
        { message: "Data like tidak valid." },
        { status: 400 },
      );
    }

    const commentId = normalizeText(payload.commentId, 120);
    if (!commentId) {
      return NextResponse.json(
        { message: "Komentar tidak valid." },
        { status: 400 },
      );
    }

    const like =
      operation === "add"
        ? await addServiceCommentLike({
            commentId,
            userId: session.user.id,
          })
        : await removeServiceCommentLike({
            commentId,
            userId: session.user.id,
          });

    return NextResponse.json({ like }, { status: 200 });
  } catch (error) {
    console.error("Gagal memproses like komentar service:", error);
    const message =
      error instanceof Error &&
      error.message === "Comment storage is not configured."
        ? "Penyimpanan komentar belum dikonfigurasi di server."
        : operation === "add"
          ? "Like belum bisa disimpan. Coba lagi nanti."
          : "Like belum bisa dibatalkan. Coba lagi nanti.";

    return NextResponse.json({ message }, { status: 500 });
  }
}

function normalizeText(value: unknown, maxLength: number) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

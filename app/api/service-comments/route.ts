import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { addServiceComment } from "../../lib/serviceComments";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu untuk mengirim komentar." },
        { status: 401 },
      );
    }

    const payload: unknown = await request.json();

    if (!isRecord(payload)) {
      return NextResponse.json(
        { message: "Data komentar tidak valid." },
        { status: 400 },
      );
    }

    const serviceId = normalizeText(payload.serviceId, 80);
    const message = normalizeText(payload.message, 600);
    const authorMode = getAuthorMode(payload.authorMode);

    if (!serviceId || !message) {
      return NextResponse.json(
        { message: "Komentar wajib diisi." },
        { status: 400 },
      );
    }

    if (!authorMode) {
      return NextResponse.json(
        { message: "Pilih identitas komentar terlebih dahulu." },
        { status: 400 },
      );
    }

    const accountName = normalizeText(session.user.name, 60);
    const author =
      authorMode === "anonymous"
        ? "Anonymous"
        : accountName || "Akun Mom";

    const comment = await addServiceComment({
      serviceId,
      author,
      message,
      userId: session.user.id,
      authorMode,
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error("Gagal menyimpan komentar service:", error);
    const message =
      error instanceof Error && error.message === "Comment storage is not configured."
        ? "Penyimpanan komentar belum dikonfigurasi di server."
        : "Komentar belum bisa disimpan. Coba lagi nanti.";

    return NextResponse.json(
      { message },
      { status: 500 },
    );
  }
}

function normalizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function getAuthorMode(
  value: unknown,
): "anonymous" | "account" | null {
  if (value === "anonymous" || value === "account") {
    return value;
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import {
  addTestimonialReaction,
  getTestimonialReaction,
  removeTestimonialReaction,
} from "@/app/lib/testimonialReactions";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testimonialId = normalizeText(searchParams.get("testimonialId"), 160);

  if (!testimonialId) {
    return NextResponse.json(
      { message: "Testimonial tidak valid." },
      { status: 400 },
    );
  }

  const session = await getServerSession(authOptions);
  const reaction = await getTestimonialReaction(
    testimonialId,
    session?.user?.id,
  );

  return NextResponse.json({ reaction }, { status: 200 });
}

export async function POST(request: Request) {
  return handleReactionRequest(request, "add");
}

export async function DELETE(request: Request) {
  return handleReactionRequest(request, "remove");
}

async function handleReactionRequest(
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
              ? "Silakan login terlebih dahulu untuk bantu Mom lain."
              : "Silakan login terlebih dahulu untuk membatalkan bantuan.",
        },
        { status: 401 },
      );
    }

    const payload: unknown = await request.json();
    if (!isRecord(payload)) {
      return NextResponse.json(
        { message: "Data bantuan tidak valid." },
        { status: 400 },
      );
    }

    const testimonialId = normalizeText(payload.testimonialId, 160);
    if (!testimonialId) {
      return NextResponse.json(
        { message: "Testimonial tidak valid." },
        { status: 400 },
      );
    }

    const reaction =
      operation === "add"
        ? await addTestimonialReaction({
            testimonialId,
            userId: session.user.id,
          })
        : await removeTestimonialReaction({
            testimonialId,
            userId: session.user.id,
          });

    return NextResponse.json({ reaction }, { status: 200 });
  } catch (error) {
    console.error("Gagal memproses bantuan testimonial:", error);
    const message =
      error instanceof Error &&
      error.message === "Testimonial reaction storage is not configured."
        ? "Penyimpanan bantuan testimonial belum dikonfigurasi di server."
        : operation === "add"
          ? "Bantuan belum bisa disimpan. Coba lagi nanti."
          : "Bantuan belum bisa dibatalkan. Coba lagi nanti.";

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

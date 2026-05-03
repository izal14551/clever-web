import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { addServiceRecommendation } from "@/app/lib/serviceRecommendations";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu untuk merekomendasikan layanan." },
        { status: 401 },
      );
    }

    const payload: unknown = await request.json();
    if (!isRecord(payload)) {
      return NextResponse.json(
        { message: "Data rekomendasi tidak valid." },
        { status: 400 },
      );
    }

    const serviceId = normalizeText(payload.serviceId, 80);
    if (!serviceId) {
      return NextResponse.json(
        { message: "Layanan tidak valid." },
        { status: 400 },
      );
    }

    const recommendation = await addServiceRecommendation({
      serviceId,
      userId: session.user.id,
    });

    return NextResponse.json({ recommendation }, { status: 200 });
  } catch (error) {
    console.error("Gagal menyimpan rekomendasi service:", error);
    const message =
      error instanceof Error &&
      error.message === "Service recommendation storage is not configured."
        ? "Penyimpanan rekomendasi layanan belum dikonfigurasi di server."
        : "Rekomendasi belum bisa disimpan. Coba lagi nanti.";

    return NextResponse.json({ message }, { status: 500 });
  }
}

function normalizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

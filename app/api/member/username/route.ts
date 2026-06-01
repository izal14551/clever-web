import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { updateMemberUsername } from "@/app/lib/memberSync";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = (await request.json()) as { name?: unknown };
  const name =
    typeof body.name === "string" ? body.name.trim() : "";

  if (name.length < 3) {
    return NextResponse.json(
      { ok: false, message: "Username minimal 3 karakter." },
      { status: 400 },
    );
  }

  await updateMemberUsername({
    userId: session.user.id,
    email: session.user.email,
    name,
  });

  return NextResponse.json({ ok: true });
}

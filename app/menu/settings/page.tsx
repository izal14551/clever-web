import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { BottomNav } from "@/app/components/BottomNav";
import { ProfileSubpageHeader } from "@/app/components/ProfileSubpageHeader";
import { UsernameSettingsForm } from "@/app/components/UsernameSettingsForm";
import { authOptions } from "@/app/lib/auth";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#fffaf5] pb-24 font-sans shadow-md">
      <ProfileSubpageHeader title="Pengaturan" />

      <section className="bg-white px-6 pb-8 pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a68b6d]">
          Pengaturan akun
        </p>
        <h2 className="mt-3 text-2xl font-extrabold leading-tight text-[#1f1f1f]">
          Ubah username akun kamu
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#6f6255]">
          Untuk sekarang pengaturan hanya mendukung perubahan username tampilan.
        </p>
      </section>

      <section className="px-6 py-6">
        <UsernameSettingsForm initialName={session.user?.name || ""} />
      </section>

      <BottomNav />
    </main>
  );
}

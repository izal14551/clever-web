"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface UsernameSettingsFormProps {
  initialName: string;
}

export function UsernameSettingsForm({
  initialName,
}: UsernameSettingsFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (trimmedName.length < 3) {
      setError("Username minimal 3 karakter.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/member/username", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: trimmedName }),
        });

        const payload = (await res.json()) as { ok?: boolean; message?: string };
        if (!res.ok || !payload.ok) {
          throw new Error(payload.message || "Gagal menyimpan username.");
        }

        await update({ name: trimmedName });
        setName(trimmedName);
        setSuccess("Username berhasil diperbarui.");
        router.refresh();
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Terjadi kesalahan saat menyimpan username.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a68b6d]">
          Username
        </p>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-medium text-[#1f1f1f]">
            Nama yang ditampilkan
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Masukkan username baru"
            className="h-12 w-full rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 text-sm text-[#1f1f1f] outline-none transition-colors focus:border-[#d58b45]"
          />
        </label>
        <p className="mt-3 text-sm leading-relaxed text-[#6f6255]">
          Perubahan ini hanya untuk nama tampilan akun terlebih dahulu.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-2xl bg-[#d58b45] text-sm font-semibold text-white shadow-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Menyimpan..." : "Simpan Username"}
      </button>
    </form>
  );
}

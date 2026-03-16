"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import { Suspense, useEffect } from "react";

function LoginContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/menu";

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [callbackUrl, router, status]);

  if (status === "loading") {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center justify-center bg-gradient-to-b from-[#fff6ea] via-[#fffaf4] to-[#fffdf9] p-6 font-sans shadow-md">
        <p className="font-semibold text-[#8d7b69] animate-pulse">Memuat...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col bg-gradient-to-b from-[#fff6ea] via-[#fffaf4] to-[#fffdf9] font-sans shadow-md relative">
      <header className="sticky top-0 z-30 flex h-14 items-center border-b border-[#efe2d3] bg-white/90 px-4 backdrop-blur">
        <Link href="/" className="inline-flex items-center text-[#6f6255]">
          <ArrowLeft size={20} />
          <span className="ml-2 font-semibold">Kembali</span>
        </Link>
      </header>

      <section className="flex flex-1 items-center justify-center p-6">
        <div className="w-full rounded-[32px] border border-[#eadbc9] bg-white/88 px-6 py-10 text-center shadow-[0_20px_55px_rgba(166,139,109,0.12)] backdrop-blur">
          <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-b from-[#fff6ea] to-[#fff0df] p-4 shadow-[0_14px_30px_rgba(166,139,109,0.14)]">
            <Image
              src="/logo/LOGO_CLEVERMOM.PNG"
              alt="Clevermom Logo"
              width={96}
              height={96}
              className="h-auto w-auto"
              priority
            />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a68b6d]">
            Akun Clevermom
          </p>
          <h1 className="mb-2 mt-3 text-2xl font-extrabold leading-tight text-[#1f1f1f] text-balance">
            Selamat Datang di Clevermom
          </h1>
          <p className="mb-8 px-2 text-sm leading-7 text-[#7b6b5b]">
            Masuk dengan akun Google untuk melihat profil, mengakses layanan, dan melanjutkan kebutuhan treatment Mom.
          </p>

          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-[#eadbc9] bg-[#fffaf5] text-sm font-semibold text-[#1f1f1f] shadow-sm transition-colors hover:bg-[#fff1e2]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            <span>Masuk dengan Google</span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen max-w-md items-center justify-center bg-gradient-to-b from-[#fff6ea] via-[#fffaf4] to-[#fffdf9] p-6 font-sans shadow-md">
          <p className="font-semibold text-[#8d7b69] animate-pulse">Memuat...</p>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BottomNav } from "@/app/components/BottomNav";
import { getArticleList } from "@/app/lib/blogger";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export default async function ArtikelPage() {
  const articles = await getArticleList();

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-24 font-sans shadow-md">
      <header className="sticky top-0 z-30 bg-gradient-to-r from-[#9c8466] to-[#b59a79] px-4 py-4 text-white">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center justify-center">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Artikel Clevermom</h1>
            <p className="text-xs text-white/80">
              Customer dapat melihat daftar artikel terbaru.
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-4 px-4 py-5">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Link
              key={article.id}
              href={`/artikel/${article.id}`}
              className="block overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition-colors hover:bg-[#fffaf5]"
            >
              <div className="h-44 bg-[#f4ede4]">
                {article.imageUrl ? (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[#8d7b69]">
                    Gambar artikel belum tersedia.
                  </div>
                )}
              </div>
              <div className="space-y-3 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a68b6d]">
                  {formatDate(article.publishedAt)}
                </p>
                <h2 className="break-words text-lg font-bold leading-tight text-[#1f1f1f]">
                  {article.title}
                </h2>
                <p className="break-words text-sm leading-relaxed text-gray-600">
                  {article.excerpt}
                </p>
                <span className="inline-flex text-sm font-semibold text-[#b26724]">
                  Baca artikel
                </span>
              </div>
            </Link>
          ))
        ) : (
          <article className="rounded-2xl border border-dashed border-orange-200 bg-[#fffaf5] p-5 text-sm text-[#6f6255]">
            Belum ada artikel yang tersedia.
          </article>
        )}
      </section>

      <BottomNav />
    </main>
  );
}

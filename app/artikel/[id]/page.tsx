import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { BottomNav } from "@/app/components/BottomNav";
import { getArticleById } from "@/app/lib/blogger";

interface ArticleDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-24 font-sans shadow-md">
      <header className="sticky top-0 z-30 flex h-14 items-center border-b border-gray-100 bg-white px-4">
        <Link href="/artikel" className="inline-flex items-center text-gray-600">
          <ArrowLeft size={20} />
        </Link>
      </header>

      <section className="bg-[#fffaf5] px-5 pb-6 pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a68b6d]">
          {formatDate(article.publishedAt)}
        </p>
        <h1 className="mt-3 break-words text-2xl font-extrabold leading-tight text-[#1f1f1f]">
          {article.title}
        </h1>
        {article.authorName ? (
          <p className="mt-3 break-words text-sm text-[#6f6255]">
            Oleh {article.authorName}
          </p>
        ) : null}
      </section>

      {article.imageUrl ? (
        <section className="h-52 overflow-hidden bg-[#f4ede4]">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </section>
      ) : null}

      <section className="px-5 py-6">
        <div
          className="article-content text-sm leading-relaxed text-gray-700"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
      </section>

      <BottomNav />
    </main>
  );
}

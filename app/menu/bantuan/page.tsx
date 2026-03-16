import Link from "next/link";
import { BottomNav } from "@/app/components/BottomNav";
import { ProfileSubpageHeader } from "@/app/components/ProfileSubpageHeader";
import { getHelpData } from "@/app/lib/help";

export default async function BantuanPage() {
  const data = await getHelpData();
  const whatsappHref = data.whatsappNumber
    ? `https://wa.me/${data.whatsappNumber}`
    : "/";

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#fffaf5] pb-24 font-sans shadow-md">
      <ProfileSubpageHeader title="Bantuan" />

      <section className="bg-white px-6 pb-8 pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a68b6d]">
          Pusat bantuan
        </p>
        <h2 className="mt-3 text-2xl font-extrabold leading-tight text-[#1f1f1f]">
          {data.heroTitle}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#6f6255]">
          {data.heroDescription}
        </p>
      </section>

      <section className="space-y-4 px-6 py-6">
        {data.topics.map((topic) => (
          <article
            key={topic.id}
            className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
          >
            <h3 className="text-base font-bold text-[#1f1f1f]">{topic.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {topic.description}
            </p>
          </article>
        ))}
      </section>

      <section className="px-6 pb-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#d58b45] to-[#e8ae72] p-5 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
            Kontak cepat
          </p>
          <h3 className="mt-2 text-xl font-bold">{data.contactTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/90">
            {data.contactDescription}
          </p>
          <Link
            href={whatsappHref}
            className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#b26724]"
          >
            {data.contactButtonLabel}
          </Link>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { notFound } from "next/navigation";
import { BottomNav } from "../../components/BottomNav";
import { getServiceById } from "../serviceData";
import { ReadMoreText } from "../../components/ReadMoreText";
import { ServiceActionButtons } from "../../components/ServiceActionButtons";

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  return (
    <main className="max-w-md mx-auto bg-white min-h-screen pb-40 font-sans shadow-md relative">
      <header className="h-14 px-4 flex items-center border-b border-gray-100 bg-white sticky top-0 z-30">
        <Link
          href="/services"
          className="inline-flex items-center text-gray-600"
        >
          <ArrowLeft size={20} />
        </Link>
      </header>

      <section className="h-48 bg-gray-300 overflow-hidden">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : null}
      </section>

      <section className="px-4 py-5 bg-white">
        <h1 className="text-xl font-extrabold text-[#1f1f1f] leading-tight">
          {service.title}
        </h1>
        <p className="text-[#a68b6d] text-md font-semibold mt-2">
          Durasi: {service.duration}
        </p>
        <ReadMoreText
          text={service.description}
          maxChars={100}
          className="text-sm text-gray-800 mt-4 leading-relaxed"
          buttonClassName="text-[#a68b6d] text-sm mt-1"
        />
      </section>

      <section className="bg-gray-100 px-4 py-4">
        <h2 className="text-xl font-bold text-[#1f1f1f] mb-3">Komentar Mom</h2>
        <article className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#a68b6d]/20 flex items-center justify-center text-[#a68b6d] font-bold">
                B
              </div>
              <p className="font-semibold text-gray-900">Bunda Melisa</p>
            </div>
            <Heart size={18} className="text-red-500 fill-red-500" />
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            Selama perawatan newborn di clevermom, saya merasa sangat terbantu.
            Penjelasan bidan jelas, bayi jadi lebih nyaman, dan saya jadi lebih
            percaya diri merawat bayi di rumah.
          </p>
        </article>
      </section>

      <div className="fixed bottom-[73px] left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-3 py-2 z-40">
        <ServiceActionButtons serviceTitle={service.title} />
      </div>

      <BottomNav />
    </main>
  );
}

import { HeartHandshake, Quote } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ProfileSubpageHeader } from "../components/ProfileSubpageHeader";
import { TestimonialCard } from "../components/TestimonialCard";
import { getLandingData } from "../lib/landing";

export default async function TestimonialPage() {
  const data = await getLandingData();
  const testimonials = data.testimonials ?? [];

  return (
    <main className="relative mx-auto min-h-screen max-w-md bg-white pb-24 font-sans shadow-md">
      <ProfileSubpageHeader title="Testimonial Mom" backHref="/" />

      <section className="bg-gradient-to-b from-[#fffaf5] to-[#f8ecde] px-6 pb-8 pt-6">
        <div className="relative rounded-[28px] border border-[#ecd8c3] bg-[linear-gradient(180deg,_#fffefb_0%,_#fff4e8_55%,_#f8e4cd_100%)] p-5 shadow-[0_14px_34px_rgba(166,139,109,0.14)]">
          <Quote
            size={148}
            className="pointer-events-none absolute right-2 top-2 z-0 text-[#f2ddc5]"
            strokeWidth={1.5}
          />
          <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#c98a47] shadow-sm">
            <HeartHandshake size={24} />
          </div>
          <h1 className="relative z-10 mt-4 text-2xl font-bold leading-8 text-[#5f4c39]">
            Cerita hangat dari Mom yang sudah ditemani CleverMom
          </h1>
          <p className="relative z-10 mt-3 text-sm leading-6 text-[#7d6a57]">
            Kumpulan pengalaman dari ibu yang sudah mencoba layanan treatment, konsultasi, dan pendampingan kami di rumah.
          </p>
          <div className="relative z-10 mt-4 inline-flex items-center rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#a68b6d]">
            {testimonials.length} testimonial pilihan
          </div>
        </div>
      </section>

      <section className="-mt-2 px-6 pb-6">
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="relative overflow-hidden rounded-[24px] border border-[#f0e1cf] bg-[#fffaf5] p-5">
          <Quote
            size={132}
            className="pointer-events-none absolute -right-6 top-1 z-0 text-[#f3e5d4]"
            strokeWidth={1.5}
          />
          <h2 className="relative z-10 text-lg font-bold text-[#5f4c39]">
            Setiap cerita jadi pengingat bahwa ibu juga perlu ditemani
          </h2>
          <p className="relative z-10 mt-2 text-sm leading-6 text-[#7d6a57]">
            Karena itu kami berusaha menjaga setiap layanan tetap hangat, tenang, dan nyaman untuk Mom serta si kecil.
          </p>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

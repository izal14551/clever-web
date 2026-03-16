import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ServicesExplorer } from "../components/ServicesExplorer";
import { getServiceListData } from "./serviceData";

export default async function ServicesPage() {
  const services = await getServiceListData();

  return (
    <main className="max-w-md mx-auto bg-white min-h-screen pb-24 font-sans shadow-md relative">
      <header className="bg-gradient-to-r from-[#9c8466] to-[#b59a79] text-white px-4 py-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center justify-center">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-bold text-xl">Butuh Layanan Apa Hari Ini?</h1>
        </div>
      </header>

      <ServicesExplorer services={services} />

      <BottomNav />
    </main>
  );
}

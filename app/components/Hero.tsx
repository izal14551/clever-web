import React from "react";
import Image from "next/image";
import { HeroData } from "../types/landing";

interface HeroProps {
  data: HeroData;
}

export function Hero({ data }: HeroProps) {
  if (!data) return null;
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="flex flex-col items-center justify-center mb-2">
        <div className="w-50 h-50 flex items-center justify-center">
          <Image
            draggable={false}
            src={data.logoUrl || "/logo/LOGO_CLEVERMOM.png"}
            alt="Logo"
            width={256}
            height={256}
            className="object-contain"
            priority
          />
        </div>
      </div>

      <h1 className="text-[#a68b6d] font-bold text-2xl uppercase tracking-wide">
        {data.title}
      </h1>
      <h2 className="text-[#a68b6d] font-bold text-lg tracking-wide mb-3 opacity-90">
        {data.subtitle}
      </h2>
      <p className="text-gray-600 text-md font-medium">{data.description}</p>
    </div>
  );
}

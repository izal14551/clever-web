import React from "react";

interface PackageCardProps {
  title: string;
  subtitle: string;
  details: string[];
  duration: string;
  imageUrl?: string;
}

export function PackageCard({
  title,
  subtitle,
  details,
  duration,
  imageUrl,
}: PackageCardProps) {
  return (
    <div className="min-w-[280px] max-w-[280px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shrink-0 snap-center pb-2">
      <div className="h-32 bg-gray-200 relative mb-2 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs font-medium">
            Image Placeholder
          </div>
        )}
      </div>
      <div className="px-4 pb-3 flex flex-col h-full justify-between">
        <div>
          <h4 className="font-bold text-md text-gray-900 leading-tight mb-0.5">
            {title}
          </h4>
          <p className="text-sm text-gray-500 font-bold mb-3">{subtitle}</p>
          <ul className="text-sm text-gray-600 space-y-1.5 mb-4 list-none pl-0 leading-relaxed">
            {details.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-[#a68b6d] text-[8px] mt-1">●</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-right border-t border-dashed border-gray-200 pt-3 mt-auto">
          <span className="text-[#a68b6d] font-bold text-[10px]">
            Durasi: {duration}
          </span>
        </div>
      </div>
    </div>
  );
}

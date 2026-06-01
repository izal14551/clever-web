import React from "react";

interface PackageCardProps {
  title: string;
  subtitle: string;
  details: string[];
  duration: string;
  imageUrl?: string;
}

const MAX_DESCRIPTION_LENGTH = 100;

export function PackageCard({
  title,
  subtitle,
  details,
  duration,
  imageUrl,
}: PackageCardProps) {
  const fullText = details.join(" · ");
  const isTruncated = fullText.length > MAX_DESCRIPTION_LENGTH;
  const displayText = isTruncated
    ? fullText.slice(0, MAX_DESCRIPTION_LENGTH).trimEnd() + "…"
    : fullText;

  return (
    <div className="min-w-[280px] max-w-[280px] h-[320px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shrink-0 snap-center flex flex-col">
      <div className="h-32 bg-gray-200 relative shrink-0 overflow-hidden">
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
      <div className="px-4 py-3 flex flex-col flex-1 justify-between">
        <div className="min-h-0">
          <h4 className="font-bold text-md text-gray-900 leading-tight mb-0.5">
            {title}
          </h4>
          <p className="text-sm text-gray-500 font-bold mb-2">{subtitle}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{displayText}</p>
          {isTruncated && (
            <span className="text-xs text-[#a68b6d] font-semibold mt-1 inline-block">
              Baca selengkapnya →
            </span>
          )}
        </div>
        <div className="text-right border-t border-dashed border-gray-200 pt-2 mt-auto">
          <span className="text-[#a68b6d] font-bold text-[10px]">
            Durasi: {duration}
          </span>
        </div>
      </div>
    </div>
  );
}

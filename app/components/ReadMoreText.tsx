"use client";

import { useMemo, useState } from "react";

interface ReadMoreTextProps {
  text: string;
  maxChars?: number;
  className?: string;
  buttonClassName?: string;
}

export function ReadMoreText({
  text,
  maxChars = 180,
  className = "",
  buttonClassName = "",
}: ReadMoreTextProps) {
  const [expanded, setExpanded] = useState(false);

  const normalizedText = useMemo(() => text.trim(), [text]);
  const needsTruncate = normalizedText.length > maxChars;
  const previewText = useMemo(() => {
    if (!needsTruncate) return normalizedText;
    return `${normalizedText.slice(0, maxChars).trimEnd()}...`;
  }, [maxChars, needsTruncate, normalizedText]);

  return (
    <div>
      <p className={className}>{expanded ? normalizedText : previewText}</p>
      {needsTruncate ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className={buttonClassName}
          aria-expanded={expanded}
        >
          {expanded ? "Tampilkan lebih sedikit" : "Baca selengkapnya"}
        </button>
      ) : null}
    </div>
  );
}

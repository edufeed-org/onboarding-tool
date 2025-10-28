"use client";

import Image from "next/image";
import { useState } from "react";

interface AppIconProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function AppIcon({ src, alt, width, height, className = "" }: AppIconProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc("/apps/default-app-icon.svg")}
    />
  );
}
import Image from "next/image";
import React from "react";

export const Logo = () => {
  return (
    <p className="flex items-center mb-[32px]">
      <Image className="mr-[8px]" src="/logo.svg" width={32} height={32} alt="DataPulse" />
      <span className="text-[18px] font-bold tracking-[-0.3px]">Data</span>
      <span className="text-[18px] font-bold tracking-[-0.3px] text-primg">Pulse</span>
    </p>
  );
};

"use client";

import Image from "next/image";
import { useState, useRef } from "react";

export const AvatarUpload = ({ name }: { name: string }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("Max 5MB");
    setPreview(URL.createObjectURL(file));
  };

  const initial = name?.charAt(0).toUpperCase() || "?";

  return (
    <div
      className={
        "flex items-center gap-[16px] px-[16px] py-[16px] bg-elevated rounded-[12px] border-border1 mb-[24px]"
      }
    >
      <div
        className={
          "w-[48px] h-[48px] rounded-full bg-primary overflow-hidden shrink-0 flex items-center justify-center text-[20px] font-bold color-[#fff]"
        }
      >
        {preview ? (
          <Image src={preview} alt="avatar" fill className={"w-[100%] h-[100%] object-cover"} />
        ) : (
          initial
        )}
      </div>

      <div className={"flex-1"}>
        <p className={"text-[14px] font-semibold text-t1"}>Profile photo</p>
        <p className={"text-[12px] text-t3"}>JPG, PNG up to 5MB</p>
        <button
          onClick={() => inputRef.current?.click()}
          className={
            "gap-[6px] inline-flex items-center font-medium mt-[8px] py-[4px] px-[12px] text-[12px] rounded-[6px] border border-border2 bg-surface text-t2 cursor-pointer"
          }
        >
          ↑ Upload photo
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFile}
        className={"hidden"}
      />
    </div>
  );
};

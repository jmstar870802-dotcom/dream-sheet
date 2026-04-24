"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

export default function Modal({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
      dialogRef.current?.scrollTo({ top: 0 });
    }
  }, []);

  return createPortal(
    <dialog
      onClose={() => router.back()}
      onClick={(e) => {
        if ((e.target as any).nodeName === "DIALOG") router.back();
      }}
      className={`fixed inset-0 w-screen h-screen max-w-none max-h-none m-0 rounded-none flex flex-col`} ref={dialogRef}>
      {/* 상단 바 */}
      <div className="
        w-full h-7 bg-gray-100 rounded-t-2xl
        flex items-center justify-between px-4 shrink-0
        md:rounded-t-2xl
      ">
        <div className="w-8" />
        <div className="w-12 h-1.5 bg-gray-400 rounded-full md:hidden" />
        <span className="hidden md:block text-sm font-semibold text-gray-600">악보</span>
        <button
          onClick={() => router.back()}
          className="w-5 h-5 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full text-gray-700 text-sm font-medium"
        >
          ✕
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="p-1 flex-1">
        {children}
      </div>
    </dialog>,
    document.getElementById("modal-root") as HTMLElement
  );
}
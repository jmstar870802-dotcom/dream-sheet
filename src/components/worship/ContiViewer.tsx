// 콘티 조회 뷰어 - 곡 번호 버튼 선택 후 AbcViewer를 표시하는 클라이언트 컴포넌트
"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, ArrowBigLeft, ArrowBigDownDash, IterationCcw, ArrowBigUpDash, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import AbcViewer from "@/components/abc/AbcViewer";
import { SheetData } from "@/types/types";

interface Props {
  songs: SheetData[];
}

export default function ContiViewer({ songs }: Props) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewerKey, setViewerKey] = useState(0);
  const [visualTranspose, setVisualTranspose] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [dropdownOpen]);

  if (songs.length === 0) {
    return (
      <p className="flex items-center justify-center text-gray-400 p-10">
        등록된 곡이 없습니다.
      </p>
    );
  }

  const hasNotation = !!songs[selectedIndex]?.notation?.length;

  function handleSelect(i: number) {
    setSelectedIndex(i);
    setViewerKey((k) => k + 1);
    setVisualTranspose(0);
    setDropdownOpen(false);
  }

  return (
    <div className="flex flex-col gap-3">

      {/* Back + 곡 선택 드롭다운 + 키 버튼 + 새로고침 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
            title="뒤로가기"
          >
            <ArrowBigLeft className="w-5 h-5" />
          </button>

          {/* 드롭다운 */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-1 h-10 px-3 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold transition-colors"
            >
              <span>{selectedIndex + 1} / {songs.length}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <ul className="absolute top-full left-0 mt-1 z-50 min-w-[220px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                {songs.map((song, i) => (
                  <li key={i}>
                    <button
                      onClick={() => handleSelect(i)}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                        i === selectedIndex
                          ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-semibold"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="truncate">{song.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {hasNotation && (
            <>
              <button
                onClick={() => setVisualTranspose((t) => t - 1)}
                className="w-10 h-10 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
                title="키 다운"
              >
                <ArrowBigDownDash className="w-5 h-5" />
              </button>
              <button
                onClick={() => setVisualTranspose(0)}
                className="w-10 h-10 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
                title="원키"
              >
                <IterationCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setVisualTranspose((t) => t + 1)}
                className="w-10 h-10 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
                title="키업"
              >
                <ArrowBigUpDash className="w-5 h-5" />
              </button>
            </>
          )}
          <button
            onClick={() => setViewerKey((k) => k + 1)}
            className="w-10 h-10 rounded-lg bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center transition-colors"
            title="화면 새로고침"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* AbcViewer */}
      <div className="w-full overflow-x-hidden md:max-w-2xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl rounded-xl border border-gray-200 dark:border-gray-700">
        <AbcViewer
          key={viewerKey}
          notationData={songs[selectedIndex]}
          showBack={false}
          showKeyControls={false}
          visualTranspose={visualTranspose}
        />
      </div>

    </div>
  );
}

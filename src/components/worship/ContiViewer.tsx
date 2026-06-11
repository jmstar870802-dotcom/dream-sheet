// 콘티 조회 뷰어 - 곡 번호 버튼 선택 후 AbcViewer를 표시하는 클라이언트 컴포넌트
"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, ArrowBigLeft, ChevronDown, LayoutGrid, Columns2, Square } from "lucide-react";
import { useRouter } from "next/navigation";
import AbcViewer from "@/components/abc/AbcViewer";
import { SheetData } from "@/types/types";

type SplitMode = 1 | 2 | 4;

interface Props {
  songs: SheetData[];
}

export default function ContiViewer({ songs }: Props) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewerKey, setViewerKey] = useState(0);
  const [splitMode, setSplitMode] = useState<SplitMode>(1);
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

  // 분할 모드에 따른 그룹 시작 인덱스 목록
  const groupStarts: number[] = [];
  for (let i = 0; i < songs.length; i += splitMode) {
    groupStarts.push(i);
  }

  // 현재 selectedIndex가 속한 그룹의 시작점
  const currentGroupStart = Math.floor(selectedIndex / splitMode) * splitMode;

  function handleSelect(groupStart: number) {
    setSelectedIndex(groupStart);
    setViewerKey((k) => k + 1);
    setDropdownOpen(false);
  }

  function handleSplitMode(mode: SplitMode) {
    // 모드 전환 시 현재 인덱스를 새 그룹 시작점으로 스냅
    const snapped = Math.floor(selectedIndex / mode) * mode;
    setSplitMode(mode);
    setSelectedIndex(snapped);
    setViewerKey((k) => k + 1);
  }

  const displaySongs = songs.slice(currentGroupStart, currentGroupStart + splitMode);

  // 드롭다운 버튼 라벨: 분할 모드에 따라 범위 표시
  function groupLabel(start: number) {
    const end = Math.min(start + splitMode - 1, songs.length - 1);
    return splitMode === 1 ? `${start + 1}` : `${start + 1} - ${end + 1}`;
  }

  // 드롭다운 버튼에 표시할 현재 범위
  const currentLabel = groupLabel(currentGroupStart);

  return (
    <div className="flex flex-col gap-3">

      {/* 툴바 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* 뒤로가기 */}
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
            title="뒤로가기"
          >
            <ArrowBigLeft className="w-5 h-5" />
          </button>

          {/* 곡 선택 드롭다운 */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-1 h-10 px-3 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold transition-colors"
            >
              <span>{currentLabel} / {songs.length}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <ul className="absolute top-full left-0 mt-1 z-50 min-w-[240px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                {groupStarts.map((start) => {
                  const end = Math.min(start + splitMode - 1, songs.length - 1);
                  const isActive = start === currentGroupStart;
                  const groupSongs = songs.slice(start, end + 1);
                  return (
                    <li key={start}>
                      <button
                        onClick={() => handleSelect(start)}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                          isActive
                            ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-semibold"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <span className="shrink-0 min-w-[32px] h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center px-1">
                          {splitMode === 1 ? start + 1 : `${start + 1}-${end + 1}`}
                        </span>
                        <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                          {groupSongs.map((s) => s.title).join(" · ")}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* 1분할 */}
          <button
            onClick={() => handleSplitMode(1)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              splitMode === 1 ? "bg-indigo-600 text-white" : "bg-indigo-400 hover:bg-indigo-500 text-white"
            }`}
            title="1분할"
          >
            <Square className="w-5 h-5" />
          </button>

          {/* 2분할 */}
          <button
            onClick={() => handleSplitMode(2)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              splitMode === 2 ? "bg-indigo-600 text-white" : "bg-indigo-400 hover:bg-indigo-500 text-white"
            }`}
            title="2분할"
          >
            <Columns2 className="w-5 h-5" />
          </button>

          {/* 4분할 */}
          <button
            onClick={() => handleSplitMode(4)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              splitMode === 4 ? "bg-indigo-600 text-white" : "bg-indigo-400 hover:bg-indigo-500 text-white"
            }`}
            title="4분할"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>

          {/* 새로고침 */}
          <button
            onClick={() => setViewerKey((k) => k + 1)}
            className="w-10 h-10 rounded-lg bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center transition-colors"
            title="화면 새로고침"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 악보 영역 */}
      {splitMode === 1 ? (
        <div className="w-full overflow-x-hidden md:max-w-2xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl rounded-xl border border-gray-200 dark:border-gray-700">
          <AbcViewer
            key={viewerKey}
            notationData={songs[currentGroupStart]}
            showBack={false}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {displaySongs.map((song, i) => (
            <div key={`${viewerKey}-${currentGroupStart + i}`} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <AbcViewer notationData={song} showBack={false} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

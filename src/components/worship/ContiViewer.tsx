// 콘티 조회 뷰어 - 곡 번호 버튼 선택 후 AbcViewer를 표시하는 클라이언트 컴포넌트
"use client";

import { useState } from "react";
import { RotateCcw, ArrowBigLeft, ArrowBigDownDash, IterationCcw, ArrowBigUpDash } from "lucide-react";
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
  }

  return (
    <div className="flex flex-col gap-3">

      {/* Back + 번호 버튼 + 키 버튼 + 새로고침 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
            title="뒤로가기"
          >
            <ArrowBigLeft className="w-5 h-5" />
          </button>
          {songs.map((_, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors ${
                i === selectedIndex
                  ? "bg-teal-700 text-white"
                  : "bg-teal-500 text-white hover:bg-teal-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
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

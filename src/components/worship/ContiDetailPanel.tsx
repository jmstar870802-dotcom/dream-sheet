// 콘티 편집 패널 - 신규/수정 모드를 구분하고 찬양목록·콘티목록을 나란히 표시하는 클라이언트 컴포넌트
"use client";

import { SheetData, Meta, ContiData } from "@/types/types";
import { useState, useRef } from "react";
import { Play, X, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getPaginationRange } from "@/utils/pagination";
import { createContiAction } from "@/action/createConti.action";
import { updateContiAction } from "@/action/updateConti.action";
import { deleteContiAction } from "@/action/deleteConti.action";

const KEY_COLORS: Record<string, string> = {
  C: "bg-red-50    text-red-700    dark:bg-red-950    dark:text-red-300",
  D: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  E: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  F: "bg-green-50  text-green-700  dark:bg-green-950  dark:text-green-300",
  G: "bg-teal-50   text-teal-700   dark:bg-teal-950   dark:text-teal-300",
  A: "bg-blue-50   text-blue-700   dark:bg-blue-950   dark:text-blue-300",
  B: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
};

function getKeyColor(key: string): string {
  const root = key.replace(/[#bm]/g, "").toUpperCase();
  return KEY_COLORS[root] ?? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
}

interface Props {
  conti: ContiData | null;
  initialSheets: SheetData[];
  initialMeta: Meta;
  initialSelectedSongs?: SheetData[];
}

export default function ContiDetailPanel({ conti, initialSheets, initialMeta, initialSelectedSongs = [] }: Props) {
  const router = useRouter();
  const isNew = conti === null;

  const [contiDate, setContiDate] = useState(conti?.contiDate ?? new Date().toISOString().split("T")[0]);
  const [contiNote, setContiNote] = useState(conti?.contiNote ?? "");
  const [contiLeader, setContiLeader] = useState(conti?.contiLeader ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [sheets, setSheets] = useState(initialSheets);
  const [meta, setMeta] = useState(initialMeta);
  const [searchInput, setSearchInput] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<SheetData[]>(initialSelectedSongs);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function fetchSheets(title: string, page: number) {
    const query = new URLSearchParams({ title, page: String(page), limit: "10" });
    const res = await fetch(`/api/sheet?${query}`);
    if (!res.ok) return;
    const result = await res.json();
    setSheets(result.data);
    setMeta(result.meta);
  }

  function handleSearch(value: string) {
    setSearchInput(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchSheets(value, 1), 500);
  }

  function handlePage(page: number) {
    fetchSheets(searchInput, page);
  }

  function handleAddSong(song: SheetData) {
    if (selectedSongs.find((s) => s.id === song.id)) return;
    setSelectedSongs((prev) => [...prev, song]);
  }

  function handleRemoveSong(id: number) {
    setSelectedSongs((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    const contiDtl = selectedSongs.map((song, index) => ({
      SheetId: song.id,
      contiOrder: index + 1,
      contiNotation: song.notation,
      conti_img_url: song.img_url,
    }));
    const payload = { contiDate, contiNote, contiLeader, contiDtl };
    try {
      if (isNew) {
        const { id } = await createContiAction(payload);
        router.push(`/conti-mngt/detail/${id}`);
      } else {
        await updateContiAction(conti.id, payload);
      }
    } catch (err) {
      setSaveError(`저장 실패: ${err}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!conti || !confirm("콘티를 삭제하시겠습니까?")) return;
    const { status, error } = await deleteContiAction(conti.id);
    if (status) {
      router.push("/conti-mngt");
    } else {
      setSaveError(error);
    }
  }

  const pageNumbers = getPaginationRange(meta.page, meta.totalPages);

  return (
    <div className="flex flex-col gap-4">

      {/* 헤더: 콘티 메타 입력 + 저장 버튼 */}
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 dark:text-gray-400">콘티일자</label>
          <input
            type="date"
            value={contiDate}
            onChange={(e) => setContiDate(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 dark:text-gray-400">예배명</label>
          <input
            type="text"
            value={contiNote}
            onChange={(e) => setContiNote(e.target.value)}
            placeholder="예) 주일 2부 예배"
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 dark:text-gray-400">예배인도자</label>
          <input
            type="text"
            value={contiLeader}
            onChange={(e) => setContiLeader(e.target.value)}
            placeholder="이름"
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-32"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saving ? "저장 중..." : isNew ? "저장" : "수정"}
        </button>
        {!isNew && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            삭제
          </button>
        )}
        {saveError && (
          <p className="text-xs text-red-500">{saveError}</p>
        )}
      </div>

      {/* 두 패널 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* 왼쪽: 찬양목록 */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
          <div className="px-6 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <p className="text-xs text-gray-400 whitespace-nowrap">총 {meta.total.toLocaleString()}곡</p>
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
                viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
              >
                <circle cx="6.5" cy="6.5" r="4.5" />
                <line x1="10.5" y1="10.5" x2="14" y2="14" />
              </svg>
              <input
                type="text"
                placeholder="제목, 가사 검색..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {sheets.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-10 text-center text-sm text-gray-400">
                      검색 결과가 없습니다
                    </td>
                  </tr>
                ) : (
                  sheets.map((song) => (
                    <tr key={song.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        <div className="flex gap-1">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold self-start mt-0.5 ${getKeyColor(song.key)}`}>
                            {song.key}
                          </span>
                          <div>
                            <span className="block font-bold text-gray-800 text-theme-lg dark:text-white/90">{song.title}</span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{song.lyrics}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 w-10">
                        <button
                          onClick={() => handleAddSong(song)}
                          className="flex justify-center items-center w-full text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-2 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {meta.total > 0
                ? `${(meta.page - 1) * meta.limit + 1} – ${Math.min(meta.page * meta.limit, meta.total)} / 총 ${meta.total.toLocaleString()}곡`
                : "결과 없음"}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePage(meta.page - 1)}
                disabled={!meta.hasPrev}
                className="w-8 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ‹
              </button>
              {pageNumbers.map((n, i) =>
                n === "..." ? (
                  <span key={`ellipsis-${i}`} className="w-8 text-center text-gray-400 text-sm">…</span>
                ) : (
                  <button
                    key={n}
                    onClick={() => handlePage(n as number)}
                    className={`w-8 h-7 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      n === meta.page
                        ? "bg-blue-600 text-white border border-blue-600"
                        : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {n}
                  </button>
                )
              )}
              <button
                onClick={() => handlePage(meta.page + 1)}
                disabled={!meta.hasNext}
                className="w-8 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {/* 오른쪽: 콘티목록 */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {selectedSongs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-sm text-gray-400">
                      검색 결과가 없습니다
                    </td>
                  </tr>
                ) : (
                  selectedSongs.map((song, index) => (
                    <tr key={song.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-3 py-2 w-8 text-center text-xs font-semibold text-gray-400 dark:text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        <div className="flex gap-1">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold self-start mt-0.5 ${getKeyColor(song.key)}`}>
                            {song.key}
                          </span>
                          <div>
                            <span className="block font-bold text-gray-800 text-theme-lg dark:text-white/90">{song.title}</span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{song.lyrics}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 w-10">
                        <button
                          onClick={() => handleRemoveSong(song.id)}
                          className="flex justify-center items-center w-full text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {selectedSongs.length > 0 ? `총 ${selectedSongs.length}곡` : "결과 없음"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

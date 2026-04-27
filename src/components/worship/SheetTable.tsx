// components/SheetTable.tsx
"use client";

import { Meta, SheetData } from "@/types/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { getPaginationRange } from "@/utils/pagination";
import { Play } from "lucide-react";
import Link from "next/link";

interface SheetTableProps {
  data: SheetData[];
  meta: Meta;
}

type SortKey = keyof Pick<SheetData, "title" | "key" | "lyrics">;

function SortIcon({ active, dir }: { active: boolean; dir: string }) {
  return (
    <span className="ml-1 flex flex-col gap-[2px]">
      <span
        className={`block border-x-4 border-x-transparent border-b-4 ${
          active && dir === "asc"
            ? "border-b-gray-800 dark:border-b-gray-100"
            : "border-b-gray-300 dark:border-b-gray-600"
        }`}
      />
      <span
        className={`block border-x-4 border-x-transparent border-t-4 ${
          active && dir === "desc"
            ? "border-t-gray-800 dark:border-t-gray-100"
            : "border-t-gray-300 dark:border-t-gray-600"
        }`}
      />
    </span>
  );
}

const KEY_COLORS: Record<string, string> = {
  C:  "bg-red-50    text-red-700    dark:bg-red-950    dark:text-red-300",
  D:  "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  E:  "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  F:  "bg-green-50  text-green-700  dark:bg-green-950  dark:text-green-300",
  G:  "bg-teal-50   text-teal-700   dark:bg-teal-950   dark:text-teal-300",
  A:  "bg-blue-50   text-blue-700   dark:bg-blue-950   dark:text-blue-300",
  B:  "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
};

function getKeyColor(key: string): string {
  const root = key.replace(/[#bm]/g, "").toUpperCase();
  return KEY_COLORS[root] ?? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
}

export default function SheetTable({ data, meta }: SheetTableProps) {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get("title") ?? "");
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const currentSortKey = searchParams.get("sortKey") ?? "id";
  const currentSortDir = searchParams.get("sortDir") ?? "asc";
  const currentLimit = Number(searchParams.get("limit") ?? 10);

  // URL 파라미터 업데이트 → 서버 재요청
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  // 검색 디바운스 (500ms)
  function handleSearch(value: string) {
    setSearchInput(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      updateParams({ title: value, page: "1" });
    }, 500);
    setDebounceTimer(timer);
  }

  function handleSort(key: SortKey) {
    const newDir =
      currentSortKey === key && currentSortDir === "asc" ? "desc" : "asc";
    updateParams({ sortKey: key, sortDir: newDir, page: "1" });
  }

  function handlePage(page: number) {
    updateParams({ page: String(page) });
  }

  function handleLimit(limit: string) {
    updateParams({ limit, page: "1" });
  }

  const columns = [
    { key: "title" as SortKey, label: "제목",   width: "w-[35%]" },
    { key: "key"   as SortKey, label: "키",     width: "w-[10%]" },
    { key: "lyrics"as SortKey, label: "첫소절", width: "w-[45%]" },
  ];

const pageNumbers = getPaginationRange(meta.page, meta.totalPages);

 return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Controls */}
      <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span><p className="text-xs text-gray-400 mt-0.5">총 {meta.total.toLocaleString()}곡</p></span>
          <select
            value={currentLimit}
            onChange={(e) => handleLimit(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span>entries</span>
        </div>
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
            viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
          >
            <circle cx="6.5" cy="6.5" r="4.5" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" />
          </svg>
          <input
            type="text"
            placeholder="제목, 키, 가사 검색..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">
                  검색 결과가 없습니다
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    <div className="flex gap-1">
                      <div>
                        <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold ${getKeyColor(row.key)}`}>
                          {row.key}
                        </span>
                      </div>
                      <div>
                         <span className="block font-bold text-gray-800 text-theme-lg dark:text-white/90">
                           {row.title}
                         </span> 
                         <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                           {row.lyrics}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs text-gray-500 dark:text-gray-400 max-w-0">
                    <Link href={`/worship-search/detail/${row.id}`}>
                      <Play />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {meta.total > 0
            ? `${(meta.page - 1) * meta.limit + 1} – ${Math.min(meta.page * meta.limit, meta.total)} / 총 ${meta.total.toLocaleString()}곡`
            : "결과 없음"}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePage(meta.page - 1)}
            disabled={!meta.hasPrev}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>
          {pageNumbers.map((n, i) =>
            n === "..." ? (
              <span key={`ellipsis-${i}`} className="w-8 text-center text-gray-400 text-sm">…</span>
            ) : (
              <button
                key={n}
                onClick={() => handlePage(n as number)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
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
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

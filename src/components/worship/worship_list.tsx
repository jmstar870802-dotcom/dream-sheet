"use client";

import { useState, useMemo } from "react";

type Status = "active" | "away" | "offline";

interface User {
  name: string;
  position: string;
  dept: string;
  status: Status;
}

const ALL_DATA: User[] = [
  { name: "Abram Schleifer",    position: "Sales Assistant",    dept: "Sales",       status: "active"  },
  { name: "Charlotte Anderson", position: "Marketing Manager",  dept: "Marketing",   status: "active"  },
  { name: "Ethan Brown",        position: "Software Engineer",  dept: "Engineering", status: "away"    },
  { name: "Isabella Davis",     position: "UI/UX Designer",     dept: "Design",      status: "active"  },
  { name: "James Wilson",       position: "Data Analyst",       dept: "Analytics",   status: "offline" },
  { name: "Sophia Martinez",    position: "Product Manager",    dept: "Product",     status: "active"  },
  { name: "Liam Johnson",       position: "DevOps Engineer",    dept: "Engineering", status: "active"  },
  { name: "Olivia Garcia",      position: "Content Strategist", dept: "Marketing",   status: "away"    },
  { name: "Noah Williams",      position: "QA Engineer",        dept: "Engineering", status: "offline" },
  { name: "Emma Thompson",      position: "HR Specialist",      dept: "HR",          status: "active"  },
];

const BADGE_COLORS = [
  "bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  "bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200",
  "bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
  "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
  "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200",
  "bg-pink-50 text-pink-800 dark:bg-pink-950 dark:text-pink-200",
];

const STATUS_CONFIG: Record<Status, { dot: string; label: string }> = {
  active:  { dot: "bg-green-500",  label: "Active"  },
  away:    { dot: "bg-amber-500",  label: "Away"    },
  offline: { dot: "bg-gray-400",   label: "Offline" },
};

type SortKey = keyof Pick<User, "name" | "position" | "dept">;

function getColor(name: string): string {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % BADGE_COLORS.length;
  return BADGE_COLORS[h];
}

function initials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase();
}

function SortIcon({ active, dir }: { active: boolean; dir: number }) {
  return (
    <span className="ml-1 flex flex-col gap-[2px]">
      <span
        className={`block border-x-4 border-x-transparent border-b-4 ${
          active && dir === 1 ? "border-b-gray-800 dark:border-b-gray-100" : "border-b-gray-300 dark:border-b-gray-600"
        }`}
      />
      <span
        className={`block border-x-4 border-x-transparent border-t-4 ${
          active && dir === -1 ? "border-t-gray-800 dark:border-t-gray-100" : "border-t-gray-300 dark:border-t-gray-600"
        }`}
      />
    </span>
  );
}

export default function DataTable() {
  const [query, setQuery] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey | "">("");
  const [sortDir, setSortDir] = useState(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const list = q
      ? ALL_DATA.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.position.toLowerCase().includes(q) ||
            r.dept.toLowerCase().includes(q)
        )
      : [...ALL_DATA];

    if (sortKey) {
      list.sort((a, b) => a[sortKey].localeCompare(b[sortKey]) * sortDir);
    }
    return list;
  }, [query, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;
  const pageData = filtered.slice(start, start + perPage);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => d * -1);
    else { setSortKey(key); setSortDir(1); }
    setPage(1);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setPage(1);
  }

  function handlePerPage(e: React.ChangeEvent<HTMLSelectElement>) {
    setPerPage(Number(e.target.value));
    setPage(1);
  }

  const entryStart = filtered.length ? start + 1 : 0;
  const entryEnd = Math.min(start + perPage, filtered.length);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Controls */}
      <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Show</span>
          <select
            value={perPage}
            onChange={handlePerPage}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {[5, 10, 25].map((n) => (
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
            placeholder="Search..."
            value={query}
            onChange={handleSearch}
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">
                   조회되는 찬양이 없습니다.
                </td>
              </tr>
            ) : (
              pageData.map((row) => {
                const color = getColor(row.name);
                const { dot, label } = STATUS_CONFIG[row.status];
                return (
                  <tr key={row.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0 ${color}`}
                        >
                          {initials(row.name)}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {row.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-medium ${color}`}>
                        {row.position}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-500 dark:text-gray-400">
                      {row.dept}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                        {label}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {filtered.length
            ? `Showing ${entryStart} to ${entryEnd} of ${filtered.length} entries`
            : "No entries"}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                n === safePage
                  ? "bg-blue-600 text-white border border-blue-600"
                  : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
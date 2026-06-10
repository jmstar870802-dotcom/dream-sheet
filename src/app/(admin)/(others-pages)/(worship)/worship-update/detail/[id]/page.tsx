import AbcEditor from "@/components/abc/AbcEditor";
import { SheetData } from "@/types/types";

export default async function WorshipUpdateDetail({ params }: { params: Promise<{ id: number }> }) {

  const { id } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/sheet/${id}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`서버 응답 에러: ${response.status}`);
  }

  const worshipData: SheetData = await response.json();

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-5">
      <div className="mx-auto w-full">
        <AbcEditor notationData={worshipData} />
      </div>
    </div>
  );
}
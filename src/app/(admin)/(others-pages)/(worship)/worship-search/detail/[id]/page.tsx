import AbcViewer from "@/components/abc/AbcViewer";
import { SheetData } from "@/types/types";
import ScaledContent from "@/components/common/ScaledContent"; // 추가

export default async function worship({ params }: { params: Promise<{ id: number }> }) {

  const { id } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/sheet/${id}`,
    { cache: "force-cache" }
  );

  if (!response.ok) {
    throw new Error(`서버 응답 에러: ${response.status}`);
  }

  const worshipData: SheetData = await response.json();
  return (
    <div>
      <div className="w-full overflow-x-hidden
                    md:w-full md:max-w-2xl
                    lg:max-w-2xl
                    xl:max-w-3xl
                    2xl:max-w-4xl
                    rounded-xl border border-gray-200 bg-white px-1 py-1 dark:border-gray-800 dark:bg-white/[0.03] xm:px-1 xl:py-1">
         <AbcViewer notationData={worshipData} />
      </div>
    </div>
  );
}
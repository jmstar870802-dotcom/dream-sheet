// 콘티 상세 편집 페이지 - 신규(new) 또는 기존 콘티 수정
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ContiDetailPanel from "@/components/worship/ContiDetailPanel";
import { ContiData, SheetData, Meta } from "@/types/types";

export default async function ContiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";

  const sheetsRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/sheet?page=1&limit=10`,
    { cache: "no-store" }
  );
  if (!sheetsRes.ok) throw new Error(`찬양 목록 조회 실패: ${sheetsRes.status}`);
  const { data: sheets, meta }: { data: SheetData[]; meta: Meta } = await sheetsRes.json();

  let conti: ContiData | null = null;
  let initialSelectedSongs: SheetData[] = [];

  if (!isNew) {
    const contiRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/conti/${id}`,
      { cache: "no-store" }
    );
    if (!contiRes.ok) throw new Error(`콘티 데이터 조회 실패: ${contiRes.status}`);
    conti = await contiRes.json();

    if (conti?.contiDtl && conti.contiDtl.length > 0) {
      const sorted = [...conti.contiDtl].sort((a, b) => a.contiOrder - b.contiOrder);
      const fetched = await Promise.all(
        sorted.map(async (dtl) => {
          const r = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/sheet/${dtl.SheetId}`, {
            cache: "no-store",
          });
          if (!r.ok) return null;
          const sheet: SheetData = await r.json();
          return {
            ...sheet,
            notation: dtl.contiNotation ?? sheet.notation,
            img_url: dtl.conti_img_url ?? sheet.img_url,
          };
        })
      );
      initialSelectedSongs = fetched.filter((s): s is SheetData => s !== null);
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle={isNew ? "콘티 신규" : "콘티 편집"} />
      <div className="min-h-screen rounded-lg border border-gray-200 bg-white px-2 py-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <ContiDetailPanel
          conti={conti}
          initialSheets={sheets}
          initialMeta={meta}
          initialSelectedSongs={initialSelectedSongs}
        />
      </div>
    </div>
  );
}

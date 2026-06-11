// 콘티 조회 상세 페이지 - 콘티의 곡 목록을 악보로 조회하는 페이지
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ContiViewer from "@/components/worship/ContiViewer";
import { ContiData, SheetData } from "@/types/types";

export default async function ContiSearchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const contiRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/conti/${id}`,
    { cache: "no-store" }
  );
  if (!contiRes.ok) throw new Error(`콘티 데이터 조회 실패: ${contiRes.status}`);

  const conti: ContiData = await contiRes.json();

  const songs: SheetData[] = [];

  if (conti.contiDtl && conti.contiDtl.length > 0) {
    const sorted = [...conti.contiDtl].sort((a, b) => a.contiOrder - b.contiOrder);

    const fetched = await Promise.all(
      sorted.map(async (dtl) => {
        const r = await fetch(
          `${process.env.NEXT_PUBLIC_API_SERVER_URL}/sheet/${dtl.SheetId}`,
          { cache: "no-store" }
        );
        if (!r.ok) return null;
        const sheet: SheetData = await r.json();
        return {
          ...sheet,
          notation: dtl.contiNotation || sheet.notation,
          img_url:  dtl.conti_img_url  || sheet.img_url,
        };
      })
    );

    songs.push(...fetched.filter((s): s is SheetData => s !== null));
  }

  const pageTitle = `${conti.contiDate ?? ""} / ${conti.contiNote ?? ""} / ${conti.contiLeader ?? ""}`.trim();

  return (
    <div>
      <PageBreadcrumb pageTitle={pageTitle} />
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <ContiViewer songs={songs} />
      </div>
    </div>
  );
}

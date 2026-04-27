// app/worship/page.tsx  (경로는 프로젝트에 맞게 조정)
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SheetTable from "@/components/worship/SheetTable";
import { Meta, SheetData } from "@/types/types";

interface SearchParams {
  title?: string;
  key?: string;
  page?: string;
  limit?: string;
  sortKey?: string;
  sortDir?: string;
}

interface PaginatedResponse {
  data: SheetData[];
  meta: Meta;
}

async function getSheetData(searchParams: SearchParams): Promise<PaginatedResponse> {

   const query = new URLSearchParams({
    title:   searchParams.title   ?? "",
    key:     searchParams.key     ?? "",
    page:    searchParams.page    ?? "1",
    limit:   searchParams.limit   ?? "10",
    sortKey: searchParams.sortKey ?? "id",
    sortDir: searchParams.sortDir ?? "asc",
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/sheet?${query.toString()}`,
    {
      next: { tags: ["worship-list", "worship"] },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`서버 응답 에러: ${response.status}`);
  }

  return response.json();
}

export default async function WorshipPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;  // await으로 unwrap
  const { data, meta } = await getSheetData(params);
  
  return (
    <div>
      <PageBreadcrumb pageTitle="찬양등록" />
      <div className="mx-auto w-full">
         <SheetTable data={data} meta={meta} />
      </div>
    </div>
  );
}


import type { Metadata } from "next";
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
    { next: { tags: ["worship-list", "worship"] }, cache: "no-store" }
  );

  if (!response.ok) throw new Error(`서버 응답 에러: ${response.status}`);
  return response.json();
}

export const metadata: Metadata = {
  title: "꿈의교회 찬양 관리",
  description: "잘쓰면 좋고 안쓰면 나만 쓰고",
};

export default async function Ecommerce({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = searchParams;
  const { data, meta } = await getSheetData(params);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">

      <div className="col-span-12 space-y-6 xl:col-span-7">
        <SheetTable data={data} meta={meta} />
      </div>

      {/* <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div> */}
    </div>
  );
}

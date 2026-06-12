// 콘티 조회 목록 페이지 (서버 컴포넌트)
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ContiTableSearch from "@/components/worship/ContiTableSearch";
import { ContiData, Meta } from "@/types/types";

interface SearchParams {
  contiNote?: string;
  page?: string;
  limit?: string;
  sortKey?: string;
  sortDir?: string;
}

interface PaginatedResponse {
  data: ContiData[];
  meta: Meta;
}

async function getContiData(searchParams: SearchParams): Promise<PaginatedResponse> {
  const query = new URLSearchParams({
    contiNote: searchParams.contiNote ?? "",
    page:      searchParams.page      ?? "1",
    limit:     searchParams.limit     ?? "10",
    sortKey:   searchParams.sortKey   ?? "contiDate",
    sortDir:   searchParams.sortDir   ?? "desc",
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/conti?${query.toString()}`,
    {
      next: { tags: ["conti-list"] },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`서버 응답 에러: ${response.status}`);
  }

  return response.json();
}

export default async function ContiSearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { data, meta } = await getContiData(params);

  return (
    <div>
      <PageBreadcrumb pageTitle="콘티조회" />
      <div className="mx-auto w-full">
        <ContiTableSearch data={data} meta={meta} showNewButton={false} />
      </div>
    </div>
  );
}

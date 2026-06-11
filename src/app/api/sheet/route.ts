// 클라이언트 컴포넌트의 CORS 우회를 위한 sheet API 프록시
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams.toString();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/sheet?${params}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return Response.json(data, { status: res.status });
}

// 콘티 레코드를 삭제하는 서버 액션
"use server";

import { revalidateTag } from "next/cache";

export async function deleteContiAction(id: number): Promise<{ status: boolean; error: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/conti/${id}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.message ?? `삭제 실패 (${response.status})`);
    }

    revalidateTag("conti-list", "default");

    return { status: true, error: "" };
  } catch (err) {
    return { status: false, error: `삭제에 실패했습니다: ${err}` };
  }
}

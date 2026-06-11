// 기존 콘티 레코드를 수정하는 서버 액션
"use server";

import { revalidateTag } from "next/cache";
import { ContiPayload } from "./createConti.action";

export async function updateContiAction(id: number, payload: ContiPayload): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/conti/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errBody = await response.json().catch(() => response.text());
    console.error("콘티 수정 실패:", response.status, errBody);
    throw new Error(`콘티 수정 실패: ${response.status} — ${JSON.stringify(errBody)}`);
  }

  revalidateTag("conti-list", "default");
}

// 새 콘티 레코드를 생성하고 생성된 ID를 반환하는 서버 액션
"use server";

import { revalidateTag } from "next/cache";

export interface ContiDtlItem {
  SheetId: number;
  contiOrder: number;
  contiNotation: string;
  conti_img_url: string;
}

export interface ContiPayload {
  contiDate: string;
  contiNote: string;
  contiLeader: string;
  contiDtl: ContiDtlItem[];
}

export async function createContiAction(payload: ContiPayload): Promise<{ id: number }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/conti`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errBody = await response.json().catch(() => response.text());
    console.error("콘티 생성 실패:", response.status, errBody);
    throw new Error(`콘티 생성 실패: ${response.status} — ${JSON.stringify(errBody)}`);
  }

  const result = await response.json();
  revalidateTag("conti-list", "default");

  return { id: result.id };
}

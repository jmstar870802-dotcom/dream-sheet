"use server";
import { revalidateTag } from "next/cache";

export async function deleteSheetAction(id: number) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/sheet/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.message ?? `삭제 실패 (${response.status})`);
    }

    revalidateTag("worship-list",'default');

    return { status: true, error: "" };

  } catch (err) {
    return { status: false, error: `삭제에 실패했습니다 : ${err}` };
  }
}

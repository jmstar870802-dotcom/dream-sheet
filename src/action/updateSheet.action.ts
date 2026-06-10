"use server";
import { revalidateTag } from "next/cache";

export async function updateSheetAction(_: any, formData: FormData) {

  const data = Object.fromEntries(formData.entries());
  const { id, title, key } = data;

  if (!title || !key) {
    return {
      status: false,
      error: "제목 또는 원키를 입력하세요.",
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/sheet/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    revalidateTag("worship-list", 'default');

    return {
      status: true,
      error: "",
      data: result,
    };

  } catch (err) {
    return {
      status: false,
      error: `수정에 실패했습니다 : ${err}`,
      data: null,
    };
  }
}
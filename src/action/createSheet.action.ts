"use server";
import { revalidateTag} from "next/cache";
import { id } from "zod/v4/locales";
export async function createSheetAction(_: any, formData: FormData) {

  // 1. formData를 JSON 객체로 변환
  const data = Object.fromEntries(formData.entries());
  // 개별 변수가 필요하다면 구조 분해 할당을 사용하세요.
  const { title, key} = data;

  if (!title || !key) {
    return {
      status: false,
      error: "제목 또는 원키를 입력하세요.",
    };
  }

  try {
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/sheet`,
      {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }, 
        body: JSON.stringify(data),
        cache: 'force-cache',
      }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message);
    }

    revalidateTag(`sheet`, 'default' );
    
    return {
      status: true,
      error: "",
      data: result
    };
  
  } catch (err) {
    return {
      status: false,
      error: `저장에 실패했습니다 : ${err}`,
      data: null
    };
  }
}
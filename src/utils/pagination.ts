/**
 * 표시할 페이지 번호 배열을 계산합니다.
 * Array.from으로 전체 배열을 만들지 않고 필요한 번호만 계산합니다.
 *
 * 예) totalPages=100, currentPage=50 → [1, "...", 49, 50, 51, "...", 100]
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number
): (number | "...")[] {
  if (totalPages <= 1) return [1];
 
  const delta = 1; // 현재 페이지 기준 양쪽으로 표시할 페이지 수
  const range = new Set<number>();
 
  // 항상 포함: 첫 페이지, 마지막 페이지
  range.add(1);
  range.add(totalPages);
 
  // 현재 페이지 주변
  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i > 1 && i < totalPages) range.add(i);
  }
 
  // 정렬 후 ellipsis 삽입
  const sorted = Array.from(range).sort((a, b) => a - b);
  const result: (number | "...")[] = [];
 
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("...");
    }
    result.push(sorted[i]);
  }
 
  return result;
}
export interface UserData {
  id: number;
  userName: string;
  birthday: string;
  mngrSe: string;
}

export interface SheetData{
  id : number;
  title : string;
  key : string;
  lyrics: string;
  notation : string;
  img_url : string;
  createdAt: Date;  
  updatedAt: Date;
  visualTranspose : number;
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

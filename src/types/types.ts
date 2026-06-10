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

export interface ContiData{
  id : number;
  contiDate : string;
  contiNote : string;
  contiNotation: string;
  conti_img_url : string;
  SheetId : number;
  createdAt: Date;  
  updatedAt: Date;
  visualTranspose : number;
  contiLeader : string;
}


export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

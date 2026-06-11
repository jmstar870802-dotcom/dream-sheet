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
  contiLeader: string;
  createdAt: Date;
  updatedAt: Date;
  contiDtl?: ContiDtlData[];
}

export interface ContiDtlData{
  id : number;
  contiNotation: string;
  conti_img_url : string;
  ContiId : number;
  SheetId : number;
  contiOrder : number;
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

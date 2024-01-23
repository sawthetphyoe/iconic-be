export interface Pageable<T extends Record<string, any> = any> {
  totalRecord: number;
  totalPage: number;
  currentPage: number;
  currentSize: number;
  dtoList: T[];
}

export interface AppResponse {
  id?: string;
  message: string;
}

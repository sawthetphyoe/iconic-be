export interface Pageable<T extends Record<string, any> = any> {
  totalRecord: number;
  totalPage: number;
  currentPage: number;
  currentSize: number;
  dtoList: T[];
}

export interface SuccessResponse {
  id?: string;
  message: string;
}

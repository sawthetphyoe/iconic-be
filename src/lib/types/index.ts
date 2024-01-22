export interface Pageable<T = Object> {
  totalRecord: number;
  totalPage: number;
  currentPage: number;
  currentSize: number;
  dtoList: T[];
}

export interface Pageable<T extends Record<string, any> = any> {
  totalRecord: number;
  totalPage: number;
  currentPage: number;
  currentSize: number;
  dtoList: T[];
}

export interface MutationSuccessResponse {
  id?: string;
  message: string;
}

export interface RequestUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role?: string;
  iat: number;
  exp: number;
}

export interface ProductColorImage {
  color: string;
  colorCode: string;
  imageId: string;
}

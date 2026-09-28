export interface Tag {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FetchTagsParams {
  page?: number;
  limit?: number;
  q?: string;
}

export interface FetchTagsResponse {
  tags: Tag[];
  total: number;
  page: number;
  limit: number;
}

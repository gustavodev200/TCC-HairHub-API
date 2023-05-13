export interface CategoryDTO {
  id?: string;
  name: string;
}

export interface CategoryOutputDTO {
  id?: string;
  name: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

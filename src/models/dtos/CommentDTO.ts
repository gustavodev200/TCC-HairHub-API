export interface CommentClientDTO {
  id: string;
  name: string;
  role: string;
  image?: string;
}

export interface CommentEmployeeDTO {
  id: string;
  name: string;
  image?: string;
}

export interface CommentInputDTO {
  content: string;
  client: CommentClientDTO;
  employee: CommentEmployeeDTO;
  star: number;
}

export interface CommentOutputDTO extends CommentInputDTO {
  id: string;
}

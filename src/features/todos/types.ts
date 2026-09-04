export interface TodoItem {
  _id: string;
  title: string;
  title2?: string;
  studentsName?: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}
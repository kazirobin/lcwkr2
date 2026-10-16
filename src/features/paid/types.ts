export interface PaidEntry {
  _id: string;
  name: string;
  whatsapp?: string;
  address?: string;
  occupation?: string;
  dateOfBirth?: string;
  details?: string;
  hskLevel?: string;
  /** Admin-managed: which classes (1..CLASS_SLOTS) the member attended. */
  classMarks: boolean[];
  /** Admin-managed: which homework (1..HOMEWORK_SLOTS) the member did. */
  homeworkMarks: boolean[];
  /** Derived on the server: how many classMarks / homeworkMarks are true. */
  classesDone: number;
  homeworkDone: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Fields anyone may submit or edit. */
export interface PaidInput {
  name: string;
  whatsapp?: string;
  address?: string;
  occupation?: string;
  dateOfBirth?: string;
  details?: string;
  hskLevel?: string;
}

/** Admin-only marks payload. Both keys optional so one grid can be saved alone. */
export interface PaidMarks {
  classMarks?: boolean[];
  homeworkMarks?: boolean[];
}

export type MarksKind = "class" | "homework";

/** Admin-managed page settings shared by everyone who opens the page. */
export interface PaidSettings {
  /** Prefilled greeting used when a WhatsApp number is tapped. */
  waMessage: string;
}

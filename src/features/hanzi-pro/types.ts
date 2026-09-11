// Hanzi Pro challenge — client-safe types.

export interface HanziProStudent {
  _id: string;
  name: string;
  phone: string;
  trxId: string;
  amount: number;
  learnedCount: number;
  status: "Pending" | "Active";
  createdAt?: string;
  updatedAt?: string;
}

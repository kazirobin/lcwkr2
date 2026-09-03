/**
 * Donor honour roll + donation config for `/donate`.
 */

export interface Donor {
  _id?: string;
  name: string;
  phone: string;
  location: string;
  trxId: string;
  amount: number;
  createdAt?: string | Date;
}

export const seedDonors: Donor[] = [
  {
    name: "Thakurdash Chandra Ray",
    phone: "017******12",
    location: "Dhaka",
    trxId: "9K2L1M4P",
    amount: 200,
  },
];

export const DONATION = {
  /** Suggested voluntary amount, in BDT. */
  amount: 200,
  /** প্ল্যাটফর্মের বর্তমান ডোনেশন লক্ষ্যমাত্রা (টাকায়) */
  targetGoal: 5000,
  /** bKash Personal number for "Send Money". */
  bkashNumber: "01787881334",
  /** Admin WhatsApp in E.164 without the leading "+". */
  adminWhatsApp: "8801787881334",
} as const;
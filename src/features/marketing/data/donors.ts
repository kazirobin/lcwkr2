/**
 * Donor honour roll + donation config for `/donate`.
 *
 * Rows are the recorded donors shown on the page. New entries submitted through
 * the form are prepended client-side (phone masked) and also POSTed to
 * `/api/donations`.
 */
export interface Donor {
  name: string;
  phone: string;
  location: string;
  trxId: string;
  amount: number;
}

export const donors: Donor[] = [
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
  /** bKash Personal number for "Send Money". */
  bkashNumber: "01787881334",
  /** Admin WhatsApp in E.164 without the leading "+". */
  adminWhatsApp: "8801787881334",
} as const;

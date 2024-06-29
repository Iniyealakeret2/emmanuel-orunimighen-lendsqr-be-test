export type DonationType = {
  id: string;
  date: Date;
  txn_id?: string;
  sender_id: string;
  beneficiary_id: string;
  amount_donated: number;
};

export type DonationQueryParams = {
  startDate: Date;
  endDate: Date;
};

export type DonationQueryValidationType = {
  page: number;
  limit: number;
};

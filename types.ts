
export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED'
}

export enum TransactionType {
  RECHARGE = 'RECHARGE',
  WALLET_ADD = 'WALLET_ADD',
  CASHBACK = 'CASHBACK'
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
}

export interface RechargePlan {
  id: string;
  price: number;
  validity: string;
  data: string;
  calls: string;
  category: 'Recommended' | 'Data' | 'Unlimited' | 'Entertainment';
}

export interface User {
  name: string;
  email: string;
  role: 'user' | 'admin';
  balance: number;
  phone: string;
}

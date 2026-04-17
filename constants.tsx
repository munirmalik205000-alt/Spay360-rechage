
import { Transaction, TransactionType, TransactionStatus, RechargePlan } from './types';

export const MOCK_PLANS: RechargePlan[] = [
  { id: '1', price: 299, validity: '28 Days', data: '1.5GB/Day', calls: 'Unlimited', category: 'Recommended' },
  { id: '2', price: 479, validity: '56 Days', data: '1.5GB/Day', calls: 'Unlimited', category: 'Recommended' },
  { id: '3', price: 666, validity: '84 Days', data: '1.5GB/Day', calls: 'Unlimited', category: 'Unlimited' },
  { id: '4', price: 719, validity: '84 Days', data: '2GB/Day', calls: 'Unlimited', category: 'Unlimited' },
  { id: '5', price: 155, validity: '24 Days', data: '1GB Total', calls: 'Unlimited', category: 'Recommended' },
  { id: '6', price: 19, validity: 'Existing Pack', data: '1GB', calls: 'N/A', category: 'Data' },
  { id: '7', price: 121, validity: 'Existing Pack', data: '12GB', calls: 'N/A', category: 'Data' },
  { id: '8', price: 999, validity: '84 Days', data: '3GB/Day', calls: 'Unlimited', category: 'Entertainment' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TXN1001', date: '2023-11-20 14:30', amount: 299, type: TransactionType.RECHARGE, status: TransactionStatus.SUCCESS, description: 'Prepaid Recharge - 9876543210' },
  { id: 'TXN1002', date: '2023-11-19 09:15', amount: 1000, type: TransactionType.WALLET_ADD, status: TransactionStatus.SUCCESS, description: 'Added to Wallet' },
  { id: 'TXN1003', date: '2023-11-18 18:45', amount: 15, type: TransactionType.CASHBACK, status: TransactionStatus.SUCCESS, description: 'Cashback Received' },
  { id: 'TXN1004', date: '2023-11-17 11:20', amount: 479, type: TransactionType.RECHARGE, status: TransactionStatus.FAILED, description: 'Prepaid Recharge - 9876543210' },
  { id: 'TXN1005', date: '2023-11-16 10:00', amount: 500, type: TransactionType.WALLET_ADD, status: TransactionStatus.PENDING, description: 'Added to Wallet' },
];

export const OPERATORS = ['Airtel', 'Jio', 'Vi', 'BSNL'];

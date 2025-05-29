import { Account } from '../../account/models/account.model';
import { Category } from '../../category/models/category.model';

export type TypeTransaction = 'TYPE1' | 'TYPE2';

export interface Transaction {
    id: string;
    amount: number;
    name: string;
    details?: string;
    isActive: boolean;
    account?: string;
    accountModel?: Account;
    category?: string;
    categoryModel?: Category;
    typeTransactionRaw: string;
    dateTransaction?: string;
}


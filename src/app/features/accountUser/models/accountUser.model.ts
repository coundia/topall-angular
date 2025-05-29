import { Account } from '../../account/models/account.model';

export type TypeAccountUser = 'TYPE1' | 'TYPE2';

export interface AccountUser {
    id: string;
    name: string;
    account?: string;
    accountModel?: Account;
    username: string;
    details?: string;
    isActive: boolean;
}


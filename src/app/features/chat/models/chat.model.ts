import { Account } from '../../account/models/account.model';

export type TypeChat = 'TYPE1' | 'TYPE2';

export interface Chat {
    id: string;
    messages: string;
    responses?: string;
    responsesJson?: string;
    state?: string;
    account?: string;
    accountModel?: Account;
    updatedAt?: string;
    reference?: string;
}


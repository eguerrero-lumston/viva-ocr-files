import { User } from 'src/app/model/user';
export class UsersRequest {
    docs: User[];
    limit: number;
    page: number;
    pages: number;
    total: number;
}

import { Role } from './role';
export class User {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  id: number;
  createdAt: string;
  role: Role;
  rol: number;
  token: string;
  username: string;
  password: string;
  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}

export class User {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  id: number;
  createdAt: string;
  role: string;
  token: string;
  username: string;
  password: string;
  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}

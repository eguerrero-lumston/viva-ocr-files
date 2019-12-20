export class ServerError {
  error: {
    code: number;
    driver: boolean;
    errmsg: string;
    index: number;
    name: string;
  };
  message: string;
  public constructor(init?: Partial<ServerError>) {
    Object.assign(this, init);
  }
}

export class DocType {
    _id: string;
    name: string;
    position: number;
    textToRecognize: string;
    created: string;
    deleted: string;
    positionName: string;
    public constructor(init?: Partial<DocType>) {
      Object.assign(this, init);
    }
}

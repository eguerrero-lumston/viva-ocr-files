import { Position } from './position';

export class DocType {
    _id: string;
    name: string;
    position: Position;
    textToRecognize: string;
    created: string;
    deleted: string;
    positionId: string;
    public constructor(init?: Partial<DocType>) {
      Object.assign(this, init);
    }
}

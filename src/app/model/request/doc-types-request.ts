import { DocType } from './../doc-type';
export class DocTypesRequest {
    docs: DocType[];
    limit: number;
    page: number;
    pages: number;
    total: number;
}

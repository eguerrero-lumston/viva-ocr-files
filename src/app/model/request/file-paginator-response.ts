import { File } from '../file/file';

export class FilePaginatorResponse {
    docs: File[];
    limit: number;
    page: number;
    pages: number;
    total: number;
}

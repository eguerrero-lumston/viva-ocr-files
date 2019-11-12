import { Manifest } from './../manifest/manifest';

export class ManifestPaginatorResponse {
    docs: Manifest[];
    limit: number;
    page: number;
    pages: number;
    total: number;
}

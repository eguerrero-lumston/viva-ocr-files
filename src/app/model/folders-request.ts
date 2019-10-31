import { File } from './file';
import { Folder } from './folder';

export interface FoldersRequest {
    folders: string[];
    files: File[];
}

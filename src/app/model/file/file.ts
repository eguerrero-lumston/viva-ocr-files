import { MatchesFile } from './matches-file';
import { FileObject } from './file-object';
import { Course } from '../course';


export class File {
    key: string;
    checkStatus: number;
    jobId: string;
    jobStatus: string;
    name: string;
    fatherLastname: string;
    motherLastname: string;
    year: number;
    course: Course;
    uploadedAt: string;
    _id: string;

}

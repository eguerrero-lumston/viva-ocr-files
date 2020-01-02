import { MatchesFile } from './matches-file';
import { FileObject } from './file-object';


export class File {
    key: string;
    checkStatus: number;
    jobId: string;
    jobStatus: string;
    name: string;
    fatherLastname: string;
    motherLastname: string;
    year: number;

    uploadedAt: string;
    _id: string;

    folio: string;
    flightNumber: number;

    realHour: string;
    intineraryHour: string;
    date: Date;
    formattedDate: string;
    formatted_date: string;

    matches: MatchesFile;

    airport = new FileObject();
    company = new FileObject();
    acronyms: string[];
    surcharges: string[];
    licences: string[];

    equipment: string;
    registration: string;
    commander = new FileObject();
    officerOne = new FileObject();
    officerTwo = new FileObject();
    officerThree = new FileObject();
    senior = new FileObject();
    surchargeOne = new FileObject();
    surchargeTwo = new FileObject();
    surchargeThree = new FileObject();

    origin = new FileObject();
    destination = new FileObject();
    nextScale = new FileObject();
    delayReason: string;

}

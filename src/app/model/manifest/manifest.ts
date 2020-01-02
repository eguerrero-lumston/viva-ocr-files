import { MatchesManifest } from './matches-manifest';
import { ManifestObject } from './manifest-object';


export class Manifest {
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

    matches: MatchesManifest;

    airport = new ManifestObject();
    company = new ManifestObject();
    acronyms: string[];
    surcharges: string[];
    licences: string[];

    equipment: string;
    registration: string;
    commander = new ManifestObject();
    officerOne = new ManifestObject();
    officerTwo = new ManifestObject();
    officerThree = new ManifestObject();
    senior = new ManifestObject();
    surchargeOne = new ManifestObject();
    surchargeTwo = new ManifestObject();
    surchargeThree = new ManifestObject();

    origin = new ManifestObject();
    destination = new ManifestObject();
    nextScale = new ManifestObject();
    delayReason: string;

}

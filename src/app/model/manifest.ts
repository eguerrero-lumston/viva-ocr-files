export class Manifest {
    folio: number;
    flightnumber: number;

    realtime: Date;
    itinerarytime: Date;
    date: Date;

    airport: string;
    company: string;
    airportacronym: string;
    companyacronym: string;
    equipment: string;
    enrollment: string;
    commander: string;
    firstofficer: string;
    secondofficer: string;
    thirdofficer: string;
    major: string;
    firstsurcharge: string;
    secondsurcharge: string;
    thirdsurcharge: string;
    commanderlicense: string;
    firstofficerlicense: string;
    secondofficerlicense: string;
    thirdofficerlicense: string;
    majorlicense: string;
    firstsurchargelicense: string;
    secondsurchargelicense: string;
    thirdsurchargelicense: string;
    origin: string;
    destination: string;
    nextscale: string;
    delaycause: string;
    originacronym: string;
    destinationacronym: string;
    nextscaleacronym: string;

    constructor() {
        this.folio = 0;
        this.flightnumber = 0;
        this.realtime = new Date();
        this.itinerarytime = new Date();
        this.date = new Date();
        this.airport = '';
        this.company = '';
        this.airportacronym = '';
        this.companyacronym = '';
        this.equipment = '';
        this.enrollment = '';
        this.commander = '';
        this.firstofficer = '';
        this.secondofficer = '';
        this.thirdofficer = '';
        this.major = '';
        this.firstsurcharge = '';
        this.secondsurcharge = '';
        this.thirdsurcharge = '';
        this.commanderlicense = '';
        this.firstofficerlicense = '';
        this.secondofficerlicense = '';
        this.thirdofficerlicense = '';
        this.majorlicense = '';
        this.firstsurchargelicense = '';
        this.secondsurchargelicense = '';
        this.thirdsurchargelicense = '';
        this.origin = '';
        this.destination = '';
        this.nextscale = '';
        this.delaycause = '';
        this.originacronym = '';
        this.destinationacronym = '';
        this.nextscaleacronym = '';
    }
}

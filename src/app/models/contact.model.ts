import { Activity } from "./activity.model";

export class Contact {
    id?: number;
    firstName: string;
    lastName: string;
    company: string;
    job: string;
    email: string;
    phone: string;
    contactOwner: Contact;
    address: string;
    city: string;
    country: string;
    state: string;
    zipCode: string;
}

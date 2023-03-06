import { DatePipe } from "@angular/common";
import { Contact } from "./contact.model";

export class Activity {
    id?: number;
    date: string;
    activityType: string;
    subject: string;
    note: string;
    participants: Contact[];
    
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Activity } from 'src/app/models/activity.model';
import { Contact } from 'src/app/models/contact.model';
import { ActivityService } from 'src/app/services/activity.service';
import { ContactService } from 'src/app/services/contact.service';
import { CustomDateParserFormatter } from 'src/app/services/dateformat.service';
import swal from 'sweetalert';



@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  model: NgbDateStruct;

  constructor(private contactService: ContactService,
              private activityService: ActivityService,
              private dateFormatter: CustomDateParserFormatter
  ) { 
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  public activities: Activity[]
  public contacts: Contact[]
  public selectedContact: Contact;

  ngOnInit() {
    this.getAllContacts();
  }

  ngOnChanges() {
    this.getAllContacts();
  }

  public getAllContacts(): void {
    this.contactService.getAllContacts().subscribe(
      (response: Contact[]) => {
        this.contacts = response;
        this.dropdownList = this.contacts.map(item => ({ item_id: item.id, item_text: item.firstName + " " + item.lastName }))
      },
      (error: HttpErrorResponse) => {
        swal("Oops!", "Fetching Contact list went wrong ! ", "error");
      }
    )
  }

  public addNewContact(addcontactForm: NgForm): void {  
    this.contactService.addNewContact(addcontactForm.value).subscribe(
      (response: Contact) => {
        this.getAllContacts();
        addcontactForm.onReset();
      },
      (error: HttpErrorResponse) => {
        swal("Oops!", "Email already exists!", "error");
      },
    );
  }

  public getAllActivities(): void {
    this.activityService.getAllActivities().subscribe(
      (response: Activity[]) => {
        this.activities = response;
      },
    )
  }

  public addNewActivity(addActivityForm: NgForm): void {
    const participants=[];
    if(this.selectedItems.length>0){
      this.selectedItems.forEach(contact=>participants.push({id: contact['item_id']}))
    }    
    const { date } = addActivityForm.value;
    const activity = { ...addActivityForm.value, "participants": participants, "date": this.dateFormatter.format(date) }
    this.activityService.addNewActivity(activity).subscribe(
      (response: Activity) => {
        this.getAllActivities();
      },
      (error: HttpErrorResponse) => {
        swal("Oops!", "Looks like something went wrong while adding a new activity! Try again.. ", "error");
      },
    );
  }

  public editContact(contact: Contact, editcontactForm: NgForm): void {
    this.contactService.editContact(contact.id, editcontactForm.value).subscribe(
      (response: Contact) => {
        this.getAllContacts();
      },
      (error: HttpErrorResponse) => {
        swal("Oops!", "Looks like something went wrong editing the contact! Try again.. ", "error");
      },
    );
  }

  public async deleteContact(id: number): Promise<void> {

    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this contact?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      this.contactService.deleteContact(id).subscribe(
        (response: void) => {
          swal("Deleted!", "Contact has been deleted!", "success");
          this.getAllContacts();
        },
        (error: HttpErrorResponse) => {
          swal("Oops!", "Looks like something went wrong while deleting contact ! Try again ! ", "error");
        },
      );
    }
  }
  searchText:any;
  p: number = 1;
  key :string = "id";
  reverse: boolean = false;

  search(){
    if (this.searchText ==""){
      this.ngOnInit();
    } else {
      this.contacts = this.contacts.filter(res => {
        return res.firstName.toLocaleLowerCase().match(this.searchText.toLocaleLowerCase()) || 
        res.lastName.toLocaleLowerCase().match(this.searchText.toLocaleLowerCase());
      });
    }

  }

  sort(key){
    this.key = key
    this.reverse = !this.reverse;
  }

}
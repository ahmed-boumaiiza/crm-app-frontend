import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Contact } from 'src/app/models/contact.model';
//import { ActivityService } from 'src/app/services/activity.service';
import { ContactService } from 'src/app/services/contact.service';
import swal from 'sweetalert';



@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  constructor(private contactService: ContactService,
  ) { }

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
        console.log(error.message);
        swal("Oops!", "Make sure you entered a valid Email and Phone number!", "error");
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
}
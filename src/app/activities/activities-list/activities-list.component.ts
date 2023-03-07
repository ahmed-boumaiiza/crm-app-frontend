import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { Activity } from 'src/app/models/activity.model';
import { Contact } from 'src/app/models/contact.model';
import { ActivityService } from 'src/app/services/activity.service';
import { ContactService } from 'src/app/services/contact.service';
import swal from 'sweetalert';

import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from 'src/app/services/dateformat.service';

@Component({
  selector: 'app-activities-list',
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.css']
})
export class ActivitiesListComponent implements OnInit {
  
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  model: NgbDateStruct;
  selectedActivity: Activity;
  activities: Activity[]
  contactsList: Contact[];
  p: number = 1;

  ngOnInit() {
    this.getAllActivities();
    this.getAllContacts();

  }
  ngOnChanges() {
    this.getAllActivities();
    this.getAllContacts();

  }

  constructor(private activityService: ActivityService,
    private contactService: ContactService
    , private dateFormatter: CustomDateParserFormatter) {

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
  public getAllActivities(): void {
    this.activityService.getAllActivities().subscribe(
      (response: Activity[]) => {
        this.activities = response;
      },
    )
  }

  public getAllContacts(): void {
    this.contactService.getAllContacts().subscribe(
      (response: Contact[]) => {
        this.contactsList = response;
        this.dropdownList = this.contactsList.map(item => ({ item_id: item.id, item_text: item.firstName + " " + item.lastName }))
      },
    )
  }

  public addNewActivity(addActivityForm: NgForm): void {
     const participants =[];
    if(this.selectedItems.length>0){
      this.selectedItems.map(contact=>participants.push({id: contact['item_id']}));
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

  public editActivity(oldactivity: Activity, editActivityForm: NgForm): void {
    const participants =[];
    if(this.selectedItems.length>0){
      this.selectedItems.map(contact=>participants.push({id: contact['item_id']}));
    }    
    const { date } = editActivityForm.value;
    const newactivity = { ...editActivityForm.value, "participants": participants, "date": this.dateFormatter.format(date) }
    this.activityService.editActivity(oldactivity.id, newactivity).subscribe(
      (response: Activity) => {
        this.getAllActivities();
      },
      (error: HttpErrorResponse) => {
        swal("Oops!", "Looks like something went wrong while editing the activity! Try again.. ", "error");
      },
    );
  }

  public async deleteActivity(id: number): Promise<void> {

    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this Activity?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      this.activityService.deleteActivity(id).subscribe(
        (response: void) => {
          swal("Deleted!", "Activity has been deleted!", "success");
          this.getAllActivities();
        },
        (error: HttpErrorResponse) => {
          swal("Oops!", "Looks like something went wrong while deleting Activity ! Try again ! ", "error");
        },
      );
    }
  }

}



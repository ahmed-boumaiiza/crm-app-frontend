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



  public activities: Activity[]
  contactsList: Contact[];

  searchText: string;

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
    // this.dropdownList = [
    //   { item_id: 1, item_text: 'Option 1' },
    //   { item_id: 2, item_text: 'Option 2' },
    // ];

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
    // const participants=[];
    // if(this.selectedItems.length>0){
    //   this.selectedItems.map(contact=>participants.push(contact.item_id))
    // }    
    const { date } = addActivityForm.value;
    const activity = { ...addActivityForm.value, "participants": this.contactsList, "date": this.dateFormatter.format(date) }
    console.log(activity);
    this.activityService.addNewActivity(activity).subscribe(
      (response: Activity) => {
        // console.log(response);
        this.getAllActivities();
      },
      (error: HttpErrorResponse) => {
        swal("Oops!", "Looks like something went wrong while adding a new activity! Try again.. ", "error");
      },
    );
    // const activity={...addActivityForm.value,"participants":this.contactsList}

    // console.log(activity);
    // this.activityService.addNewActivity(activity).subscribe(
    //   (response: Activity) => {
    //     // console.log(response);
    //     this.getAllActivities();
    //   },
    //   (error: HttpErrorResponse) => {
    //     swal("Oops!", "Looks like something went wrong while adding a new activity! Try again.. ", "error");
    //   },
    // );
  }

  public editActivity(activity: Activity, editActivityForm: NgForm): void {
    this.activityService.editActivity(activity.id, editActivityForm.value).subscribe(
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


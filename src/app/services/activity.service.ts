import { Injectable } from '@angular/core';
import {Activity} from 'src/app/models/activity.model'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private http: HttpClient) { }

  private apiServerUrl=environment.apiBaseUrl;
  
  public getAllActivities(): Observable<Activity[]>{
    return this.http.get<Activity[]>(`${this.apiServerUrl}/activity/getall`)
  }

  
  public addNewActivity(activity: Activity): Observable<Activity>{
    return this.http.post<Activity>(`${this.apiServerUrl}/activity/create`,activity)
  }


  public editActivity(id:number,activity: Activity): Observable<Activity>{
    return this.http.put<Activity>(`${this.apiServerUrl}/activity/update/${id}`,activity)
  }

  public deleteActivity(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}/activity/delete/${id}`)
  }

}

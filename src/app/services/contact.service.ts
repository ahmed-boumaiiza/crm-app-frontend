import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from 'src/app/models/contact.model';
import { environment } from 'src/environments/environment';




@Injectable({
  providedIn: 'root'
})
export class ContactService {
  
  constructor(private http: HttpClient) { }

  private apiServerUrl=environment.apiBaseUrl;

  public getAllContacts(): Observable<Contact[]>{
    return this.http.get<Contact[]>(`${this.apiServerUrl}/contact/getall`)
  }

  
  public addNewContact(contact: Contact): Observable<Contact>{
    return this.http.post<Contact>(`${this.apiServerUrl}/contact/create`,contact)
  }

  public editContact(id:number,contact: Contact): Observable<Contact>{
    return this.http.put<Contact>(`${this.apiServerUrl}/contact/update/${id}`,contact)
  }

  public deleteContact(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}/contact/delete/${id}`)
  }
 
  }



  


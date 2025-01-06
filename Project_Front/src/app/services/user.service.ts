import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Job } from '../interfaces/job';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = 'https://localhost:44330/api/User';

  constructor(
    private http:HttpClient
  ) { }

  getJobOptions(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`);
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
    console.log("user submitted");
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable} from 'rxjs';
import { Job } from '../interfaces/job';
import { Dashboard } from '../interfaces/dashboard';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = 'https://localhost:44330/api';

  constructor(
    private http:HttpClient,
    private route:Router
  ) { }

  getJobOptions(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/User/jobs`);
  }

  registerUser(userData: any): Observable<any> {
    console.log("user submitted");
    return this.http.post(`${this.apiUrl}/User/register`, userData);
    
  }

  loginUser(userData:any):Observable<any>{
    const headers=new HttpHeaders({'content-type':'application/json'});
    return this.http.post(`${this.apiUrl}/User/login`,userData,
    {headers, responseType: 'text' as 'json' });
  }


  logoutUser():void{
    localStorage.removeItem('token');
    this.route.navigate(['/login']);
  }

  getSchedules():Observable<Dashboard[]>{
    return this.http.get<Dashboard[]>(`${this.apiUrl}/User/dashboard`)
  }  

  postSchedule(date:any):Observable<any>{
    console.log('Posting:',date);
    return this.http.post<any>(`${this.apiUrl}/Worker/add-schedule-request`,date);
  }
  
  
   
  decodeToken(token: string|null): any{
    if(!token) return null;

    try{
      return JSON.parse(atob(token.split('.')[1]));
    }catch(e){
      console.error('Error decoding JWT token', e);
      return null;
    }
   }  


}









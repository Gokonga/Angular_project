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
  
  private apiUrl = 'https://localhost:44330/api/User';

  constructor(
    private http:HttpClient,
    private route:Router
  ) { }

  getJobOptions(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`);
  }

  registerUser(userData: any): Observable<any> {
    console.log("user submitted");
    return this.http.post(`${this.apiUrl}/register`, userData);
    
  }

  loginUser(userData:any):Observable<any>{
    const headers=new HttpHeaders({'content-type':'application/json'});
    return this.http.post(`${this.apiUrl}/login`,userData,
    {headers, responseType: 'text' as 'json' });
  }


  logoutUser():void{
    localStorage.removeItem('token');
    this.route.navigate(['/login']);
  }

  getSchedules():Observable<Dashboard[]>{
    return this.http.get<Dashboard[]>(`${this.apiUrl}/dashboard`)
  }  

   


}









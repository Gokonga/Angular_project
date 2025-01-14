import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable} from 'rxjs';
import { Job } from '../interfaces/job';
import { Dashboard } from '../interfaces/dashboard';
import { Users } from '../interfaces/workerRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private tokenKey = 'token';
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




  getSchedules():Observable<Dashboard[]>{
    return this.http.get<Dashboard[]>(`${this.apiUrl}/User/dashboard`)
  }  

  postSchedule(date:any):Observable<any>{
    console.log('Posting:',date);
    return this.http.post(`${this.apiUrl}/Worker/add-schedule-request`,date);
  }

  deleteRequest(ID:any):Observable<any>{
    return this.http.delete(`${this.apiUrl}/Admin/delete-schedule/${ID}`,ID);
  }

  approveRequest(ScheduleId:Number):Observable<any>{
    console.log("ID",ScheduleId);
    console.log('Posting to:', `${this.apiUrl}/Admin/approve-schedule-request`);
    const params = new HttpParams().set('ScheduleId',ScheduleId.toString());
    return this.http.post(`${this.apiUrl}/Admin/approve-schedule-request`,null, {params});
  }
  
  getUsers():Observable<Users[]>{
    return this.http.get<Users[]>(`${this.apiUrl}/User/users`)
  }

  deleteUser(userId:any):Observable<any>{
    return this.http.delete(`${this.apiUrl}/Admin/delete-user/${userId}`,userId);
  }
  ChangeUSerRole(user:any):Observable<any>{

    const headers=new HttpHeaders({'content-type':'application/json'});
    return this.http.post(`${this.apiUrl}/Admin/change-user-role`,user,
      {headers, responseType: 'text' as 'json' }
    );
  }

  deleteJob(jobId:any):Observable<any>{
    return this.http.delete(`${this.apiUrl}/Admin/delete-job/${jobId}`,jobId)
  }
    
  addJob(jobTitle:any):Observable<Job>{
    const headers=new HttpHeaders({'content-type':'application/json'});
    return this.http.post<Job>(`${this.apiUrl}/Admin/add-new-job`,jobTitle,
      {headers, responseType: 'text' as 'json'  }
   )
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

  isLoggedIn(): boolean {
      if(localStorage.getItem("token")==null){
       return false
      }
      else{
       return true
      }
     }
   
  getToken(): string | null {
       return localStorage.getItem(this.tokenKey);
     }
   
  getUserRole(token: string|null): string | null {
       const decoded = this.decodeToken(token);
       return decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null; 
     }
   
  isAdmin(): boolean {
      const token = localStorage.getItem('token');
      const decoded = this.decodeToken(token);
      return decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === '1'; 
    }
    
isWorker(): boolean {
      const token = localStorage.getItem('token');
      const decoded = this.decodeToken(token);
      return decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === '2'; 
    }
    
logoutUser(): void {
      localStorage.removeItem('token');
      this.route.navigate(['/login']);
    }



   }
   


   









import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Job } from '../interfaces/job';
import { AbstractControl,ValidationErrors,ValidatorFn } from '@angular/forms';


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
export function Checkpassword(password:string,confirmPassword:string):ValidatorFn {
  return (group:AbstractControl):ValidationErrors|null=>{
    const passwordControl =group.get(password);
    const confirmPasswordControl=group.get(confirmPassword)

    if(!passwordControl || !confirmPasswordControl){
      return null;
    }
    if (passwordControl.value !== confirmPasswordControl.value){
      confirmPasswordControl.setErrors({ passwordMismatch: true });
      return {passwordMismatch:true};
    }
    else{
    confirmPasswordControl.setErrors(null);
    }
    return null;
  };
}


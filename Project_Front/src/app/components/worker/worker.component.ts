import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Dashboard } from 'src/app/interfaces/dashboard';
import { CurrentWeek } from 'src/app/interfaces/dashboard';
import { Job } from 'src/app/interfaces/job';




@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css']
})
export class WorkerComponent {
  jobs:Job[]=[];
  dashboard:Dashboard[]=[];
  currentWeek:CurrentWeek[]=[];
  currentWeekStart:Date=new Date();
  currentWeekEnd:Date=new Date();

  constructor(
    private userservice:UserService,
    private Schedule:ScheduleService
  ){}


  ngOnInit(){ 
    this.fetchJobOptions();
    this.updateWeekRange();

    
  }

  updateWeekRange(){
    this.fetchSchedules();
    const{start,end}=this.Schedule.getWeekRange(this.currentWeekStart);
    this.currentWeekStart=start;
    this.currentWeekEnd=end;
    this.currentWeek=this.Schedule.FilterArray(this.dashboard,this.currentWeekStart,this.currentWeekEnd);
  }

  goPreviousWeek(){
    const{PreviousWeekStart,PreviousWeekEnd}=this.Schedule.getPreviousWeekStart(this.currentWeekStart);
    this.currentWeekStart=PreviousWeekStart;
    this.currentWeekEnd=PreviousWeekEnd;
    this.currentWeek=this.Schedule.FilterArray(this.dashboard,this.currentWeekStart,this.currentWeekEnd);
    
  }

  goNextWeek(){
    const{NextWeekStart,NextWeekEnd}= this.Schedule.getNextWeekStart(this.currentWeekEnd);
    this.currentWeekStart=NextWeekStart;
    this.currentWeekEnd=NextWeekEnd;
    this.currentWeek=this.Schedule.FilterArray(this.dashboard,this.currentWeekStart,this.currentWeekEnd);
  
  }

  
  fetchSchedules(): void {
    // const start = this.currentWeekStart.toISOString().split('T')[0]; 
    // const end = this.currentWeekEnd.toISOString().split('T')[0];
    this.userservice.getSchedules().subscribe({
      next:(response)=>{
        console.log("dashboard",response);
        this.dashboard=response as Dashboard[];

      },
      error:(err)=>{
        console.error('error fetching dashboard',err)
      }
    });
  }
  fetchJobOptions(){
    this.userservice.getJobOptions().subscribe({
      next:(response)=>{
        console.log('job options',response);
        this.jobs=response as Job[];
      },
      error:(error)=>{
        console.error('error Fetching job options',error);
        
      }
    });
  }

  getdate(date:Date,index:number){
   return  this.Schedule.formatMonth(date,index);
  
  }

  

  
  
  logout(){
    this.userservice.logoutUser();
  }

}

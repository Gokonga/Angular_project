import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { CurrentWeekDates,CurrentWeekSchedule, Dashboard } from 'src/app/interfaces/dashboard';
import { Job } from 'src/app/interfaces/job';




@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css']
})
export class WorkerComponent {
  weekDates:CurrentWeekDates[]=[]
  jobs:Job[]=[];
  dashboard:Dashboard[]=[];
  WeekSchedule:CurrentWeekSchedule[]=[];
  WeekStart:Date=new Date();
  WeekEnd:Date=new Date();

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
    
    const{start,end}=this.Schedule.getWeekRange(this.WeekStart);
    this.WeekStart=start;
    this.WeekEnd=end;
    this.WeekSchedule=this.Schedule.FilterArray(this.dashboard,this.WeekStart,this.WeekEnd);
    this.weekDates=this.Schedule.formatWeek(this.WeekStart,this.WeekEnd);
    console.log("weekstart",this.WeekStart);
    console.log("weeelend",this.WeekEnd);
  }

  goPreviousWeek(){
    console.log("weekstart",this.WeekStart);
    console.log("weeelend",this.WeekEnd);
    const{PreviousWeekStart,PreviousWeekEnd}=this.Schedule.getPreviousWeekStart(this.WeekStart);
    this.WeekStart=PreviousWeekStart;
    this.WeekEnd=PreviousWeekEnd;
    this.WeekSchedule=this.Schedule.FilterArray(this.dashboard,this.WeekStart,this.WeekEnd);
    this.weekDates=this.Schedule.formatWeek(this.WeekStart,this.WeekEnd);
    
  }

  goNextWeek(){
    console.log("weekstart",this.WeekStart);
    console.log("weeelend",this.WeekEnd);
    const{NextWeekStart,NextWeekEnd}= this.Schedule.getNextWeekStart(this.WeekEnd);
    this.WeekStart=NextWeekStart;
    this.WeekEnd=NextWeekEnd;
    this.WeekSchedule=this.Schedule.FilterArray(this.dashboard,this.WeekStart,this.WeekEnd);
    this.weekDates=this.Schedule.formatWeek(this.WeekStart,this.WeekEnd);
  
  }

  
  fetchSchedules(): void {
    // const start = this.WeekStart.toISOString().split('T')[0]; 
    // const end = this.WeekEnd.toISOString().split('T')[0];
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

  logout(){
    this.userservice.logoutUser();
  }

}

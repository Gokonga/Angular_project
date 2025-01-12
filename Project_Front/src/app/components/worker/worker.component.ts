import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { CurrentWeekDates,CurrentWeekSchedule, Dashboard } from 'src/app/interfaces/dashboard';
import { Job } from 'src/app/interfaces/job';
import { workerRequest } from 'src/app/interfaces/workerRequest';

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
  selectedDate: Date | null = null;
  selectedShift='';

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
  }

  goPreviousWeek(){
    const{PreviousWeekStart,PreviousWeekEnd}=this.Schedule.getPreviousWeekStart(this.WeekStart);
    this.WeekStart=PreviousWeekStart;
    this.WeekEnd=PreviousWeekEnd;
    this.WeekSchedule=this.Schedule.FilterArray(this.dashboard,this.WeekStart,this.WeekEnd);
    this.weekDates=this.Schedule.formatWeek(this.WeekStart,this.WeekEnd);
    
  }

  goNextWeek(){
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
  addSchedule(){
    if(this.selectedDate!=null){
      const jwtToken=localStorage.getItem('token');
      const decodedToken=this.userservice.decodeToken(jwtToken);
      const user=decodedToken?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      const [startTime, endTime] = this.selectedShift.split('-');
      const adjustedDate=this.Schedule.adjustToLocalTimezone(this.selectedDate);
      console.log("Adjusted",adjustedDate)

      console.log("selectedate",this.selectedDate.toISOString())

      const request:workerRequest=({
        startTime:adjustedDate.toISOString().split('T')[0]+startTime,
        endTime:adjustedDate.toISOString().split('T')[0]+endTime,
        userId:Number(user)
      });
      
      this.userservice.postSchedule(request).subscribe({
       next:(response) => {
          console.log('Schedule submitted successfully', response);
        },
        error:(err) => {
          console.error('Error submitting schedule', err);
          }
        
    });
      }
  }

  getshifttime(todaysWorker:CurrentWeekSchedule):string{
    const tempdate=new Date(todaysWorker.endTime.getTime()+10800000);
    console.log("date1",todaysWorker.endTime)
    console.log("date2",tempdate)
    if(todaysWorker.endTime.getDate()<tempdate.getDate()){
      return ("Evening")
    }
    else if(todaysWorker.endTime.getDate()==tempdate.getDate()){
      return ("Morning")
    }
    else
        return "i dont know :("

  }

 
  logout(){
    this.userservice.logoutUser();
  }

}

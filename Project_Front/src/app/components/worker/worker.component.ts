import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { CurrentWeekDates, Dashboard } from 'src/app/interfaces/dashboard';
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
    this.weekDates=this.Schedule.formatWeek(this.WeekStart,this.WeekEnd);
  }

  goPreviousWeek(){
    const{PreviousWeekStart,PreviousWeekEnd}=this.Schedule.getPreviousWeekStart(this.WeekStart);
    this.WeekStart=PreviousWeekStart;
    this.WeekEnd=PreviousWeekEnd;
    this.weekDates=this.Schedule.formatWeek(this.WeekStart,this.WeekEnd);
    
  }

  goNextWeek(){
    const{NextWeekStart,NextWeekEnd}= this.Schedule.getNextWeekStart(this.WeekEnd);
    this.WeekStart=NextWeekStart;
    this.WeekEnd=NextWeekEnd;
    this.weekDates=this.Schedule.formatWeek(this.WeekStart,this.WeekEnd);
  
  }

  
  fetchSchedules(): void {
    this.userservice.getSchedules().subscribe({
      next:(response)=>{
        console.log("dashboard",response);
        this.dashboard=(response as Dashboard[]).map(item => ({
          id: item.id,
          startTime: new Date(item.startTime),
          endTime: new Date(item.endTime),
          userId: item.userId,
          firstName: item.firstName,
          lastName: item.lastName,
          jobId: item.jobId,
          jobTitle: item.jobTitle,
          isApproved: item.isApproved,
        }));
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

      
      const request:workerRequest=({
        startTime:adjustedDate.toISOString().split('T')[0]+startTime,
        endTime:adjustedDate.toISOString().split('T')[0]+endTime,
        userId:Number(user)
      });
      
      this.userservice.postSchedule(request).subscribe({
       next:(response) => {
          console.log('Schedule submitted successfully', response);
          this.selectedShift='';
          this.selectedDate=null;
        },
        error:(err) => {
          console.error('Error submitting schedule', err);
          }
        
    });
      }
  }

  getshifttime(todaysWorker:Dashboard):string{
    const tempdate=new Date(todaysWorker.endTime.getTime()+10800000);

    if(todaysWorker.endTime.getDate()<tempdate.getDate()){
      return ("Evening")
    }
    else if(todaysWorker.endTime.getDate()==tempdate.getDate()){
      return ("Morning")
    }
    else
        return "i dont know :("

  }

 

}

import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { CurrentWeekDates, Dashboard,} from 'src/app/interfaces/dashboard';
import { Job } from 'src/app/interfaces/job';
import { Users } from 'src/app/interfaces/workerRequest';
import { last } from 'rxjs';





@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  showRequests:boolean=false;
  showUsers:boolean=false;
  ShowJobs:boolean=false;
  showDashboard:boolean=false;
  newJob='';
  newId='';
  ScheduleID:Number | null=null;
  users:Users[]=[];
  weekDates:CurrentWeekDates[]=[];
  jobs:Job[]=[];
  dashboard:Dashboard[]=[];
  PendingSchedule:Dashboard[]=[];
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

ShowWholeDashboard(){
  this.showDashboard=!this.showDashboard;
  }

AproveSchedules(){
  this.showRequests=!this.showRequests;
  if(this.showRequests==true){
  this.PendingSchedule=this.Schedule.getPendingRequests(this.dashboard);
  }
}

removeRequest(ScheduleId:Number){
  this.userservice.deleteRequest(ScheduleId).subscribe({
    next:(response) => {
      console.log('Schedule deleted successfully', response);
      this.PendingSchedule = this.PendingSchedule.filter(worker => worker.id !== ScheduleId);
    },
    error:(err) => {
      console.error('Error deleting schedule', err);
      }
  });
}

acceptRequest(Id:any){
  this.userservice.approveRequest(Id).subscribe({
    next:(response)=>{
      console.log("Schedule added succesfully",response)
      this.PendingSchedule = this.PendingSchedule.filter(worker => worker.id !== Id);
    },
    error:(e)=>{
      console.log("error adding Schedule",e);
      console.log("error",e.error)
    }
  });
 }


 ShowUsers(){
  this.showUsers=!this.showUsers;
  if(this.showUsers==true){
    this.userservice.getUsers().subscribe({
      next:(response)=>{
        console.log("users Fetched",response)
        this.users=response as Users[];
      },
      error:(err)=>{
        console.error('Error fetching Users', err);
      }
    });
  }
 }

 removeUser(userId:any){
  this.userservice.deleteUser(userId).subscribe({
    next:(response)=>{
      console.log("User deleted Succsefully")
      this.users = this.users.filter(user => user.id !== userId);
    },
    error:(err)=>{
      console.error("Error deleting User",err)
    }
  });
 }

 changeUserRole(oldId:any){
  const user={
    userId:oldId,
    newRoleId:this.newId}
    this.newId='';
  this.userservice.ChangeUSerRole(user).subscribe({
    next:(response)=>{
      console.log("User role changed Succsefully",response)
    },
    error:(err)=>{
      console.error("Error changing  User role",err)
    }
  });

 }

 removeJob(jobId:any){
  this.userservice.deleteJob(jobId).subscribe({
    next:(response)=>{
      console.log("Job deleted Succsefully",response)
      this.jobs = this.jobs.filter(job => job.id !== jobId);
    },
    error:(err)=>{
      console.error("Error deleting Job",err)
    }
  })

 }

 addNewJOb(jobTitle:any){
  const jobbe={title:jobTitle};
  this.newJob='';
  this.userservice.addJob(jobbe).subscribe({
    next:(response)=>{
      console.log("Job added Succsefully",response)
    },
    error:(err)=>{
      console.error("Error adding Job",err)
    }
  })
 }

showJobs(){
  this.ShowJobs=!this.ShowJobs;
  if(this.ShowJobs==true){
    this.fetchJobOptions();
  }
}



}

import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { CurrentWeekDates,CurrentWeekSchedule, Dashboard,} from 'src/app/interfaces/dashboard';
import { Job } from 'src/app/interfaces/job';
import { Users } from 'src/app/interfaces/workerRequest';
import { scheduled } from 'rxjs';




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
  users:Users[]=[];
  weekDates:CurrentWeekDates[]=[];
  jobs:Job[]=[];
  dashboard:Dashboard[]=[];
  PendingSchedule:Dashboard[]=[];
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

ShowWholeDashboard(){
  this.showDashboard=!this.showDashboard;
  }

AproveSchedules(){
  this.showRequests=!this.showRequests;
  if(this.showRequests==true){
  this.PendingSchedule=this.Schedule.getPendingRequests(this.dashboard);
  }
}

removeRequest(ScheduleId:any){
  this.userservice.deleteRequest(ScheduleId).subscribe({
    next:(response) => {
      console.log('Schedule deleted successfully', response);
    },
    error:(err) => {
      console.error('Error deleting schedule', err);
      }
  });
}

acceptRequest(ScheduleId:Number){
  this.userservice.approveRequest(32).subscribe({
    next:(response)=>{
      console.log("Schedule added succesfully",response)
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
      console.log("User role changed Succsefully")
    },
    error:(err)=>{
      console.error("Error changing  User role",err)
    }
  });

 }

 removeJob(jobId:any){
  this.userservice.deleteJob(jobId).subscribe({
    next:(response)=>{
      console.log("Job deleted Succsefully")
    },
    error:(err)=>{
      console.error("Error deleting Job",err)
    }
  })
 }

 addNewJOb(jobTitle:any){
  const jobbe={title:jobTitle};
  // this.newJob='';
  this.userservice.addJob(jobbe).subscribe({
    next:(response)=>{
      console.log("Job added Succsefully")
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


  logout(){
    this.userservice.logoutUser();
  }

}

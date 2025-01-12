import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Dashboard } from 'src/app/interfaces/dashboard';
import { CurrentWeek } from 'src/app/interfaces/dashboard';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  dashboard:Dashboard[]=[];
  currentWeek:CurrentWeek[]=[];
  currentWeekStart:Date=new Date();
  currentWeekEnd:Date=new Date();

  constructor(
    private userservice:UserService,
    private Schedule:ScheduleService
  ){}


  ngOnInit(){
    this.fetchSchedules();
    this.updateWeekRange();
  }

  updateWeekRange(){
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

  goToNextWeek(){
    const{NextWeekStart,NextWeekEnd}= this.Schedule.getNextWeekStart(this.currentWeekStart);
    this.currentWeekStart=NextWeekStart;
    this.currentWeekEnd=NextWeekEnd;
    this.currentWeek=this.Schedule.FilterArray(this.dashboard,this.currentWeekStart,this.currentWeekEnd);
  
  }

  
  fetchSchedules(): void {
    // const start = this.currentWeekStart.toISOString().split('T')[0]; 
    // const end = this.currentWeekEnd.toISOString().split('T')[0];
    this.userservice.getSchedules().subscribe({
      next:(response)=>{
        this.dashboard=response as Dashboard[];

      },
      error:(err)=>{
        console.error('error fetching dashboard',err)
      }
    });
  }

  logout(){
    this.userservice.logoutUser();
  }

}

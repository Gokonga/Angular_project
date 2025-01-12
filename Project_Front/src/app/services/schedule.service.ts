import { Injectable } from '@angular/core';
import { Dashboard } from '../interfaces/dashboard';
import { CurrentWeekSchedule,CurrentWeekDates } from '../interfaces/dashboard';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

    getWeekRange(date: Date): { start: Date; end: Date } {
      const start = new Date(date);
      start.setDate(start.getDate() - start.getDay());
      console.log("test1",start); 
      const end = new Date(start);
      end.setDate(start.getDate() + 6); 
      console.log("test2",end);
      return { start, end };
    }
  
    getPreviousWeekStart(date: Date):{ PreviousWeekStart:Date; PreviousWeekEnd: Date} {
      const PreviousWeekStart = new Date(date);
      PreviousWeekStart.setDate(date.getDate() - 7);
      const PreviousWeekEnd=new Date(date);
      PreviousWeekEnd.setDate(date.getDate()-1);
      return {PreviousWeekStart,PreviousWeekEnd};
    }
  
    getNextWeekStart(date: Date):{ NextWeekStart:Date, NextWeekEnd:Date}{
      const NextWeekStart = new Date(date);
      NextWeekStart.setDate(date.getDate()+1);
      const NextWeekEnd=new Date(date);
      NextWeekEnd.setDate(date.getDate()+7);
      return {NextWeekStart,NextWeekEnd};

    }

    FilterArray(
      dashboard:Dashboard[],
      currentWeekStart:Date,
      currentWeekEnd:Date
    ):CurrentWeekSchedule[]{
      return dashboard.filter(item => {
        const itemStartTime = new Date(item.startTime);
        const itemEndTime = new Date(item.endTime);
        return (
          (itemStartTime >= currentWeekStart && itemEndTime <= currentWeekEnd) && item.isApproved==true
        );
      }).map(item => ({
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
  }
  
  formatWeek(start:Date,end:Date):CurrentWeekDates[] {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const weekdays=[
      "Monday", "Tuesday", "Wednesday", 
      "Thursday", "Friday", "Saturday", "Sunday"
    ]
    const thisweek:CurrentWeekDates[]=[];
    for(let i=new Date(start); i<=end; i.setDate(i.getDate() + 1)){
      thisweek.push({
        day: i.getDate(),
        weekday:weekdays[i.getDay()],
        month: monthNames[i.getMonth()],
      }); 
    }
    return  thisweek;
  }
    
  }

  
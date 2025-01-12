import { Injectable } from '@angular/core';
import { Dashboard } from '../interfaces/dashboard';
import { CurrentWeek } from '../interfaces/dashboard';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

    getWeekRange(date: Date): { start: Date; end: Date } {
      const start = new Date(date);
      start.setDate(start.getDate() - start.getDay()); 
      const end = new Date(start);
      end.setDate(start.getDate() + 6); 
      return { start, end };
    }
  
    getPreviousWeekStart(date: Date):{ PreviousWeekStart:Date; PreviousWeekEnd: Date} {
      const PreviousWeekStart = new Date(date);
      PreviousWeekStart.setDate(date.getDate() - 7);
      const PreviousWeekEnd=new Date(date);
      PreviousWeekEnd.setDate(date.getDate()-1);
      console.log("previous",PreviousWeekStart,PreviousWeekEnd);
      return {PreviousWeekStart,PreviousWeekEnd};
    }
  
    getNextWeekStart(date: Date):{ NextWeekStart:Date, NextWeekEnd:Date}{
      const NextWeekStart = new Date(date);
      NextWeekStart.setDate(date.getDate()+1);
      const NextWeekEnd=new Date(date);
      NextWeekEnd.setDate(date.getDate()+7);
      console.log("next",NextWeekStart,NextWeekEnd);
      return {NextWeekStart,NextWeekEnd};

    }

    FilterArray(
      dashboard:Dashboard[],
      currentWeekStart:Date,
      currentWeekEnd:Date
    ):CurrentWeek[]{
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
  
  formatMonth(date:Date,index:number) {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
   
    const tempdate=new Date(date);
    tempdate.setDate(date.getDate()+index);
    return `${tempdate.getDate()} ${monthNames[tempdate.getMonth()]}`;
  }
    
  }

  
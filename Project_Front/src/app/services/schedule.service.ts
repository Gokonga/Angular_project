import { Injectable } from '@angular/core';
import { Dashboard } from '../interfaces/dashboard';
import {CurrentWeekDates } from '../interfaces/dashboard';
import { workerRequest } from '../interfaces/workerRequest';

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
      return {PreviousWeekStart,PreviousWeekEnd};
    }
  
    getNextWeekStart(date: Date):{ NextWeekStart:Date, NextWeekEnd:Date}{
      const NextWeekStart = new Date(date);
      NextWeekStart.setDate(date.getDate()+1);
      const NextWeekEnd=new Date(date);
      NextWeekEnd.setDate(date.getDate()+7);
      return {NextWeekStart,NextWeekEnd};

    }


  getPendingRequests( dashboard:Dashboard[]):Dashboard[]{
    return dashboard.filter(item =>{
      return (item.isApproved==false)});
  }

  
  formatWeek(start:Date,end:Date):CurrentWeekDates[] {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const weekdays=[
     "Sunday", "Monday", "Tuesday", "Wednesday", 
      "Thursday", "Friday", "Saturday", 
    ]
    const thisweek:CurrentWeekDates[]=[];
    for(let i=new Date(start); i<=end; i.setDate(i.getDate() + 1)){
      thisweek.push({
        day: i.getDate(),
        weekday:weekdays[i.getDay()],
        month: monthNames[i.getMonth()],
        daydate:new Date(i)
      });
    }
    console.log("start time",start)
    console.log("DaTe i need",thisweek)
    return  thisweek;
  }

  adjustToLocalTimezone(date: Date): Date {

    const timezoneOffset = date.getTimezoneOffset(); 
    const adjustedDate = new Date(date.getTime() - timezoneOffset * 60000);
    
    return adjustedDate;
  }

  }
  
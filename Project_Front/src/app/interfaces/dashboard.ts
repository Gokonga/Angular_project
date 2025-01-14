export interface Dashboard {

    id: number,
    startTime: Date,
    endTime: Date,
    userId: number,
    firstName: string,
    lastName: string,
    jobId: number,
    jobTitle: string,
    isApproved: boolean


}

export interface CurrentWeekDates{
    daydate:Date,
    month:string,
    weekday:string,
    day:number
}

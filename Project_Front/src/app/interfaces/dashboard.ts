export interface Dashboard{

    id: number,
    startTime: string,
    endTime: string,
    userId: number,
    firstName: string,
    lastName: string,
    jobId: number,
    jobTitle: string,
    isApproved: boolean

}

export interface CurrentWeek {

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

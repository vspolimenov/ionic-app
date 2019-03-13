import { TaskType } from './taskType';

export class Task {

    public constructor (){}
    public  name:string;
    public  durations:string[];
    public currentDuration:string;
    public  time:string;
    public date:string;
    public isDone:boolean;
    public parent:Task;
    public type:string;
    public description:string;
    public taskId:number;
    public showInfo:boolean;
    public pinned:boolean;
    public remaining:string;
    public isFixed:boolean;
    public startTime:number;
    public endTime:number;
    public isStarted:boolean;
    public todayTime:string;
}
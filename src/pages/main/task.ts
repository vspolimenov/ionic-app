import { TaskType } from './taskType';

export class Task {

    public constructor (){}
    public  name:string;
    public  duration:number;
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
}
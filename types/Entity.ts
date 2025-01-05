import { DateData } from "react-native-calendars";


export interface User {
    id: string;
    name: string;
    email: string;
    isChild: boolean;
}


export interface Parent {
    id: string;
    name: string;
    email: string;
}



export interface Child {
    id: string;
    name: string;
}
// Define the Task type
export interface Task {
    id?: string;
    date: DateData;
    parent: Parent;
    childName: string;
    description: string
}
import { DateData } from "react-native-calendars";

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
    task: string;
    date: DateData;
    parent: Parent;
    childName: string;
}
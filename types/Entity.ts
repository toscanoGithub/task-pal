import { DateData } from "react-native-calendars";


export interface User {
    id: string;
    name: string;
    email: string;
    isChild: boolean;
}

export interface FamilyMember {
    id: string;
    name: string;
    passcode: string;
    email: string;
}


export interface Parent {
    id: string;
    name: string;
    email: string;
    members?: Child[]
}



export interface Child {
    name: string;
    passcode: string;
    email?: string;
}
// Define the Task type
export interface Task {
    id?: string;
    date: DateData;
    parent: Parent;
    childName: string;
    description: string
}
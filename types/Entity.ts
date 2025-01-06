import { DateData } from "react-native-calendars";


export interface User {
    id: string;
    name: string;
    email: string;
    isFamilyMember: boolean;
}

export interface FamilyMember {
    name: string;
    passcode: string;
    email?: string;
}


export interface Parent {
    id: string;
    name: string;
    email: string;
    members?: FamilyMember[]
}




// Define the Task type
export interface Task {
    id?: string;
    date: DateData;
    parent: Parent;
    toFamilyMember: string;
    description: string
}
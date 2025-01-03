import db from '@/firebase/firebase-config';
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { DateData } from 'react-native-calendars';
import { useUserContext } from './UserContext';

interface Parent {
    id: string;
    name: string;
    email: string;
}

interface Child {
    id: string;
    name: string;
}
// Define the Task type
interface Task {
    id?: string;
    task: string;
    date: DateData;
    parent: Parent;
    childName: string;
}

// Define the TaskContext type
interface TaskContextType {
    tasks: Task[];
    addTaskToContext: (task: Task) => void;
    getTaskById: (id: string) => Task | undefined;
}

// Create a context with default values
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Create a Provider component
export const TaskContextProvider = ({ children }: { children: ReactNode }) => {
    // const {user} = useUserContext()
    const user = {name: "Ait Assou", id: "123"}
    const [tasks, setTasks] = useState<Task[]>([]);
    const fetchedTasks: Task[] = []

    const fetchTasks = async () => {    
    const q = query(collection(db, "tasks"),); //  where("parent", "==", user!.name)
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty) {
      console.log("no Task registered yet")
    } else {
      querySnapshot.forEach((doc) => {
       const task: Task = {
        id: doc.id,
        task: doc.data().task,
        date: doc.data().date,
        parent: doc.data().parent,
        childName: doc.data().childName,
    }
        fetchedTasks.push(task)
        
    });
    setTasks(fetchedTasks);
    
    }

    }

    useEffect(() => {
        fetchTasks();
       }, [])


       
    const addTaskToContext = async (task: Task) => {
        try {
            const docRef = await addDoc(collection(db, "tasks"), {...task});
            fetchTasks()
            
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        
    };

    const getTaskById = (id: string) => {
        return tasks.find((task) => task.id === id);
    };

    

    return (
        <TaskContext.Provider value={{ tasks, addTaskToContext, getTaskById }}>
            {children}
        </TaskContext.Provider>
    );
};



// Custom hook to use TaskContext
export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTaskContext must be used within a TaskProvider");
    }
    return context;
};

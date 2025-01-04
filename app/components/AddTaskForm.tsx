import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DateData } from 'react-native-calendars'
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Text } from '@ui-kitten/components';
import theme from "../theme.json"
import { useTaskContext } from '@/contexts/TaskContext';
import { Task } from '@/types/Entity';

interface AddTaskFormProps {
    date?: DateData;
    dismiss: () => void;
}

interface FormValues {
    description: string;
    childName: string;
  };

  const validationSchema = Yup.object().shape({
    description: Yup.string().required("Task description is required"),
    childName: Yup.string().required("Child name is required"),
  });

const AddTaskForm: React.FC<AddTaskFormProps> = ({date, dismiss}) => {
    const user = {id: "1234567890", email: "parent@taskpal.com", name: "Parent Name"}
    const {tasks, addTaskToContext, editTaskInContext} = useTaskContext()

    const [currentDayTask, setCurrentDayTask] = useState<Task>()

    useEffect(() => {
      const tasksInCurrentDay = tasks.filter(task => task.id !== null && task.date.timestamp === date?.timestamp)
      setCurrentDayTask(tasksInCurrentDay[0])
      
      
    }, [tasks])
    
    

  return (
    <View>
      {/* MODAL TITLE */}
      <Text category='h4' style={styles.modalTitle}>{currentDayTask ? "Edit Task" : "Add Task"}</Text>
      <Text style={styles.selectedDate}>{date?.dateString}</Text>
        {/* Form */}
        <Formik 
            initialValues={{
              description: currentDayTask?.description ?? "",
              childName: currentDayTask?.childName ?? ""
            }}
            validationSchema={validationSchema}
            
            onSubmit={values => {
                console.log(":::::::::::: submit form ::::::::::::::");
                
                // submit form to firestore
                if (!currentDayTask) {
                    // Add new task
                    const task = {...values, parent: {...user}, date, isCompleted: false} as Task
                    console.log(":::::::::: ", task);
                    addTaskToContext(task);
                } else {
                    // Edit existing task
                    const task = {...values, parent: {...user}, date, isCompleted: false} as Task
                    editTaskInContext(task)
                }

                dismiss()
                
            }}
        >
    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm }) => 
            
            <View style={styles.inputsWrapper}>
                    {/* FULL NAME */}
                    <Input
                        style={styles.input}
                        placeholder={`${currentDayTask ? currentDayTask.childName : 'Task description'}`}
                        value={ values.description}
                        onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    status={touched.description && errors.description ? 'danger' : 'basic'}
                    />
                     {touched.description && errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

                    {/* CHILD NAME */}
                    <Input
                        style={styles.input}
                        placeholder={`${currentDayTask ? currentDayTask.childName : 'Child name'}`}
                        value={values.childName}
                        onChangeText={handleChange('childName')}
                        onBlur={handleBlur('childName')}
                        status={touched.childName && errors.childName ? 'danger' : 'basic'}
                    />
                    {touched.childName && errors.childName && <Text style={styles.errorText}>{errors.childName}</Text>}

                    <Button appearance='outline' onPress={() => {
                        handleSubmit()
                        // resetForm()
                        
                    }} style={styles.submitBtn} status="primary">
                        {evaProps => <Text style={{...evaProps, color:"#EDB232", fontSize: 20}} >
                            {currentDayTask ? "Edit task" : "Add new task"}    
                        </Text>}
                    </Button>

            </View>
            
            }
            
                    </Formik>

    </View>
  )
}

export default AddTaskForm

const styles = StyleSheet.create({
  modalTitle: {
    marginTop: 30,
    marginBottom:0,
    textAlign: 'center',
    color: "#EDB232"
  },
    selectedDate: {
        textAlign:"center",
        marginVertical: 5,
        color:"#DDCA87",
        fontSize: 18,
        fontWeight: 100,
    },
    inputsWrapper: {
        flex: 1,
        width:"100%",
        marginTop: 30,
      },
    
      input: {
        width:"100%",
        paddingVertical: 15,
        backgroundColor: "#3A7174",
        borderWidth: 1,
        borderColor: "#DDCA8750",
        color: "white"
      },
    
      errorText: {
        color: 'red',
        marginTop: -10,
        marginBottom: 10,
      },
    
      submitBtn: {
        marginTop: 15,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#DDCA8750"
      },
})
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DateData } from 'react-native-calendars'
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Text } from '@ui-kitten/components';
import theme from "../theme.json"
import { useTaskContext } from '@/contexts/TaskContext';
import { Task } from '@/types/Entity';
import InputWithAutocomplete from './InputWithAutocomplete';
import { useUserContext } from '@/contexts/UserContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { CiCirclePlus } from "react-icons/ci";


interface AddTaskFormProps {
    date?: DateData;
    dismiss: () => void;
    iHaveFocus: () => void;
    toFamilyMember: string;
}


  const validationSchema = Yup.object().shape({
    description: Yup.string().required("Task description is required"),
  });

const AddTaskForm: React.FC<AddTaskFormProps> = ({date, dismiss, iHaveFocus, toFamilyMember}) => {
    const {tasks, addTaskToContext} = useTaskContext()
    const [currentDayTask, setCurrentDayTask] = useState<Task>()
    const {user} = useUserContext();

    const [tempTasks, setTempTasks] = useState<Task[]>([])

    useEffect(() => {
      const tasksInCurrentDay = tasks.filter(task => task.id !== null && task.date.timestamp === date?.timestamp)
      setCurrentDayTask(tasksInCurrentDay[0])

      console.log(":::::::::::::::", tasksInCurrentDay[0]);
      
    }, [tasks])
    
    
  
    

  return (
    <View>
      {/* MODAL TITLE */}
      <Text category='h4' style={styles.modalTitle}>Add tasks</Text>
      <Text style={styles.selectedDate}>{date?.dateString}</Text>
        {/* Form */}
        <Formik 
            initialValues={{
              description: "",
            }}
            validationSchema={validationSchema}
            
            onSubmit={values => {
                // console.log(":::::::::::: submit form ::::::::::::::");
                // submit form to firestore
                // const task = {...values, parent: {...user}, date, isCompleted: false} as Task

                const task = { ...values, parent: { ...user }, date, isCompleted: false, toFamilyMember: toFamilyMember } as unknown as Task
                
                addTaskToContext(task);
                // setCurrentDayTask(task)

                // tempTasks.forEach(task => {
                //   addTaskToContext(task);
                // })
                // dismiss()
                
            }}
        >
    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm }) => 
            
            <View style={styles.inputsWrapper}>
                    <View style={{width:"100%", flexDirection: "row", justifyContent:"space-between", alignItems:"center"}}>
                      {/* DESCRIPTION */}
                    <Input
                        style={styles.input}
                        placeholder='Task description'
                        value={ values.description}
                        onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      onFocus={iHaveFocus}
                      status={touched.description && errors.description ? 'danger' : 'basic'}
                    />

                    <TouchableOpacity onPress={() => {
                      handleSubmit()
                      setTimeout(() => {
                        resetForm()
                      }, 0);
                    }} style={{position:"absolute", right:0, top: 15}}>
                    <EvilIcons style={{marginTop: 3, opacity: 0.7}} name="plus" size={40} color={theme.secondary} />
                    </TouchableOpacity>
                    </View>
                     {touched.description && errors.description && <Text style={styles.errorText}>{errors.description}</Text>}


                    
                    {/* <Button appearance='outline' onPress={() => {
                        handleSubmit()
                        // resetForm()
                        
                    }} style={styles.submitBtn} status="primary">
                        {evaProps => <Text style={{...evaProps, color:"#EDB232", fontSize: 20}} >
                            Done    
                        </Text>}
                    </Button> */}

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
        borderColor: "#DDCA8750",
        position:"absolute", right:0, top: 15
      },
})
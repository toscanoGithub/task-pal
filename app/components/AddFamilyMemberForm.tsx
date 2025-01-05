import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DateData } from 'react-native-calendars'
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Text } from '@ui-kitten/components';
import theme from "../theme.json"
import { useTaskContext } from '@/contexts/TaskContext';
import { Child, Parent, Task, User } from '@/types/Entity';
import { useUserContext } from '@/contexts/UserContext';

interface AddFamilyMemberFormProps {
    dismiss: () => void;
    iHaveFocus: () => void;
    addedBy: string;
}

interface FormValues {
    name: string;
    passcode: string;
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    passcode: Yup.string().required("Passcode is required"),
  });

const AddFamilyMember: React.FC<AddFamilyMemberFormProps> = ({dismiss, iHaveFocus, addedBy}) => {
    const {tasks, addTaskToContext, editTaskInContext} = useTaskContext()
    const {updateUser, user} = useUserContext()
    const [currentDayTask, setCurrentDayTask] = useState<Task>()

    useEffect(() => {
      
      
      
    }, [])
    
    

  return (
    <View>
      {/* MODAL TITLE */}
      <Text category='h4' style={styles.modalTitle}>Family Member</Text>
        {/* Form */}
        <Formik 
            initialValues={{
              name: "",
              passcode: ""
            }}
            validationSchema={validationSchema}
            
            onSubmit={values => {
                console.log(":::::::::::: submit form ::::::::::::::", values);
                const {name, passcode} = values;
                const newMember = {name, passcode}
                // update user with newMember data
                
            updateUser({...newMember})
            
                
          
                
              
                dismiss()
                
            }}
        >
    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm }) => 
            
            <View style={styles.inputsWrapper}>
                    {/* FULL NAME */}
                    <Input
                        style={styles.input}
                        placeholder="Enter name"
                        value={ values.name}
                        onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      onFocus={iHaveFocus}
                      status={touched.name && errors.name ? 'danger' : 'basic'}
                    />
                     {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                    {/* CHILD NAME */}
                    <Input
                        style={styles.input}
                        placeholder="Enter a Passcode"
                        value={values.passcode}
                        onChangeText={handleChange('passcode')}
                        onBlur={handleBlur('passcode')}
                        onFocus={iHaveFocus}
                        status={touched.passcode && errors.passcode ? 'danger' : 'basic'}
                    />
                    {touched.passcode && errors.passcode && <Text style={styles.errorText}>{errors.passcode}</Text>}

                    <Button appearance='outline' onPress={() => {
                        handleSubmit()
                        // resetForm()
                        
                    }} style={styles.submitBtn} status="primary">
                        {evaProps => <Text style={{...evaProps, color:"#EDB232", fontSize: 20}} >
                            Add new family member    
                        </Text>}
                    </Button>

            </View>
            
            }
            
          </Formik>

    </View>
  )
}

export default AddFamilyMember

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
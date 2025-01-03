import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { DateData } from 'react-native-calendars'
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button, Input } from '@ui-kitten/components';
import theme from "../theme.json"

interface AddTaskFormProps {
    date?: DateData;
    dismiss: () => void;
}

interface FormValues {
    task: string;
    childName: string;
  };

  const validationSchema = Yup.object().shape({
    task: Yup.string().required("Task description is required"),
    childName: Yup.string().required("Child name is required"),
  });

const AddTaskForm: React.FC<AddTaskFormProps> = ({date, dismiss}) => {
    const user = {id: "1234567890", email: "parent@taskpal.com", name: "Parent Name"}
  return (
    <View>
      <Text style={styles.selectedDate}>{date?.dateString}</Text>
        {/* Form */}
        <Formik 
            initialValues={{
                task: "",
                childName: ""
            }}
            validationSchema={validationSchema}
            
            onSubmit={values => {
                // submit form to firestore
                const task = {...values, parent: {...user}, date, isCompleted: false}
                console.log(":::::::::: ", task);
                dismiss();
                
            }}
        >
    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm }) => 
            
            <View style={styles.inputsWrapper}>
                    {/* FULL NAME */}
                    <Input
                        style={styles.input}
                        placeholder='Task description'
                        value={values.task}
                        onChangeText={handleChange('task')}
                    onBlur={handleBlur('task')}
                    status={touched.task && errors.task ? 'danger' : 'basic'}
                    />
                    {touched.task && errors.task && <Text style={styles.errorText}>{errors.task}</Text>}

                    {/* CHILD NAME */}
                    <Input
                        style={styles.input}
                        placeholder='Child name'
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
                        {evaProps => <Text style={{...evaProps, color:"#EDB232", fontSize: 20}} >Add Task</Text>}
                    </Button>

            </View>
            
            }
            
                    </Formik>

    </View>
  )
}

export default AddTaskForm

const styles = StyleSheet.create({
    selectedDate: {
        textAlign:"center",
        marginVertical: 10,
        color:"#DDCA87",
        fontSize: 20,
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
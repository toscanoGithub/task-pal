import { StyleSheet, Switch, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Input, Button, Toggle } from '@ui-kitten/components';
import theme from "../theme.json"


// Firebase
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, Auth } from "firebase/auth";
import "../../firebase/firebase-config";

import { collection, addDoc, query, where, getDocs, doc } from "firebase/firestore"; 
import db from '../../firebase/firebase-config';
import { router } from 'expo-router';
import { useUserContext } from '@/contexts/UserContext';
interface signupProp {
  dismissModal: () => void;  // Defining the function prop type
  iHaveFocus: () => void;
}


interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Not a valid email").required('Email is required'),
  password: Yup.string().required('Password is required').min(6, 'Password is too short'),
  confirmPassword: Yup.string()
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password'), ""], "Passwords don't match"),
});

const SignupForm: React.FC<signupProp> = ({ dismissModal, iHaveFocus }) => {
  const {setUser} = useUserContext();
  // REGISTER LOGIC
 const register = (values: FormValues) => {
      const {name, email, password, confirmPassword} = values;
      const auth = getAuth();
    if(confirmPassword === password) {
        createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        addMoreDataToUser(email, name, true)
      })
      .catch((error) => {
        console.log(error.message);
        if(error.message.split("-").includes("already")) {
          alert("Email is already in use")
        } else {
          alert("Something went wrong, try later or contact the developer")
        }
      });
    }
}

const addMoreDataToUser = async (email: string, name: string, isHost: boolean) => {
try {
const docRef = await addDoc(collection(db, "users"), {
  email,
  name, 
  isHost: true 
});

setUser({id: docRef.id, email: email, name: name, isHost: true})  
dismissModal()
router.push("/(screens)/parent-screen")    
} catch (e) {
console.error("Error adding document: ", e);
}
}

  return (
      
    <Formik 
        initialValues={{
          email: 'cocot@taskpal.com',
          password: 'qwerty',
          confirmPassword: 'qwerty',
          name: 'Coralie',
          isHost: true,
        }}
        validationSchema={validationSchema}
        onSubmit={values => register(values)}
      
      >

{({ handleChange, handleBlur, handleSubmit, values, errors, touched, resetForm }) => 

<View style={styles.inputsWrapper}>


  
  {/* Name */}
  <Input
          style={styles.input}
          placeholder='Your name'
          value={values.name}
          onChangeText={handleChange('name')}
          onBlur={handleBlur('name')}
          onFocus={iHaveFocus}
          status={touched.name && errors.name ? 'danger' : 'basic'}
        />
        {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}


  {/* EMAIL */}
        <Input
          style={styles.input}
          placeholder='Email'
          value={values.email}
          onChangeText={handleChange('email')}
          onBlur={handleBlur('email')}
          onFocus={iHaveFocus}
          status={touched.email && errors.email ? 'danger' : 'basic'}
        />
        {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}


{/* PASSWORD */}
        <Input
          style={styles.input}
          placeholder='Password'
          value={values.password}
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          onFocus={iHaveFocus}
          status={touched.password && errors.password ? 'danger' : 'basic'}
        />
        {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}


{/* CONFIRM PASSWORD */}
        <Input
          style={styles.input}
          placeholder='Confirm password'
          value={values.confirmPassword}
          onChangeText={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
          onFocus={iHaveFocus}
          status={touched.confirmPassword && errors.confirmPassword ? 'danger' : 'basic'}
        />
        {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}


        <Button style={styles.submitBtn} status="primary" onPress={() => {
          handleSubmit()
        }} >
          Register
        </Button>
</View>

}

      </Formik>
  )
}

export default SignupForm

const styles = StyleSheet.create({
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
    backgroundColor: theme["h-1-text-color"],
    borderColor:"#fefefe40",
    borderRadius: 30
  },

  button: {
    width: "100%",
    height: 50,
    borderRadius: 30,
  },
  buttonPressed: {
    opacity: 0.5,  // Change the opacity when button is pressed
  },
})
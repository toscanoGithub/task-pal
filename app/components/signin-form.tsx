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
import { User } from '@/types/Entity';
import { useRouter } from 'expo-router';


interface signupProp {
  dismissModal: () => void;  // Defining the function prop type
  iHaveFocus: () => void;
}


interface FormValues {
  email: string;
  password: string;
  name?: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Not a valid email").required('Email is required'),
  password: Yup.string().required('Password is required').min(6, 'Password is too short'),
});

const SigninForm: React.FC<signupProp> = ({ dismissModal, iHaveFocus }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const {setUser} = useUserContext()
  const auth = getAuth();
  const router = useRouter();
  // REGISTER LOGIC
  const signin = async (values: FormValues) => {
  /*query the email
      if success >> check if isChild.
      if not a child >> normal signInWithEmailAndPassword
      if child >> check the name if it matches doc.data().childName
      match means grant access and pusch screen to child-screen */

      const {email, password, name} = values;
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if(querySnapshot.empty) {
        alert("No email found in our database")
      } else {
        const foundUsers: User[] = []
        querySnapshot.forEach((doc) => {
          // console.log(doc.id, doc.data());
          foundUsers.push({id: doc.id, ...doc.data()} as User)         
        });
        const foundUser = foundUsers.pop() as User;
        
        
        if(!foundUser.isChild) { // parent
          setUser(foundUser) // user is parent so pick the name
          signInWithEmailAndPassword(auth, email, password) // signin parent
          .then(userCredentials => {
            // console.log(":::::::::: ", foundUser);
            dismissModal();
            router.push("/(screens)/parent-screen")
          })
        } else {
          // pick the name from childName just grant access to the child
          console.log(":::::::::: ", foundUser);
          
          dismissModal();
          router.push("/(screens)/parent-screen")
        }
        

        // dismissModal();
        // router.push("/(screens)/parent-screen")
        
      }
      

      
}





  return (
    <>
      <View style={{flexDirection:"row", width:"100%", justifyContent:"flex-start", alignItems:"center", columnGap: 10, marginTop: 30, marginBottom: 0}}>
    <Switch
      trackColor={{false: theme["gradient-to"], true: theme["gradient-to"]}}
      thumbColor={isEnabled ? theme["secondary"] : theme["gradient-to"]}
      ios_backgroundColor="secondary"
      onValueChange={toggleSwitch}
      value={isEnabled}
    /> 
    <Text style={{fontSize: 20, color: `${isEnabled ? theme["secondary"] : theme["gradient-to"]}`}}>I'm a child</Text>
  </View>
    <Formik 
        initialValues={{
          email: 'coco_belge@hotmail.com',
          password: 'qwerty',
          name: ""
        }}
        validationSchema={validationSchema}
        onSubmit={values => signin(values)}
      
      >

{({ handleChange, handleBlur, handleSubmit, values, errors, touched, resetForm }) => 

<View style={styles.inputsWrapper}>
  
  {/* EMAIL */}
        <Input
          style={styles.input}
          placeholder={isEnabled ? "Your parent's email" : "Your email"}
          value={values.email}
          onChangeText={handleChange('email')}
          onBlur={handleBlur('email')}
          onFocus={iHaveFocus}
          status={touched.email && errors.email ? 'danger' : 'basic'}
        />
        {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}


{/* PASSWORD */}
        {
          !isEnabled && <><Input
          style={styles.input}
          placeholder='Password'
          value={values.password}
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          onFocus={iHaveFocus}
          status={touched.password && errors.password ? 'danger' : 'basic'}
        />
        {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}</>
        }

{/* Name */}
        {
          isEnabled && <><Input
          style={styles.input}
          placeholder='Your name'
          value={values.name}
          onChangeText={handleChange('name')}
          onBlur={handleBlur('name')}
          onFocus={iHaveFocus}
          status={touched.name && errors.name ? 'danger' : 'basic'}
        />
        {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}</>
        }




        <Button style={styles.submitBtn} status="primary" onPress={() => {
          handleSubmit()
        }} >
          Login
        </Button>
</View>

}

      </Formik>
    </>
  )
}

export default SigninForm

const styles = StyleSheet.create({
  inputsWrapper: {
    flex: 1,
    width:"100%",
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




import { StyleSheet, Text, View } from 'react-native'
import React from 'react'


interface signupProp {
  dismissModal: () => void;  // Defining the function prop type
}

const SignupForm: React.FC<signupProp> = ({ dismissModal }) => {
  return (
    <View>
      <Text>SignupForm</Text>
    </View>
  )
}

export default SignupForm

const styles = StyleSheet.create({})
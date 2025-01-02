import { StyleSheet, Text, View } from 'react-native'
import React from 'react'


interface signinProp {
  dismissModal: () => void;  // Defining the function prop type
}

const SigninForm: React.FC<signinProp> = ({ dismissModal }) => {
  return (
    <View>
      <Text>SigninForm</Text>
    </View>
  )
}

export default SigninForm

const styles = StyleSheet.create({})
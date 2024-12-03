import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ChildScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>ChildScreen</Text>
    </SafeAreaView>
  )
}

export default ChildScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#F7F8FC"
    }
})
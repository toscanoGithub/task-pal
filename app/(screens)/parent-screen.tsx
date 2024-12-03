import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ParentScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>ParentScreen</Text>
    </SafeAreaView>
  )
}

export default ParentScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#F7F8FC"
    }
})
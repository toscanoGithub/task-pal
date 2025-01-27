import { StyleSheet, View } from 'react-native'
import React from 'react'
import theme from "../theme.json"
import { Text } from '@ui-kitten/components'
import { LinearGradient } from 'expo-linear-gradient'

const RewardScreen = () => {
  return (

    <View style={styles.container}>
        <LinearGradient style={styles.gradient}  colors={[theme['gradient-from'], theme['gradient-to']]}/>
        <View>
        <Text style={styles.rewardText} category='h6' >Reward Screen</Text>
        </View>
    </View>
  )
}

export default RewardScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme['gradient-from']
    },

    rewardText: {
        color: theme.secondary,
        fontSize: 30,
        lineHeight: 45,
        textAlign: "center",

    },

    gradient: {
        position: "absolute",
        left: 0, right: 0, bottom: 0, top: 0
    }
})
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import theme from "../theme.json"
import { Text } from '@ui-kitten/components'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'

const RewardScreen = () => {
    const params = useLocalSearchParams()
    const router = useRouter()
  return (

    <View style={styles.container}>
        <TouchableOpacity style={{zIndex: 3000, position:"absolute", top: 10, left: 10,}} onPress={() => router.back()} >
          <AntDesign name='back' size={60} color={theme.secondary} />
        </TouchableOpacity>
        <LinearGradient style={styles.gradient}  colors={[theme['gradient-from'], theme['gradient-to']]}/>
        <View>
        <Text style={styles.rewardText} category='h6' >{params.reward}</Text>
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
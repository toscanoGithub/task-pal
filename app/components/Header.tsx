import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import theme from "../theme.json"
import { Button, Icon, IconElement, Text } from '@ui-kitten/components'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUserContext } from '@/contexts/UserContext';

interface HeaderProps {
    username: string;
}



const Header: React.FC<HeaderProps> = ({username}) => {
  const {user} = useUserContext()

  useEffect(() => {
   console.log(":::::::::::", user?.name);
   
  }, [user])
  
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.username} category='h6'>{user?.name }</Text>
        <TouchableOpacity>
        <Ionicons name="exit-outline" size={34} color="#EDB232" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container: {
        height: 80,
        backgroundColor: theme["gradient-from"],
        justifyContent:"center",
    },

    row: {
        flexDirection:"row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 30,
        paddingHorizontal: 10
    },

    icon: {
        width: 32,
        height: 32,
      },

      username: {
        color:"#EDB232",
        fontWeight: 900,
        letterSpacing: 1
      }


})
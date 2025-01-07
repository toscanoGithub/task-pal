import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import theme from "../theme.json"
import { Button, Icon, IconElement, Text } from '@ui-kitten/components'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUserContext } from '@/contexts/UserContext';
import LottieView from 'lottie-react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
  
  
interface HeaderProps {
    username: string;
}



const Header: React.FC<HeaderProps> = ({username}) => {
  const auth = getAuth();
  const {user, setUser} = useUserContext()
  const router = useRouter()

  useEffect(() => {
   
   
  }, [user])
  
  const [logoIsPlaying, setLogoIsPlaying] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLogoIsPlaying(false)
    }, 5000);
    
  }, [])

  
  const handleSignout = () => {
    if(!user?.isFamilyMember) {
      signOut(auth).then(() => {
        // Sign-out successful.
        setUser(null); // clear user
        router.push("/");
  
      }).catch((error) => {
        // An error happened.
        console.log("Error to sign you out");
      });
    } else {
      setUser(null)
      router.push("/")
    }
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.row}>

        {
          logoIsPlaying ? <View style={{height: 80, width: 60, zIndex: 1000, position: "absolute", top: -20, left: 0} }>
          <LottieView
          style={{height: "100%"}}
          source={require('../../assets/animations/lottie.json')} // Path to your local Lottie file
          autoPlay
          loop={false}
        />
          </View> : <Text style={styles.username} category='h6'>{user?.name }</Text>
        }
        
        
        <TouchableOpacity onPress={handleSignout} style={{marginLeft:"auto"}}>
        <Ionicons name="exit-outline" size={34} color={theme["secondary"]} />
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
        // paddingTop: 30,
        paddingHorizontal: 10
    },

    icon: {
        width: 32,
        height: 32,
      },

      username: {
        color: theme["secondary"],
        fontWeight: 900,
        letterSpacing: 1
      }


})
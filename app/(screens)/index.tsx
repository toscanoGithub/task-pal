import { SafeAreaView, StyleSheet, View, Dimensions, Pressable, Modal, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert, Animated} from 'react-native'
import React, { useState } from 'react'
import { Button, Divider, Icon, IconElement, Layout, Text } from '@ui-kitten/components'
import theme from "../theme.json"
import { Link, useRouter } from 'expo-router'
import SignupForm from '../components/signup-form'
import SigninForm from '../components/signin-form'
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Alternative icon library
import { LinearGradient } from 'expo-linear-gradient'
import Gradient from '../components/Gradient'
import { BlurView } from 'expo-blur'
import { StatusBar } from 'expo-status-bar'

const closeIcon = (props: any): IconElement => (
    <Icon
      {...props}
      name="close-circle"
      style={{width: 30, height: 30}}
      fill="#EC645B"
    />
  );

const auth = () => {
  // Create an Animated Value for height
    const modalHeight = useState(new Animated.Value(0))[0];
    const {width, height} = Dimensions.get('screen')
    const router = useRouter()
    const [modalIsVisible, setModalIsVisible] = useState<boolean>(false)
    const [modalType, setModalType] = useState("SIGN IN")
    const [isrewardDay, setIsrewardDay] = useState(false)
    const [expandedModal, setExpandedModal] = useState(false)
    
    const dismissModal = () => {
      setExpandedModal(false)
      // Animate height between 80% and 100% of the screen height
      Animated.timing(modalHeight, {
        toValue: 0, // 0.8 -> 80% and 1 -> 100%
        duration: 500, // 3 seconds for the transition
        useNativeDriver: false, // We can't animate height with native driver
        
      }).start();

        setModalIsVisible(false)
        setExpandedModal(false)
      };

      
      const handleFormHasFocus = () => {
          setExpandedModal(true)
        // Animate height between 80% and 100% of the screen height
        Animated.timing(modalHeight, {
          toValue: 0.95, // 0.8 -> 80% and 1 -> 100%
          duration: 500, // 3 seconds for the transition
          useNativeDriver: false, // We can't animate height with native driver
        }).start();
         

        setModalIsVisible(true)
      }

  return (

     
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Gradient />
      <View style={styles.buttonsRow}>
        {/* SIGN IN BUTTON */}
        <Button onPress={() => {
            setModalType("SIGN IN")
            setModalIsVisible(true)
        }} style={styles.authBtn} appearance='outline' 
         status='primary'>
          {evaProps => <Text  {...evaProps} style={{color:"#ffffff"}}>SIGN IN</Text>}</Button>

        {/* SIGN UP BUTTON */}
        <Button onPress={() => {
          setModalType("SIGN UP")
          setModalIsVisible(true);
            }} style={styles.authBtn} appearance='outline'  status='primary'>
              {evaProps => <Text  {...evaProps} style={{color:"#ffffff"}}>SIGN UP</Text>}</Button>

       {/* HERO TEXT */}
      </View>
      <View style={styles.instructions}>
      
        <Text category='h1' status='primary' style={[styles.instructionsText, {marginTop: -200, fontSize: height*0.06}]}  >
            Enter
        </Text>

        <Text style={[styles.instructionsText, {fontSize: height*0.06}]} category='h1' status='primary'  >
            Complete tasks
        </Text>

        <Text style={[styles.instructionsText, {fontSize: height*0.06}]} category='h1' status='primary'  >
            Be happy
        </Text>
      </View>
      
      
      <Modal animationType="slide" transparent={true} visible={modalIsVisible}>
      <View style={styles.centeredView}>    
            <Animated.View style={[styles.modalView, {height: modalHeight.interpolate({
            inputRange: [0, 1], // Mapping values (0 -> 80%, 1 -> 100%)
            outputRange: ['80%', '95%'],
          }),}]}>
              <Gradient />
              {/* MODAL TITLE */}
              <Text category='h4' style={styles.modalTitle}>{modalType}</Text>
              {/* CLOSE BUTTON */}
              <Button style={styles.closeBtn} onPress={() => dismissModal()}>
                <MaterialCommunityIcons name="close" size={24} color="red" />
            </Button>

              {/* AUTH FORM */}
              {modalType === "SIGN UP" ? <SignupForm iHaveFocus={handleFormHasFocus} dismissModal={dismissModal} /> : <SigninForm iHaveFocus={handleFormHasFocus} dismissModal={dismissModal} />}
            </Animated.View>
          </View>
    </Modal>
      
      
        
    </View>
  )
}

export default auth

const styles = StyleSheet.create({
  
    container: {
        flex: 1,
        backgroundColor: theme["gradient-from"],

    },

  

    buttonsRow: {
      marginVertical: 100,
      flexDirection:"row",
      justifyContent:"center", 
      alignItems:"center",
      columnGap: 10,
    },

   
    
    

    authBtn: {
         borderRadius: 30, paddingHorizontal: 30, backgroundColor: "transparent",  borderColor: theme["secondary"]
    },

    instructions: {
        justifyContent:"center", alignItems:"flex-start", rowGap: 30, flex: 1, paddingHorizontal: 10, 
    },

    instructionsText: {
         color: theme["secondary"]
    },


    // modal
    centeredView: {
        flex: 1,
        position:"relative",
        
      },
      modalView: {
        position:"absolute",
        bottom:0,
        left:0, right:0,
        backgroundColor: theme["h-1-text-color"],
        borderTopLeftRadius: 30,
        overflow: "hidden",
        alignItems: 'center',
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width:"100%",
        borderTopColor: "#fff",
        
    },
        
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalTitle: {
        marginTop: 40,
        textAlign: 'center',
        color: theme["secondary"]
      },

      closeBtn: {
        position: "absolute",
        left: 0,
        top:0,
        borderTopLeftRadius: 30,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 0,
        borderWidth: 1,
        borderColor: "#DDCA8770",
        backgroundColor:"transparent"

      },

      modalContent: {
        height: '25%',
        width: '100%',
        backgroundColor: '#25292e',
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        position: 'absolute',
        bottom: 0,
      },
      titleContainer: {
        height: '16%',
        backgroundColor: '#464C55',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      title: {
        color: '#fff',
        fontSize: 16,
      },

      gradientBackground: {
        padding: 10,
        borderRadius: 5, // Optional: Add rounded corners if needed
        overflow: 'hidden', // Make sure gradient doesn't overflow text area
      },
})
import { SafeAreaView, StyleSheet, View, Dimensions, Pressable, Modal, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity} from 'react-native'
import React, { useState } from 'react'
import { Button, Divider, Icon, IconElement, Layout, Text } from '@ui-kitten/components'
import theme from "../theme.json"
import { Link, useRouter } from 'expo-router'
import SignupForm from '../components/signup-form'
import SigninForm from '../components/signin-form'
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Alternative icon library

const closeIcon = (props: any): IconElement => (
    <Icon
      {...props}
      name="close-circle"
      style={{width: 30, height: 30}}
      fill="#EC645B"
    />
  );

const auth = () => {
    const {width, height} = Dimensions.get('screen')
    const router = useRouter()
    const [modalIsVisible, setModalIsVisible] = useState<boolean>(false)
    const [modalType, setModalType] = useState("SIGN IN")
    const [isrewardDay, setIsrewardDay] = useState(false)
    const dismissModal = () => {
        setModalIsVisible(true)
      };

  return (

     
    <SafeAreaView style={[styles.container, {marginTop: height * 0.10}]}>
        
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
      <View style={[styles.instructions, {minHeight: height * 0.9}]}>
        <Text category='h1' status='primary' style={[styles.instructionsText, {marginTop: -200}]}  >
            Enter
        </Text>

        <Text style={styles.instructionsText} category='h1' status='primary'  >
            Complete tasks
        </Text>

        <Text style={styles.instructionsText} category='h1' status='primary'  >
            Be happy!
        </Text>
      </View>
      
      
      <Modal animationType="slide" transparent={true} visible={modalIsVisible}>
      <View style={styles.centeredView}>    
            <View style={styles.modalView}>
              {/* MODAL TITLE */}
              <Text category='h4' style={styles.modalTitle}>{modalType}</Text>
              {/* CLOSE BUTTON */}
              <Button style={styles.closeBtn} onPress={() => setModalIsVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="black" />
            </Button>

              {/* AUTH FORM */}
              {modalType === "SIGN UP" ? <SignupForm dismissModal={dismissModal} /> : <SigninForm dismissModal={dismissModal} />}
            </View>
          </View>
    </Modal>
      
      
        
    </SafeAreaView>
  )
}

export default auth

const styles = StyleSheet.create({
    container: {
        
    },

    buttonsRow: {
        flexDirection:"row",
        justifyContent:"center", 
        alignItems:"center",
        columnGap: 10
    },

   
    link: {
        paddingTop: 20,
        fontSize: 20,
        color:"white"
        },
    

    authBtn: {
         borderRadius: 30, paddingHorizontal: 30, backgroundColor: theme["h-1-text-color"], 
    },

    instructions: {
        justifyContent:"center", alignItems:"flex-start", padding: 10
    },

    instructionsText: {
        fontSize: 45, lineHeight: 70, color: theme["h-1-text-color"]
    },


    // modal
    centeredView: {
        flex: 1,
        position:"relative"
      },
      modalView: {
        position:"absolute",
        bottom:0,
        left:0, right:0,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 45,
        // padding: 35,
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
        height:"80%",
        width:"100%",
        
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
        marginTop: 60,
        marginBottom:0,
        textAlign: 'center',
      },

      closeBtn: {
        position: "absolute",
        left: 0,
        top:0,
        borderTopLeftRadius: 30,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 0,
        borderWidth: 0,
        backgroundColor:theme["h-1-text-color"]

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
})
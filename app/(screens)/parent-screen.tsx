import {Animated, Modal, SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Text } from '@ui-kitten/components'
import { Calendar, DateData } from 'react-native-calendars';
import theme from "../theme.json"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AddTaskForm from '../components/AddTaskForm';
import { LinearGradient } from 'expo-linear-gradient';
import { useTaskContext } from '@/contexts/TaskContext';
import { MarkedDates } from 'react-native-calendars/src/types';
import Gradient from '../components/Gradient';
import { useUserContext } from '@/contexts/UserContext';
import ActionSheetAddButton from '../components/action-sheet-add-button';
import { Alert } from 'react-native';
import AddFamilyMember from '../components/AddFamilyMemberForm';

// Define a custom type for the day object returned by onDayPress
interface DayPressObject {
  dateString: string;
  day: string;
  month: number;
  year: number;
}


const ParentScreen = () => {
  // task context
  const {tasks} = useTaskContext()
  const modalHeight = useState(new Animated.Value(0))[0];
  const [modalIsVisible, setModalIsVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState<DateData>()
  const [daysWithTasks, setDaysWithTasks] = useState<MarkedDates>()
  const [expandedModal, setExpandedModal] = useState(false)
  const {user} = useUserContext()
  const [modalType, setModalType] = useState<string>("ADD_TASK")
  // Handler for when a day is pressed
  const handleDayPress = (date: DateData) => {
    // Selected day: {"dateString": "2025-01-01", "day": 1, "month": 1, "timestamp": 1735689600000, "year": 2025}
    if(date.dateString < new Date().toLocaleDateString()) return;

    // No child?
    if(!user?.members?.length) {
      Alert.alert("You nedd to add a child")
      return;
    }
  
    setSelectedDate(date)
    setModalIsVisible(!modalIsVisible)
  };

  useEffect(() => {
    const tasksDates = tasks.map(task => task.date)
    // '2025-01-05': {selected: true, marked: false, selectedColor: 'orange'},
    tasksDates.forEach(td => setDaysWithTasks(prev => {
      return {...prev, [td.dateString]: {selected: true, marked: false, selectedColor: 'orange'}}
    }))
    
  }, [tasks])
  

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
     <View style={{flexDirection:"row", alignItems: "center"}}>
     <Text style={styles.greetings} category='h4'>Welcome, </Text>
     <Text style={styles.greetings} category='h4'>{user?.name}</Text>
     </View>
      <Text style={styles.instructions} category='s2'>Interact with the calendar below to add manage tasks for your child.</Text>
      </View>
      
      <View style={styles.calendarContainer}>
      <Calendar
      theme={{calendarBackground: "#617BB310",}}
          // Set the currently visible month
          date={'2025-01-01'} // Use 'date' instead of 'current'
          // Minimum and Maximum dates that can be selected
          minDate={new Date().toLocaleDateString()}
          maxDate={'2030-12-31'}
          // Handler which gets executed on day press
          onDayPress={handleDayPress}
          // Month format
          monthFormat={'yyyy MMM'}
          // Customize arrows for month navigation
          renderArrow={(direction) => (
            <View style={{ padding: 10 }}>
              {direction === 'left' ? <Text>◀</Text> : <Text>▶</Text>}
            </View>
          )}
          // Mark specific dates
          markedDates={{
            ...daysWithTasks
          }}
        />
      </View>
     
     {/* Modal */}
     <Modal animationType="slide" transparent={true} visible={modalIsVisible}>
      <View style={styles.centeredView}>    
            <Animated.View style={[styles.modalView, {height: modalHeight.interpolate({
            inputRange: [0, 1], // Mapping values (0 -> 80%, 1 -> 100%)
            outputRange: ['80%', '95%'],
          }),}]}>
            
            <Gradient />
              
              {/* CLOSE BUTTON */}
              <Button style={styles.closeBtn} onPress={() => dismissModal()}>
                <MaterialCommunityIcons name="close" size={32} color="red" />
            </Button>

              {
                modalType === "ADD_TASK" ? 
                <AddTaskForm iHaveFocus={handleFormHasFocus}  date={selectedDate} dismiss={() => setModalIsVisible(!modalIsVisible)} />
              : 
                <AddFamilyMember iHaveFocus={handleFormHasFocus} dismiss={() => setModalIsVisible(!modalIsVisible)} addedBy={user!.name} />
              }
            </Animated.View>
          </View>
    </Modal>

    <ActionSheetAddButton type="ADD_MEMBER" onPress={function (): void {
      console.log("::::::::::::: + :::::::::::::");
      
          setModalType("ADD_MEMBER")
          setModalIsVisible(true)
      } } iconName={'add'}  />
    </SafeAreaView>
  )
}

export default ParentScreen

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"#ffffff",
  },

  header: {
    paddingVertical: 20,
    marginBottom: 30,
    paddingHorizontal: 10
  },

  greetings: {
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 24
  },

  instructions: {
    fontSize: 16,
    fontWeight: 300,
    color: "#2B2B2B",
  },

  calendarContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 10,

    boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -10px, #4A8177 0px 30px 60px -30px"
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

  
  
})

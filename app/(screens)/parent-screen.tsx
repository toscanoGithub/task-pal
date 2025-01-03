import {Modal, SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Button, Text } from '@ui-kitten/components'
import { Calendar, DateData } from 'react-native-calendars';
import theme from "../theme.json"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AddTaskForm from '../components/AddTaskForm';
import { LinearGradient } from 'expo-linear-gradient';

// Define a custom type for the day object returned by onDayPress
interface DayPressObject {
  dateString: string;
  day: string;
  month: number;
  year: number;
}


const ParentScreen = () => {
  const [modalIsVisible, setModalIsVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState<DateData>()
  // Handler for when a day is pressed
  const handleDayPress = (date: DateData) => {
    // Selected day: {"dateString": "2025-01-01", "day": 1, "month": 1, "timestamp": 1735689600000, "year": 2025}
    if(date.dateString < new Date().toLocaleDateString()) return;
    setSelectedDate(date)
    setModalIsVisible(!modalIsVisible)
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.greetings} category='h4'>Welcome, Parent</Text>
      <Text style={styles.instructions} category='s2'>Interact with the calendar below to add manage tasks for your child.</Text>
      </View>
      
      <View style={styles.calendarContainer}>
      <Calendar
      theme={{calendarBackground: "#617BB310", }}
          // Set the currently visible month
          date={'2025-01-01'} // Use 'date' instead of 'current'
          // Minimum and Maximum dates that can be selected
          minDate={new Date().toLocaleDateString()}
          maxDate={'2025-12-31'}
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
            
          }}
        />
      </View>
     
     {/* Modal */}
     <Modal animationType="slide" transparent={true} visible={modalIsVisible}>
      <View style={styles.centeredView}>    
            <View style={styles.modalView}>
            <LinearGradient
        // Background Linear Gradient
        colors={[theme["gradient-from"], theme["gradient-to"]]}
        style={styles.background}
      />
              {/* MODAL TITLE */}
              <Text category='h4' style={styles.modalTitle}>Add Task</Text>
              {/* CLOSE BUTTON */}
              <Button style={styles.closeBtn} onPress={() => setModalIsVisible(!modalIsVisible)}>
                <MaterialCommunityIcons name="close" size={32} color="red" />
            </Button>

              {/* ADD TASK FORM */}
              <AddTaskForm date={selectedDate} dismiss={() => setModalIsVisible(!modalIsVisible)} />
            </View>
          </View>
    </Modal>
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
    marginBottom: 30
  },

  greetings: {
    fontWeight: 100,
  },

  instructions: {
    fontSize: 16,
    fontWeight: 300,
    color: "#2B2B2B",
    marginVertical: 5,
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
    color: "#EDB232"
  },

  closeBtn: {
    position: "absolute",
    left: 0,
    top:0,
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderColor: "#cccccc",
    backgroundColor:theme["h-1-text-color"]
  },

  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  
})

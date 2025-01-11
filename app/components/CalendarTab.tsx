import {Animated, Modal, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, IndexPath, Text } from '@ui-kitten/components'
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
import AddFamilyMemberForm from '../components/AddFamilyMemberForm';
import { FamilyMember } from '@/types/Entity';
import Popover  from 'react-native-popover-view';
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';

// Define a custom type for the day object returned by onDayPress
interface DayPressObject {
  dateString: string;
  day: string;
  month: number;
  year: number;
  
}


const CalendarTab = () => {
  // task context
  const {tasks} = useTaskContext()
  const modalHeight = useState(new Animated.Value(0))[0];
  const [modalIsVisible, setModalIsVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState<DateData>()
  const [daysWithTasks, setDaysWithTasks] = useState<MarkedDates>()
  const [expandedModal, setExpandedModal] = useState(false)
  const {user} = useUserContext()
  const [modalType, setModalType] = useState<string>()

  const [visible, setVisible] = React.useState(false);
  const [placementIndex, setPlacementIndex] = React.useState(new IndexPath(1, 0));

const [selectedFamilyMember, setSelectedFamilyMember] = useState<string>()
const [value, setValue] = React.useState('');
const [isPopoverContentVisible, setIsPopoverContentVisible] = useState(false)

    const memberSelected = (member: FamilyMember) => {
      if(member.name === selectedFamilyMember) {
        setIsPopoverContentVisible(false)
        return;
      }
        setDaysWithTasks({})
        setIsPopoverContentVisible(false)

        setSelectedFamilyMember(member.name)
        // assignDriver(driver)
    }




  // Handler for when a day is pressed
  const handleDayPress = (date: DateData) => {
    setModalType("ADD_TASK");
    // Selected day: {"dateString": "2025-01-01", "day": 1, "month": 1, "timestamp": 1735689600000, "year": 2025}
    if(date.dateString < new Date().toLocaleDateString()) return;

    console.log(user);
    
    // No child?
    if(!user?.members?.length) {
      Alert.alert("You nedd to add a child")
      return;
    }
  
    setSelectedDate(date)
    setModalIsVisible(!modalIsVisible)
  };

  const [tasksDates, setTasksDates] = useState<DateData[]>([])
  useEffect(() => {
    if(user?.members) setSelectedFamilyMember(user!.members[0].name)
  }, [])
  
  useEffect(() => {
    const tasksDates = tasks.map(task => {
        return ((task.toFamilyMember === selectedFamilyMember) && task.date) as DateData
    });

    

    console.log("::::::::::::::::", selectedFamilyMember, tasksDates);
  // '2025-01-05': {selected: true, marked: false, selectedColor: 'orange'},
  tasksDates.forEach(td => setDaysWithTasks(prev => {
    return {...prev, [td.dateString]: 
      {selected: true, marked: true, selectedTextColor: "#14282F", dotColor:"#ff0000", selectedColor: "#4A817730", customStyles: {container: {borderColor: "red", borderWidth: 4, borderStyle:"solid"}}  }}
  }))
    
  }, [tasks, selectedFamilyMember])
  


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
      <Text style={styles.instructions} category='s2'>Interact with the calendar below to add manage tasks for your family members.</Text>
      </View>
      
      {
        user?.members && 
        <View style={{flexDirection:"row", width:"100%", paddingHorizontal: 10, justifyContent:"space-between", alignItems:"center"}}>
<Text style={{color: theme.secondary, fontSize: 16, }} category='h6'>{selectedFamilyMember}</Text>
<View style={{marginLeft:"auto"}}>
            <Popover
            isVisible={isPopoverContentVisible}
            popoverStyle={{backgroundColor:theme["gradient-to"], backfaceVisibility: "hidden", width: 150,  }}
          from={(
            <TouchableOpacity disabled={user.members.length === 0} style={{borderWidth: 1, borderRadius: 5, borderColor: "#ffffff", padding: 10, marginRight: 10, marginBottom: 3, backgroundColor: theme['gradient-to']}} onPress={() => setIsPopoverContentVisible(!isPopoverContentVisible)}>
                <Text  category='h6'  style={{color: theme.secondary, fontSize: 12, fontWeight: 900}}>{user.members && user.members.length ? "Select a family member" : "No family members yet" }</Text>
            
            </TouchableOpacity>
          )}>
          {
            user.members.map(member => <Button style={{width: 150}}  status='info' onPress={()=>memberSelected(member)} key={member.name}>{evaProps => <Text style={{color:"white", fontSize: 14, ...evaProps}} >{member.name}</Text>}</Button>)
          }
        </Popover>
        </View>
        </View>

      }
      
      {
        user?.members?.length ? <View style={styles.calendarContainer}>
            
        <Calendar
        theme={{calendarBackground: "#617BB310", }}
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
        </View> : <View style={{flex: 1, justifyContent:"center", alignItems: "center", paddingHorizontal: 50, marginTop: -50}}>
        <Text style={{textAlign: "center", color:theme['gradient-from']}} category='h3'>Please, Add Family Members</Text>
        </View>
      }
     
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
                modalType === "ADD_MEMBER" ? 
                <AddFamilyMemberForm iHaveFocus={handleFormHasFocus} dismiss={() => setModalIsVisible(!modalIsVisible)} addedBy={user!.name} />

              : 
              selectedFamilyMember && <AddTaskForm toFamilyMember={selectedFamilyMember} iHaveFocus={handleFormHasFocus}  date={selectedDate} dismiss={() => setModalIsVisible(!modalIsVisible)} />
}
            </Animated.View>
          </View>
    </Modal>

    <ActionSheetAddButton type="ADD_MEMBER" onPress={function (): void {
          setModalType("ADD_MEMBER")
          setTimeout(() => {
            console.log("::::::::::::: + :::::::::::::", modalType);
            setModalIsVisible(true)
          }, 100);
      } } iconName={'user'}  />
    </SafeAreaView>
  )
}

export default CalendarTab

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"#ffffff",
  },

  header: {
    paddingVertical: 10,
    // marginBottom: 30,
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
    // marginTop: -20,
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

  segmentedButtons: {
    height: "auto", // Customize the height of the segmented control
    width: "90%", // Control width, so it's not full width
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 3
  },

  segmentLabel: {
    fontSize: 12,
    paddingVertical: 0,
    paddingHorizontal:0,

  }
 

  
  
})

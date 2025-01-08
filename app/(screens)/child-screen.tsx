import { SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUserContext } from '@/contexts/UserContext'
import { Text } from '@ui-kitten/components'
import { Calendar } from 'react-native-calendars'
import { DateData, MarkedDates } from 'react-native-calendars/src/types'
import { useTaskContext } from '@/contexts/TaskContext'
import { Task } from '@/types/Entity'
import TaskView from '../components/TaskView'

const ChildScreen = () => {
  const {tasks} = useTaskContext()
  const {user} = useUserContext()
  const [modalIsVisible, setModalIsVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState<DateData>()
  const [daysWithTasks, setDaysWithTasks] = useState<MarkedDates>()
  const [expandedModal, setExpandedModal] = useState(false)
  const [modalType, setModalType] = useState<string>()
  const [tasksForSelectedDay, settasksForSelectedDay] = useState<Task[]>([])

  const [showTask, setShowTask] = useState(false)
  useEffect(() => {
      const filteredTasks = tasks.filter(task => task.toFamilyMember === user?.name)
      const tasksDates = filteredTasks.map(task => task.date)
      // '2025-01-05': {selected: true, marked: false, selectedColor: 'orange'},
      tasksDates.forEach(td => setDaysWithTasks(prev => {
        return {...prev, [td.dateString]: 
          {selected: true, marked: true, selectedTextColor: "#14282F", dotColor:"#ff0000", selectedColor: "#4A817730", customStyles: {container: {borderColor: "red", borderWidth: 4, borderStyle:"solid"}}  }}
      }))
    }, [tasks])


  // Handler for when a day is pressed
    const handleDayPress = (date: DateData) => {
      const filteredTasks = tasks.filter(task => task.toFamilyMember === user?.name)
      const currentDayWithTask = filteredTasks.filter(task => task.date.day === date.day)
      
      if(!currentDayWithTask.length) return // handle day press on day with no task
      
      settasksForSelectedDay(currentDayWithTask)
      setSelectedDate(date)
      setShowTask(!showTask)
    };

    useEffect(() => {
      if(tasksForSelectedDay) console.log("::::::::::::", tasksForSelectedDay);
      
    }, [tasksForSelectedDay])
    
  

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
           <View style={{flexDirection:"row", alignItems: "center"}}>
           <Text style={styles.greetings} category='h4'>Welcome, </Text>
           <Text style={styles.greetings} category='h4'>{user?.name}</Text>
           </View>
            <Text style={styles.instructions} category='s2'>Interact with the calendar below to see your tasks.</Text>
            </View>

            <View style={styles.calendarContainer}>
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
      </View>


      <TaskView tasksCurrentdDay={tasksForSelectedDay} isVisible={showTask} />
    </SafeAreaView>
  )
}

export default ChildScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#F7F8FC"
    },

    header: {
      paddingVertical: 10,
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
      marginTop: -20,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginHorizontal: 10,
      boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -10px, #4A8177 0px 30px 60px -30px"
    },
})
import { Task } from '@/types/Entity';
import { Text } from '@ui-kitten/components';
import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, SafeAreaView } from 'react-native';
import Animated, { Easing, withSpring, useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import theme from "../theme.json"
import ConfettiCannon from 'react-native-confetti-cannon';
import LottieView from 'lottie-react-native';
import { date } from 'yup';
import { DateData } from 'react-native-calendars';
import { useUserContext } from '@/contexts/UserContext';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import db from '@/firebase/firebase-config';
import { useTaskContext } from '@/contexts/TaskContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { dismiss } from 'expo-router/build/global-state/routing';

const { height } = Dimensions.get('window');

interface TaskViewProps {
    isVisible: boolean;
    tasksCurrentdDay: { description: string, id: string,}[],
    date?: DateData,
    allDone: () => void;
}

// Define a type for the button center
type ButtonCenter = {
  x: number;
  y: number;
};




const TaskView: React.FC<TaskViewProps> = ({isVisible, tasksCurrentdDay, date, allDone }) => {
  const [confettiStates, setConfettiStates] = useState<{ [key: string]: boolean }>({}); // Track confetti per task
  const [buttonCenter, setButtonCenter] = useState<ButtonCenter | null>(null); // Button center can be null initially
  const confettiRef = useRef(null);
  const {user} = useUserContext();
  const {updateTask} = useTaskContext()

  // Shared value to track the slide position
  const slidePosition = useSharedValue(-height);

  // Trigger animation when the state changes
  const slideIn = () => {
    slidePosition.value = withSpring(0, { damping: 20, stiffness: 100 }); // Spring animation to slide in
  };

  const slideOut = () => {
    slidePosition.value = withTiming(-height, { duration: 300, easing: Easing.ease }); // Timing animation to slide out
  };

  useEffect(() => {
    if (isVisible) {
      slideIn()
    } else {
      slideOut()
    }
  }, [isVisible]);

  // Style based on the slide position
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: slidePosition.value }],
    };
  });

  // Handle Done button press and trigger confetti for the specific task
  const handlePressDoneBtn = async (taskId: string) => {
    setConfettiStates(prev => ({ ...prev, [taskId]: true }));
    // update state >>> task status from "Pending" to "Completed"
    /*
      query tasks where date match date, where toFamilyMember match user.name and where tasks match tasksCurrentdDay
      Update task with id that match taskId
    */
      
      const q = query(collection(db, "tasks"), where("date", "==", date), where("toFamilyMember", "==", user!.name));
            const querySnapshot = await getDocs(q);
            if(querySnapshot.empty) {
            console.log("no Task registered yet in handlePressDoneBtn")
            } else {
              
              querySnapshot.forEach(async (currentDoc) => {
                  updateTask(currentDoc.data() as Task, taskId );
                  console.log("currentDoc.data() --------- ", currentDoc.data());
                  
                  

                  
                });
              
            }
  };

  const handleLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setButtonCenter({ x: x + width / 2, y: y + height / 2 });
  };


  
 

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Sliding view */}
      <Animated.View style={[styles.slidingView, animatedStyle]}>
      <TouchableOpacity onPress={() =>slideOut()} style={{marginTop: 90,}}>
      <AntDesign name="back" size={24} color="black" />
            </TouchableOpacity>
      <Text category='h1' style={{ color: theme['gradient-to'], marginTop: 30, fontSize: 18, lineHeight: 27, textTransform: "uppercase", paddingLeft: 10, textAlign: "center" }}>Your tasks for</Text>
        <Text  style={{ color: theme['gradient-to'], fontSize: 12, lineHeight: 18,  paddingLeft: 10, marginBottom: 20, textAlign: "center" }}>{date?.dateString}</Text>
        <View style={styles.content}>
          {tasksCurrentdDay.map(task => (
            <View style={styles.taskCard} key={task.id}>
              <Text style={styles.description}>{task.description}</Text>

              {/* Only render the "Done" button if confetti hasn't been triggered */}
              {!confettiStates[task.id] && (
                <TouchableOpacity onLayout={handleLayout} onPress={() => handlePressDoneBtn(task.id)} style={[styles.doneBtn]}>
                  <Text style={{ textAlign: "center" }}>Done</Text>
                </TouchableOpacity>
              )}

              {/* Display the confetti animation for this task */}
              {confettiStates[task.id] && buttonCenter && (
                <LottieView
                  source={require('../../assets/animations/done.json')} // Path to your confetti animation JSON
                  autoPlay
                  loop={false}
                  style={[styles.confetti, { zIndex: 1000, top: buttonCenter.y - 30, left: buttonCenter.x / 2 + 5 }]}
                />
              )}
            </View>
          ))}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slidingView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    height: height, // Adjust the height of the sliding view
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: -5 },
    shadowRadius: 5,
    shadowOpacity: 0.3,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    position: "relative"
  },
  taskCard: {
    marginVertical: 10,
    position: "relative",
    minHeight: 85,
    width: "90%",
    backgroundColor: theme['gradient-to'],
    paddingTop: 10,
    borderTopRightRadius: 30,
    borderTopStartRadius: 20,
    borderBottomStartRadius: 10,
    boxShadow: "rgba(0, 0, 0, 0.45) 0px 25px 20px -20px"
  },
  category: {
    fontSize: 16,
    fontWeight: 700
  },
  description: {
    // marginTop: 3,
    fontSize: 16,
    fontWeight: 700,
    paddingHorizontal: 10,
    color: theme.secondary
  },
  doneBtn: {
    position: "absolute",
    zIndex: 100,
    marginLeft: "auto",
    borderRadius: 30,
    backgroundColor: theme.secondary,
    padding: 5,
    bottom: -10,
    right: -10,
    width: 80,
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"
  },
  confetti: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default TaskView;

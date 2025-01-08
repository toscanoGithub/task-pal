import { Task } from '@/types/Entity';
import { Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Animated, { Easing, withSpring, useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import theme from "../theme.json"

const { height } = Dimensions.get('window');

interface TaskViewProps {
    isVisible: boolean;
    tasksCurrentdDay: Task[]
}
const TaskView: React.FC<TaskViewProps> = ({isVisible, tasksCurrentdDay}) => {

    useEffect(() => {
      console.log(tasksCurrentdDay);
      
    }, [])
    

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
    if(isVisible) {
        slideIn()
    } else {
        slideOut()
    }
  }, [isVisible])
  

  // Style based on the slide position
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: slidePosition.value }],
    };
  });

  return (
    <View style={styles.container}>
      

      {/* Sliding view */}
      <Animated.View style={[styles.slidingView, animatedStyle]}>
        <Text category='h1' style={{color:theme['gradient-to'], marginTop: 120, fontSize: 18, lineHeight: 27, textTransform:"uppercase", paddingLeft: 10, marginBottom: 20, textAlign: "center"}}>Your tasks for today</Text>
        <View style={styles.content}>
          {tasksCurrentdDay.map(task => <View style={styles.taskCard} key={task.date.dateString}>
            <View style={{flexDirection:"row", width:"100%", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 10,}}>
            <Text style={styles.category} category='h6'>Task category</Text>
            
            </View>
            <Text style={styles.description}>{task.description}</Text>
            <TouchableOpacity style={styles.doneBtn}><Text style={{textAlign:"center"}}>Done</Text></TouchableOpacity>
          </View>)}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
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
  },
  text: {
    fontSize: 18,
    color: '#333',
  },

//  Task card
  taskCard: {
    width:"90%",
    backgroundColor: theme.tertiary,
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
    marginTop: 3,
    fontSize: 14,
    fontWeight: 100,
    paddingHorizontal: 10,
  },

  doneBtn: {
    marginLeft: "auto",
    borderRadius: 30,
    backgroundColor: theme.secondary,
    padding: 5,
    bottom: -10,
    right: -10,
    width: 80,
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"
  }
});

export default TaskView;

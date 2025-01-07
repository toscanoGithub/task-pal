import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Animated, { Easing, withSpring, useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

interface TaskViewProps {
    isVisible: boolean;
}
const TaskView: React.FC<TaskViewProps> = ({isVisible}) => {
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
        <View style={styles.content}>
          <Text style={styles.text}>This is a sliding view!</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default TaskView;

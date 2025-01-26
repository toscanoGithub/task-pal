import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Animated, Easing, Dimensions } from 'react-native';

const images = [
  require("../../assets/notifications/good-job.png"),
  require("../../assets/notifications/great-job.png"),
  require("../../assets/notifications/nice-job.png"),
  require("../../assets/notifications/well-done.png")
];

const RewardSlidingImage = () => {
    const {width, height} = Dimensions.get('screen')
  const [position] = useState(new Animated.Value(-404)); // Initial position off the screen (top)
  const [imageIndex, setImageIndex] = useState(Math.floor(Math.random() * images.length)); // Random image index



  useEffect(() => {
    // Slide image down
    Animated.timing(position, {
      toValue: -10, // Center of the screen
      duration: 1000, // Slide duration
      easing: Easing.bounce, // Easing effect for a nice bounce
      useNativeDriver: true,
    }).start(() => {
      // After 3 seconds, slide the image up again
      const timeout = setTimeout(() => {
        Animated.timing(position, {
          toValue: -404, // Slide image back up
          duration: 1000, // Slide back duration
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      }, 3000); // Wait for 5 seconds before sliding up

      // Cleanup timeout on unmount
      return () => clearTimeout(timeout);
    });
  }, [position]);

  useEffect(() => {
    // Pick a random image when the component mounts
    setImageIndex(Math.floor(Math.random() * images.length));
  }, []); // Only run on mount

  return (
      <Animated.View
        style={[styles.imageContainer, { transform: [{ translateX: position }], top: 0 }]}>
        <Image source={images[imageIndex]} style={styles.image} />
      </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    
  },
  imageContainer: {
    position: 'absolute',
    left: 0,
    zIndex: 1000,
    width:404,
    height:452,
  },
  image: {
    width: 404,
    height: 452,
    resizeMode:"center"
  },
});

export default RewardSlidingImage;

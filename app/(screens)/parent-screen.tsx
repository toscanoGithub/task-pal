import { Platform, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Tab, TabBar, Text } from '@ui-kitten/components';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useUserContext } from '@/contexts/UserContext';
import CalendarTab from '../components/CalendarTab';
import TasksTab from '../components/TasksTab';
import { User } from '@/types/Entity';
import { doc, updateDoc } from 'firebase/firestore';
import db from '@/firebase/firebase-config';
import { useTaskContext } from '@/contexts/TaskContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowAlert: true,
  }),
});

const ParentScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [expoPushToken, setExpoPushToken] = useState('');
  const { user, setUser, updateUser } = useUserContext();  // Using user context
  const [shouldUpdateUi, setShouldUpdateUi] = useState(false)
  const [notifiiedFromFamilyMemeber, setNotifiiedFromFamilyMemeber] = useState("")
  const {fetchTasks} = useTaskContext()

  useEffect(() => {
    if(!shouldUpdateUi) return;
    fetchTasks()
  }, [shouldUpdateUi])
  

  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync()
      .then(async (token) => {
        setExpoPushToken(token ?? '')
        setUser((prev) => {
          if (prev) {
            // If prev is not null, just update the pushToken field
            return { ...prev, parentPushToken: token };
          } else {
            // If prev is null, return a full AuthUser object
            return {
              id: "", // Provide a default value or leave it empty
              email: "",
              name: "", // Provide a default value
              parentPushToken: token, // Include the new pushToken
              isFamilyMember: false, // Default value or based on your logic
              members: [], // Empty array or default members
            };
          }
        });

        // Firestore users
        const docRef = doc(db, 'users', user?.id ?? 'userid');
        await updateDoc(docRef, { parentPushToken: token });
      })
      .catch((error: any) => alert(error));

    // Add listener for notification when received
    const notificationSubscription = Notifications.addNotificationReceivedListener(notification => {
      // alert(`Notification received: ${notification.request.content.data.familyMember}`);
      setNotifiiedFromFamilyMemeber(notification.request.content.data.name)
      setShouldUpdateUi(true)

    });

    // Clean up the listener when component unmounts
    return () => {
      notificationSubscription.remove();
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Permission not granted to get push token for push notification!');
        return;
      }
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        alert('Project ID not found');
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log("Parent pushTokenString :::::::::::", pushTokenString);

        return pushTokenString;
      } catch (e: unknown) {
        alert(`${e}`);
      }
    } else {
      alert('Must use physical device for push notifications');
    }
  };

  return (
    <View style={styles.container}>
      <TabBar selectedIndex={selectedIndex} onSelect={index => setSelectedIndex(index)}>
        <Tab title="Calendar" />
        <Tab title="Tasks" />
      </TabBar>

      <View style={styles.tabContent}>
        {selectedIndex === 0 ? (
          <CalendarTab showLikeBtn={shouldUpdateUi} notificationSender={notifiiedFromFamilyMemeber} />
        ) : (
          <TasksTab />
        )}
      </View>
    </View>
  );
};

export default ParentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fc",
  },
  tabContent: {
    flex: 1,
    padding: 10,
  },
});

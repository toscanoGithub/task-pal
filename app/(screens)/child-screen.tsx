import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { Text } from '@ui-kitten/components';
import { Calendar } from 'react-native-calendars';
import { DateData, MarkedDates } from 'react-native-calendars/src/types';
import { useTaskContext } from '@/contexts/TaskContext';
import { Task } from '@/types/Entity';
import TaskView from '../components/TaskView';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';



interface TaskItem {
  description: string;
  id: string;
  status: string;
}

const ChildScreen = () => {
  const { tasks } = useTaskContext();
  const { user } = useUserContext();
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateData>();
  const [daysWithTasks, setDaysWithTasks] = useState<MarkedDates>({});
  const [expandedModal, setExpandedModal] = useState(false);
  const [modalType, setModalType] = useState<string>();
  const [tasksForSelectedDay, settasksForSelectedDay] = useState<TaskItem[]>([]);
  const [showTask, setShowTask] = useState(false);
  const [taskDoneCounter, settaskDoneCounter] = useState(0);
  const [daysCompletedCount, setDaysCompletedCount] = useState(0);
  const [expoPushToken, setExpoPushToken] = useState('');

  async function sendPushNotification(expoPushToken: string) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'All Tasks Completed!',
      body: `${user?.name} has completed all tasks for today.`,
      data: { familyMember: user?.name },
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => alert(error));
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
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        alert('Project ID not found');
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        return pushTokenString;
      } catch (e: unknown) {
        alert(`${e}`);
      }
    } else {
      alert('Must use physical device for push notifications');
    }
  };

  useEffect(() => {
    const filteredTasks = tasks.filter(task => task.toFamilyMember === user?.name);

    let daysWithTasksObj: MarkedDates = {};
    let completedDays = 0;

    filteredTasks.forEach(task => {
      const taskItems = task.tasks as unknown as TaskItem[];

      const allCompleted = taskItems.every((item: TaskItem) => item.status === "Completed");

      daysWithTasksObj[task.date.dateString] = {
        selected: true,
        marked: true,
        selectedTextColor: "#14282F",
        dotColor: "#ff0000",
        selectedColor: allCompleted ? "green" : "#4A817730",
        customStyles: {
          container: {
            borderColor: "red",
            borderWidth: 4,
            borderStyle: "solid"
          }
        }
      };

      if (allCompleted) {
        completedDays += 1;
      }
    });

    setDaysWithTasks(daysWithTasksObj);
    setDaysCompletedCount(completedDays);

  }, [tasks, user?.name]);

  useEffect(() => {
    const totalDaysWithTasks = Object.keys(daysWithTasks).length;
    if (daysCompletedCount === totalDaysWithTasks && totalDaysWithTasks > 0) {
      notifyParentWithAllDone();
    }
  }, [daysCompletedCount, daysWithTasks]);

  const notifyParentWithAllDone = async () => {
    if (expoPushToken) {
      const parentPushToken = getParentPushToken();  // Get parent's push token
      if (parentPushToken) {        
        await sendPushNotification(parentPushToken);  // Send notification to parent
      }
    }
  };

  const getParentPushToken = () => {
    return user?.parentPushToken;  // Assuming parent's token is stored in user context
  };

  const handleDayPress = (date: DateData) => {
    const filteredTasks = tasks.filter(task => task.toFamilyMember === user?.name && date.dateString === task.date.dateString);
    if(filteredTasks.length === 0) return;

    const taskItems = filteredTasks.map(task => task.tasks)[0] as unknown as TaskItem[];

    if (taskItems) {
      settasksForSelectedDay(taskItems);
    }

    setSelectedDate(date);
    setShowTask(!showTask);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Your Expo push token: {expoPushToken}</Text>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.greetings} category="h4">Welcome, </Text>
          <Text style={styles.greetings} category="h4">{user?.name}</Text>
        </View>
        <Text style={styles.instructions} category="s2">
          Interact with the calendar below to see your tasks.
        </Text>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          theme={{ calendarBackground: "#617BB310" }}
          date="2025-01-01"
          minDate={new Date().toLocaleDateString()}
          maxDate="2030-12-31"
          onDayPress={handleDayPress}
          monthFormat="yyyy MMM"
          renderArrow={(direction) => (
            <View style={{ padding: 10 }}>
              {direction === 'left' ? <Text>◀</Text> : <Text>▶</Text>}
            </View>
          )}
          markedDates={daysWithTasks}
        />
      </View>

      <TaskView
        dismiss={() => setShowTask(false)}
        tasksCurrentdDay={tasksForSelectedDay}
        isVisible={showTask}
        date={selectedDate}
        allDone={() => alert("All tasks are done")}
      />
    </SafeAreaView>
  );
};

export default ChildScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },
  header: {
    paddingVertical: 10,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  greetings: {
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 24,
  },
  instructions: {
    fontSize: 16,
    fontWeight: 300,
    color: "#2B2B2B",
  },
  calendarContainer: {
    marginTop: -20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginHorizontal: 10,
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -10px, #4A8177 0px 30px 60px -30px",
  },
});

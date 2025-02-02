import { Animated, Modal, SafeAreaView, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, IndexPath, Text } from '@ui-kitten/components';
import { Calendar, DateData } from 'react-native-calendars';
import theme from "../theme.json";
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
import Popover from 'react-native-popover-view';
import * as Notifications from 'expo-notifications';
import RewardDialog from '../components/RewardDialog';


interface CalendarTabProps {
  showLikeBtn: boolean,
  notificationSender: string;
}
const CalendarTab: React.FC<CalendarTabProps> = ({showLikeBtn, notificationSender}) => {
  // task context
  const { tasks } = useTaskContext();
  const { user } = useUserContext();

  const modalHeight = useState(new Animated.Value(0))[0];
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateData>();
  const [daysWithTasks, setDaysWithTasks] = useState<MarkedDates>({});
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<string>();
  const [isPopoverContentVisible, setIsPopoverContentVisible] = useState(false);
  const [modalType, setModalType] = useState<string>()
  const [expandedModal, setExpandedModal] = useState(false)
  const {fetchTasks} = useTaskContext()
  const [allDone, setAllDone] = useState(false)

  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
  const [reward, setReward] = useState<string>();

  const memberSelected = (member: FamilyMember) => {
    if (member.name === selectedFamilyMember) {
      setIsPopoverContentVisible(false);
      return;
    }
    setDaysWithTasks({});
    setIsPopoverContentVisible(false);
    setSelectedFamilyMember(member.name);
  };

  // Handler for when a day is pressed
  const handleDayPress = (date: DateData) => {
    setModalType("ADD_TASK");
    if (date.dateString < new Date().toLocaleDateString()) return;

    if (!user?.members?.length) {
      Alert.alert("You need to add a child");
      return;
    }

    setSelectedDate(date);
    setModalIsVisible(!modalIsVisible);
  };

  // useEffect(() => { 
  //     if (user?.members && !selectedFamilyMember) {
  //       setSelectedFamilyMember(user!.members[0].name)
  //     }
  // }, []);

  useEffect(() => {
    const tasksDates = tasks.map(task => {
      return task.toFamilyMember === selectedFamilyMember ? task.date : null;
    }).filter((taskDate): taskDate is DateData => taskDate !== null); // Filter out null values
  
    // Initialize the daysWithTasks object
    const newDaysWithTasks: MarkedDates = {};
    
    tasksDates.forEach(td => {
      // Filter tasks for the given date and family member
      const taskItems = tasks.filter(task => task.date.dateString === td.dateString && task.toFamilyMember === selectedFamilyMember)[0]?.tasks;
      
      if (taskItems) {
        // Type assertion to specify taskItems as an array of objects with a `status` property
        const allCompleted = (taskItems as unknown as { status: string }[]).every((item) => item.status === 'Completed');
        console.log(":::::::: allCompleted ::::::::::", allCompleted);
        newDaysWithTasks[td.dateString] = {
          selected: true,
          marked: true,
          selectedTextColor: "#14282F",
          dotColor: "#ff0000",
          selectedColor: allCompleted ? "green" : "#4A817730", // green for completed, transparent for incomplete
        };

        setAllDone(allCompleted)

      }
    });
  
    setDaysWithTasks(newDaysWithTasks);
  }, [tasks, selectedFamilyMember]);



  useEffect(() => {
    if(notificationSender === "") return;
    setSelectedFamilyMember(notificationSender)
    fetchTasks()
    
  }, [notificationSender])
  
  
 

  

  const dismissModal = () => {
    setExpandedModal(false);
    // Animate height between 80% and 100% of the screen height
    Animated.timing(modalHeight, {
      toValue: 0, // 0.8 -> 80% and 1 -> 100%
      duration: 500, // 3 seconds for the transition
      useNativeDriver: false,
    }).start();

    setModalIsVisible(false);
    setExpandedModal(false);
  };

  const handleFormHasFocus = () => {
    setExpandedModal(true);
    // Animate height between 80% and 100% of the screen height
    Animated.timing(modalHeight, {
      toValue: 0.95, // 0.8 -> 80% and 1 -> 100%
      duration: 500, // 3 seconds for the transition
      useNativeDriver: false,
    }).start();

    setModalIsVisible(true);
  };



  async function sendPushNotification(expoPushToken: string) {
    const pt = user?.members?.find(u => u.name === notificationSender);
    
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Great job!',
      body: `${selectedFamilyMember} You completed all tasks of the week.`,
      data: { reward: reward },
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

  const congratNotificationSender = () => {
    setIsDialogVisible(true)
    
    
  }

  const handleAddReward = (newReward: string) => {
  console.log("::::::::::::", reward);
  
    setReward(newReward);
    
  };

  useEffect(() => {
    if(!reward) return;
    const pt = user?.members?.find(m => m.name === selectedFamilyMember);
    if(pt) {
      sendPushNotification(pt!.memberPushToken as unknown as string)
    }
  }, [reward])
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.greetings} category="h4">Welcome, </Text>
          <Text style={styles.greetings} category="h4">{user?.name}</Text>
          
        </View>
        <Text style={styles.instructions} category="s2">
          Interact with the calendar below to add/manage tasks for your family members.
        </Text>
      </View>

      {user?.members && (
        <View style={{ flexDirection: "row", width: "100%", paddingHorizontal: 10, justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: theme.secondary, fontSize: 16 }} category="h6">{selectedFamilyMember}</Text>
          {allDone  && (<TouchableOpacity onPress={congratNotificationSender} style={styles.likeImageBtn}>
          <Image
            source={require('../../assets/notifications/like.png')}
            style={styles.likeImage}
          />
          </TouchableOpacity>)}
          <View style={{ marginLeft: "auto" }}>
            <Popover
              isVisible={isPopoverContentVisible}
              popoverStyle={{ backgroundColor: theme["gradient-to"], backfaceVisibility: "hidden", width: 150 }}
              from={(
                <TouchableOpacity
                  disabled={user.members.length === 0}
                  style={{ borderWidth: 1, borderRadius: 5, borderColor: "#ffffff", padding: 10, marginRight: 10, marginBottom: 3, backgroundColor: theme['gradient-to'] }}
                  onPress={() => {
                    setIsPopoverContentVisible(!isPopoverContentVisible)
                  }}
                >
                  <Text category="h6" style={{ color: theme.secondary, fontSize: 12, fontWeight: 900 }}>
                    {user.members && user.members.length ? "Select a family member" : "No family members yet"}
                  </Text>
                </TouchableOpacity>
              )}
            >
              {user.members.map(member => (
                <Button style={{ width: 150 }} status="info" onPress={() => {
                  fetchTasks()
                  memberSelected(member)
                }} key={member.name}>
                  {evaProps => <Text style={{ color: "white", fontSize: 14, ...evaProps }}>{member.name}</Text>}
                </Button>
              ))}
            </Popover>
          </View>
        </View>
      )}

      {user?.members?.length ? (
        <View style={styles.calendarContainer}>
          <Calendar
            theme={{ calendarBackground: "#ffffff" , dayTextColor:"black"}}
            date={'2025-01-01'}
            minDate={new Date().toLocaleDateString()}
            maxDate={'2080-12-31'}
            onDayPress={handleDayPress}
            monthFormat={'yyyy MMM'}
            renderArrow={(direction) => (
              <View style={{ padding: 10 }}>
                {direction === 'left' ? <Text>◀</Text> : <Text>▶</Text>}
              </View>
            )}
            markedDates={daysWithTasks}
          />
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 50, marginTop: -50 }}>
          <Text style={{ textAlign: "center", color: theme['gradient-from'] }} category="h3">Please, Add Family Members</Text>
        </View>
      )}

      {/* Reward dialogue */}
      <RewardDialog
        isVisible={isDialogVisible}
        onClose={() => setIsDialogVisible(false)}
        onAddReward={handleAddReward}
      />

      {/* Modal */}
      <Modal animationType="slide" transparent={true} visible={modalIsVisible}>
        <View style={styles.centeredView}>
          <Animated.View style={[styles.modalView, { height: modalHeight.interpolate({ inputRange: [0, 1], outputRange: ['80%', '95%'] }) }]}>
            <Gradient />
            <Button style={styles.closeBtn} onPress={() => dismissModal()}>
              <MaterialCommunityIcons name="close" size={32} color="red" />
            </Button>
            {modalType === "ADD_MEMBER" ? (
               user && <AddFamilyMemberForm iHaveFocus={handleFormHasFocus} dismiss={() => setModalIsVisible(!modalIsVisible)} addedBy={user.name} />
            ) : selectedFamilyMember && (
              <AddTaskForm toFamilyMember={selectedFamilyMember} iHaveFocus={handleFormHasFocus} date={selectedDate} dismiss={() => setModalIsVisible(!modalIsVisible)} />
            )}
          </Animated.View>
        </View>
      </Modal>

      <ActionSheetAddButton
        type="ADD_MEMBER"
        onPress={() => {
          setModalType("ADD_MEMBER");
          setTimeout(() => {
            setModalIsVisible(true);
          }, 100);
        }}
        iconName={'user'}
      />
    </SafeAreaView>
  );
};

export default CalendarTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingVertical: 10,
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 10,
    boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -10px, #4A8177 0px 30px 60px -30px",
  },
  centeredView: {
    flex: 1,
    position: "relative",
  },
  modalView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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
    width: "100%",
  },
  closeBtn: {
    position: "absolute",
    left: 0,
    top: 0,
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderColor: "#DDCA8770",
    backgroundColor: "transparent",
  },

  likeImageBtn: {
    width: 40,  // width of the image
    height: 40, // height of the image,
  },

  likeImage: {
    width: "100%",  // width of the image
    height: "100%", // height of the image
    resizeMode: 'contain', // or 'cover', 'stretch', etc.
  }
});


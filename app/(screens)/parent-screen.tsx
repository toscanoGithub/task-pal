import { StyleSheet, View } from 'react-native'
import React from 'react'
import CalendarTab from '../components/CalendarTab'
import { Tab, TabBar, Text } from '@ui-kitten/components';
import theme from "../theme.json"
import SuggestionsTab from '../components/TasksTab';
import TasksTab from '../components/TasksTab';

const ParentScreen = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const tabsContent = () => {
    switch (selectedIndex) {
      case 0:
        return <CalendarTab />
      case 1:
        return <TasksTab />
      
      default:
        break;
    }
  }
  return (
    <>
    <TabBar indicatorStyle={{backgroundColor: theme['gradient-to'], paddingVertical: 1}} style={{backgroundColor: theme['gradient-to'], borderTopColor: "#cccccc20", paddingVertical: 15, borderTopWidth: 2}}
      selectedIndex={selectedIndex}
      onSelect={index => setSelectedIndex(index)}
    >
      <Tab  title={evaProps => <Text category="h1" {...evaProps} style={{color: `${selectedIndex === 0 ? theme.secondary : "#F7F9FC50"}`, fontSize: 14, fontWeight: 700, textTransform: "uppercase"}}>Calendar</Text>} />
      <Tab  title={evaProps => <Text category="h1" {...evaProps} style={{color: `${selectedIndex === 1 ? theme.secondary : "#F7F9FC50"}`, fontSize: 14, fontWeight: 700, textTransform: "uppercase"}}>Tasks</Text>} />
    </TabBar>

    {
      tabsContent()
    }
    </>
  );
}

export default ParentScreen

const styles = StyleSheet.create({})
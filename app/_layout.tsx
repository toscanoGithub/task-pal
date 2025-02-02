import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, Text } from '@ui-kitten/components';
import { PaperProvider } from 'react-native-paper';


import { useColorScheme } from '@/hooks/useColorScheme';
import { View } from 'react-native';
import Header from './components/Header';
import CombinedContextProvider from '@/contexts/CombinedContextProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  
  const [currentUser, setCurrentUser] = useState(false)

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

      // already logged go to parent-screen >>> sure not yet so stay home
      if(currentUser) {
        router.push("/(screens)/parent-screen")
      } 
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <CombinedContextProvider>
      <PaperProvider>
        <ApplicationProvider {...eva} theme={eva.light}>
                <IconRegistry icons={EvaIconsPack}/>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack  screenOptions={{headerShown: false}}>
            {/* parent screen */}
            <Stack.Screen name="(screens)/parent-screen" 
            options={{headerShown: true, title: "Parent", headerBackVisible: false,
              header: (props) => {
                return <Header  username='Parent' />
              }
            }}/>

            {/* child screen */}
            <Stack.Screen name="(screens)/child-screen" 
            options={{headerShown: true,  title:"Child", headerBackVisible: true, 
              
              header: (props) => {
                return <Header username='Child' />
              }
            }}/>

            {/* child screen */}
            <Stack.Screen name="(screens)/reward-screen" />

            {/* not found screen */}
            <Stack.Screen name="+not-found" />
            
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
        </ApplicationProvider>
        </PaperProvider>
    </CombinedContextProvider>

  );
}

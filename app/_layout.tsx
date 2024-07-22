import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Raleway: require('../assets/fonts/Raleway-Regular.ttf'),
  });

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const onboardingStatus = await AsyncStorage.getItem(
        'onboardingCompleted'
      );
      if (onboardingStatus) {
        setIsOnboardingCompleted(true);
      }
    };

    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (!isOnboardingCompleted) {
    return (
      <Stack>
        <Stack.Screen name='onboarding' options={{ headerTitle: 'Sign Up' }} />
      </Stack>
    );
  }

  console.log('isOnboardingCompleted', isOnboardingCompleted);
  return (
    <Stack>
      {/* <Stack.Screen name='(tabs)' options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name='+not-found' /> */}
      {/* <Stack.Screen name='Home'/> */}
    </Stack>
  );
}

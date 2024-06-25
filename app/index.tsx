import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useLayoutEffect } from 'react';
import { Link, Stack, useNavigation } from 'expo-router';

const index = () => {
  const navigation = useNavigation();
  // remove header
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);
  return (
    <SafeAreaView className='flex-1 '>
      <Text className='text-center text-5xl font-Raleway'>#Chat</Text>
      <Text className='text-center text-xl font-Raleway'>
        Empower Your Mind: AI Support for Teens
      </Text>
      <Image
        source={require('../assets/images/hashtag.png')}
        style={{ width: 200, height: 200, marginHorizontal: 'auto' }}
      />
      <Link href='(tabs)'>Go to (tabs)</Link>
      <Link href='/test'>Go to test</Link>
      <TouchableOpacity className='bg-blue-400 rounded-xl p-4 text-white w-[90%] mt-auto mx-auto'>
        <Text
          className='text-center text-lg text-white
          font-Raleway font-semibold'
        >
          Get Started
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default index;

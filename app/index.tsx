import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useLayoutEffect } from 'react';
import { Link, Stack, useNavigation, useRouter } from 'expo-router';

const index = () => {
  const navigation = useNavigation();
  // remove header
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const router = useRouter();

  return (
    <SafeAreaView className='flex-1 '>
      <TouchableWithoutFeedback onPress={() => router.push('/voice')}>
        <View className='my-auto flex-1 items-center justify-center'>
          <Text className='text-center text-5xl font-Raleway'>#Chat</Text>
          <Text className='text-center text-xl font-Raleway my-6'>
            Empower Your Mind: AI Support for Teens
          </Text>
          <Image
            source={require('../assets/images/hashtag2.png')}
            style={{ width: 200, height: 200, marginHorizontal: 'auto' }}
          />
          {/* <Link href='(tabs)'>Go to (tabs)</Link>
        <Link href='/test'>Go to test</Link> */}
        </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity
        className='bg-blue-400 rounded-xl p-4 text-white w-[90%] mt-auto mx-auto'
        onPress={() => router.push('/text')}
      >
        <Text
          className='text-center text-lg text-white
          font-Raleway font-semibold'
        >
          Get Started with text
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default index;

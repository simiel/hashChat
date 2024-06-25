import { View, Text } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { Link, Stack, useNavigation } from 'expo-router';

const index = () => {
  const navigation = useNavigation();
  // remove header
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);
  return (
    <View>
      <Text>index</Text>
      <Text>index</Text>
      <Text>index</Text>
      <Text>index</Text>
      <Text className='font-[100] font-Raleway'>indexyy</Text>
      <Text className='font-Raleway'>index</Text>
      <Text className='font-SpaceMono font-[400]'>index</Text>
      <Text className='font-Raleway'>Raleway</Text>
      <Link href='(tabs)'>Go to (tabs)</Link>
      <Link href='/test'>Go to test</Link>
    </View>
  );
};

export default index;

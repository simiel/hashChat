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
      <Text>index</Text>
      <Text>index</Text>
      <Text>index</Text>
      <Text>index</Text>
      <Text>index</Text>
      <Link href='(tabs)'>Go to (tabs)</Link>
      <Link href='/test'>Go to test</Link>
    </View>
  );
};

export default index;

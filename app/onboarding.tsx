// screens/OnboardingScreen.js
import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const OnboardingScreen = ({ navigation }: any) => {
  const { control, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      navigation.navigate('Home');
    } catch (e) {
      console.error('Failed to save onboarding data to local storage', e);
    }
  };

  return (
    <View className='flex-1 justify-center p-5'>
      <Text className='text-lg mb-2'>Age</Text>
      <Controller
        control={control}
        name='age'
        render={({ field: { onChange, value } }) => (
          <TextInput
            className='border border-gray-300 p-2 mb-4 rounded'
            placeholder='Enter your age'
            keyboardType='numeric'
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Text className='text-lg mb-2'>Disability</Text>
      <Controller
        control={control}
        name='disability'
        render={({ field: { onChange, value } }) => (
          <Picker
            selectedValue={value}
            onValueChange={onChange}
            style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 16 }}
          >
            <Picker.Item label='Select Disability' value='' />
            <Picker.Item label='None' value='none' />
            <Picker.Item label='Visual' value='visual' />
            <Picker.Item label='Hearing' value='hearing' />
          </Picker>
        )}
      />

      <Text className='text-lg mb-2'>Gender</Text>
      <Controller
        control={control}
        name='gender'
        render={({ field: { onChange, value } }) => (
          <Picker
            selectedValue={value}
            onValueChange={onChange}
            style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 16 }}
          >
            <Picker.Item label='Select Gender' value='' />
            <Picker.Item label='Male' value='male' />
            <Picker.Item label='Female' value='female' />
          </Picker>
        )}
      />

      <Button title='Submit' onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default OnboardingScreen;

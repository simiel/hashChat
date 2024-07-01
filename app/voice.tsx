import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-proj-1QeKnew1Z6MY3CazY3xNT3BlbkFJsP1dGVemeeQpvGRsnBMf',
});

const VoiceToText: React.FC = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [results, setResults] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [currentResponseIndex, setCurrentResponseIndex] = useState<
    number | null
  >(null);
  const animatedValue = useRef(new Animated.Value(1)).current;

  const initialContextMessage = {
    role: 'user',
    content: 'You are an AI chatbot for mental health.',
  };

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    getSavedResponses();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (e: SpeechResultsEvent) => {
    setResults(e.value ?? []);
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    console.error(e);
    setIsListening(false);
  };

  const startRecognition = async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecognition = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
      if (results.length > 0) {
        sendToChatGPT(results[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendToChatGPT = async (message: string) => {
    try {
      const savedResponses = await AsyncStorage.getItem('conversationHistory');
      const parsedHistory: any[] = savedResponses
        ? JSON.parse(savedResponses)
        : [];
      const updatedHistory = [
        ...parsedHistory,
        { role: 'user', content: message },
      ];
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k',
        messages: [initialContextMessage, ...updatedHistory],
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.7,
      });

      const reply = response.choices[0].message.content || '';
      setResponses((prevResponses) => [...prevResponses, reply]);
      setConversationHistory(updatedHistory);
      setCurrentResponseIndex(responses.length);
      saveResponse(updatedHistory, reply);
      speakResponse(reply);
    } catch (error) {
      console.error('Error sending message to ChatGPT', error);
    }
  };

  const speakResponse = (text: string) => {
    Speech.speak(text, {
      language: 'en',
    });
  };

  const saveResponse = async (updatedHistory: any[], response: string) => {
    try {
      const newHistory = [
        ...updatedHistory,
        { role: 'assistant', content: response },
      ];
      await AsyncStorage.setItem(
        'conversationHistory',
        JSON.stringify(newHistory)
      );
    } catch (error) {
      console.error('Error saving response', error);
    }
  };

  const getSavedResponses = async () => {
    try {
      const savedResponses = await AsyncStorage.getItem('conversationHistory');
      const parsedResponses: string[] = savedResponses
        ? JSON.parse(savedResponses)
        : [];
      setConversationHistory(parsedResponses);
    } catch (error) {
      console.error('Error retrieving responses', error);
    }
  };

  const previousResponse = () => {
    if (currentResponseIndex !== null && currentResponseIndex > 0) {
      const newIndex = currentResponseIndex - 1;
      setCurrentResponseIndex(newIndex);
      speakResponse(responses[newIndex]);
    }
  };

  const nextResponse = () => {
    if (
      currentResponseIndex !== null &&
      currentResponseIndex < responses.length - 1
    ) {
      const newIndex = currentResponseIndex + 1;
      setCurrentResponseIndex(newIndex);
      speakResponse(responses[newIndex]);
    }
  };

  const animateButton = (toValue: number) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPressIn={() => {
          animateButton(1.5);
          startRecognition();
        }}
        onPressOut={() => {
          animateButton(1);
          stopRecognition();
        }}
        style={styles.recordButton}
      >
        <Animated.View
          style={[
            styles.animatedButton,
            { transform: [{ scale: animatedValue }] },
          ]}
        >
          <Text style={styles.recordButtonText}>🎤</Text>
        </Animated.View>
      </TouchableOpacity>
      <View style={styles.navigationButtons}>
        <Button
          title='Previous'
          onPress={previousResponse}
          disabled={currentResponseIndex === 0}
        />
        <Button
          title='Next'
          onPress={nextResponse}
          disabled={
            currentResponseIndex === null ||
            currentResponseIndex === responses.length - 1
          }
        />
      </View>
      {results.length > 0 && (
        <View style={{ marginTop: 20 }}>
          {results.map((result, index) => (
            <Text key={index}>{result}</Text>
          ))}
        </View>
      )}
      {responses.length > 0 && (
        <View style={{ marginTop: 20 }}>
          {responses.map((response, index) => (
            <Text key={index}>{response}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  recordButton: {
    marginBottom: 20,
  },
  animatedButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonText: {
    fontSize: 40,
    color: '#fff',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
});

export default VoiceToText;

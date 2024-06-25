import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import Voice from '@react-native-voice/voice';

const VoiceToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (e: any) => {
    setResults(e.value);
  };

  const onSpeechError = (e: any) => {
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button
        onPress={isListening ? stopRecognition : startRecognition}
        title={isListening ? 'Stop Listening' : 'Start Listening'}
      />
      {results.length > 0 && (
        <View style={{ marginTop: 20 }}>
          {results.map((result, index) => (
            <Text key={index}>{result}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default VoiceToText;

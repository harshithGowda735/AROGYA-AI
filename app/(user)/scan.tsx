import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView } from '../../components/CameraView';
import { TFLiteEngine } from '../../services/tfliteEngine';
import { StorageService } from '../../services/storage';

export default function ScanScreen() {
  const router = useRouter();
  const [isCapturing, setIsCapturing] = useState(true);

  const handleCapture = async (uri: string) => {
    setIsCapturing(false);
    // Redirect to processing UI with the image URI
    router.replace({
      pathname: '/ai-processing/processing-ui',
      params: { uri }
    });
  };

  return (
    <View style={styles.container}>
      {isCapturing && (
        <CameraView 
          onClose={() => router.back()} 
          onCapture={handleCapture} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

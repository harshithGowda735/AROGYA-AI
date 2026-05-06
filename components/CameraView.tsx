import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import { Camera, X, Zap, RefreshCw } from 'lucide-react-native';
import * as Reanimated from 'react-native-reanimated';

interface CameraViewProps {
  onClose: () => void;
  onCapture: (uri: string) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onClose, onCapture }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      onCapture(photo.uri);
    }
  };

  return (
    <View style={styles.container}>
      <ExpoCameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={onClose} style={styles.iconButton}>
              <X color="white" size={24} />
            </TouchableOpacity>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>READY FOR SCAN</Text>
            </View>
          </View>

          <View style={styles.reticleContainer}>
             <View style={styles.reticle} />
          </View>

          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.sideButton}>
              <Zap color="white" size={24} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleCapture} style={styles.captureButton}>
              <View style={styles.captureButtonInner}>
                <Camera color="#000" size={32} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideButton}>
              <RefreshCw color="white" size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </ExpoCameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'space-between',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  iconButton: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#00E5FF',
  },
  statusText: {
    color: '#00E5FF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  reticleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticle: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 125,
    borderStyle: 'dashed',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00E5FF',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideButton: {
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00E5FF',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  }
});

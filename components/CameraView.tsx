import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Platform, Image, Animated, Easing
} from 'react-native';
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X, RefreshCw, Image as ImageIcon, CheckCircle } from 'lucide-react-native';

interface CameraViewProps {
  onClose: () => void;
  onCapture: (uri: string) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onClose, onCapture }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [preview, setPreview] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    startAnimation();
  }, []);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 258], // 260 height - 2 line height
  });

  // ── Pick from gallery ────────────────────────────────────────────────────────
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Gallery permission is required to upload images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setPreview(result.assets[0].uri);
    }
  };

  // ── Take photo with camera ───────────────────────────────────────────────────
  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      setPreview(photo.uri);
    }
  };

  // ── Confirm and send to AI pipeline ─────────────────────────────────────────
  const handleConfirm = () => {
    if (preview) onCapture(preview);
  };

  // ── Permission screen ────────────────────────────────────────────────────────
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permBox}>
          <Camera size={48} color="#00E5FF" />
          <Text style={styles.permTitle}>Camera Access Needed</Text>
          <Text style={styles.permSub}>Required for skin scanning. You can also upload from gallery without camera access.</Text>
          <TouchableOpacity onPress={requestPermission} style={styles.permBtn}>
            <Text style={styles.permBtnText}>GRANT CAMERA ACCESS</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickImage} style={styles.permBtnAlt}>
            <ImageIcon size={16} color="#00E5FF" />
            <Text style={styles.permBtnAltText}>Upload from Gallery Instead</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.permClose}>
            <Text style={styles.permCloseText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        {/* Show preview if user picked from gallery */}
        {preview && (
          <View style={styles.previewOverlay}>
            <Image source={{ uri: preview }} style={styles.previewImage} />
            <View style={styles.previewActions}>
              <TouchableOpacity onPress={() => setPreview(null)} style={styles.retakeBtn}>
                <RefreshCw size={18} color="#FFF" />
                <Text style={styles.retakeBtnText}>RETAKE</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm} style={styles.confirmBtn}>
                <CheckCircle size={18} color="#000" />
                <Text style={styles.confirmBtnText}>ANALYZE</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }

  // ── Preview screen (after capture or upload) ─────────────────────────────────
  if (preview) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: preview }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={styles.previewOverlay}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => setPreview(null)} style={styles.iconButton}>
              <X color="white" size={22} />
            </TouchableOpacity>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>IMAGE READY</Text>
            </View>
            <View style={{ width: 48 }} />
          </View>

          <View style={styles.reticleContainer}>
            <View style={styles.scanBox}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
            </View>
          </View>

          <View style={styles.previewActions}>
            <TouchableOpacity onPress={() => setPreview(null)} style={styles.retakeBtn}>
              <RefreshCw size={18} color="#FFF" />
              <Text style={styles.retakeBtnText}>RETAKE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={styles.confirmBtn}>
              <CheckCircle size={18} color="#000" />
              <Text style={styles.confirmBtnText}>ANALYZE SKIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ── Live camera screen ───────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <ExpoCameraView style={styles.camera} ref={cameraRef} />
      <View style={styles.overlay}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.iconButton}>
            <X color="white" size={22} />
          </TouchableOpacity>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>READY FOR SCAN</Text>
          </View>
          <View style={{ width: 48 }} />
        </View>

        {/* Scan guide */}
        <View style={styles.reticleContainer}>
          <View style={styles.scanBox}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
          </View>
          <Text style={styles.guideText}>ALIGN SKIN AREA WITHIN THE BOX</Text>
        </View>

        {/* Bottom controls */}
        <View style={styles.bottomBar}>
          {/* Upload from gallery */}
          <TouchableOpacity onPress={handlePickImage} style={styles.sideButton}>
            <ImageIcon color="white" size={24} />
            <Text style={styles.sideLabel}>Gallery</Text>
          </TouchableOpacity>

          {/* Capture button */}
          <TouchableOpacity onPress={handleCapture} style={styles.captureButton}>
            <View style={styles.captureButtonInner}>
              <Camera color="#000" size={30} />
            </View>
          </TouchableOpacity>

          {/* Flip (placeholder) */}
          <TouchableOpacity style={styles.sideButton}>
            <RefreshCw color="white" size={24} />
            <Text style={styles.sideLabel}>Flip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 30,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
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
    gap: 24,
  },
  scanBox: {
    width: 260,
    height: 260,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00E5FF',
    borderWidth: 4,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 16 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 16 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 16 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 16 },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    opacity: 1,
    position: 'absolute',
    top: 0,
    zIndex: 5,
  },
  guideText: {
    color: '#00E5FF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideButton: {
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
    alignItems: 'center',
    gap: 4,
  },
  sideLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // ── Preview ──────────────────────────────────────────────────────────────────
  previewImage: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 20,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
    justifyContent: 'center',
  },
  retakeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  retakeBtnText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1.5,
  },
  confirmBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#00E5FF',
    borderRadius: 16,
  },
  confirmBtnText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1.5,
  },

  // ── Permission ───────────────────────────────────────────────────────────────
  permBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  permTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  permSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  permBtn: {
    backgroundColor: '#00E5FF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  permBtnText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1.5,
  },
  permBtnAlt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#00E5FF',
    width: '100%',
    justifyContent: 'center',
  },
  permBtnAltText: {
    color: '#00E5FF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  permClose: { marginTop: 8 },
  permCloseText: { color: 'rgba(255,255,255,0.3)', fontSize: 13 },
});

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { TacoService } from '../../../services/TacoService';

export default function CameraScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<any>(null);

  if (!permission) return <View style={styles.center}><ActivityIndicator color="#10B981" /></View>;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>O NutriLens precisa da câmera.</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}><Text style={styles.btnText}>Permitir</Text></TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsProcessing(true);
      try {
        await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
        setTimeout(() => {
          setIsProcessing(false);
          // IA "Identificou" Frango
          const aiResult = TacoService.search('frango')[0]; 
          if(aiResult) navigation.navigate('AddFood', { food: aiResult });
        }, 1500);
      } catch (e) {
        setIsProcessing(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. A Câmera no fundo (SEM FILHOS DENTRO) */}
      <CameraView style={StyleSheet.absoluteFillObject} facing="back" ref={cameraRef} />
      
      {/* 2. Os botões e a mira flutuando por cima */}
      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <MaterialIcons name="close" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.focusFrame} />

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.captureBtn} onPress={takePicture} disabled={isProcessing}>
            {isProcessing ? <ActivityIndicator size="large" color="#10B981" /> : <View style={styles.captureInner} />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#FFF', marginBottom: 20 },
  btn: { backgroundColor: '#10B981', padding: 15, borderRadius: 10 },
  btnText: { fontWeight: 'bold' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', paddingVertical: 40 },
  topBar: { paddingHorizontal: 20, alignItems: 'flex-end' },
  iconBtn: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 20 },
  focusFrame: { width: 250, height: 250, borderWidth: 2, borderColor: '#10B981', borderRadius: 20, alignSelf: 'center', borderStyle: 'dashed' },
  bottomBar: { alignItems: 'center', paddingBottom: 30 },
  captureBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: 65, height: 65, borderRadius: 35, backgroundColor: '#FFF' },
});
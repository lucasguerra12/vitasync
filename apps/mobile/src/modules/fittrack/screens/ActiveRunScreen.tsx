import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppSelector } from '../../../store/hooks';
import { supabase } from '../../../services/supabase';

// 1. ALTERNE PARA FALSE PARA DESATIVAR O MAPA E EVITAR O ERRO DA API KEY
const MAPA_ATIVO = false; 

export function ActiveRunScreen({ navigation }: any) {
  const auth = useAppSelector((state) => state.auth); 
  
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(0); 
  const [duration, setDuration] = useState(0); 
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulação de GPS para teste sem mapa
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
        // Simula ganhar 5 metros a cada segundo enquanto corre
        if (Math.random() > 0.5) setDistance((prev) => prev + 0.005);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [isTracking]);

  const togglePause = () => setIsTracking(!isTracking);

  const finishWorkout = async () => {
    setIsTracking(false);
    
    if (duration < 10) {
      Alert.alert('Treino muito curto', 'Corra por mais tempo para salvar.');
      navigation.goBack();
      return;
    }

    try {
      const durationMinutes = Math.max(1, Math.floor(duration / 60));
      const caloriesBurned = Math.floor(distance * 65);
      
      const { error } = await supabase.from('workouts').insert([
        {
          id: String(Date.now()),
          user_id: auth.userId || '00000000-0000-0000-0000-000000000000',
          type: 'Running',
          title: 'Outdoor Run (Mocked)',
          duration: durationMinutes,
          distance: parseFloat(distance.toFixed(2)),
          calories: caloriesBurned,
          created_at: Date.now(),
          updated_at: Date.now()
        }
      ]);

      if (error) throw error;
      navigation.goBack();
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert('Erro', 'Não foi possível salvar.');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      {/* MAPA MOCKADO */}
      <View style={styles.mapPlaceholder}>
        <MaterialIcons name="map" size={64} color="#1E293B" />
        <Text style={{color: '#475569', marginTop: 10}}>Mapa Indisponível (Modo Offline)</Text>
      </View>

      <SafeAreaView style={styles.overlayHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.bottomSheet}>
        <View style={styles.statsGrid}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>TIME</Text>
            <Text style={styles.statValueGiant}>{formatTime(duration)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>DISTANCE (KM)</Text>
            <Text style={styles.statValueGiant}>{distance.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.roundIconBtn} onPress={togglePause}>
            <MaterialIcons name={isTracking ? "pause" : "play-arrow"} size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.stopBtn, duration === 0 ? { opacity: 0.5 } : {}]} 
            onPress={finishWorkout}
            disabled={duration === 0}
          >
            <View style={styles.stopIconSquare} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E' },
  mapPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0F1E' },
  overlayHeader: { position: 'absolute', top: 20, left: 0, right: 0, padding: 16, zIndex: 10 },
  backButton: { width: 44, height: 44, backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  bottomSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#0A0F1E', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, borderTopWidth: 1, borderColor: '#1E293B' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  statCol: { flex: 1 },
  statDivider: { width: 1, height: 40, backgroundColor: '#334155', marginHorizontal: 16 },
  statLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 4 },
  statValueGiant: { color: '#fff', fontSize: 48, fontFamily: 'monospace', fontWeight: 'bold' },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  roundIconBtn: { width: 64, height: 64, borderRadius: 32, borderWidth: 1, borderColor: '#334155', justifyContent: 'center', alignItems: 'center' },
  stopBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#DC2626', justifyContent: 'center', alignItems: 'center' },
  stopIconSquare: { width: 32, height: 32, backgroundColor: '#fff', borderRadius: 4 }
});
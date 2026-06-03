import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppSelector } from '../../../store/hooks';
import { supabase } from '../../../services/supabase';

// Tema escuro para o mapa harmonizar com o '#0A0F1E' (vita-black)
const mapDarkStyle = [
  { elementType: "geometry", stylers: [{ color: "#0A0F1E" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8b9cb5" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0A0F1E" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1E293B" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f172a" }] },
];

export function ActiveRunScreen({ navigation }: any) {
  const auth = useAppSelector((state) => state.auth); 
  
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [route, setRoute] = useState<{latitude: number, longitude: number}[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(0); // Em KM
  const [duration, setDuration] = useState(0); // Em Segundos
  
  const mapRef = useRef<MapView>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('GPS Necessário', 'Precisamos da permissão para rastrear sua corrida.');
        navigation.goBack();
        return;
      }

      let initialLoc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(initialLoc);
      setRoute([{ latitude: initialLoc.coords.latitude, longitude: initialLoc.coords.longitude }]);
    })();

    return () => stopTrackingService();
  }, []);

  // Lógica do Cronômetro
  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTracking]);

  const startTracking = async () => {
    setIsTracking(true);
    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 2000,
        distanceInterval: 5, 
      },
      (newLocation) => {
        const newCoord = { latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude };
        
        setRoute((prevRoute) => {
          if (prevRoute.length > 0) {
            const lastCoord = prevRoute[prevRoute.length - 1];
            const dist = getDistance(lastCoord, newCoord);
            setDistance((prevDist) => prevDist + (dist / 1000));
          }
          return [...prevRoute, newCoord];
        });
        
        setLocation(newLocation);
        mapRef.current?.animateCamera({ center: newCoord, pitch: 45, zoom: 18 });
      }
    );
  };

  const stopTrackingService = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
  };

  const togglePause = () => {
    if (isTracking) {
      setIsTracking(false);
      stopTrackingService();
    } else {
      startTracking();
    }
  };

  const finishWorkout = async () => {
    setIsTracking(false);
    stopTrackingService();
    
    if (distance < 0.1 && duration < 60) {
      Alert.alert('Treino curto', 'A distância ou tempo foi muito baixo e não será salvo.');
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
          title: 'Outdoor Run',
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
      console.error('Erro ao salvar treino:', error);
      Alert.alert('Erro', 'Não foi possível salvar o treino.');
    }
  };

  // Formatação visual "00:00"
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      {/* MAPA */}
      {location ? (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          customMapStyle={mapDarkStyle}
          showsUserLocation={false} 
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          {route.length > 0 && (
            <Polyline coordinates={route} strokeColor="#F97316" strokeWidth={6} />
          )}
          {location && (
             <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}>
                <View style={styles.userMarker} />
             </Marker>
          )}
        </MapView>
      ) : (
        <View style={styles.loadingMap}>
          <Text style={{color: '#94a3b8'}}>Obtendo sinal do GPS...</Text>
        </View>
      )}

      {/* HEADER: Botão Voltar e Badge do Status */}
      <SafeAreaView style={styles.overlayHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.statusBadge}>
          <MaterialIcons name={isTracking ? "directions-run" : "pause"} size={16} color="#F97316" />
          <Text style={styles.statusText}>
            {isTracking ? "Active Run" : duration === 0 ? "Ready to Start" : "Paused"}
          </Text>
        </View>
        <View style={{ width: 44 }} /> {/* Espaçador invisível para centralizar o badge */}
      </SafeAreaView>

      {/* BOTTOM SHEET: Igual ao HTML */}
      <View style={styles.bottomSheet}>
        {/* Métricas Principais */}
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

        <View style={styles.secondaryStats}>
          <Text style={styles.paceLabel}>PACE</Text>
          <Text style={styles.paceValue}>
            {distance > 0 ? formatTime(Math.floor(duration / distance)) : '--:--'} <Text style={styles.paceUnit}>/km</Text>
          </Text>
        </View>

        {/* CONTROLES DA CORRIDA (Baseado no HTML) */}
        <View style={styles.controlsRow}>
          {/* Pause / Resume Button */}
          <TouchableOpacity style={styles.roundIconBtn} onPress={togglePause}>
            <MaterialIcons 
              name={isTracking ? "pause" : "play-arrow"} 
              size={32} 
              color="#fff" 
            />
          </TouchableOpacity>

          {/* Stop / Finish Button (Vermelho) */}
          <TouchableOpacity 
            style={[styles.stopBtn, duration === 0 && { opacity: 0.5 }]} 
            onPress={finishWorkout}
            disabled={duration === 0}
          >
            <View style={styles.stopIconSquare} />
          </TouchableOpacity>

          {/* Lap / Center Map Button */}
          <TouchableOpacity 
            style={styles.roundIconBtn} 
            onPress={() => {
              if (location) {
                mapRef.current?.animateCamera({ 
                  center: { latitude: location.coords.latitude, longitude: location.coords.longitude }, 
                  zoom: 18 
                });
              }
            }}
          >
            <MaterialIcons name="my-location" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0A0F1E', // vita-black
  },
  loadingMap: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#0A0F1E' 
  },
  userMarker: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    backgroundColor: '#F97316', // vita-orange
    borderWidth: 4, 
    borderColor: '#fff',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  overlayHeader: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    padding: 16, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10 
  },
  backButton: { 
    width: 44, 
    height: 44, 
    backgroundColor: 'rgba(30, 41, 59, 0.8)', // bg-vita-surface/80
    borderRadius: 22, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.9)', // bg-vita-surface/90
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#334155', // border-slate-700
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  bottomSheet: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: '#0A0F1E', // vita-black
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    padding: 24, 
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: '#1E293B' // border-slate-800
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statCol: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#334155', // slate-700
    marginHorizontal: 16,
  },
  statLabel: { 
    color: '#94a3b8', 
    fontSize: 12, 
    fontWeight: '600', 
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValueGiant: { 
    color: '#fff', 
    fontSize: 48, 
    fontFamily: 'monospace', // Usando monospace para imitar a fonte "DM Mono" do seu HTML
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  secondaryStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  paceLabel: {
    color: '#94a3b8', 
    fontSize: 12, 
    fontWeight: '600', 
    letterSpacing: 1,
    marginRight: 12,
  },
  paceValue: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  paceUnit: {
    color: '#64748b',
    fontSize: 16,
  },
  controlsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  roundIconBtn: {
    width: 56, // w-14
    height: 56, // h-14
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#334155', // border-slate-700
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopBtn: {
    width: 80, // w-20
    height: 80, // h-20
    borderRadius: 40,
    backgroundColor: '#DC2626', // bg-red-600
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  stopIconSquare: {
    width: 32, // w-8
    height: 32, // h-8
    backgroundColor: '#fff',
    borderRadius: 4, // rounded-sm
  }
});
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';

export function ExerciseDetailScreen({ route, navigation }: any) {
  // Pega o exercício passado pelo menu
  const { exercise } = route.params; 
  const [reps, setReps] = useState(0);

  const progress = reps / (exercise.targetReps || 1);
  const strokeDashoffset = 402 - (402 * Math.min(progress, 1));

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      <Text style={styles.title}>{exercise.name}</Text>

      <View style={styles.circleContainer}>
        <Svg width="160" height="160" style={styles.svg}>
          <Circle cx="80" cy="80" r="70" stroke="#1E293B" strokeWidth="8" fill="none" />
          <Circle cx="80" cy="80" r="70" stroke="#F97316" strokeWidth="8" fill="none" 
            strokeDasharray="440" strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
        </Svg>
        
        <TouchableOpacity style={styles.mainBtn} onPress={() => setReps(Math.min(reps + 1, exercise.targetReps))}>
          <Text style={styles.repCount}>{reps}</Text>
          <Text style={styles.repLabel}>REPS</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.goalText}>{reps} / {exercise.targetReps} concluído</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.desc}>{exercise.description}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E', alignItems: 'center' },
  backBtn: { position: 'absolute', top: 60, left: 20, zIndex: 10 },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 100, marginBottom: 40 },
  circleContainer: { width: 160, height: 160, justifyContent: 'center', alignItems: 'center' },
  svg: { position: 'absolute' },
  mainBtn: { width: 130, height: 130, borderRadius: 65, backgroundColor: '#F97316', justifyContent: 'center', alignItems: 'center' },
  repCount: { color: '#FFF', fontSize: 48, fontWeight: 'bold' },
  repLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 'bold' },
  goalText: { color: '#F97316', marginTop: 20, fontSize: 16, fontWeight: 'bold' },
  infoBox: { marginTop: 40, padding: 20, backgroundColor: '#1E293B', borderRadius: 16, width: '90%' },
  desc: { color: '#94A3B8', textAlign: 'center', lineHeight: 22 }
});
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export function ExerciseDiaryScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER COM BOTÃO DE VOLTAR */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#f1f5f9" />
            </TouchableOpacity>
            <Text style={styles.title}>History</Text>
          </View>
          
          <TouchableOpacity style={styles.dropdownBtn}>
            <Text style={styles.dropdownText}>Last 30 days</Text>
            <MaterialIcons name="expand-more" size={18} color="#f97316" />
          </TouchableOpacity>
        </View>

        {/* STATS SUMMARY CARD */}
        <LinearGradient colors={['#f97316', '#f59e0b']} style={styles.statsCard} start={{x:0, y:0}} end={{x:1, y:1}}>
          <View style={styles.grid}>
            {[
              { label: 'Total Workouts', val: '24', icon: 'fitness-center' },
              { label: 'Total Distance', val: '142.5 km', icon: 'route' },
              { label: 'Kcal Burned', val: '12,400', icon: 'local-fire-department' },
              { label: 'Active Days', val: '18', icon: 'calendar-today' },
            ].map((stat, i) => (
              <View key={i} style={styles.gridItem}>
                <View style={styles.row}>
                  <MaterialIcons name={stat.icon as any} size={14} color="#FFF" style={{opacity: 0.8}} />
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
                <Text style={styles.statValue}>{stat.val}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* WORKOUT LIST */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          {/* Card de Corrida - Maior espaçamento abaixo */}
          <View style={styles.workoutCardActive}>
            <View style={styles.cardHeader}>
              <View style={styles.iconCircleActive}>
                <MaterialIcons name="directions-run" size={20} color="#f97316" />
              </View>
              <View style={{flex: 1, marginLeft: 12}}>
                <Text style={styles.cardTitle}>Morning Run</Text>
                <Text style={styles.cardDate}>Today, 07:30 AM</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.cardMetric}>8.2 km</Text>
                <View style={styles.badge}><Text style={styles.badgeText}>640 Kcal</Text></View>
              </View>
            </View>
          </View>

          {/* Card Simples - Maior espaçamento abaixo */}
          <View style={styles.workoutCard}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="fitness-center" size={20} color="#38bdf8" />
            </View>
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.cardTitle}>Upper Body Session</Text>
              <Text style={styles.cardDate}>Yesterday, 05:45 PM</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.cardMetric}>55 min</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>380 Kcal</Text></View>
            </View>
          </View>

          {/* Card Simples 2 (Apenas para ver o espaçamento) */}
          <View style={styles.workoutCard}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="directions-walk" size={20} color="#f59e0b" />
            </View>
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.cardTitle}>Evening Walk</Text>
              <Text style={styles.cardDate}>Jun 12, 2026</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.cardMetric}>3.1 km</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>120 Kcal</Text></View>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 16, padding: 4 },
  title: { color: '#f1f5f9', fontSize: 24, fontWeight: 'bold' },
  dropdownBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  dropdownText: { color: '#f1f5f9', fontSize: 12, marginRight: 4 },
  statsCard: { margin: 20, marginTop: 0, padding: 20, borderRadius: 16, shadowColor: '#f97316', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '50%', marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  statLabel: { color: '#FFF', fontSize: 10, textTransform: 'uppercase', opacity: 0.9, marginLeft: 4, fontWeight: '500' },
  statValue: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  section: { padding: 20, paddingTop: 0 },
  sectionTitle: { color: '#f1f5f9', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  workoutCardActive: { backgroundColor: '#1e293b', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#f97316', marginBottom: 20 }, // Margem aumentada para 20
  workoutCard: { backgroundColor: '#1e293b', padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#334155' }, // Margem aumentada para 20
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center' },
  iconCircleActive: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f9731622', justifyContent: 'center', alignItems: 'center' },
  cardTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  cardDate: { color: '#94a3b8', fontSize: 10, marginTop: 2 },
  cardMetric: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  badge: { backgroundColor: '#f9731622', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  badgeText: { color: '#f97316', fontSize: 9, fontWeight: 'bold' }
});
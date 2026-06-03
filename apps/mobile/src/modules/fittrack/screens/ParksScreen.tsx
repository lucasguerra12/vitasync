import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// DADOS MOCKADOS (Simulando a API)
const MOCK_PARKS = [
  { id: '1', name: 'Parque Vicentina Aranha', distance: '1.2 km', tags: ['Running', 'Yoga'] },
  { id: '2', name: 'Parque Santos Dumont', distance: '2.5 km', tags: ['Walking', 'Kids'] },
  { id: '3', name: 'Parque da Cidade', distance: '4.8 km', tags: ['Cycling', 'Nature'] },
];

export function ParksScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Nearby Parks</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={MOCK_PARKS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="park" size={24} color="#F97316" />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.distance}>{item.distance} away</Text>
              <View style={styles.tagsRow}>
                {item.tags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#475569" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  listContent: { padding: 20 },
  card: { 
    backgroundColor: '#1E293B', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  iconContainer: { 
    width: 48, 
    height: 48, 
    backgroundColor: '#0A0F1E', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16 
  },
  info: { flex: 1 },
  name: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  distance: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  tagsRow: { flexDirection: 'row', marginTop: 8, gap: 8 },
  tag: { backgroundColor: '#334155', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { color: '#E2E8F0', fontSize: 10, fontWeight: '500' }
});
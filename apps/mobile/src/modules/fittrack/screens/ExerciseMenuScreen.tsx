import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import exercises from '../../../utils/exercises.json';

export function ExerciseMenuScreen({ navigation }: any) {

  // Mapeamento de categorias para ícones de "bonequinho" ou exercício
  const getIconForCategory = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('peito') || cat.includes('chest')) return 'human-male';
    if (cat.includes('perna') || cat.includes('leg')) return 'human-greeting';
    if (cat.includes('core') || cat.includes('abs')) return 'human-handsdown';
    if (cat.includes('costas') || cat.includes('back')) return 'human-child';
    return 'dumbbell'; // Ícone padrão
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Exercícios</Text>
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('ExerciseDetailScreen', { exercise: item })}
          >
            {/* O "Container do Bonequinho" exatamente como na imagem */}
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons 
                name={getIconForCategory(item.category)} 
                size={32} 
                color="#94A3B8" 
              />
            </View>
            
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.category} • {item.targetSets} séries</Text>
            </View>
            
            <MaterialCommunityIcons name="chevron-right" size={24} color="#475569" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E' }, // Fundo Vita-Black
  header: { padding: 20, paddingTop: 40 },
  headerTitle: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  list: { padding: 20 },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1E293B', // Fundo do Card (Vita-Surface)
    padding: 12, 
    borderRadius: 16, // Borda arredondada suave
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155' // Borda sutil
  },
  iconWrapper: { 
    width: 60, // Tamanho do quadrado da imagem
    height: 60, 
    borderRadius: 12, 
    backgroundColor: '#0F172A', // Cor do fundo do bonequinho (mais escuro que o card)
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16 
  },
  info: { flex: 1 },
  name: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  meta: { color: '#94A3B8', fontSize: 12, marginTop: 4 }
});
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useFoodLogger } from '../../../hooks/useFoodLogger';

export function AddFoodScreen({ navigation }: any) {
  const route = useRoute<any>();
  const { food } = route.params || {};
  const { portion, setPortion, mealType, setMealType, calculatedMacros, isSaving, saveMeal, setSelectedFood } = useFoodLogger();

  useEffect(() => { if (food) setSelectedFood(food); }, [food]);

  const handleSave = async () => {
    const success = await saveMeal();
    if (success) {

      navigation.navigate('Main', { screen: 'NutriLens' });
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.dragHandle} />
        <Text style={styles.foodTitle}>{food?.name}</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>QUANTIDADE (G)</Text>
          <TextInput 
            style={styles.mainInput} 
            keyboardType="numeric" 
            value={portion} 
            onChangeText={setPortion} 
            autoFocus
          />
        </View>

        <Text style={styles.label}>ASSIGN TO MEAL</Text>
        <View style={styles.grid}>
          {[
            { id: 'breakfast', label: 'Breakfast', icon: 'wb-sunny' },
            { id: 'lunch', label: 'Lunch', icon: 'lunch-dining' },
            { id: 'dinner', label: 'Dinner', icon: 'dinner-dining' },
            { id: 'snack', label: 'Snacks', icon: 'cookie' }
          ].map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.mealBtn, mealType === item.id && styles.mealBtnActive]}
              onPress={() => setMealType(item.id as any)}
            >
              <MaterialIcons name={item.icon as any} size={24} color={mealType === item.id ? '#fff' : '#10B981'} />
              <Text style={[styles.mealBtnText, mealType === item.id && styles.mealBtnTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logBtn} onPress={handleSave} disabled={isSaving}>
          {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.logBtnText}>Log Food</Text>}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.8)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#1E293B', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 40 },
  dragHandle: { width: 40, height: 4, backgroundColor: '#334155', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  foodTitle: { color: '#10B981', fontSize: 24, fontWeight: 'bold', marginBottom: 25, textAlign: 'center' },
  label: { color: '#64748B', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 10 },
  inputGroup: { marginBottom: 25, alignItems: 'center' },
  mainInput: { color: '#fff', fontSize: 48, fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: '#10B981', width: '50%', textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 30 },
  mealBtn: { width: '48%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', padding: 15, borderRadius: 15, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  mealBtnActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  mealBtnText: { color: '#94A3B8', marginLeft: 10, fontWeight: 'bold' },
  mealBtnTextActive: { color: '#fff' },
  logBtn: { backgroundColor: '#3B82F6', padding: 18, borderRadius: 15, alignItems: 'center' },
  logBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cancelBtn: { marginTop: 15, alignItems: 'center' },
  cancelText: { color: '#64748B', fontWeight: 'bold' }
});
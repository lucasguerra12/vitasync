import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Polyline, Circle } from 'react-native-svg';
import { useWater } from '../../../hooks/useWater';

export function IMCScreen() {
  const navigation = useNavigation<any>();
  
  // --- Água Global ---
  const { water, waterGoal, addWater } = useWater();

  // --- Estados do IMC ---
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [imc, setImc] = useState<number | null>(null);

  // --- Estados do Histórico de Peso ---
  const [isWeightModalVisible, setWeightModalVisible] = useState(false);
  const [newWeightInput, setNewWeightInput] = useState('');
  // Mock inicial do gráfico (últimos 4 pesos)
  const [weightHistory, setWeightHistory] = useState([80, 79.5, 78, 77.5]);

  const calculateIMC = () => {
    const w = parseFloat(weight.replace(',', '.'));
    const h = parseFloat(height.replace(',', '.')) / 100;
    if (w > 0 && h > 0) {
      const result = w / (h * h);
      setImc(parseFloat(result.toFixed(1)));
    }
  };

  const getClassification = (value: number) => {
    if (value < 18.5) return { text: 'Abaixo do peso', color: '#38bdf8' };
    if (value >= 18.5 && value < 24.9) return { text: 'Peso normal', color: '#10b981' };
    if (value >= 25 && value < 29.9) return { text: 'Sobrepeso', color: '#f59e0b' };
    return { text: 'Obesidade', color: '#ef4444' };
  };

  const handleSaveWeight = () => {
    const w = parseFloat(newWeightInput.replace(',', '.'));
    if (w > 0) {
      // Pega os últimos 3 pesos e adiciona o novo (para o gráfico ter 4 pontos)
      const updatedHistory = [...weightHistory.slice(1), w];
      setWeightHistory(updatedHistory);
      setWeight(w.toString()); // Já preenche no IMC também
      setWeightModalVisible(false);
      setNewWeightInput('');
      Alert.alert("Sucesso", "Novo peso registrado com sucesso!");
    }
  };

  // Função simples para mapear o peso para a altura Y do Gráfico SVG
  const getY = (val: number) => 120 - ((val - 60) * 3); 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#f1f5f9" />
        </TouchableOpacity>
        <Text style={styles.title}>Corpo & Saúde</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* 1. SEÇÃO DE ÁGUA */}
        <View style={styles.waterCard}>
          <View style={styles.waterHeader}>
            <MaterialIcons name="water-drop" size={24} color="#38bdf8" />
            <Text style={styles.cardTitle}>Hidratação Diária</Text>
          </View>
          
          <View style={styles.waterContent}>
            <View style={styles.waterInfo}>
              <Text style={styles.waterValue}>{water} <Text style={styles.waterGoal}>/ {waterGoal} ml</Text></Text>
              <View style={styles.waterBarBg}>
                <View style={[styles.waterBarFill, { width: `${Math.min((water / waterGoal) * 100, 100)}%` }]} />
              </View>
            </View>

            <TouchableOpacity style={styles.waterAddButton} onPress={() => addWater(250)}>
              <MaterialIcons name="add" size={24} color="#fff" />
              <Text style={styles.waterAddText}>250ml</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. SEÇÃO DE IMC */}
        <View style={[styles.card, { borderColor: '#8B5CF644' }]}>
          <View style={styles.waterHeader}>
            <MaterialIcons name="monitor-weight" size={24} color="#8B5CF6" />
            <Text style={styles.cardTitle}>Calculadora de IMC</Text>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Peso (kg)</Text>
              <TextInput 
                style={styles.input} placeholder="Ex: 75.5" placeholderTextColor="#64748b"
                keyboardType="decimal-pad" value={weight} onChangeText={setWeight}
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Altura (cm)</Text>
              <TextInput 
                style={styles.input} placeholder="Ex: 175" placeholderTextColor="#64748b"
                keyboardType="decimal-pad" value={height} onChangeText={setHeight}
              />
            </View>
          </View>

          <TouchableOpacity style={[styles.calcButton, { backgroundColor: '#8B5CF6' }]} onPress={calculateIMC}>
            <Text style={styles.calcButtonText}>CALCULAR MEU IMC</Text>
          </TouchableOpacity>

          {imc && (
            <View style={styles.resultBox}>
              <Text style={styles.resultValue}>{imc}</Text>
              <Text style={[styles.resultClass, { color: getClassification(imc).color }]}>
                {getClassification(imc).text}
              </Text>
            </View>
          )}
        </View>

        {/* 3. SEÇÃO HISTÓRICO DE PESO */}
        <View style={styles.card}>
          <View style={styles.chartHeader}>
            <Text style={styles.cardTitle}>Evolução de Peso</Text>
            <Text style={styles.targetText}>Meta: 70kg</Text>
          </View>
          
          <View style={styles.chartContainer}>
            <Svg height="120" width="100%" viewBox="0 0 300 120">
              {/* Linha da meta (70kg -> Y = 90 no nosso calculo) */}
              <Polyline points={`0,${getY(70)} 300,${getY(70)}`} fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />
              {/* Linha do peso dinâmica */}
              <Polyline 
                points={`20,${getY(weightHistory[0])} 100,${getY(weightHistory[1])} 180,${getY(weightHistory[2])} 280,${getY(weightHistory[3])}`} 
                fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" 
              />
              <Circle cx="20" cy={getY(weightHistory[0])} r="6" fill="#f97316" />
              <Circle cx="100" cy={getY(weightHistory[1])} r="6" fill="#f97316" />
              <Circle cx="180" cy={getY(weightHistory[2])} r="6" fill="#f97316" />
              <Circle cx="280" cy={getY(weightHistory[3])} r="6" fill="#f1f5f9" stroke="#f97316" strokeWidth="3" />
            </Svg>
          </View>
          
          <TouchableOpacity style={styles.addButtonOutlined} onPress={() => setWeightModalVisible(true)}>
            <Text style={styles.addButtonOutlinedText}>+ REGISTRAR PESO HOJE</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* MODAL DE REGISTRAR PESO */}
      <Modal visible={isWeightModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Peso Atual</Text>
            <Text style={styles.modalSubtitle}>Insira seu peso de hoje para atualizar o gráfico.</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Ex: 74.5"
              placeholderTextColor="#64748b"
              keyboardType="decimal-pad"
              value={newWeightInput}
              onChangeText={setNewWeightInput}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setWeightModalVisible(false)}>
                <Text style={styles.modalCancelText}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveWeight}>
                <Text style={styles.modalSaveText}>SALVAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 },
  backButton: { padding: 8, marginLeft: -8 },
  title: { color: '#f1f5f9', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20, paddingBottom: 40 },
  cardTitle: { color: '#f1f5f9', fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
  card: { backgroundColor: '#1e293b', padding: 20, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  
  // Água
  waterCard: { backgroundColor: '#1e293b', padding: 20, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#38bdf844' },
  waterHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  waterContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  waterInfo: { flex: 1, marginRight: 20 },
  waterValue: { color: '#38bdf8', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  waterGoal: { color: '#64748b', fontSize: 14, fontWeight: 'normal' },
  waterBarBg: { height: 10, backgroundColor: '#0f172a', borderRadius: 5, overflow: 'hidden' },
  waterBarFill: { height: '100%', backgroundColor: '#38bdf8', borderRadius: 5 },
  waterAddButton: { backgroundColor: '#0284c7', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  waterAddText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginTop: 4 },

  // IMC
  inputRow: { flexDirection: 'row', justifyContent: 'space-between' },
  inputGroup: { flex: 1 },
  label: { color: '#94a3b8', fontSize: 12, textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: '#0f172a', color: '#fff', padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  calcButton: { padding: 16, borderRadius: 12, alignItems: 'center' },
  calcButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  resultBox: { marginTop: 16, padding: 16, backgroundColor: '#0f172a', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  resultValue: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
  resultClass: { fontSize: 16, fontWeight: '600', marginTop: 4 },

  // Gráfico
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  targetText: { color: '#10b981', fontSize: 12, fontWeight: 'bold' },
  chartContainer: { height: 120, width: '100%', marginBottom: 20 },
  addButtonOutlined: { padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#f97316' },
  addButtonOutlinedText: { color: '#f97316', fontWeight: 'bold', fontSize: 14 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: '#1e293b', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  modalSubtitle: { color: '#94a3b8', fontSize: 14, marginBottom: 20 },
  modalInput: { backgroundColor: '#0f172a', color: '#FFF', padding: 16, borderRadius: 12, fontSize: 18, borderWidth: 1, borderColor: '#334155', marginBottom: 24 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  modalCancelBtn: { padding: 12, marginRight: 12 },
  modalCancelText: { color: '#94a3b8', fontWeight: 'bold', fontSize: 16 },
  modalSaveBtn: { backgroundColor: '#f97316', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  modalSaveText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
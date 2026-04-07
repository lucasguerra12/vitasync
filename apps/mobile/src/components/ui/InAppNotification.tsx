import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import { Colors, Typography } from '../../constants';

export function InAppNotification() {
  const [notificationData, setNotificationData] = useState<{ title: string; body: string } | null>(null);
  // Começa escondido fora da tela (150 pixels para cima)
  const translateY = useSharedValue(-150);

  useEffect(() => {
    // Escuta notificações recebidas APENAS enquanto o app está ABERTO
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      if (title && body) {
        setNotificationData({ title, body });
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (notificationData) {
      // Faz o banner deslizar para baixo suavemente (efeito mola)
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });

      // Esconde automaticamente após 4 segundos
      const timer = setTimeout(() => {
        closeNotification();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [notificationData]);

  const closeNotification = () => {
    // Faz o banner subir de volta
    translateY.value = withTiming(-150, { duration: 300 }, (finished) => {
      if (finished) {
        // Limpa o estado depois que a animação termina
        runOnJS(setNotificationData)(null);
      }
    });
  };

  // Conecta o valor da animação ao estilo do componente
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Se não houver notificação, não renderiza nada na tela
  if (!notificationData) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <SafeAreaView>
        <TouchableOpacity activeOpacity={0.9} onPress={closeNotification} style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔔</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>{notificationData.title}</Text>
            <Text style={styles.message} numberOfLines={2}>{notificationData.body}</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999, // Garante que ficará por cima de TUDO no app
    elevation: 10,
  },
  content: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.surface,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.home}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fonts.body,
    fontWeight: Typography.weights.bold,
    marginBottom: 4,
  },
  message: {
    color: Colors.dark.textSecondary,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.body,
  },
});
import * as Notifications from 'expo-notifications';

// Configuração obrigatória para o Expo SDK 55 (exige banner e list explícitos)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true, 
    shouldShowList: true,   
  }),
});

export const NotificationService = {
  requestPermissions: async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      return newStatus === 'granted';
    }
    return status === 'granted';
  },

  scheduleLocalNotification: async (title: string, body: string, triggerSeconds: number = 1) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: triggerSeconds,
      },
    });
  },

  // A FUNÇÃO QUE ESTAVA A FALTAR!
  scheduleWaterReminder: async (minutes: number) => {
    // Primeiro, cancela lembretes anteriores para não acumular notificações
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Se selecionou OFF (0 minutos), não agenda nada e sai da função
    if (minutes === 0) return;

    // Agenda o novo lembrete em loop
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hora da Água! 💧",
        body: `Já se passaram ${minutes} minutos. Vamos manter a hidratação?`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: minutes * 60, 
        repeats: true, 
      },
    });
  }
};
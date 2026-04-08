import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography } from '../../constants';

type NotifData = { id: string; title: string; body: string };

export function InAppNotification() {
  const [queue, setQueue] = useState<NotifData[]>([]);
  const [currentNotif, setCurrentNotif] = useState<NotifData | null>(null);
  
  const translateY = useSharedValue(-150);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      const id = notification.request.identifier;
      
      if (title && body) {
        setQueue(prev => [...prev, { id, title, body }]);
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!currentNotif && queue.length > 0) {
      const nextNotif = queue[0];
      setCurrentNotif(nextNotif);
      setQueue(prev => prev.slice(1));
    }
  }, [queue, currentNotif]);

  useEffect(() => {
    if (currentNotif) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 100, mass: 0.8 });

      const timer = setTimeout(() => {
        closeCurrent();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [currentNotif]);

  const closeCurrent = () => {
    translateY.value = withTiming(-150, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(setCurrentNotif)(null);
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!currentNotif) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        animatedStyle, 
        { paddingTop: Math.max(insets.top, 16) } 
      ]}
    >
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={closeCurrent}
        style={styles.content}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔔</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{currentNotif.title}</Text>
          <Text style={styles.message} numberOfLines={2}>{currentNotif.body}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  content: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.surface,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
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
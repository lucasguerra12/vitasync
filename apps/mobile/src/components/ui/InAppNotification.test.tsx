import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import { InAppNotification } from './InAppNotification';
import * as Notifications from 'expo-notifications';

let listenerCallback: Function;
jest.spyOn(Notifications, 'addNotificationReceivedListener').mockImplementation((callback) => {
  listenerCallback = callback;
  return { remove: jest.fn() } as any;
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 40, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: { View }, 
    useSharedValue: jest.fn((val) => ({ value: val })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn((val) => val),
    withTiming: jest.fn((val, config, callback) => {
      if (callback) {
        setTimeout(() => callback(true), config?.duration || 300);
      }
      return val;
    }),
    runOnJS: jest.fn((fn) => fn),
  };
});

describe('InAppNotification Component', () => {
  beforeEach(() => {
    jest.useFakeTimers(); 
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('não deve renderizar nada na tela inicialmente', () => {
    const { toJSON } = render(<InAppNotification />);
    expect(toJSON()).toBeNull(); 
  });

  it('deve exibir a notificação quando o listener recebe um evento', async () => {
    const { getByText } = render(<InAppNotification />);

    act(() => {
      listenerCallback({
        request: {
          identifier: '123',
          content: { title: 'Água', body: 'Beba água!' },
        },
      });
    });

    expect(getByText('Água')).toBeTruthy();
    expect(getByText('Beba água!')).toBeTruthy();
  });

  it('deve esconder a notificação após 4 segundos automaticamente', async () => {
    const { queryByText } = render(<InAppNotification />);

    act(() => {
      listenerCallback({
        request: { identifier: '1', content: { title: 'Oi', body: 'Tudo bem?' } },
      });
    });

    expect(queryByText('Oi')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(queryByText('Oi')).toBeNull();
  });
});
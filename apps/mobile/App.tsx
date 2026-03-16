import { Provider } from 'react-redux';
import { store } from './src/store';
import Navigation from './src/navigation';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
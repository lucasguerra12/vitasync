import { useAppSelector } from '../store/hooks';
import { Colors } from '../constants';

export function useTheme() {
  const current = useAppSelector(state => state.theme.current);
  const isDark = current === 'dark';

  return {
    isDark,
    colors: isDark ? Colors.dark : Colors.light,
    theme: current,
  };
}
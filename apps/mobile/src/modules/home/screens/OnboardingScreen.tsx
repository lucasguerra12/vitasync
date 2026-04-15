import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useState } from 'react';
import { Colors, Typography } from '../../../constants';


const { width } = Dimensions.get('window');

const SLIDES = [
  {
    tag: 'BEM-VINDO AO VITASYNC',
    title: 'Seu corpo conta uma história',
    subtitle: 'Acompanhe como alimentação, movimento, sono e humor se conectam ao que você sente todos os dias.',
    tagColor: Colors.home,
    button: "Vamos lá!",
    image: require('../../../../assets/images/onboarding_1.png'),
  },
  {
    tag: '5 MÓDULOS',
    title: 'Tudo em um só lugar',
    subtitle: 'NutriLens, FitTrack, MindZen, HealthPact e seu Painel Diário — todos conectados, todos aprendendo um com o outro.',
    tagColor: Colors.home,
    button: 'Próximo',
    image: require('../../../../assets/images/onboarding_2.png'),
  },
  {
    tag: 'HEALTHPACT',
    title: 'Juntos é melhor',
    subtitle: "Participe de desafios, compartilhe seu progresso e mantenha o foco com amigos. Porque saúde é melhor quando é compartilhada.",
    tagColor: Colors.healthpact,
    button: 'Começar',
    image: require('../../../../assets/images/onboarding_3.png'),
  },
  {
    tag: 'AI INSIGHTS',
    title: 'Conecte os pontos que você nunca conseguiu',
    subtitle: 'O VitaSync encontra padrões entre sua dor, alimentação, sono, humor e clima. Correlações reais, em linguagem simples.',
    tagColor: Colors.mindzen,
    button: 'Vamos lá!',
    image: require('../../../../assets/images/onboarding_4.png'),
  },
];

interface Props {
  onFinish: () => void;
}

export default function OnboardingScreen({ onFinish }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slide = SLIDES[currentIndex];
  const isLast = currentIndex === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      onFinish();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  return (
    <View style={styles.container}>

      {/* Botão Skip */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Pular</Text>
      </TouchableOpacity>

      {/* Área da ilustração */}
      <View style={styles.illustrationArea}>
        <Image
          source={slide.image}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Conteúdo de texto */}
      <View style={styles.content}>
        <Text style={[styles.tag, { color: slide.tagColor }]}>
          {slide.tag}
        </Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </View>

      {/* Footer — dots + botão */}
      <View style={styles.footer}>

        {/* Progress dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Botão principal */}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>{slide.button}</Text>
        </TouchableOpacity>

        {/* Botão Voltar */}
        {currentIndex > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={() => setCurrentIndex(currentIndex - 1)}>
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
        )}

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: 24,
    paddingBottom: 0,
  },
  skipText: {
    color: Colors.dark.textSecondary,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.body,
  },

  illustration: {
  width: width - 48,
  height: '100%',
},

  illustrationArea: {
    flex: 0.55,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  illustrationPlaceholder: {
    width: width - 48,
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  illustrationEmoji: {
    fontSize: 80,
  },
  content: {
    flex: 0.30,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  tag: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.body,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontFamily: Typography.fonts.display,
    fontWeight: Typography.weights.bold,
    color: Colors.dark.text,
    lineHeight: 32,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.body,
    color: Colors.dark.textSecondary,
    lineHeight: 22,
  },
  footer: {
    flex: 0.15,
    paddingHorizontal: 32,
    paddingBottom: 40,
    justifyContent: 'flex-end',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.home,
  },
  dotInactive: {
    width: 6,
    backgroundColor: Colors.dark.border,
  },
  button: {
    backgroundColor: Colors.home,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fonts.body,
    fontWeight: Typography.weights.semibold,
  },
  backButton: {
    alignItems: 'center',
  },
  backText: {
    color: Colors.dark.textSecondary,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.body,
    top: 8,
  },
});
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useState } from 'react';
import { Colors, Typography } from '../../../constants';


const { width } = Dimensions.get('window');

const SLIDES = [
  {
    tag: 'WELCOME TO VITASYNC',
    title: 'Your body tells a story',
    subtitle: 'Track how food, movement, sleep and mood connect to how you actually feel every day.',
    tagColor: Colors.home,
    button: "Let's go",
    image: require('../../../../assets/images/onboarding_1.png'),
  },
  {
    tag: '5 MODULES',
    title: 'Everything in one place',
    subtitle: 'NutriLens, FitTrack, MindZen, HealthPact and your daily Dashboard — all connected, all learning from each other.',
    tagColor: Colors.home,
    button: 'Next',
    image: require('../../../../assets/images/onboarding_2.png'),
  },
  {
    tag: 'HEALTHPACT',
    title: 'Better together',
    subtitle: "Join challenges, share progress, and stay accountable with friends. Because health is better when it's shared.",
    tagColor: Colors.healthpact,
    button: 'Get Started',
    image: require('../../../../assets/images/onboarding_3.png'),
  },
  {
    tag: 'AI INSIGHTS',
    title: 'Connect the dots you never could',
    subtitle: 'VitaSync finds patterns between your pain, food, sleep, mood and weather. Real correlations, in plain language.',
    tagColor: Colors.mindzen,
    button: 'Set up my profile',
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
        <Text style={styles.skipText}>Skip</Text>
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
            <Text style={styles.backText}>Back</Text>
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
    gap: 16,
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
  },
});
export const Typography = {
  // ── Famílias de fonte ──
  fonts: {
    display: 'PublicSans',   // títulos e headings
    body: 'DMSans',          // texto corrido
    mono: 'DMMono',          // números, stats, dados
  },

  // ── Tamanhos ──
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  // ── Pesos ──
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // ── Altura de linha ──
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};
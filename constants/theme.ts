// ─── MileWise Global Theme ───────────────────────────────────────────────────
export const Colors = {
  primary: '#1D267D',       // Deep Navy Blue — headers, backgrounds
  accent: '#FFD200',        // Bright Yellow — buttons, highlights
  white: '#FFFFFF',
  background: '#F5F6FA',    // Light grey — screen backgrounds
  card: '#FFFFFF',
  inputBg: '#E1E2E7',       // Form field background
  textDark: '#1A1A2E',
  textMid: '#4A4A6A',
  textLight: '#9999BB',
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#1A1A2E',

  // Status
  urgent: '#FF3B30',
  soon: '#FF9500',
  ok: '#34C759',

  border: '#D1D5DB',
  shadow: '#00000015',
};

export const Font = {
  regular: { fontFamily: 'System', fontWeight: '400' as const },
  medium: { fontFamily: 'System', fontWeight: '500' as const },
  semiBold: { fontFamily: 'System', fontWeight: '600' as const },
  bold: { fontFamily: 'System', fontWeight: '700' as const },
  extraBold: { fontFamily: 'System', fontWeight: '800' as const },
};

export const Spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const Radius = {
  sm: 8, md: 12, lg: 18, xl: 25, full: 999,
};

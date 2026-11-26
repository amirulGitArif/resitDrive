import React from 'react';
import { Text, TextStyle } from 'react-native';

/**
 * Minimal glyph icons so Phase 1 needs no icon-font dependency.
 * To switch to a real icon library later, only this file changes.
 */
const GLYPHS: Record<string, string> = {
  home: '⌂',
  receipts: '☰',
  capture: '+',
  categories: '▦',
  settings: '⚙',
  medical: '✚',
  education: '✎',
  lifestyle: '★',
  sports: '◉',
  insurance: '☂',
  childcare: '☺',
  books: '▤',
  other: '•',
};

interface Props {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

export function Icon({ name, size = 22, color = '#000', style }: Props) {
  return <Text style={[{ fontSize: size, color, lineHeight: size + 4 }, style]}>{GLYPHS[name] ?? '•'}</Text>;
}

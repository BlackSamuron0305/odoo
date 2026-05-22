/**
 * Accessibility helpers — ensures all interactive elements have proper a11y attributes.
 * Usage: spread `...a11y(label, role)` onto TouchableOpacity / Pressable.
 */

type AccessibilityRole =
  | 'button' | 'link' | 'search' | 'image' | 'text' | 'none'
  | 'checkbox' | 'radio' | 'menu' | 'menuitem' | 'tab' | 'header';

export function a11y(label: string, role: AccessibilityRole = 'button') {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: role,
  };
}

/** Minimum tap target size — 44pt per Apple HIG */
export const MIN_TAP_TARGET = { minWidth: 44, minHeight: 44 };

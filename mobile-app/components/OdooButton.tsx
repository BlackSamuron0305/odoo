import { TouchableOpacity, Text, ActivityIndicator, type TouchableOpacityProps } from 'react-native';

interface OdooButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
}

const variantClasses = {
  primary:   { bg: 'bg-brand-primary',   text: 'text-white' },
  secondary: { bg: 'bg-odoo-100',        text: 'text-odoo-800' },
  danger:    { bg: 'bg-status-danger',   text: 'text-white' },
  ghost:     { bg: 'bg-transparent border border-brand-primary', text: 'text-brand-primary' },
};

export function OdooButton({ title, variant = 'primary', loading, disabled, ...props }: OdooButtonProps) {
  const { bg, text } = variantClasses[variant];
  return (
    <TouchableOpacity
      className={`${bg} rounded-xl py-4 items-center ${disabled || loading ? 'opacity-50' : ''}`}
      disabled={disabled || loading}
      activeOpacity={0.75}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#343a40' : 'white'} />
      ) : (
        <Text className={`${text} text-base font-semibold`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

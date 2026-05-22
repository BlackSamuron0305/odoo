import { View, Animated, useRef, useEffect } from 'react-native';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1,   duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={{ opacity }}
      className={`bg-odoo-200 rounded-lg ${className ?? 'h-4 w-full'}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <View className="bg-white rounded-xl p-4 gap-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-full" />
    </View>
  );
}

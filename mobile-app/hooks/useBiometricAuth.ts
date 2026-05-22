import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export type BiometricStatus = 'idle' | 'checking' | 'authenticated' | 'failed' | 'unavailable';

export function useBiometricAuth() {
  const [status, setStatus] = useState<BiometricStatus>('idle');
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    LocalAuthentication.hasHardwareAsync().then((has) => {
      if (!has) { setIsAvailable(false); setStatus('unavailable'); return; }
      LocalAuthentication.isEnrolledAsync().then((enrolled) => {
        setIsAvailable(enrolled);
        if (!enrolled) setStatus('unavailable');
      });
    });
  }, []);

  const authenticate = async (): Promise<boolean> => {
    if (!isAvailable) return true; // No biometric → allow through
    setStatus('checking');
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verify your identity to continue',
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });
      if (result.success) {
        setStatus('authenticated');
        return true;
      } else {
        setStatus('failed');
        return false;
      }
    } catch {
      setStatus('failed');
      return false;
    }
  };

  return { isAvailable, status, authenticate };
}

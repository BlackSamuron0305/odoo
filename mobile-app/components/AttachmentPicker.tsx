import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/stores/auth';

interface AttachmentPickerProps {
  resModel: string;
  resId: number;
  onAttached?: (attachmentId: number) => void;
}

export function AttachmentPicker({ resModel, resId, onAttached }: AttachmentPickerProps) {
  const { client } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const pick = async (source: 'camera' | 'library') => {
    const permResult = source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permResult.granted) {
      Alert.alert('Permission required', `Please grant ${source} access in Settings.`);
      return;
    }

    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({ quality: 0.7, base64: true })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7, base64: true, mediaTypes: ImagePicker.MediaTypeOptions.Images });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    setPreviewUri(asset.uri);
    setIsUploading(true);

    try {
      const filename = asset.uri.split('/').pop() ?? 'photo.jpg';
      const base64Data = asset.base64 ?? '';
      const attachmentId = await client?.callKw<number>('ir.attachment', 'create', [{
        name: filename,
        datas: base64Data,
        res_model: resModel,
        res_id: resId,
        mimetype: asset.mimeType ?? 'image/jpeg',
      }]);
      if (attachmentId) onAttached?.(attachmentId);
    } catch (e: unknown) {
      Alert.alert('Upload failed', (e as Error).message);
      setPreviewUri(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View className="gap-2">
      <View className="flex-row gap-2">
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center gap-2 bg-odoo-100 rounded-xl py-2"
          onPress={() => pick('camera')}
          disabled={isUploading}
          accessibilityLabel="Take a photo"
          accessibilityRole="button"
        >
          <Text>📷</Text>
          <Text className="text-sm font-semibold text-odoo-700">Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center gap-2 bg-odoo-100 rounded-xl py-2"
          onPress={() => pick('library')}
          disabled={isUploading}
          accessibilityLabel="Choose from library"
          accessibilityRole="button"
        >
          <Text>🖼️</Text>
          <Text className="text-sm font-semibold text-odoo-700">Library</Text>
        </TouchableOpacity>
      </View>
      {previewUri && (
        <View className="items-center">
          <Image
            source={{ uri: previewUri }}
            className="w-40 h-40 rounded-xl"
            accessibilityLabel="Selected image preview"
          />
          {isUploading && (
            <Text className="text-xs text-odoo-500 mt-1">Uploading…</Text>
          )}
        </View>
      )}
    </View>
  );
}

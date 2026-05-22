import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';

interface Product {
  id: number;
  name: string;
  list_price: number;
  taxes_id: number[];
}

interface OrderLine {
  product: Product;
  qty: number;
}

export default function PosOrderScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const router = useRouter();
  const { client } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!client || !sessionId) return;
    setIsLoading(true);
    client.callKw<Product[]>('product.product', 'search_read', [], {
      domain: [['available_in_pos', '=', true], ['active', '=', true]],
      fields: ['name', 'list_price', 'taxes_id'],
      limit: 100,
      order: 'name asc',
    })
      .then((p) => setProducts(p ?? []))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, [client, sessionId]);

  const addProduct = (p: Product) => {
    setOrderLines((lines) => {
      const existing = lines.find((l) => l.product.id === p.id);
      if (existing) {
        return lines.map((l) => l.product.id === p.id ? { ...l, qty: l.qty + 1 } : l);
      }
      return [...lines, { product: p, qty: 1 }];
    });
  };

  const removeProduct = (productId: number) => {
    setOrderLines((lines) => lines.filter((l) => l.product.id !== productId));
  };

  const total = orderLines.reduce((s, l) => s + l.product.list_price * l.qty, 0);

  const postOrder = async () => {
    if (orderLines.length === 0) return;
    setIsPosting(true);
    try {
      const lines = orderLines.map((l) => [0, 0, {
        product_id: l.product.id,
        qty: l.qty,
        price_unit: l.product.list_price,
        price_subtotal: l.product.list_price * l.qty,
        price_subtotal_incl: l.product.list_price * l.qty,
      }]);
      await client?.callKw('pos.order', 'create', [{
        session_id: Number(sessionId),
        lines,
        amount_total: total,
        amount_paid: total,
        amount_return: 0,
        amount_tax: 0,
        state: 'paid',
        payment_ids: [[0, 0, {
          amount: total,
          payment_method_id: 1,
        }]],
      }]);
      Alert.alert('Order Posted', `Total: $${total.toFixed(2)}`, [
        { text: 'New Order', onPress: () => setOrderLines([]) },
        { text: 'Back', onPress: () => router.back() },
      ]);
    } catch (e: unknown) {
      Alert.alert('Error', (e as Error).message);
    } finally {
      setIsPosting(false);
    }
  };

  const filtered = search.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <View className="flex-1 bg-surface-subtle flex-row">
      {/* Product grid - left 60% */}
      <View className="flex-1">
        <View className="px-3 pt-3 pb-2">
          <TextInput
            className="bg-white border border-odoo-200 rounded-xl px-3 py-2 text-sm text-odoo-900"
            value={search}
            onChangeText={setSearch}
            placeholder="Search products..."
          />
        </View>
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#71639e" />
          </View>
        ) : (
          <FlatList
            data={filtered}
            numColumns={2}
            keyExtractor={(p) => String(p.id)}
            contentContainerStyle={{ padding: 8, gap: 8 }}
            columnWrapperStyle={{ gap: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-1 bg-white rounded-xl p-3 items-center gap-1"
                onPress={() => addProduct(item)}
                activeOpacity={0.75}
              >
                <View className="w-10 h-10 rounded-full bg-brand-light items-center justify-center">
                  <Text className="text-xl">🛍️</Text>
                </View>
                <Text className="text-xs font-semibold text-odoo-800 text-center" numberOfLines={2}>
                  {item.name}
                </Text>
                <Text className="text-sm font-bold text-brand-primary">
                  ${item.list_price.toFixed(2)}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Order panel - right 40% */}
      <View className="w-44 bg-white border-l border-odoo-100 flex-col">
        <Text className="text-sm font-bold text-odoo-800 px-3 pt-3 pb-2">Order</Text>
        <ScrollView className="flex-1 px-3" contentContainerStyle={{ gap: 6 }}>
          {orderLines.length === 0 ? (
            <Text className="text-xs text-odoo-400 text-center mt-8">Tap products to add</Text>
          ) : (
            orderLines.map((l) => (
              <View key={l.product.id} className="flex-row items-center gap-1">
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-odoo-800" numberOfLines={1}>
                    {l.product.name}
                  </Text>
                  <Text className="text-xs text-odoo-500">
                    {l.qty} × ${l.product.list_price.toFixed(2)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeProduct(l.product.id)}
                  className="w-6 h-6 rounded-full bg-red-100 items-center justify-center"
                >
                  <Text className="text-red-600 text-xs font-bold">✕</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
        <View className="border-t border-odoo-100 px-3 py-3 gap-2">
          <View className="flex-row justify-between">
            <Text className="text-sm font-bold text-odoo-600">Total</Text>
            <Text className="text-base font-bold text-odoo-900">${total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            className={`rounded-xl py-3 items-center ${orderLines.length ? 'bg-brand-primary' : 'bg-odoo-200'}`}
            onPress={postOrder}
            disabled={orderLines.length === 0 || isPosting}
          >
            {isPosting ? <ActivityIndicator color="white" size="small" /> : (
              <Text className={`font-semibold text-sm ${orderLines.length ? 'text-white' : 'text-odoo-400'}`}>
                Pay
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

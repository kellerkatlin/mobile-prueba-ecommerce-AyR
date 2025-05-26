// app/cart.tsx
import { useCartStore } from "@/stores/useCartStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

export default function CartScreen() {
  const { items, loadCart, updateQuantity, removeProduct, checkout } =
    useCartStore();

  const router = useRouter();

  const total = items.reduce(
    (sum, item) => sum + item.cantidad * item.producto.precioVenta,
    0
  );

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <View className="flex-1 pt-20 bg-white">
      <View className="relative flex items-center justify-center px-4 mb-7">
        {/* Flecha alineada a la izquierda */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-3"
        >
          <ArrowLeftIcon size={24} color="black" />
        </TouchableOpacity>

        {/* Título centrado */}
        <Text className="text-2xl font-bold text-center">
          Carrito de Compras
        </Text>
      </View>

      {items.length === 0 ? (
        <Text className="pt-20 text-center text-gray-600">
          No hay productos en tu carrito.
        </Text>
      ) : (
        <ScrollView className="mb-20">
          {items.map(({ producto, cantidad }) => (
            <View
              key={producto.id}
              className="flex-row items-center pb-4 mb-4 border-b"
            >
              <Image
                source={{ uri: producto.fotoUrl }}
                className="w-16 h-16 mr-4 rounded"
              />
              <View className="flex-1">
                <Text className="text-lg font-semibold">
                  {producto.descripcion}
                </Text>
                <Text className="text-gray-500">
                  S/ {producto.precioVenta} x {cantidad}
                </Text>
                <View className="flex-row items-center mt-2">
                  <TouchableOpacity
                    onPress={() =>
                      cantidad > 1
                        ? updateQuantity(producto.id, cantidad - 1)
                        : removeProduct(producto.id)
                    }
                    className="px-2 py-1 mr-2 bg-gray-200 rounded-full"
                  >
                    <Text>-</Text>
                  </TouchableOpacity>
                  <Text className="mx-2">{cantidad}</Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(producto.id, cantidad + 1)}
                    className="px-2 py-1 bg-gray-200 rounded-full"
                  >
                    <Text>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        await removeProduct(producto.id);
                      } catch (error) {
                        console.error("Error al eliminar el producto:", error);
                      }
                    }}
                    className="ml-4"
                  >
                    <Text className="text-red-500">Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {items.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Text className="text-lg font-semibold">Total: S/ {total}</Text>
          <TouchableOpacity
            onPress={async () => {
              try {
                await checkout();
                router.push("/success"); // o mostrar mensaje / navegar
              } catch (e) {
                console.error("Error al finalizar el pedido:", e);
              }
            }}
            className="py-3 mt-3 bg-black rounded-xl"
          >
            <Text className="text-center text-white">Finalizar Pedido</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

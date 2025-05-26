// components/ProductModal.tsx
import { useCartStore } from "@/stores/useCartStore";
import { ProductResponse } from "@/types/product";
import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export type ProductModalRef = {
  open: (producto: ProductResponse) => void;
  close: () => void;
};

const ProductModal = forwardRef<ProductModalRef>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [producto, setProducto] = useState<ProductResponse | null>(null);
  const { height } = useWindowDimensions();

  useImperativeHandle(ref, () => ({
    open: (producto) => {
      setProducto(producto);
      setVisible(true);
    },
    close: () => {
      setVisible(false);
      setProducto(null);
    },
  }));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => setVisible(false)}
    >
      <View
        style={{ height: height * 0.9 }}
        className="justify-end flex-1 bg-black/50"
      >
        <View className="p-5 bg-white rounded-t-3xl">
          {producto && (
            <>
              <Image
                source={{ uri: producto.fotoUrl }}
                className="w-full mb-4 h-[30rem] rounded-xl"
                resizeMode="cover"
              />
              <Text className="mb-2 text-xl font-bold">
                {producto.descripcion}
              </Text>
              <Text className="mb-4 text-lg text-gray-700">
                S/ {producto.precioVenta.toFixed(2)}
              </Text>
              <TouchableOpacity
                className="py-3 bg-black rounded-xl"
                onPress={() => {
                  useCartStore.getState().addProduct(producto.id, 1);
                  setVisible(false);
                }}
              >
                <Text className="text-center text-white">
                  Agregar al carrito
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-2 mt-4"
                onPress={() => setVisible(false)}
              >
                <Text className="text-center text-gray-600">Cerrar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
});

ProductModal.displayName = "ProductModal";
export default ProductModal;

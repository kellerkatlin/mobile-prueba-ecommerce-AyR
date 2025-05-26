import { getCategories } from "@/api/categoryService";
import { getProducts } from "@/api/productService";
import ProductModal, { ProductModalRef } from "@/components/ProductModal";
import { useCartStore } from "@/stores/useCartStore";
import { CategoryResponse } from "@/types/caregory";
import { ProductResponse } from "@/types/product";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  ArrowLeftIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "react-native-heroicons/solid";

export default function CategoriaScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [categorias, setCategorias] = useState<CategoryResponse[]>([]);
  const [subCategorias, setSubCategorias] = useState<CategoryResponse[]>([]);
  const [productos, setProductos] = useState<ProductResponse[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<CategoryResponse | null>(null);

  const modalRef = useRef<ProductModalRef>(null);
  useEffect(() => {
    const fetchData = async () => {
      const all = await getCategories();
      setCategorias(all.filter((cat) => cat.categoriaPadreId === null));
      const actual = all.find((cat) => cat.id === Number(id));
      setCategoriaSeleccionada(actual ?? null);
      setSubCategorias(
        all.filter((cat) => cat.categoriaPadreId === Number(id))
      );
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await getProducts();
        //filtrar por productos que tengan stock disponible
        const productosConStock = res.filter(
          (prod) => prod.stock && prod.stock.stockFisico > 0
        );
        setProductos(productosConStock);
      } catch (error) {
        console.error("Error fetching productos:", error);
      }
    };
    fetchProductos();
  }, [id]);

  return (
    <View className="flex-1 pt-5 bg-white">
      <ScrollView className="px-4">
        <View className="pt-10 mb-4">
          <View className="flex flex-row justify-between ">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex flex-row items-center my-2 rounded-full gap-x-2"
            >
              <ArrowLeftIcon size={20} color="black" />

              <Text className="text-xl font-bold">
                {categoriaSeleccionada?.descripcion}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-5 rounded-full "
              onPress={() => router.push("/cart")}
            >
              <ShoppingCartIcon size={25} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {subCategorias.map((subCat) => {
          const productosSubCat = productos.filter(
            (prod) => prod.categoriaId === subCat.id
          );

          return (
            <View key={subCat.id} className="mb-6">
              <View className="flex flex-row justify-between">
                <Text className="mb-2 text-lg font-semibold">
                  {subCat.descripcion}
                </Text>
                <TouchableOpacity className="px-2 py-2 text-sm bg-gray-200 rounded-full">
                  <Text>Ver más</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                className="flex-row "
                showsHorizontalScrollIndicator={false}
              >
                <View className="relative flex flex-row gap-3 mt-10">
                  {productosSubCat.length === 0 ? (
                    <Text className="text-gray-500">Sin productos</Text>
                  ) : (
                    productosSubCat.map((item, index) => (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => modalRef.current?.open(item)}
                        className={`relative py-5 px-3 mb-2 bg-white rounded shadow ${
                          index !== 0 ? "ml-3" : ""
                        }`}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            useCartStore.getState().addProduct(item.id, 1)
                          }
                          className="absolute z-10 p-1 bg-green-500 rounded-full -top-2 -right-2"
                        >
                          <PlusIcon
                            className="w-4 h-4 text-white "
                            color="white"
                          />
                        </TouchableOpacity>

                        <View className="flex items-center justify-center mt-2">
                          <Image
                            source={{ uri: item.fotoUrl }}
                            className="w-16 h-16 mb-1 rounded-full"
                          />
                        </View>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          className="w-24 text-sm font-medium"
                        >
                          {item.descripcion}
                        </Text>
                        <Text className="text-gray-600">
                          S/ {item.precioVenta}
                        </Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>

      {/* Aquí está el modal de producto */}
      <ProductModal ref={modalRef} />
    </View>
  );
}

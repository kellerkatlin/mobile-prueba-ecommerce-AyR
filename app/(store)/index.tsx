import { getCategories } from "@/api/categoryService";
import { getProducts } from "@/api/productService";
import ProductModal, { ProductModalRef } from "@/components/ProductModal";
import { useCartStore } from "@/stores/useCartStore";
import { CategoryResponse } from "@/types/caregory";
import { ProductResponse } from "@/types/product";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ArrowLeftIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "react-native-heroicons/solid";

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categorias, setCategorias] = useState<CategoryResponse[]>([]);
  const [subCategorias, setSubCategorias] = useState<CategoryResponse[]>([]);
  const [productos, setProductos] = useState<ProductResponse[]>([]);
  const [favoritos, setFavoritos] = useState<ProductResponse[]>([]);
  const modalRef = useRef<ProductModalRef>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/login"); // Redirige al login si no hay token
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await getCategories();
        const categoriasFiltradas = res.filter(
          (categoria) =>
            categoria.categoriaPadreId === null ||
            categoria.categoriaPadreId === undefined
        );

        setCategorias(categoriasFiltradas);

        const subcats = res.filter(
          (categoria) => categoria.categoriaPadreId !== null
        );
        setSubCategorias(subcats);
      } catch (error) {
        console.error("Error fetching categorias:", error);
      }
    };
    const fetchFavoritos = async () => {
      try {
        const res = await getProducts();
        setFavoritos(res.slice(0, 5)); // solo unos cuantos
        // productos con stock físico
        const conStock = res.filter((p) => p.stock && p.stock.stockFisico > 0);
        setProductos(conStock);
      } catch (error) {
        console.error("Error fetching productos:", error);
      }
    };
    fetchCategorias();
    fetchFavoritos();
  }, []);

  return (
    <ScrollView className="flex-1 px-4 pt-5 bg-white">
      <View className="flex flex-row items-center justify-between pt-10 mb-4 ">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center justify-center"
        >
          <ArrowLeftIcon size={20} color="black" />
          <Text className="ml-2 text-xl font-bold">Mi tienda</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-5 rounded-full "
          onPress={() => router.push("/cart")}
        >
          <ShoppingCartIcon size={25} color="black" />
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <TextInput
        style={{
          borderRadius: 30,
        }}
        className="w-full px-5 py-2 mb-4 mr-5 border border-gray-200 placeholder:text-black/30"
        placeholder="Busca en Mi tienda"
        value={search}
        onChangeText={setSearch}
      />

      {/* Categorías */}
      <FlatList
        horizontal
        data={categorias}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/categoria/${item.id}` as any)}
            className="items-center mr-4"
          >
            <Image
              source={{
                uri: item.imagenUrl,
              }}
              className="w-16 h-16 mb-1 rounded-full"
            />
            <Text className="text-xs text-center">{item.descripcion}</Text>
          </TouchableOpacity>
        )}
      />

      <Text className="mt-6 mb-2 text-lg font-semibold">
        Explora por subcategorías
      </Text>

      {subCategorias.map((subcat) => {
        const productosSub = productos.filter(
          (prod) => prod.categoriaId === subcat.id
        );

        if (productosSub.length === 0) return null;

        return (
          <View key={subcat.id} className="mb-6">
            <View className="flex flex-row justify-between">
              <Text className="mb-2 text-lg font-semibold">
                {subcat.descripcion}
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
                {productosSub.length === 0 ? (
                  <Text className="text-gray-500">Sin productos</Text>
                ) : (
                  productosSub.map((item, index) => (
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
      <ProductModal ref={modalRef} />
    </ScrollView>
  );
}

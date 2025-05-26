import { register } from "@/api/authService";
import { RegisterRequest } from "@/types/auth";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const { control, handleSubmit } = useForm<RegisterRequest>();

  const onSubmit = async (data: RegisterRequest) => {
    try {
      const res = await register(data);
      console.log("Register ok", res);
      router.push("/login");
    } catch (err: any) {
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Data:", err.response.data);
        console.error("Headers:", err.response.headers);
      } else if (err.request) {
        console.error("Request:", err.request);
      } else {
        console.error("Error", err.message);
      }
    }
  };

  return (
    <View className="justify-center flex-1 px-6 bg-white">
      <Text className="mb-6 text-2xl font-bold text-center">Registrarse</Text>

      <Controller
        control={control}
        name="nombres"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="p-3 mb-4 border rounded placeholder:text-gray-400"
            placeholder="Nombres"
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="p-3 mb-4 border rounded placeholder:text-gray-400"
            placeholder="Correo"
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="p-3 mb-4 border rounded placeholder:text-gray-400"
            placeholder="Contraseña"
            secureTextEntry
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <TouchableOpacity
        className="p-3 mb-4 bg-green-600 rounded"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="font-semibold text-center text-white">
          Crear cuenta
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text className="text-center text-blue-600">
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

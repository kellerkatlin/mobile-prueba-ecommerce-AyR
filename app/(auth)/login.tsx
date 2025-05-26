import { login } from "@/api/authService";
import { LoginRequest } from "@/types/auth";
import { Link, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      const res = await login(data);
      console.log("Login ok", res);
      router.replace("/(store)" as any);
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
      <Text className="mb-6 text-2xl font-bold text-center">
        Iniciar Sesión
      </Text>

      <Controller
        control={control}
        name="email"
        rules={{
          required: "El correo electrónico es obligatorio",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "El correo electrónico no es válido",
          },
        }}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              className="p-3 mb-1 border rounded placeholder:text-gray-400"
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={onChange}
              value={value}
            />
            {errors.email && (
              <Text className="mb-2 text-red-600">{errors.email.message}</Text>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{
          required: "La contraseña es obligatoria",

          minLength: {
            value: 6,
            message: "La contraseña debe tener al menos 6 caracteres",
          },
        }}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              className="p-3 mb-1 border rounded placeholder:text-gray-400"
              placeholder="Contraseña"
              secureTextEntry
              onChangeText={onChange}
              value={value}
            />
            {errors.password && (
              <Text className="mb-2 text-red-600">
                {errors.password.message}
              </Text>
            )}
          </>
        )}
      />

      <TouchableOpacity
        className="p-3 mb-4 bg-blue-600 rounded"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="font-semibold text-center text-white">Entrar</Text>
      </TouchableOpacity>

      <Link href="/register" className="text-center text-blue-600">
        ¿No tienes cuenta? Regístrate
      </Link>
    </View>
  );
}

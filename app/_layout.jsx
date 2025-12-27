import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const MainLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(drawer)" />
      <Stack.Screen
        name="image_viewer"
        options={{
          presentation: "transparentModal",
          animation: "fade",
        }}
      />
    </Stack>
  );
};

const RootLayout = () => {
  return (
    <GestureHandlerRootView>
      <MainLayout />
      <Toast />
    </GestureHandlerRootView>
  );
};

export default RootLayout;

import Colors from "@constants/Colors";
import { Stack } from "expo-router";

const MainLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(drawer)" />
    </Stack>
  );
};

export default MainLayout;

import CustomDrawerContent from "@components/CustomDrawerContent";

import { Drawer } from "expo-router/drawer";

const DrawerLayout = () => {
  return (
    <Drawer
      screenOptions={({ navigation, route }) => ({
        drawerPosition: "left",
        drawerStyle: {
          width: "65%",
        },
        overlayColor: "rgba(0, 0, 0, 0.8)",
        headerShown: false,
      })}
      drawerContent={(props) => {
        return <CustomDrawerContent {...props} />;
      }}
    >
      <Drawer.Screen name="index" />
      <Drawer.Screen name="dalle" />
    </Drawer>
  );
};

export default DrawerLayout;

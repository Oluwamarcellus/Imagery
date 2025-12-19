import CustomDrawerContent from "@components/CustomDrawerContent";
import Colors from "@constants/Colors";
import { Ionicons } from "@expo/vector-icons";

import { Drawer } from "expo-router/drawer";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const DrawerLayout = () => {
  return (
    <Drawer
      screenOptions={({ navigation, route }) => ({
        drawerPosition: "left",
        drawerItemStyle: {
          borderRadius: 10,
        },
        drawerStyle: {
          width: "65%",
          borderRadius: 10,
          backgroundColor: Colors.background,
        },
        drawerLabel: ({ focused }) => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Ionicons
              name={route.name === "index" ? "home" : "images"}
              size={widthPercentageToDP("4%")}
              color={focused ? Colors.background : Colors.dark}
            />
            <Text
              style={{
                color: focused ? Colors.background : Colors.dark,
                fontSize: widthPercentageToDP("4%"),
                fontWeight: "500",
              }}
            >
              {route.name === "index"
                ? "Explore"
                : route.name === "dalle"
                ? "Dall-E"
                : ""}
            </Text>
          </View>
        ),
        overlayColor: "rgba(0, 0, 0, 0.75)",
        drawerActiveBackgroundColor: Colors.dark,
        drawerActiveTintColor: Colors.background,
        headerStyle: {
          height: heightPercentageToDP("12%"),
        },
        headerTransparent: true,
        headerShadowVisible: false,
        headerBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.background,
            }}
          />
        ),
        headerTitle: "",
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Ionicons
              name="menu"
              size={30}
              color={Colors.dark}
              style={styles.headerRight}
            />
          </TouchableOpacity>
        ),
      })}
      drawerContent={(props) => {
        return <CustomDrawerContent {...props} />;
      }}
    >
      <Drawer.Screen name="index" options={{}} />
      <Drawer.Screen name="dalle" />
    </Drawer>
  );
};

export default DrawerLayout;

const styles = StyleSheet.create({
  headerRight: {
    fontSize: widthPercentageToDP("8%"),
    color: Colors.dark,
    marginRight: 5,
  },
});

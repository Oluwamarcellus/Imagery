import Colors from "@constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const CustomDrawerContent = (props) => {
  const [inputText, setInputText] = useState("");
  const [prevInput, setPrevInput] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const DRAWERS = [
    {
      name: "Explore",
      path: "/",
      icon: "home",
    },
    {
      name: "ImageGPT",
      path: "/dalle",
      icon: "images",
    },
  ];

  const handleSubmit = () => {
    if (!inputText.trim()) return;

    router.navigate({
      pathname: "/(drawer)",
      params: { search: inputText === prevInput ? `${inputText} ` : inputText },
    });

    setPrevInput(inputText === prevInput ? `${inputText} ` : inputText);
    setInputText("");
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, backgroundColor: Colors.surface }}
    >
      {/** Header */}
      <Text style={styles.headerTitle}>Imagery</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Search"
          placeholderTextColor="grey"
          onChangeText={setInputText}
          value={inputText}
          onSubmitEditing={handleSubmit}
        />
      </View>

      {/* <DrawerItemList {...props} /> */}
      {DRAWERS.map((drawer, index) => (
        <TouchableOpacity
          onPress={() => router.navigate("/(drawer)" + drawer.path)}
          style={[
            styles.drawerItem,
            { backgroundColor: drawer.path === pathname ? Colors.dark : null },
          ]}
          key={index}
        >
          <Ionicons
            name={drawer.icon}
            size={widthPercentageToDP("4%")}
            color={drawer.path === pathname ? Colors.background : Colors.dark}
          />
          <Text
            style={{
              color: drawer.path === pathname ? Colors.background : Colors.dark,
              fontSize: widthPercentageToDP("4%"),
              fontWeight: "500",
            }}
          >
            {drawer.name}
          </Text>
        </TouchableOpacity>
      ))}
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: wp("9%"),
    fontWeight: "500",
    color: Colors.dark,
    marginBottom: 10,
  },
  inputWrapper: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: Colors.lightGrey,
    marginBottom: 15,
    backgroundColor: Colors.input,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 13,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },
});

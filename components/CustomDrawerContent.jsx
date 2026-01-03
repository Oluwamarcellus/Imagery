import Colors from "@constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import useAsyncStorage from "@hooks/useAsyncStorage";
import {
  DrawerContentScrollView,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
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
  const [conversations, setConversations] = useState([]);

  const pathname = usePathname();
  const router = useRouter();
  const isDrawerOpen = useDrawerStatus();
  const { get, removeItem } = useAsyncStorage();

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

  const loadGPTHistory = async () => {
    const data = await get("conversations");
    if (!data) return;
    setConversations(data);
    // console.log(data);
  };

  const deleteHistory = async (id) => {
    await removeItem(id);
    loadGPTHistory();

    pathname === "/dalle" &&
      router.navigate({
        pathname: "/(drawer)/dalle",
        params: {
          data: JSON.stringify({
            id: "deletion",
            title: null,
            title: null,
            conversations: [],
            createdAt: id,
          }),
        },
      });
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteHistory(id),
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    if (isDrawerOpen === "closed") return;

    loadGPTHistory();
  }, [isDrawerOpen]);

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

      {/* Navigation section */}
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

      {/* Conversations Section */}
      {conversations.length > 0 && (
        <>
          <View
            style={{
              height: 1,
              marginTop: 20,
              backgroundColor: Colors.lightGrey,
            }}
          />
          <Text style={styles.subTitle}>Conversations</Text>
        </>
      )}

      {conversations.length > 0 &&
        conversations.map((conversation, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 15,
              paddingRight: 20,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                router.navigate({
                  pathname: "/(drawer)/dalle",
                  params: { data: JSON.stringify(conversation) },
                })
              }
              style={{ width: "100%" }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="middle"
                style={styles.listTitle}
              >
                {conversation.title}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleDelete(conversation.id)}>
              <MaterialIcons name="delete" color={Colors.dark} size={24} />
            </TouchableOpacity>
          </View>
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
  subTitle: {
    fontSize: wp("5.5%"),
    marginTop: 20,
    fontWeight: "500",
    color: Colors.dark,
  },
  listTitle: {
    fontSize: wp("4%"),
    fontWeight: "500",
    color: "grey",
    textDecorationLine: "underline",
    width: "90%",
  },
});

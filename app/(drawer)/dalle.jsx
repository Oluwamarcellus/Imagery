import HeaderPanel from "@components/HeaderPanel";
import Colors from "@constants/Colors";
import { Image } from "expo-image";
import { Plus, Send } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Dalle = () => {
  const [inputHeight, setInputHeight] = useState(null);
  const [inputHeightDefault, setInputHeightDefault] = useState(null);
  const [conversationsData, setConversationsData] = useState({
    entryPrompt: "",
    conversations: [
      {
        role: "user",
        prompt: "Show me a cyberpunk street city at night with neon lights",
      },
      {
        role: "image-gpt",
        imageUrl: require("@assets/images/prayer.webp"),
      },

      // {
      //   role: "user",
      //   prompt: "Now generate a beautiful natural waterfall scene",
      // },
      // {
      //   role: "image-gpt",
      //   imageUrl:
      //     "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      // },
      // {
      //   role: "user",
      //   prompt: "Show a city skyline with mountains in the background",
      // },
      // {
      //   role: "image-gpt",
      //   imageUrl:
      //     "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      // },
      // {
      //   role: "user",
      //   prompt: "Give me a neon city or cyberpunk skyline image",
      // },
      // {
      //   role: "image-gpt",
      //   imageUrl:
      //     "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      // },
    ],
  });

  const listRef = useRef(null);
  const { top, bottom } = useSafeAreaInsets();
  // Constants
  const padding = 10;

  const generateImage = async () => {
    try {
      const res = await fetch("http://172.20.10.3:8081/api/create_image", {
        method: "POST",
        body: JSON.stringify({
          prompts: "Generate an Image of a Dog sitting next to a Cat",
        }),
      });
      const { data } = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLayout = (e) => {
    if (inputHeightDefault) return;
    setInputHeight(e.nativeEvent.layout.height);
    setInputHeightDefault(e.nativeEvent.layout.height);
  };

  const handleInputChange = (texts) => {
    const numLines = texts.split("\n").length - 1;
    const lineHeight = numLines * 20;
    const newHeight = lineHeight + inputHeightDefault;

    if (inputHeight !== newHeight) setInputHeight(newHeight);
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <HeaderPanel listRef={listRef} padding={padding / 2} />
      <ScrollView
        ref={listRef}
        style={{ paddingHorizontal: padding / 2 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: padding - 3,
          paddingVertical: 20,
        }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        {conversationsData.conversations.map((conversation, index) =>
          conversation.role === "image-gpt" ? (
            <View key={index} style={[styles.gptChatBox]}>
              <Image
                source={require("@assets/images/imageGPT.webp")}
                style={[styles.gptLogo]}
              />
              <Image source={conversation.imageUrl} style={[styles.gptImage]} />
            </View>
          ) : (
            <View key={index} style={[styles.userChatBox]}>
              <Text style={[styles.userChat]}>{conversation.prompt}</Text>
            </View>
          )
        )}
      </ScrollView>

      {/* Input Section */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={15}
        style={[styles.inputWrapper]}
      >
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 10,
          }}
        >
          <TextInput
            placeholder="Enter your prompt"
            placeholderTextColor={"grey"}
            style={[styles.input, { height: inputHeight }]}
            multiline
            scrollEnabled={false}
            onLayout={handleLayout}
            onChangeText={handleInputChange}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <TouchableOpacity style={styles.addBtn}>
            <Plus size={25} />
          </TouchableOpacity>

          <Send style={styles.sendBtn} />
        </View>
      </KeyboardAvoidingView>
      <View style={{ paddingBottom: bottom, backgroundColor: "#6e6e6e35" }} />
    </View>
  );
};

export default Dalle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gptChatBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "spaceetween",
    marginBottom: 20,
    gap: 10,
  },
  gptLogo: {
    width: 30,
    height: 30,
    contentFit: "cover",
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: Colors.dark,
  },
  gptImage: {
    width: 280,
    height: 320,
    contentFit: "cover",
    borderRadius: 15,
  },
  userChatBox: {
    flexDirection: "row",
    justifyContent: "flex-end",

    marginBottom: 10,
    flexWrap: "wrap",
  },
  userChat: {
    backgroundColor: Colors.dark,
    color: Colors.input,
    maxWidth: 250,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 15,
    alignSelf: "flex-end",
    fontWeight: "500",
  },
  inputContainer: {},
  inputWrapper: {
    justifyContent: "flex-start",
    padding: 5,
    backgroundColor: "#6e6e6e35",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  addBtn: {
    // backgroundColor: "#6e6e6e35",
    // borderRadius: 50,
    // padding: 5,
  },
  input: {
    width: "100%",
    paddingVertical: 15,
    color: Colors.dark,
    fontSize: 18,
    textAlignVertical: "top",
  },
  sendBtn: {},
});

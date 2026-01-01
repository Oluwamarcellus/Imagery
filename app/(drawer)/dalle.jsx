import CustomImageViewer from "@components/CustomImageViewer";
import HeaderPanel from "@components/HeaderPanel";
import Colors from "@constants/Colors";
import useAsyncStorage from "@hooks/useAsyncStorage";
import { Image } from "expo-image";
import { Plus, Send } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Dalle = () => {
  const [prompt, setPrompt] = useState("");
  const [inputHeight, setInputHeight] = useState(0);
  const [processingImage, setProcessingImage] = useState(false);
  const [saveTrigger, setSaveTrigger] = useState(0);
  const [conversationsData, setConversationsData] = useState({
    id: null,
    conversations: [],
    createdAt: null,
    title: null,
  });
  const { set, get, remove } = useAsyncStorage();

  // async function test() {
  //   const data = await get("conversations");
  //   console.log(data);
  // }

  // useEffect(() => {
  //   test();
  // });

  const listRef = useRef(null);
  const { top, bottom } = useSafeAreaInsets();
  const padding = 10;

  useEffect(() => {
    if (saveTrigger > 0) {
      saveHistory();
    }
  }, [saveTrigger]);

  const handleInputSubmit = async () => {
    if (!prompt.trim()) return;

    setConversationsData((prev) => ({
      id: prev.id ? prev.id : Date.now().toString(),
      createdAt: prev.createdAt ? prev.createdAt : Date.now().toString(),
      title: prev.title ? prev.title : prompt,
      conversations: [
        ...prev.conversations,
        {
          role: "user",
          prompt,
        },
        {
          role: "image-gpt",
          loading: true,
        },
      ],
    }));
    setPrompt("");
    listRef.current?.scrollTo({
      y: heightPercentageToDP("100%"),
      animated: true,
    });
    Keyboard.dismiss();

    try {
      await generateImage();
    } catch (e) {
      console.error(e);
    }
  };

  const generateImage = async () => {
    setProcessingImage(true);
    try {
      const res = await fetch("http://172.20.10.3:8081/api/create_image", {
        method: "POST",
        body: JSON.stringify({
          prompts: prompt,
        }),
      });
      const { data } = await res.json();

      if (data.success) {
        setConversationsData((prev) => ({
          ...prev,
          conversations: [
            ...prev.conversations.slice(0, -1),
            {
              role: "image-gpt",
              imageUrl: data.url,
            },
          ],
        }));
      }

      setSaveTrigger((prev) => prev + 1);
    } catch (err) {
      throw new Error(err);
    } finally {
      setProcessingImage(false);
    }
  };

  const saveHistory = async () => {
    const conversations = await get("conversations");
    console.log("conversations", conversations);
    console.log("conversationData", conversationsData);

    if (!conversations) {
      await set("conversations", [conversationsData]);
      return;
    }

    let alreadyExists = false;

    const filteredConversations = conversations.map((conversation) => {
      if (conversation.id === conversationsData.id) {
        alreadyExists = true;
        return {
          ...conversation,
          conversations: [...conversationsData.conversations],
        };
      } else {
        return conversation;
      }
    });

    if (alreadyExists) {
      await set("conversations", filteredConversations);
    } else {
      await set("conversations", [...conversations, { ...conversationsData }]);
    }
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
          paddingBottom: 100,
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
              <View style={styles.gptImageWrapper}>
                {conversation["loading"] ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors.dark}
                    style={{ alignSelf: "center" }}
                  />
                ) : (
                  <CustomImageViewer url={conversation.imageUrl} />
                )}
              </View>
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
            style={[styles.input, inputHeight >= 150 && { height: 150 }]}
            multiline
            onChangeText={setPrompt}
            onContentSizeChange={(e) => {
              setInputHeight(e.nativeEvent.contentSize.height);
            }}
            value={prompt}
            onSubmitEditing={handleInputSubmit}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingBottom: 5,
          }}
        >
          <TouchableOpacity style={[styles.btn]}>
            <Plus size={25} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { opacity: processingImage ? 0.3 : 1 }]}
            disabled={processingImage}
            onPress={handleInputSubmit}
          >
            <Send />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <View style={{ paddingBottom: bottom, backgroundColor: "#6e6e6e35" }} />
      {/* Empty Screen */}
      {conversationsData.conversations.length === 0 && (
        <View style={styles.welcomeTextWrapper}>
          <Text
            style={{
              fontSize: 40,
              fontWeight: "500",
              color: "rgba(0,0,0,0.8)",
            }}
          >
            Welcome,
          </Text>
          <Text
            style={{
              color: "rgba(0,0,0,0.5)",
              textAlign: "center",
              fontSize: 16,
              width: "60%",
              marginTop: 5,
              fontStyle: "italic",
            }}
          >
            Generate stunning images from simple text prompts
          </Text>
        </View>
      )}
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
  gptImageWrapper: {
    width: 280,
    height: 320,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
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
  btn: {},
  input: {
    width: "100%",
    paddingVertical: 15,
    color: Colors.dark,
    fontSize: 18,
    textAlignVertical: "top",
  },
  welcomeTextWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: heightPercentageToDP("20%"),
    justifyContent: "center",
    alignItems: "center",
  },
});

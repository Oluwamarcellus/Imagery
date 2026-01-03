import CustomImageViewer from "@components/CustomImageViewer";
import HeaderPanel from "@components/HeaderPanel";
import Colors from "@constants/Colors";
import useAsyncStorage from "@hooks/useAsyncStorage";
import { useIsFocused } from "@react-navigation/native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { FilePlus, Plus, Send } from "lucide-react-native";
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
import Animated, { FadeInLeft } from "react-native-reanimated";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Dalle = () => {
  const [prompt, setPrompt] = useState("");
  const [inputHeight, setInputHeight] = useState(0);
  const [addBtnLayout, setAddBtnLayout] = useState({});
  const [processingImage, setProcessingImage] = useState(false);
  const [toggleBtn, setToggleBtn] = useState(false);
  const [saveTrigger, setSaveTrigger] = useState(0);
  const [conversationsData, setConversationsData] = useState({
    id: null,
    conversations: [],
    createdAt: null,
    title: null,
  });
  const { set, get, remove } = useAsyncStorage();
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();

  async function test() {
    const data = await get("conversations");
    console.log(data);
  }

  const listRef = useRef(null);
  const { top, bottom } = useSafeAreaInsets();
  const padding = 10;
  let timer = null;

  useEffect(() => {
    verifyDeletion();
  }, [isFocused]);

  useEffect(() => {
    // Auto saves conversation history
    if (saveTrigger > 0) {
      saveHistory();
    }
  }, [saveTrigger]);

  useEffect(() => {
    // Manages the conversation data history
    if (Object.keys(params).length === 0) {
      return;
    }
    const data = JSON.parse(params.data);
    if (data["id"] === "deletion") {
      verifyDeletion();
    } else {
      setConversationsData(data);
    }
  }, [params.data]);

  useEffect(() => {
    // Auto hides the input menu options
    if (toggleBtn) {
      timer = setTimeout(() => {
        setToggleBtn(false);
      }, 2000);
    }
  }, [toggleBtn]);

  const handleTooggle = () => {
    setToggleBtn((prev) => {
      if (prev) clearTimeout(timer);
      return !prev;
    });
  };

  const verifyDeletion = async () => {
    if (conversationsData.id) {
      const conversations = await get("conversations");
      if (!conversations) return;
      const isPresent = conversations.some(
        (c) => c.id === conversationsData.id
      );
      if (!isPresent) {
        // Hass been deleted
        setConversationsData({
          id: null,
          title: null,
          conversations: [],
          createdAt: null,
        });
      }
    }
  };

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

  const handleAddBtnLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    setAddBtnLayout({ width, height });
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
          {/* Text Field */}
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

        {/* Buttons */}
        <View style={styles.btnContainer}>
          <View style={[styles.btn, { position: "relative" }]}>
            {/* Menu BTN */}
            <TouchableOpacity
              onLayout={(e) => handleAddBtnLayout(e)}
              onPress={() => handleTooggle()}
            >
              <Plus size={25} />
            </TouchableOpacity>
            {/* Select Box */}
            {toggleBtn && (
              <Animated.View
                entering={FadeInLeft.duration(300)}
                style={[
                  styles.optionModal,
                  {
                    bottom: addBtnLayout.height + 10,
                    left: addBtnLayout.width,
                    backgroundColor: Colors.background,
                  },
                ]}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                  onPress={() => {
                    setConversationsData({
                      id: null,
                      conversations: [],
                      createdAt: null,
                      title: null,
                    });
                    setToggleBtn(false);
                  }}
                >
                  <Text style={{ fontSize: 16, color: "grey" }}>Start New</Text>
                  <FilePlus size={16} color={"grey"} />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

          {/* Send BTN */}
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

      {/* Empty Screen Text */}
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
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  optionModal: {
    borderWidth: StyleSheet.hairlineWidth,
    position: "absolute",
    borderRadius: 10,
    borderColor: "grey",
    padding: 15,
    minWidth: 150,
  },
});

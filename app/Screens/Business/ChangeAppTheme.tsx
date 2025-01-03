import { View, Text, TouchableNativeFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import Screen from "../../utilities/Screen";
import LoadingComp from "../../utilities/LoadingComp";
import { useDynamicStyles } from "../../utilities/Styles";
import { useStates } from "../../utilities/States";
import * as Font from "expo-font";
import fontMap from "../../utilities/fontMap";
import { SelectList } from "react-native-dropdown-select-list";
import { useDispatch } from "react-redux";
import { setColor, setFont } from "../../redux/appSlice";
import ColorPicker, {
  HueSlider,
  LuminanceSlider,
} from "reanimated-color-picker";
import { ScrollView } from "react-native-gesture-handler";

import ClickableBtn from "../../components/ClickableBtn";
import {
  AppTheme,
  RootTabParamList,
  StackSettingsParamList,
  TabParamList,
} from "../../utilities/Types";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ChangeThemeLoader } from "../../utilities/Loaders";

type Props = BottomTabScreenProps<TabParamList,"settings">;

const ChangeAppTheme: React.FC<Props> = ({ navigation }) => {
  console.log("change app scrren called");
  const dispatch = useDispatch();
  const { appTheme } = useStates();
  const styles = useDynamicStyles();
  const [backgroundColor, setbackgroundColor] = useState(
    appTheme.colors?.background
  );
  const [primary, setPrimary] = useState(appTheme.colors?.background);
  const [isValid, setIsValid] = useState(true);
  const [secondary, setSecondary] = useState(appTheme.colors?.background);
  const [tertiary, setTertiary] = useState(appTheme.colors?.background);
  const [quaternary, setQuanternary] = useState(appTheme.colors?.background);
  const [quaternarySup, setQuanternarySup] = useState(
    appTheme.colors?.background
  );
  const [textColor, setTextColor] = useState(appTheme.colors?.textColor!!);
  const handleSave = () => {
    const data: AppTheme = {
      current_screen: "layout",
      colors: {
        background: backgroundColor,
        secondary:
          secondary === appTheme.colors?.background
            ? appTheme.colors?.secondary
            : secondary,
        primary:
          primary === appTheme.colors?.background
            ? appTheme.colors?.primary
            : primary,
        tertiary:
          tertiary === appTheme.colors?.background
            ? appTheme.colors?.tertiary
            : tertiary,
        quaternary:
          quaternary === appTheme.colors?.background
            ? appTheme.colors?.quaternary
            : quaternary,
        quaternarySup:
          quaternarySup === appTheme.colors?.background
            ? appTheme.colors?.quaternarySup
            : quaternarySup,
        textColor: textColor,
      },
      fonts: {
        primary: selectedFont,
      },
    };
    dispatch(setColor(data));
    navigation.navigate("Layout");
  };
  const [fontList, setFontList] = useState(
    Object.keys(fontMap).map((key) => ({ key, value: key }))
  );
  const [selectedFont, setSelectedFont] = useState(
    appTheme.fonts?.primary || ""
  );
  const [isFontLoaded, setIsFontLoaded] = useState(true);
  const handleBtn = async () => {
    const operation = (): Promise<boolean> => {
      return new Promise((resolve) => {
        let count = 0;
        const maxCount = 50000;

        const run = () => {
          for (let i = 0; i < 1000; i++) {
            count++;
            if (count >= maxCount) {
              resolve(false);
              return;
            }
          }
          setTimeout(run, 0);
        };

        run();
      });
    };

    try {
      const result = await operation();
      setIsValid(result);
    } catch (err) {
      console.log(err);
    }
  };

  const loadFont = async (fontName: string) => {
    if (fontMap[fontName]) {
      setIsFontLoaded(false);
      await Font.loadAsync({ [fontName]: fontMap[fontName] });
      setIsFontLoaded(true);
    }
  };

  useEffect(() => {
    const delay = async () => {
      await handleBtn();
    };
    delay();
    if (selectedFont) loadFont(selectedFont);
  }, [selectedFont]);

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    dispatch(setFont(font));
  };
  if (isValid) {
    return (
      <Screen>
        <ChangeThemeLoader />
      </Screen>
    );
  } else {
    return (
      <View
        style={{ backgroundColor: appTheme.colors?.background }}
        className=" h-full"
      >
        <LoadingComp
          loaded={isFontLoaded}
          item={
            <View
              style={{ backgroundColor: appTheme.colors?.primary }}
              className="p-[5%] w-full"
            >
              <Text style={styles.text} className={`text-[24px]  `}>
                App Theme
              </Text>
            </View>
          }
        />
        <View className="">
          <ScrollView>
            <View
              style={{ backgroundColor: appTheme.colors?.primary }}
              className="mt-1  p-[5%]  "
            >
              <View className="mt-2 mb-4">
                <Text style={styles.text}>Background Color</Text>
              </View>
              <View className=" flex-row gap-7 items-center">
                <View
                  style={{
                    backgroundColor: appTheme.colors?.background,
                    borderColor: appTheme.colors?.quaternarySup,
                    borderWidth: 1,
                  }}
                  className="w-[120px] h-[100px] rounded-md "
                ></View>
                <View
                  style={{
                    backgroundColor: backgroundColor,
                    borderColor: appTheme.colors?.quaternarySup,
                    borderWidth: 1,
                  }}
                  className="w-[120px] h-[100px] rounded-md "
                ></View>
              </View>
              <TouchableNativeFeedback
                onPress={() => {
                  // setShowModal(true);
                }}
              >
                <View className="mt-5 w-[180px] self-end right-5  rounded-md  ">
                  <ColorPicker
                    style={{ width: "100%", gap: 10 }}
                    value={"red"}
                    onComplete={({ hex }) => {
                      setbackgroundColor(hex);
                    }}
                  >
                    <HueSlider
                      style={{ width: "60%", alignSelf: "flex-end" }}
                      thumbSize={20}
                      thumbShape="circle"
                    />
                    <LuminanceSlider thumbSize={20} thumbShape="circle" />
                  </ColorPicker>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View
              style={{ backgroundColor: appTheme.colors?.primary }}
              className=" mt-2  p-[5%] "
            >
              <View className="mt-2 mb-4">
                <Text style={styles.text}>Primary Color</Text>
              </View>
              <View className=" flex-row gap-7 items-center">
                <View
                  style={{
                    backgroundColor: appTheme.colors?.primary,
                    borderColor: appTheme.colors?.quaternarySup,
                    borderWidth: 1,
                  }}
                  className="w-[120px] h-[100px] rounded-md "
                ></View>
                <View
                  style={{
                    backgroundColor: primary,
                    borderColor: appTheme.colors?.quaternarySup,
                    borderWidth: 1,
                  }}
                  className="w-[120px] h-[100px] rounded-md "
                ></View>
              </View>
              <TouchableNativeFeedback>
                <View className="mt-5 self-start  w-[180px]  rounded-md  ">
                  <ColorPicker
                    style={{ width: "100%", gap: 10 }}
                    value={"red"}
                    onComplete={({ hex }) => {
                      setPrimary(hex);
                    }}
                  >
                    <HueSlider
                      style={{ width: "60%" }}
                      thumbSize={20}
                      thumbShape="circle"
                    />
                    <LuminanceSlider thumbSize={20} thumbShape="circle" />
                  </ColorPicker>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View
              style={{ backgroundColor: appTheme.colors?.primary }}
              className=" mt-2  p-[5%] "
            >
              <View className="mt-2 mb-4">
                <Text style={styles.text}>Secondary Color</Text>
              </View>
              <View className=" flex-row gap-7 items-center">
                <View
                  style={{
                    backgroundColor: appTheme.colors?.secondary,
                    borderColor: appTheme.colors?.quaternarySup,
                    borderWidth: 1,
                  }}
                  className="w-[120px] h-[100px] rounded-md "
                ></View>
                <View
                  style={{
                    backgroundColor: secondary,
                    borderColor: appTheme.colors?.quaternarySup,
                    borderWidth: 1,
                  }}
                  className="w-[120px] h-[100px] rounded-md "
                ></View>
              </View>
              <TouchableNativeFeedback>
                <View className="mt-5 self-end w-[180px] right-5 rounded-md  ">
                  <ColorPicker
                    style={{ width: "100%", gap: 10 }}
                    value={"red"}
                    onComplete={({ hex }) => {
                      setSecondary(hex);
                    }}
                  >
                    <HueSlider
                      style={{ width: "60%", alignSelf: "flex-end" }}
                      thumbSize={20}
                      thumbShape="circle"
                    />
                    <LuminanceSlider thumbSize={20} thumbShape="circle" />
                  </ColorPicker>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View
              style={{ backgroundColor: appTheme.colors?.primary }}
              className=" mt-2  p-[5%] "
            >
              <View className="mt-2 mb-4">
                <Text style={styles.text}>Tertiary Color</Text>
              </View>
              <View className=" flex-row gap-7 items-center">
                <View
                  style={{
                    backgroundColor: appTheme.colors?.tertiary,
                    borderColor: appTheme.colors?.quaternarySup,
                    borderWidth: 1,
                  }}
                  className="w-[120px] h-[100px] rounded-md "
                ></View>
                <View
                  style={{
                    backgroundColor: tertiary,
                    borderColor: appTheme.colors?.quaternarySup,
                    borderWidth: 1,
                  }}
                  className="w-[120px] h-[100px] rounded-md "
                ></View>
              </View>
              <TouchableNativeFeedback>
                <View className="mt-5 self-start  w-[180px]  rounded-md  ">
                  <ColorPicker
                    style={{ width: "100%", gap: 10 }}
                    value={"red"}
                    onComplete={({ hex }) => {
                      setTertiary(hex);
                    }}
                  >
                    <HueSlider
                      style={{ width: "60%" }}
                      thumbSize={20}
                      thumbShape="circle"
                    />
                    <LuminanceSlider thumbSize={20} thumbShape="circle" />
                  </ColorPicker>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View
              style={{ backgroundColor: appTheme.colors?.primary }}
              className=" mt-2  p-[5%] "
            >
              <View className="mt-2 mb-4">
                <Text style={styles.text}>quaternary Color</Text>
              </View>
              <View className=" flex-row gap-7 items-center">
                <View
                  style={{
                    backgroundColor: appTheme.colors?.quaternary,
                    borderColor: appTheme.colors?.quaternarySup,
                    borderWidth: 1,
                  }}
                  className="w-[120px] h-[100px] rounded-md "
                ></View>
                <View
                  style={{
                    backgroundColor: quaternary,
                    borderColor: appTheme.colors?.quaternarySup,
                    borderWidth: 1,
                  }}
                  className="w-[120px] h-[100px] rounded-md "
                ></View>
              </View>
              <TouchableNativeFeedback>
                <View className="mt-5 self-end right-5 w-[180px] rounded-md  ">
                  <ColorPicker
                    style={{ width: "100%", gap: 10 }}
                    value={"red"}
                    onComplete={({ hex }) => {
                      setQuanternary(hex);
                    }}
                  >
                    <HueSlider
                      style={{ width: "60%", alignSelf: "flex-end" }}
                      thumbSize={20}
                      thumbShape="circle"
                    />
                    <LuminanceSlider thumbSize={20} thumbShape="circle" />
                  </ColorPicker>
                </View>
              </TouchableNativeFeedback>
            </View>

            <View
              style={{ backgroundColor: appTheme.colors?.primary }}
              className=" mt-2  p-[5%] "
            >
              <View className="mt-2 mb-4">
                <Text style={styles.text}>Quirnary Color</Text>
              </View>
              <View className=" flex-row gap-7 items-center">
                <View
                  style={{
                    backgroundColor: appTheme.colors?.quaternarySup,
                    borderColor: appTheme.colors?.quaternarySup,
                    borderWidth: 1,
                  }}
                  className="w-[120px] h-[100px] rounded-md "
                ></View>
                <View
                  style={{
                    backgroundColor: quaternarySup,
                    borderColor: appTheme.colors?.quaternarySup,
                    borderWidth: 1,
                  }}
                  className="w-[120px] h-[100px] rounded-md "
                ></View>
              </View>
              <TouchableNativeFeedback>
                <View className="mt-5 self-start w-[180px] rounded-md  ">
                  <ColorPicker
                    style={{ width: "100%", gap: 10 }}
                    value={"red"}
                    onComplete={({ hex }) => {
                      setQuanternarySup(hex);
                    }}
                  >
                    <HueSlider
                      style={{ width: "60%" }}
                      thumbSize={20}
                      thumbShape="circle"
                    />
                    <LuminanceSlider thumbSize={20} thumbShape="circle" />
                  </ColorPicker>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View
              style={{ backgroundColor: appTheme.colors?.primary }}
              className=" mt-2  p-[5%] "
            >
              <View className="mt-2 mb-4">
                <Text style={styles.text}>Select Text Color</Text>
              </View>
              <View className="mt-2">
                <Text
                  style={{ color: textColor, fontFamily: "font" }}
                  className={`text-[24px]  `}
                >
                  Dummy Text
                </Text>
              </View>
              <TouchableNativeFeedback>
                <View className="mt-5 self-end right-5 w-[180px] rounded-md  ">
                  <ColorPicker
                    style={{ width: "100%", gap: 10 }}
                    value={"red"}
                    onComplete={({ hex }) => {
                      setTextColor(hex);
                    }}
                  >
                    <HueSlider
                      style={{ width: "60%", alignSelf: "flex-end" }}
                      thumbSize={20}
                      thumbShape="circle"
                    />
                    <LuminanceSlider thumbSize={20} thumbShape="circle" />
                  </ColorPicker>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View
              style={{ backgroundColor: appTheme.colors?.primary }}
              className=" mt-2  p-[5%] "
            >
              <View className="mt-2 mb-4">
                <Text style={styles.text}>Select Font Style</Text>
              </View>
              <SelectList
                setSelected={handleFontChange}
                data={fontList}
                boxStyles={{ borderColor: appTheme.colors?.secondary }}
                save="key"
                inputStyles={{
                  color: appTheme.colors?.textColor || "black",
                  fontFamily: selectedFont,
                }}
                dropdownTextStyles={{
                  color: appTheme.colors?.textColor || "black",
                  fontFamily: selectedFont,
                }}
                placeholder="Select Font"
                search={false}
              />
              {/* Font Preview */}
              <LoadingComp
                loaded={isFontLoaded}
                item={
                  <View className="mt-8">
                    <Text
                      style={{
                        fontFamily: selectedFont,
                        color: appTheme.colors?.textColor,
                      }}
                      className="text-[24px] "
                    >
                      This is a preview of the selected font.
                    </Text>
                  </View>
                }
              />
            </View>
            <ClickableBtn
              onPress={() => {
                handleSave();
              }}
              title="Save"
              className="left-4"
            />
            <View className=" h-[85px]"></View>
          </ScrollView>
        </View>
      </View>
    );
  }
};

export default ChangeAppTheme;

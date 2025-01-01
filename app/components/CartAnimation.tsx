import React from "react";
import { View, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const CartAnimation = () => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  const productStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  const animateToCart = () => {
    scale.value = withSequence(withSpring(1.2), withSpring(1), withSpring(0.8));
    translateY.value = withSpring(-100);
    translateX.value = withSpring(100);

    // Reset after animation
    setTimeout(() => {
      translateY.value = withTiming(0);
      translateX.value = withTiming(0);
      scale.value = withTiming(1);
    }, 1000);
  };

  return (
    <View className="flex-1 justify-center items-center">
      <View className="absolute top-4 right-4">
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Path
            d="M9 22a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm7 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-7-4h7V5H9v13zm0-15h7V2H9v1zM3 3h4v16H3V3z"
            fill="#000"
          />
        </Svg>
      </View>

      <Pressable onPress={animateToCart}>
        <Animated.View style={productStyle}>
          <View className="w-16 h-16 bg-blue-500 rounded-lg" />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default CartAnimation;

import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const Checkmark = () => {
  const strokeDashoffset = useSharedValue(100);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeDashoffset.value,
  }));

  useEffect(() => {}, []);
  strokeDashoffset.value = withTiming(0, { duration: 1000 });
  return (
    <View style={styles.container}>
      <Svg width={100} height={100} viewBox="0 0 24 24" fill="none">
        <AnimatedPath
          d="M5 13l4 4L19 7"
          stroke="green"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={100}
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Checkmark;

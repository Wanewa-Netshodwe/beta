import React, { useEffect, useState, useRef } from "react";
import { View, Animated } from "react-native";
import { useStates } from "../utilities/States";
import { useDynamicStyles } from "../utilities/Styles";

type Props = {
  title: string;
  letterDelay?: number;
  resetDelay?: number;
  gap?: number;
  size?: number;
  direction?: "flex-start" | "flex-end" | "center";
  textDirection?: "left" | "right";
};

const AnimatedText = ({
  title,
  letterDelay,
  resetDelay,
  direction,
  gap,
  size,
  textDirection,
}: Props) => {
  const styles = useDynamicStyles();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const fadeAnims = useRef<Animated.Value[]>([]);
  const words = title.split(" ");
  let letters = Array.from({ length: 1 }, () =>
    words.map((w) => w.split(""))
  ).flat(2);

  const animationTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fadeAnims.current = letters.map(() => new Animated.Value(0));
  }, [title]);

  const animateLetter = (index: number) => {
    if (index >= letters.length) {
      animationTimeout.current = setTimeout(() => {
        fadeAnims.current.forEach((anim) => anim.setValue(0));
        setCurrentIndex(-1);
      }, resetDelay || 700);
      return;
    }

    Animated.timing(fadeAnims.current[index], {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    animationTimeout.current = setTimeout(() => {
      setCurrentIndex(index + 1);
    }, letterDelay || 300);
  };

  useEffect(() => {
    if (currentIndex === -1) {
      animateLetter(currentIndex + 1);
    } else {
      animateLetter(currentIndex);
    }

    return () => {
      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
      }
    };
  }, [currentIndex]);

  return (
    <View
      style={{ gap: gap || 4, justifyContent: direction || "center" }}
      className="flex-row  flex-wrap "
    >
      {letters.map((letter, index) => (
        <Animated.Text
          key={`${index}-${letter}`}
          style={[
            {
              textAlign: textDirection || "auto",
              opacity: fadeAnims.current[index],
              fontSize: size || 16,
            },
            styles.text,
          ]}
        >
          {letter}
        </Animated.Text>
      ))}
    </View>
  );
};

export default AnimatedText;

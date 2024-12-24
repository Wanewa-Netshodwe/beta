import Toast from "react-native-toast-message";
export const errorMsg = (msg: string) => {
  Toast.show({
    type: "error",
    text1: msg,
  });
};
export const successMsg = (msg: string) => {
  Toast.show({
    type: "success",
    text1: msg,
  });
};
export const logErrors = (msg: string) => {
  switch (msg) {
    case "auth/invalid-email":
      Toast.show({
        type: "error",
        text1: "Invalid email address.",
      });
      break;
    case "auth/invalid-password":
      Toast.show({
        type: "error",
        text1: "Password requirements not met:",
        text2:
          "- At least 6 characters\n- At least 1 uppercase and 1 lowercase character\n- At least 1 digit and 1 special character",
      });
      break;
    default:
      "";
  }
};

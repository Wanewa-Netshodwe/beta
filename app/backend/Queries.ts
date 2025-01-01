import { errorMsg, logErrors } from "../errors/catchErrors";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "./db";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  addDoc,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import { convertTime } from "../utilities/convertTime";

import {
  getBusinessCategories,
  getCurrentUser,
  getUserBusiness,
  getValidCategoryLists,
  RootState,
} from "../redux/store";
import { NavigationProp, NavigationState } from "@react-navigation/native";
import { Dispatch, UnknownAction } from "redux";
import {
  BusRegData,
  category,
  product,
  sectionData,
  StackShopLayoutParamList,
  TabParamList,
} from "../utilities/Types";
import { useSelector } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { defaultUser, setUser } from "../redux/userSlice";
import {
  addProduct,
  addSection,
  delProduct,
  delSection,
  editProduct,
  setBusiness,
} from "../redux/businessSlice";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  addCat,
  addCategoryList,
  delCat,
  saveCategoryList,
} from "../redux/categoryList";

//Collection names
const USERCOLLECTION = "users";
const BUSINESSCOLLECTION = "business";
const PRODUCTSCOLLECTION = "products";
const WALLETCOLLECTION = "wallets";
const TRANSATIONSCOLLECTION = "transactions";

//-------------------------------------User Accounts Section-----------------------

//create a new user and add the user to the User Doc
export const BE_signup = (data: {
  username: string;
  email: string;
  fileName: string;
  image: string;
  password: string;
  phonenumber: string;
  navigation: Omit<
    NavigationProp<ReactNavigation.RootParamList>,
    "getState"
  > & {
    getState(): NavigationState | undefined;
  };
  dispatch: Dispatch<UnknownAction>;
}) => {
  const {
    username,
    email,
    fileName,
    image,
    password,
    phonenumber,
    navigation,
    dispatch,
  } = data;
  username && email && password
    ? createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const imageurl = await uploadImage(
            image,
            `images/${user.uid}`,
            fileName
          );
          const userinfo = await AddUserToCollection(
            user.uid,
            phonenumber,
            username,
            imageurl,
            password,
            email
          );
          const u = userinfo;
          console.log(u);
          dispatch(setUser(u));
          //   navigation.navigate("Dashboard");
          console.log("proccess done");
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log(error);
          const errorMessage = error.message;
          logErrors(errorCode);
        })
    : errorMsg("fields cann not be empty");
};

export const getUserInfo = async (id: string) => {
  const userRef = doc(db, USERCOLLECTION, id);
  const user = await getDoc(userRef);

  if (user.exists()) {
    return user.data();
  } else {
    errorMsg("User Not Found");
    return defaultUser;
  }
};

const uploadImage = async (uri: string, path: string, fileName: string) => {
  const storage = getStorage();
  const storageRef = ref(storage);
  const ImageRef = ref(storageRef, `${path}/${fileName}.png`);

  // 'file' comes from the Blob or File API
  const ur = await fetch(uri);
  const blob = await ur.blob();
  const snapshot = await uploadBytes(ImageRef, blob, { contentType: "image" });
  if (snapshot) console.log("file uplaoded");
  const imageUrl = await getDownloadURL(snapshot.ref);
  return imageUrl;
};
const AddUserToCollection = async (
  id: string,
  phoneNumber: string,
  username: string,
  imageUrl: string,
  password: string,
  email: string
) => {
  await setDoc(doc(db, USERCOLLECTION, id), {
    buyer_rating: 0,
    followers: [],
    following: [],
    has_business: false,
    has_wallet: false,
    id: id,
    isOnline: true,
    last_seen: serverTimestamp(),
    password: password,
    phonenumber: phoneNumber,
    profile_pic: imageUrl,
    store_id: "",
    email: email,
    username: username,
  });

  return getUserInfo(id);
};

//------------------------------------Business Accounts-----------------
export const BE_signup_Business = async (
  data: BusRegData,
  loading: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: Dispatch<UnknownAction>
) => {
  try {
    console.log("business called");
    console.log("kjjjj ", getCurrentUser());

    // Upload the image and get the URL
    let imageurl;
    loading(true);

    try {
      if (data.pic)
        imageurl = await uploadImage(
          data.pic,
          `images/${getCurrentUser().id}/business`,
          "BusinessLogo"
        );
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload business logo.");
    }

    // Add a new document with a generated id.
    let docRef;
    try {
      docRef = await addDoc(collection(db, BUSINESSCOLLECTION), {
        userId: getCurrentUser().id,
        verified: false,
        font: "",
        store_name: data.name,
        followers: [],
        following: [],
        sections: [],
        hasWallet: false,
        password: data.password,
        edit: true,
        wallet: "",
        offering: data.offering,
        store_pic: imageurl,
        dis_auth: false,
        location: data.location,
        seller_rating: 0.0,
        has_subscription: false,
        business_hours: data.business_hours,
        social_media_links: [],
      });
    } catch (error) {
      console.error("Error creating business document:", error);
      throw new Error("Failed to create business document.");
    }

    // Update the newly created business document with its id
    try {
      const BusinessRef = doc(db, BUSINESSCOLLECTION, docRef.id);
      await updateDoc(BusinessRef, { id: docRef.id });
    } catch (error) {
      console.error("Error updating business document with ID:", error);
      throw new Error("Failed to update business document with ID.");
    }

    // Update the user document with the business id
    try {
      const UserRef = doc(db, USERCOLLECTION, getCurrentUser().id);
      await updateDoc(UserRef, {
        has_business: true,
        businessid: docRef.id,
      });
    } catch (error) {
      console.error("Error updating user document:", error);
      throw new Error("Failed to update user document.");
    }
    const Businessref = doc(db, BUSINESSCOLLECTION, docRef.id);
    const business = await getDoc(Businessref);
    const busData = business.data();
    console.log("\n\n\n\n\n\nbusiness ddata: ", { ...busData });
    dispatch(setBusiness(busData));
    console.log("process done");
    loading(false);
    // navigation.navigate("Layout");
  } catch (error) {
    console.error("Error in BE_signup_Business:", error);
    throw error; // Re-throw the error to be handled by the caller if needed
  }
};
export const BE_addSection = (data: {
  navigator: StackNavigationProp<StackShopLayoutParamList>;
  loading: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: Dispatch<UnknownAction>;
  sectionInfo: sectionData;
}) => {
  const { loading, dispatch, sectionInfo, navigator } = data;
  console.log(sectionInfo);
  loading(true);
  dispatch(addSection(sectionInfo));
  loading(false);
  navigator.navigate("home");
};
export const BE_deleteSection = (data: {
  // loading: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: Dispatch<UnknownAction>;
  sectionInfo: sectionData;
}) => {
  const { dispatch, sectionInfo } = data;
  console.log("deetiing section", sectionInfo);

  dispatch(delSection(sectionInfo));
  console.log("done");
};
export const BE_addProduct = (data: {
  // loading: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: Dispatch<UnknownAction>;
  sectionInfo: product;
  navigator: BottomTabNavigationProp<TabParamList>;
  loading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { dispatch, sectionInfo, navigator, loading } = data;
  loading(true);
  console.log("add product called");
  dispatch(addProduct(sectionInfo));

  setTimeout(() => {
    loading(false);
    navigator.navigate("Layout");
  }, 7000);
};
export const BE_EditProduct = (data: {
  // loading: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: Dispatch<UnknownAction>;
  sectionInfo: product;
  navigator: StackNavigationProp<StackShopLayoutParamList>;
}) => {
  const { dispatch, sectionInfo, navigator } = data;
  console.log("add product called");
  dispatch(editProduct(sectionInfo));
  navigator.navigate("home");
};
export const BE_delProduct = (data: {
  // loading: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: Dispatch<UnknownAction>;
  sectionInfo: product;
  navigator: StackNavigationProp<StackShopLayoutParamList>;
}) => {
  const { dispatch, sectionInfo, navigator } = data;
  console.log("add product called");
  dispatch(delProduct(sectionInfo));
  navigator.navigate("home");
};
let uidg: string;
export const getUid = () => {
  return uidg;
};

export const BE_addCategory = (data: {
  // loading: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: Dispatch<UnknownAction>;
  sectionInfo: sectionData;
  id: string;
}) => {
  const uid = data.id;
  uidg = uid;
  console.log("add id : ", data.id);
  data.dispatch(addCategoryList(data.sectionInfo));
};
export const BE_addC = (data: category, dispatch: Dispatch<UnknownAction>) => {
  console.log("id to find is : ", data.id);
  dispatch(addCat(data));
};
export const BE_delC = (data: category, dispatch: Dispatch<UnknownAction>) => {
  console.log("id to find is : ", data.id);
  dispatch(delCat(data));
};

export const BE_saveCategory = (
  data: category,
  dispatch: Dispatch<UnknownAction>,
  name: String,
  postion: number,
  navigator: StackNavigationProp<RootStackParamList, "categoryList", undefined>
) => {
  const d = { id: data.id, name: name, postion: postion };
  dispatch(saveCategoryList(d));
  navigator.navigate("shopLayout");
  const existingCat = getBusinessCategories();
  const section = getValidCategoryLists();
  let validSections: sectionData[] = [];
  for (let i = 0; i < section.length; i++) {
    if (existingCat.includes(section[i])) {
    } else {
      validSections.push(section[i]);
    }
  }
  validSections.forEach((sec) => {
    dispatch(addSection(sec));
  });
};

export const getBusinessInfo = async (id: string) => {
  try {
    if (!id) {
      throw new Error("Business ID is required");
    }
    const BusinessRef = doc(db, BUSINESSCOLLECTION, id);
    const business = await getDoc(BusinessRef);
    if (business.exists()) {
      console.log("Business exists");
      const businessData = business.data();
      console.log(businessData);
      return businessData;
    } else {
      console.log("Business does not exist");
      return null;
    }
  } catch (error) {
    console.error("Error fetching business info:", error);
  }
};
const updateUserinfo = async ({
  id = "",
  username = "",
  img = "",
  isOnline = false,
  isOffline = false,
}) => {
  if (id) {
    const userRef = doc(db, USERCOLLECTION, id);
    await updateDoc(userRef, {
      ...(username && { username }),
      ...(img && { img }),
      ...(isOnline && { isOnline }),
      ...(isOffline && { isOnline: false }),
      last_seen: serverTimestamp(),
    });
  }
};
export const BE_login = (data: {
  password: string;
  email: string;
  dispatch: Dispatch<UnknownAction>;
}) => {
  console.log("logn called");
  const { password, email, dispatch } = data;
  if (!(email && password)) {
    errorMsg("Fields Can Not be Empty");
  } else {
    signInWithEmailAndPassword(auth, email, password).then(async ({ user }) => {
      await updateUserinfo({ id: user.uid, isOnline: true });
      const userinfo = await getUserInfo(user.uid);
      console.log(userinfo);
      dispatch(setUser(userinfo));

      if (userinfo.has_business) {
        console.log("has busniesss");
        const business = await getBusinessInfo(userinfo.businessid);
        console.log("business", business);
        dispatch(setBusiness(business));
      }
      console.log("done");
    });
    // .catch((err) => {
    //   console.log(err);
    //   catchError(err.code);
    // });
  }
};

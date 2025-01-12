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
  BusinessAccount,
  BusRegData,
  category,
  DiscountedProducts,
  product,
  sectionData,
  StackShopLayoutParamList,
  TabParamList,
  voucherProduct,
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
  setBusinesses,
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
export const createRandomId = () => {
  return Math.random().toString(36).substring(2, 27);
};

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

const uploadVideo = async (uri: string, path: string, fileName: string) => {
  const storage = getStorage();
  const storageRef = ref(storage);
  const ImageRef = ref(storageRef, `${path}/${fileName}.mp4`);

  const ur = await fetch(uri);
  const blob = await ur.blob();
  const snapshot = await uploadBytes(ImageRef, blob, { contentType: "video" });
  if (snapshot) console.log("video uplaoded");
  const videoUrl = await getDownloadURL(snapshot.ref);
  return videoUrl;
};

const uploadImage = async (uri: string, path: string, fileName: string) => {
  const storage = getStorage();
  const storageRef = ref(storage);
  const ImageRef = ref(storageRef, `${path}/${fileName}.png`);

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

    let docRef;
    try {
      docRef = await addDoc(collection(db, BUSINESSCOLLECTION), {
        userId: getCurrentUser().id,
        verified: false,
        store_name: data.name,
        followers: [],
        following: [],
        sections: [],
        offersDelivery: true,
        hasWallet: false,
        password: data.password,
        wallet: "",
        offering: data.offering,
        store_pic: imageurl,
        dis_auth: false,
        location: data.location,
        seller_rating: 0.0,
        has_subscription: false,
        business_hours: data.business_hours,
        social_media_links: [],
        foregroundImg: "",
        free_delivery_pro: 0,
      });
    } catch (error) {
      console.error("Error creating business document:", error);
      throw new Error("Failed to create business document.");
    }

    try {
      const BusinessRef = doc(db, BUSINESSCOLLECTION, docRef.id);
      await updateDoc(BusinessRef, { id: docRef.id });
    } catch (error) {
      console.error("Error updating business document with ID:", error);
      throw new Error("Failed to update business document with ID.");
    }

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
    throw error;
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
  navigator.popTo("home");
};
export const BE_updateBusiness = async (
  data: BusinessAccount,
  dispatch: Dispatch<UnknownAction>
) => {
  console.log("updating doc");
  const Businessref = doc(db, BUSINESSCOLLECTION, data.id);
  await updateDoc(Businessref, { ...data });
  console.log("done");
  dispatch(setBusiness(data));
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
  console.log("addding product called");
  setTimeout(() => {
    dispatch(addProduct(sectionInfo));
    loading(false);
    navigator.navigate("Layout");
  }, 6000);
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
  navigator.popTo("home");
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
  navigator: StackNavigationProp<
    StackShopLayoutParamList,
    "categoryList",
    undefined
  >
) => {
  const d = { id: data.id, name: name, postion: postion };
  dispatch(saveCategoryList(d));
  navigator.popTo("home");
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
    try {
      signInWithEmailAndPassword(auth, email, password).then(
        async ({ user }) => {
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
        }
      );
    } catch (err) {
      console.log(err);
    }
    // .catch((err) => {
    //   console.log(err);
    //   catchError(err.code);
    // });
  }
};
export const BE_getAllBusinesses = async (
  dispatch: Dispatch<UnknownAction>
) => {
  return new Promise(async (res, rej) => {
    let businesses: any = [];
    console.log("fetching businesses data");
    try {
      const querySnapshot = await getDocs(collection(db, BUSINESSCOLLECTION));
      if (querySnapshot) {
        console.log("found");
        querySnapshot.forEach((doc) => {
          businesses.push(doc.data());
        });
      }
      if (querySnapshot.empty) {
        console.log("no data found");
      }
      dispatch(setBusinesses(businesses));
      console.log("done");
      res(businesses);
    } catch (err) {
      console.log(err);
    }
  });
};
const UploadBusinessMedia = async (BusinessInfo: BusinessAccount) => {
  const { foregroundImg, sections } = BusinessInfo;

  let updatedBusinessInfo = { ...BusinessInfo };

  try {
    if (foregroundImg) {
      updatedBusinessInfo.foregroundImg = foregroundImg.includes(
        "firebasestorage"
      )
        ? await uploadImage(
            foregroundImg,
            `images/${getCurrentUser().id}/business`,
            `ForegroundImage`
          )
        : foregroundImg;
    }

    if (sections) {
      updatedBusinessInfo.sections = await Promise.all(
        sections.map(async (sec) => {
          let updatedSection = { ...sec };

          if (sec.type === "Banner" || sec.type === "Carousel") {
            if (sec.imgs) {
              updatedSection.imgs = await Promise.all(
                sec.imgs.map((img, index) =>
                  !img.includes("firebasestorage")
                    ? uploadImage(
                        img,
                        `images/${getCurrentUser().id}/business/${sec.name}`,
                        `${sec.name}${index + 1}`
                      )
                    : img
                )
              );
            }
          }

          if (sec.type === "Section" && sec.products) {
            updatedSection.products = await Promise.all(
              sec.products.map(async (pro) => {
                let updatedProduct = { ...pro };

                if (pro.imgs) {
                  updatedProduct.imgs = await Promise.all(
                    pro.imgs.map(async (img, index) => {
                      if (!img.includes("firebasestorage")) {
                        return await uploadImage(
                          img,
                          `images/${getCurrentUser().id}/business/${
                            sec.name
                          }/products/${pro.name}/`,
                          `${pro.name}${index + 1}`
                        );
                      } else {
                        return img;
                      }
                    })
                  );
                }
                if (pro.video) {
                  if (pro.video.type === "web") {
                  } else {
                    updatedProduct.video = updatedProduct.video || undefined;
                    const uploadResult = updatedProduct.video?.uri.includes(
                      "firebasestorage"
                    )
                      ? updatedProduct.video?.uri
                      : await uploadVideo(
                          pro.video.uri,
                          `videos/${getCurrentUser().id}/business/${
                            sec.name
                          }/products/${pro.name}/`,
                          `${pro.name}`
                        );

                    if (updatedProduct.video)
                      updatedProduct.video.uri = uploadResult;
                  }
                }

                return updatedProduct;
              })
            );
          }

          if (sec.type === "categories" && sec.categoryList?.categories) {
            updatedSection.categoryList = {
              ...sec.categoryList,
              categories: await Promise.all(
                sec.categoryList.categories.map(async (cat) => {
                  console.log(cat);
                  let updatedCategory = { ...cat };

                  if (cat.img) {
                    updatedCategory.img = !cat.img.includes("firebasestorage")
                      ? await uploadImage(
                          cat.img,
                          `images/${getCurrentUser().id}/business/${sec.name}/${
                            cat.name
                          }/`,
                          `${cat.name}$`
                        )
                      : cat.img;
                  }

                  return updatedCategory;
                })
              ),
            };
          }

          return updatedSection;
        })
      );
    }

    return updatedBusinessInfo;
  } catch (error) {
    console.error("Error uploading business media:", error);
    throw error;
  }
};
export const BE_PublishStore = async (
  BusinessInfo: BusinessAccount,
  discountedProducts: DiscountedProducts[],
  voucherProducts: voucherProduct[]
) => {
  console.log("called publish store");
  const { id } = BusinessInfo;
  const BusinessRef = doc(db, BUSINESSCOLLECTION, id);
  await UploadBusinessMedia(BusinessInfo).then(async (Bus: BusinessAccount) => {
    console.log("recived promise");
    console.log(Bus.sections);
    try {
      await updateDoc(BusinessRef, {
        ...Bus,
        discountedProducts: discountedProducts,
        voucherProducts: voucherProducts,
      });
    } catch (err) {
      console.log(err);
    }

    console.log("businesss Updated");
  });
};

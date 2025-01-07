export type RootTabParamList = {
  Business: undefined;
  UserPage: undefined;
};
export type TabParamList = {
  Layout: undefined;
  wallet: undefined;
  addProduct: undefined;
  settings: undefined;
};
export type StackShopLayoutParamList = {
  editProduct: { product: product };
  foregroundImg: undefined;
  searchModal: undefined;
  home: undefined;
  banner: undefined;
  section: undefined;
  carousel: undefined;
  categoryList: undefined;
  viewProduct: { product: product };
  category: { id: string };
};
export type StackStoreListParamList = {
  stores: undefined;
  viewStore: { business: BusinessAccount };
  viewProduct: { product: product };
};

export type StackSettingsParamList = {
  home: undefined;
  AppTheme: undefined;
  User: undefined;
  BusinessSetting: undefined;
};
export type Cart = {
  items: CartItem[];
};
export type CartItem = {
  id: string;
  business?: BusinessAccount;
  products: product[];
  userId?: string;
};
export type voucherProduct = {
  quantity: number;
  id: string;
  product: product;
  code: string;
  action: "Discount" | "Giveaway";
  discount?: number;
};
export type BusinessStatus = {
  id: string;
  businessID: string;
  media: string;
  uploadDate: Date;
};
export type DiscountedProducts = {
  store_id: string;
  product: product;
  discount: number;
  expDate?: {
    from?: string;
    to?: string;
  };
  price?: number;
  name: string;
};
export type BusinessAccount = {
  foregroundImg?: string;
  id: string;
  offering: string;
  location: {
    address: string;
    coord: {
      latitude: number;
      longtitude: number;
    };
  };
  business_hours: {
    opening: string;
    closing: string;
  };
  has_subscription: boolean;
  followers?: string[];
  following?: string[];
  wallet?: string;
  password: string;
  sections: sectionData[];
  seller_rating: number;
  social_media_links?: {
    facebook?: string;
    website?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  store_name: string;
  store_pic: string;
  userId: string;
  verified: boolean;
  dis_auth: false;
  offersDelivery?: boolean;
  free_delivery_pro?: number;
  discountedProducts?: DiscountedProducts[];
};
export type sectionData = {
  id?: string;
  style?: {
    font?: string;
    fontSize?: number;
  };
  type?: string;
  imgs?: string[];
  postion: number;
  name: string;
  layout?: string;
  valid?: boolean;
  categoryList?: categoryList;
  businessid?: string;
  products?: product[];
  height?: number;
  properties?: {
    carouselType?: string;
    carouselSpeed?: number;
  };
};
export type categoryList = {
  saved?: boolean;
  id?: string;
  categories?: category[];
};
export type category = {
  id?: string;
  name?: string;
  img?: string;
};
export type product = {
  id?: string;
  category?: string;
  rating?: number;
  reviews?: Review[];
  store_id?: string;
  descriptions?: string;
  name?: string;
  imgs?: string[];
  price?: number;
  quantity?: number;
  video?: {
    type: string;
    uri: string;
  };
  section?: string;
  free_delivery?: string;
  delivery_cost?: number;
  auction?: {
    started?: boolean;
    bidIncrement?: number;
    startPrice?: number;
    openingDate?: string;
    closingDate?: string;
    bidPrice?: number;
    bidWinner?: bid;
    bidders?: bid[];
  };
  product_info?: {
    property?: string;
    info?: string;
  }[];
};
export type personalAccount = {
  id: string;
  location?: {
    address: string;
    coord: {
      latitude: number;
      longtitude: number;
    };
  };
  buyer_rating: number;
  following: string[];
  followers: string[];
  has_wallet: boolean;
  has_business: boolean;
  isOnline: boolean;
  last_seen: Date;
  phonenumber: string;
  password: string;
  profile_pic: string;
  username: string;
  email: string;
  businessid: string;
};
export type AppTheme = {
  current_screen?: string;
  colors?: {
    background?: string;
    textColor?: string;
    primary?: string;
    secondary?: string;
    tertiary?: string;
    quaternary?: string;
    quaternarySup?: string;
  };
  fonts?: {
    primary: string;
  };
  appBackgroundImage?: string;
};
export type BusRegData = {
  name?: string;
  pic?: string;
  location?: {
    address: string;
    coord: {
      latitude: number;
      longtitude: number;
    };
  };
  offering?: string;
  password?: string;
  business_hours?: {
    opening: string;
    closing: string;
  };
};
export type Review = {
  userid?: number;
  name: string;
  rating: number;
  Title: string;
  date: Date;
  content: string;
  likes?: number;
};

export const reviews: Review[] = [
  {
    userid: 1,
    name: "John Doe",
    rating: 5,
    Title: "Amazing Console!",
    date: new Date("2023-01-15"),
    content:
      "The Xbox Series X is a game-changer. The graphics are stunning, and the load times are incredibly fast.",
    likes: 24,
  },
  {
    userid: 2,
    name: "Jane Smith",
    rating: 4,
    Title: "Great Performance",
    date: new Date("2023-02-20"),
    content:
      "I love the performance of the Series X. The backward compatibility is a great feature.",
    likes: 18,
  },
  {
    userid: 3,
    name: "Dave Brown",
    rating: 3,
    Title: "Good, but Pricey",
    date: new Date("2023-03-10"),
    content:
      "It’s a great console, but the price is a bit steep. Wish it was more affordable.",
    likes: 10,
  },
  {
    userid: 4,
    name: "Emily White",
    rating: 5,
    Title: "Next-Gen Experience",
    date: new Date("2023-04-05"),
    content:
      "The Series X offers a true next-gen experience. The quick resume feature is fantastic.",
    likes: 30,
  },
  {
    userid: 5,
    name: "Mike Green",
    rating: 4,
    Title: "Solid Console",
    date: new Date("2023-05-11"),
    content:
      "Solid performance and great game selection. Worth the investment.",
    likes: 12,
  },
  {
    userid: 6,
    name: "Laura Black",
    rating: 5,
    Title: "Best Console Ever",
    date: new Date("2023-06-07"),
    content:
      "Best console ever! Loving the 4K gaming experience and the speed.",
    likes: 27,
  },
  {
    userid: 7,
    name: "Paul Gold",
    rating: 3,
    Title: "Decent but Needs Improvements",
    date: new Date("2023-07-15"),
    content:
      "It’s decent but I had higher expectations. Needs more exclusive titles.",
    likes: 9,
  },
  {
    userid: 8,
    name: "Nina Silver",
    rating: 4,
    Title: "Impressed",
    date: new Date("2023-08-22"),
    content: "Impressed with the performance and speed. A bit bulky though.",
    likes: 14,
  },
  {
    userid: 9,
    name: "Sam Blue",
    rating: 5,
    Title: "Fantastic Console",
    date: new Date("2023-09-30"),
    content: "The Xbox Series X is fantastic. Games look and play great.",
    likes: 20,
  },
  {
    userid: 10,
    name: "Rachel Violet",
    rating: 4,
    Title: "Great But Expensive",
    date: new Date("2023-10-14"),
    content:
      "Great console but quite expensive. Still, the performance is top-notch.",
    likes: 16,
  },
  {
    userid: 11,
    name: "Tom Indigo",
    rating: 5,
    Title: "Superb Console",
    date: new Date("2023-11-05"),
    content: "Superb console! Loving the backward compatibility and speed.",
    likes: 22,
  },
  {
    userid: 12,
    name: "Olivia Amber",
    rating: 3,
    Title: "Okay, Not Great",
    date: new Date("2023-12-12"),
    content:
      "It’s okay, but I expected more exclusive games. Performance is good.",
    likes: 8,
  },
  {
    userid: 13,
    name: "Liam Crimson",
    rating: 4,
    Title: "Solid Gaming Experience",
    date: new Date("2024-01-19"),
    content: "Solid gaming experience. Wish it had more storage.",
    likes: 15,
  },
  {
    userid: 14,
    name: "Sophia Bronze",
    rating: 5,
    Title: "Love It!",
    date: new Date("2024-02-25"),
    content: "Absolutely love it! The graphics and speed are unbelievable.",
    likes: 25,
  },
  {
    userid: 15,
    name: "Lucas Jade",
    rating: 4,
    Title: "Good Console",
    date: new Date("2024-03-10"),
    content: "Good console. A bit pricey but worth it for the performance.",
    likes: 17,
  },
];
export type bid = {
  userId?: string;
  bid?: number;
  name?: string;
  img?: string;
};
export const bids: bid[] = [
  {
    userId: "user1",
    bid: 6700,
    name: "Alice",
    img: "https://example.com/img1.jpg",
  },
  {
    userId: "user2",
    bid: 6790,
    name: "Bob",
    img: "https://example.com/img2.jpg",
  },
  {
    userId: "user3",
    bid: 6880,
    name: "Charlie",
    img: "https://example.com/img3.jpg",
  },
  {
    userId: "user4",
    bid: 6970,
    name: "Diana",
    img: "https://example.com/img4.jpg",
  },
  {
    userId: "user5",
    bid: 7060,
    name: "Eve",
    img: "https://example.com/img5.jpg",
  },
  {
    userId: "user6",
    bid: 7150,
    name: "Frank",
    img: "https://example.com/img6.jpg",
  },
  {
    userId: "user7",
    bid: 7240,
    name: "Grace",
    img: "https://example.com/img7.jpg",
  },
];

// import React, { useState, useEffect } from "react";
// import { Link } from "expo-router";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import Rating from "../../components/Rating";
// import { useGetProductsQuery } from "@/hooks/productHooks";
// import NetInfo from "@react-native-community/netinfo";
// import AnimatedNoInternetBanner from "@/components/AnimatedNoInternetBanner";

// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   TextInput,
//   StatusBar,
//   ScrollView,
//   StyleSheet,
// } from "react-native";
// import { all } from "axios";

// export default function Index() {
//   const { data: products, isLoading, error } = useGetProductsQuery();
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [isConnected, setIsConnected] = useState(true);

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener((state) => {
//       setIsConnected(state.isConnected ?? true);
//     });

//     return () => unsubscribe();
//   }, []);
//   let filteredProducts = (products || []).filter(
//     (product) =>
//       product.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.category.toLowerCase().includes(searchQuery.toLowerCase())
//   );
//   if (searchQuery.toLowerCase().trim() === "all") {
//     filteredProducts = products || [];
//   }
//   let prodCategories = [
//     "All",
//     "Food",
//     "Fashion",
//     "Shoes",
//     "Accesories",
//     "Bag",
//     "Books & stationery",
//     "Electronics",
//   ];
//   useEffect(() => {
//     products?.forEach((product) => {
//       if (!prodCategories.includes(product.category)) {
//         prodCategories.push(product.category);
//       }
//     });
//     console.log(products);
//   }, []);

//   return (
//     <View style={{ flex: 1 }}>
//       <StatusBar barStyle="light-content" backgroundColor="blue" />

//       {!isConnected && (
//         <>
//           <AnimatedNoInternetBanner visible={!isConnected} />
//           <View
//             style={{
//               flex: 1,
//               justifyContent: "center",
//               alignItems: "center",
//               backgroundColor: "#fff",
//             }}
//           >
//             <ActivityIndicator size="large" color="#FFA500" />
//           </View>
//         </>
//       )}

//       {isConnected && isLoading ? (
//         <ActivityIndicator
//           size="large"
//           color="#0000ff"
//           style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
//         />
//       ) : isConnected && error ? (
//         <View
//           style={{
//             flex: 1,
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <Text>Error fetching data</Text>
//         </View>
//       ) : isConnected ? (
//         <View style={{ flex: 1 }}>
//           {/* search bar */}
//           <View
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "space-between",
//               marginBottom: 10,
//               padding: 10,
//               position: "relative",
//             }}
//           >
//             <TextInput
//               style={{
//                 backgroundColor: "white",
//                 borderWidth: 1,
//                 borderColor: "black",
//                 width: "100%",
//                 height: 40,
//                 borderRadius: 18,
//                 paddingLeft: 30,
//               }}
//               placeholder="Search Temi"
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//             <View
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: 8,
//                 position: "absolute",
//                 right: 12,
//                 top: 12,
//                 zIndex: 1,
//               }}
//             >
//               <Ionicons name={"camera"} size={30} color={"gray"} outline />
//               <View
//                 style={{
//                   backgroundColor: "black",
//                   borderRadius: 18,
//                   paddingVertical: 6,
//                   paddingHorizontal: 10,
//                 }}
//               >
//                 <Ionicons name={"search"} size={22} color={"white"} />
//               </View>
//             </View>
//           </View>
//           {/* search bar ends */}
//           {/* category list */}

//           <ScrollView
//             horizontal={true}
//             showsHorizontalScrollIndicator={false}
//             style={styles.menuContainer}
//           >
//             {prodCategories.map((category, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.menuItem}
//                 onPress={() => setSearchQuery(category)}
//               >
//                 <Text style={styles.menuText}>{category}</Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>

//           {/* category list ends */}

//           {/* Product Grid */}
//           {filteredProducts.length > 0 ? (
//             <FlatList
//               data={filteredProducts}
//               style={{ padding: 10 }}
//               numColumns={2}
//               keyExtractor={(item) => item._id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={{
//                     flex: 1,
//                     margin: 5,
//                     backgroundColor: "#fff",
//                     borderRadius: 10,
//                     padding: 10,
//                     shadowColor: "#000",
//                     shadowOpacity: 0.1,
//                     shadowOffset: { width: 0, height: 2 },
//                     elevation: 3,
//                   }}
//                 >
//                   <Link
//                     href={{
//                       pathname: "/productdetailscreen",
//                       params: { slug: `${item.slug}` },
//                     }}
//                   >
//                     <View>
//                       <Image
//                         source={{ uri: item.image }}
//                         style={{ width: 150, height: 150, borderRadius: 10 }}
//                         resizeMode="contain"
//                       />
//                     </View>

//                     <Text style={{ fontWeight: "bold", marginTop: 5 }}>
//                       {item.name}
//                     </Text>
//                     <Rating rating={item.rating} numReviews={item.numReviews} />
//                     <Text>${item.price}</Text>
//                   </Link>
//                 </TouchableOpacity>
//               )}
//             />
//           ) : (
//             <Text
//               style={{
//                 justifyContent: "center",
//                 alignItems: "center",
//                 textAlign: "center",
//                 color: "gray",
//               }}
//             >
//               No products
//             </Text>
//           )}
//         </View>
//       ) : null}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   menuContainer: {
//     height: 50,
//     backgroundColor: "#f0f0f0",
//     marginBottom: 10,
//     gap: 20,
//   },
//   menuItem: {
//     width: 100,
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   menuText: {
//     fontSize: 16,
//     color: "gray",
//     fontWeight: "bold",
//   },
// });

import React, { useState, useEffect, useRef, useContext } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";

import { useGetProductsQuery } from "@/hooks/productHooks";
import NetInfo from "@react-native-community/netinfo";
import AnimatedNoInternetBanner from "@/components/AnimatedNoInternetBanner";
import Banner from "@/components/Banner";

import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import FadeInView from "@/components/FadeIn";
import Twirl from "@/components/Twirl";
import GreenBoxAnimationApp from "@/components/GiftBox";
import GiftsBanner from "@/components/GiftsBanner";
import GiftWaveBanner from "@/components/GiftWaveBanner";
import ProductCard from "../../components/ProductCard";
import { Store } from "@/Store";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { Product } from "@/types/Product";

type Action =
  | { type: "REFRESH_PRODUCT"; payload: Product }
  | { type: "CREATE_REQUEST" }
  | { type: "CREATE_SUCCESS" }
  | { type: "CREATE_FAIL"; payload: string };

const reducer = (state: any, action: Action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    default:
      return state;
  }
};

export default function Index() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const router = useRouter();

  const { data: products, isLoading, error } = useGetProductsQuery();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isConnected, setIsConnected] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);

  let filteredProducts = (products || []).filter(
    (product) =>
      product.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (searchQuery.toLowerCase().trim() === "all") {
    filteredProducts = products || [];
  }

  const handleAddToCart = (product: Product) => {
    const existItem = cart.cartItems.find((x) => x._id === product?._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock < quantity) {
      Alert.alert("Product out of stock!", "Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    router.navigate("/cart");
  };

  // Automatically populate unique categories
  const prodCategories = Array.from(
    new Set(["All", ...(products?.map((product) => product.category) || [])])
  );

  return (
    <View style={{ flex: 1 }}>
      {!isConnected && (
        <>
          <AnimatedNoInternetBanner visible={!isConnected} />
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <ActivityIndicator size="large" color="#FFA500" />
          </View>
        </>
      )}

      {isConnected && isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        />
      ) : isConnected && error ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Error fetching data</Text>
        </View>
      ) : isConnected ? (
        <View style={{ flex: 1 }}>
          {/* Search bar */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,

              padding: 10,

              position: "relative",
            }}
          >
            <TextInput
              style={{
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "black",
                width: "100%",
                height: 40,
                borderRadius: 18,
                paddingLeft: 30,
              }}
              placeholder="Search Temi"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                position: "absolute",
                right: 12,
                top: 12,
                zIndex: 1,
              }}
            >
              <Ionicons
                name={"camera-outline"}
                size={30}
                color={"gray"}
                outline
              />
              <View
                style={{
                  backgroundColor: "black",
                  borderRadius: 18,
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                }}
              >
                <Ionicons name={"search"} size={22} color={"white"} />
              </View>
            </View>
          </View>
          {/* Search bar ends */}

          {/* Category list */}
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.menuContainer}
          >
            {prodCategories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  //selectedCategory === category && styles.selectedMenuItem,// Applied when we switch to highlighting selected category by changing the background color
                ]}
                onPress={() => {
                  setSearchQuery(category);
                  setSelectedCategory(category);
                }}
              >
                <View
                  style={
                    selectedCategory === category && styles.selectedMenuItem // This view is removed if we switch to hightlighting the selected category by changing the background color
                  }
                >
                  <Text
                    style={[
                      styles.menuText,
                      selectedCategory === category && styles.selectedMenuText,
                    ]}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Category list ends */}
          <Banner />

          {/* <Twirl /> */}

          {/* <GreenBoxAnimationApp /> */}

          {/* <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 40,
            }}
          >
            <FadeInView
              style={{
                width: 250,
                height: 50,
                backgroundColor: "powderblue",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 28 }}>Welcome</Text>
            </FadeInView>
          </View> */}

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              // style={{ padding: 10 }}
              numColumns={2}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <ProductCard item={item} onAddToCart={handleAddToCart} />
              )}
            />
          ) : (
            <Text
              style={{
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                color: "gray",
              }}
            >
              No products
            </Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    height: 50,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  menuItem: {
    width: 100,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  selectedMenuItem: {
    //backgroundColor: "#FF9900", // Highlight color #007BFF"
    //borderRadius: 10, // Highlight border radius
    borderBottomColor: "gray", // Color of the underline
    borderBottomWidth: 4, // Thickness of the underline
    paddingBottom: 2, // Spacing between text and underline
  },

  menuText: {
    fontSize: 16,
    color: "gray",
    fontWeight: "bold",
  },
  selectedMenuText: {
    //color: "white", // Text color when selected
    fontWeight: "bold",
    //textDecorationLine: "underline",
  },
});

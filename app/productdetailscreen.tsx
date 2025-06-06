import React, {
  useEffect,
  useState,
  useContext,
  useReducer,
  useMemo,
} from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  StyleSheet,
} from "react-native";

import axios from "axios";
import { Product } from "./types/Product";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Store } from "@/Store";
import Rating from "@/components/Rating";
import { Picker } from "@react-native-picker/picker";

//import SelectDropdown from "react-native-select-dropdown";
import { useGetProductDetailsBySlugQuery } from "@/hooks/productHooks";

//import Ionicons from "@expo/vector-icons/Ionicons";
import { ApiError } from "./types/ApiError";
import { getError } from "../utils";
//import CustomModal from "@/components/CustomModal";
import ReviewFormModal from "@/components/CustomModal";

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

type ProductDetailRouteProp = RouteProp<
  { ProductDetail: { productId: string } },
  "ProductDetail"
>;

export default function ProductDetailScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [currentUserExistingReview, setCurrentUserExistingReview] = useState<{
    title?: string | undefined;
    comment?: string | undefined;
    rating?: number | undefined;
  }>({});

  type ReviewProp = {
    title: string | undefined;
    rating: number | undefined;
    comment: string | undefined;
  };

  //const route = useRoute<ProductDetailRouteProp>();

  const { slug } = useLocalSearchParams();

  //const { slug  } = route.params;
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug as string);

  const router = useRouter();
  const [{ loadingCreateReview }, dispatch] = useReducer(reducer, {
    product: {} as Product,
    loading: true,
    error: "",
  });

  useEffect(() => {
    if (product?.reviews && userInfo?.name) {
      const currentUserReview = product.reviews.find(
        (review) => review.name === userInfo.name
      );

      if (currentUserReview) {
        const { title, comment, rating } = currentUserReview;
        setCurrentUserExistingReview({ title, comment, rating });
      } else {
        setCurrentUserExistingReview({});
      }
    }
    console.log("Current user data", currentUserExistingReview);
  }, [product?.reviews, userInfo]);

  useEffect(() => {
    if (product?.reviews?.length) {
      const avg =
        product.reviews.reduce((a, b) => a + b.rating, 0) /
        product.reviews.length;
      product.rating = avg;
    }
  }, [product?.reviews]);

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      />
    );
  }

  if (!product) {
    return (
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        Product not found!
      </Text>
    );
  }

  const addToCartHandler = async () => {
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

  const submit = async ({
    title,
    comment,
    rating,
  }: {
    title: string;
    comment: string;
    rating: string | number;
  }) => {
    if (!title || !comment || !rating) {
      console.log("Review at details page", { title, comment, rating });
      Alert.alert("Blank Field(s)", "Please fill in all the fields");
      return;
    }
    try {
      const { data } = await axios.post(
        `https://temimartapi.onrender.com/api/products/${product._id}/reviews`,
        { rating, title, comment, name: userInfo!.name },
        {
          headers: { Authorization: `Bearer ${userInfo!.token}` },
        }
      );

      if (data.review in product.reviews) {
        const rem = product.reviews.splice(
          product.reviews.indexOf(data.review),
          1
        );
        console.log("Removed Review:", rem);
      }

      dispatch({ type: "CREATE_SUCCESS" });

      if (!product.reviews) product.reviews = [];
      console.log("New Review:", data.review);

      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;

      Alert.alert("Success", "Review submitted successfully");

      dispatch({ type: "REFRESH_PRODUCT", payload: product });
      // Assuming each review has a createdAt property of type string or Date
      product.reviews.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // descending: most recent first
      });
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert("Not allowed!", getError(err));
        dispatch({ type: "CREATE_FAIL", payload: getError(err) });
      }
    }
  };

  return isLoading ? (
    <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />
  ) : error ? (
    // <View>{getError(error as ApiError)}</View>
    <View style={{ padding: 20 }}>
      <Text style={{ color: "red", fontSize: 16 }}>
        {getError(error as ApiError)}
      </Text>
    </View>
  ) : !product ? (
    <View>
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        Product Not Found!
      </Text>
    </View>
  ) : (
    <ScrollView style={{ flex: 1, padding: 15, backgroundColor: "#fff" }}>
      <Image
        source={{ uri: product.image }}
        style={{ width: "100%", height: 300, borderRadius: 10 }}
      />

      {/* Product Details */}
      <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 10 }}>
        {product.name}
      </Text>
      <Text style={{ fontSize: 20, color: "green" }}>$ {product.price}</Text>
      <Text style={{ fontSize: 18, marginVertical: 10 }}>
        {product.description}
      </Text>

      {/* Stock and Add to Cart */}
      {product.countInStock > 0 ? (
        <TouchableOpacity
          style={{
            backgroundColor: "#ff9900",
            padding: 15,
            borderRadius: 5,
            alignItems: "center",
          }}
          onPress={addToCartHandler}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
            Add to Cart
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={{ color: "red", fontWeight: "bold" }}>Out of Stock</Text>
      )}
      <View>
        {userInfo ? (
          <View>
            <ReviewFormModal
              onSubmitReview={submit}
              review={currentUserExistingReview}
            />
          </View>
        ) : (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: 25,
            }}
          >
            <Text
              style={{
                color: "blue",
                textDecorationLine: "underline",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              <Link href="/signin">Sign in </Link>
            </Text>
            <Text
              style={{
                fontSize: 18,
              }}
            >
              to leave a review
            </Text>
          </View>
        )}
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 10 }}>
          Reviews
        </Text>

        <View style={{ marginBottom: 10 }}>
          {product.reviews.length === 0 && (
            <Text style={{ fontStyle: "italic", color: "gray" }}>
              No reviews yet. Be the first to leave one!
            </Text>
          )}
        </View>

        <View>
          {product.reviews.length > 5
            ? product.reviews
                .sort((a, b) => {
                  const dateA = new Date(a.createdAt).getTime();
                  const dateB = new Date(b.createdAt).getTime();
                  return dateB - dateA; // descending: most recent first
                })
                .slice(0, 5)
                .map((item) => (
                  // <View
                  //   key={item._id}
                  //   style={{
                  //     borderColor: "gray",
                  //     borderWidth: 1,
                  //     borderRadius: 10,
                  //     paddingVertical: 6,
                  //     paddingHorizontal: 10,
                  //     marginBottom: 10,
                  //   }}
                  // >
                  //   <Text
                  //     style={{
                  //       fontSize: 16,
                  //       fontWeight: "bold",
                  //       marginVertical: 10,
                  //     }}
                  //   >
                  //     {item.name}
                  //   </Text>
                  //   <Text>
                  //     <Rating rating={item.rating} caption=" "></Rating>
                  //   </Text>
                  //   {item.title && <Text>{item.title}</Text>}
                  //   <Text>{item.createdAt.substring(0, 10)}</Text>
                  //   <Text>{item.comment}</Text>
                  // </View>
                  <View
                    key={item._id}
                    style={{
                      borderColor: "gray",
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      marginBottom: 10,
                    }}
                  >
                    {userInfo?.profileImage ? (
                      <Image
                        source={{ uri: userInfo.profileImage }}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          marginRight: 10,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: "#318CE7",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 10,
                        }}
                      >
                        <Text style={{ color: "white", fontWeight: "bold" }}>
                          {item.name[0]}
                        </Text>
                      </View>
                    )}
                    <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                    <Text>
                      <Rating rating={item.rating} caption=" "></Rating>
                    </Text>
                    <Text>{item.createdAt.substring(0, 10)}</Text>
                    {item.title && <Text>{item.title}</Text>}
                    <Text>{item.comment}</Text>
                  </View>
                ))
            : product.reviews
                .sort((a, b) => {
                  const dateA = new Date(a.createdAt).getTime();
                  const dateB = new Date(b.createdAt).getTime();
                  return dateB - dateA; // descending: most recent first
                })
                ?.map((item) => (
                  // <View
                  //   key={item._id}
                  //   style={{
                  //     borderColor: "gray",
                  //     borderWidth: 1,
                  //     borderRadius: 10,
                  //     paddingVertical: 6,
                  //     paddingHorizontal: 10,
                  //     marginBottom: 10,
                  //   }}
                  // >
                  //   <Text
                  //     style={{
                  //       fontSize: 16,
                  //       fontWeight: "bold",
                  //       marginVertical: 10,
                  //     }}
                  //   >
                  //     {item.name}
                  //   </Text>
                  //   <Text>
                  //     <Rating rating={item.rating} caption=" "></Rating>
                  //   </Text>
                  //   <Text>{item.createdAt.substring(0, 10)}</Text>
                  //   {item.title && <Text>{item.title}</Text>}
                  //   <Text>{item.comment}</Text>
                  // </View>
                  <View
                    key={item._id}
                    style={{
                      borderColor: "gray",
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      marginBottom: 10,
                    }}
                  >
                    {userInfo?.profileImage ? (
                      <Image
                        source={{ uri: userInfo?.profileImage }}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          marginRight: 10,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: "#318CE7",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 10,
                        }}
                      >
                        <Text style={{ color: "white", fontWeight: "bold" }}>
                          {item.name[0]}
                        </Text>
                      </View>
                    )}
                    <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                    <Text>
                      <Rating rating={item.rating} caption=" "></Rating>
                    </Text>
                    <Text>{item.createdAt.substring(0, 10)}</Text>
                    {item.title && <Text>{item.title}</Text>}
                    <Text>{item.comment}</Text>
                  </View>
                ))}
          {product.reviews.length > 5 && (
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: "#ff9900",
                  padding: 15,
                  borderRadius: 5,
                  alignItems: "center",
                }}
                onPress={() => router.navigate(`/reviews/${product._id}`)}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  More Reviews
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 3,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "green",
    width: "45%",
    borderRadius: 12,
    padding: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  cancelButton: {
    backgroundColor: "red",
    width: "45%",
    borderRadius: 12,
    padding: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});

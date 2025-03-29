import React, { useEffect, useState, useContext, useReducer } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";

import axios from "axios";
import { Product } from "./types/Product";
import { Link, useRouter } from "expo-router";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Store } from "@/Store";
import styles from "@/constants/styles";
import { getError } from "../utils";
import ReviewFormat from "@/components/ReviewFormat";
import SelectDropdown from "react-native-select-dropdown";
import { useGetProductDetailsBySlugQuery } from "@/hooks/productHooks";

import Ionicons from "@expo/vector-icons/Ionicons";
import { ApiError } from "./types/ApiError";

type Action =
  | { type: "REFRESH_PRODUCT"; payload: Product }
  | { type: "CREATE_REQUEST" }
  | { type: "CREATE_SUCCESS" }
  | { type: "CREATE_FAIL"; payload: string };

const reducer = (state, action: Action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    // case "CREATE_REQUEST":
    //   return { ...state, loadingCreateReview: true };
    // case "CREATE_SUCCESS":
    //   return { ...state, loadingCreateReview: false };
    // case "CREATE_FAIL":
    //   return { ...state, loadingCreateReview: false };
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

  const route = useRoute<ProductDetailRouteProp>();

  let updatedProduct;
  //const { slug: slug } = useLocalSearchParams();
  useEffect(() => {
    dispatch({ type: "REFRESH_PRODUCT", payload: updatedProduct });
  }, [updatedProduct]);
  const { slug } = route.params;
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug);

  const router = useRouter();

  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const data = [
    { title: "1 - Poor" },
    { title: "2 - Fair" },
    { title: "3 - Good" },
    { title: "4 - Very Good" },
    { title: "5 - Excellent" },
  ];

  const [{ loadingCreateReview }, dispatch] = useReducer(reducer, {
    product: {} as Product,
    loading: true,
    error: "",
  });
  // const initialState: State = {
  //   isLoading: false,
  //   error: null,
  // };

  // const [state, dispatch] = useReducer(reducer, initialState);

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ marginTop: 50 }}
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

  const submit = async () => {
    if (!comment || !rating) {
      Alert.alert("Blank Field(s)", "Please enter comment and rating");
      return;
    }
    try {
      const { data } = await axios.post(
        `https://temimartapi.onrender.com/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo!.name },
        {
          headers: { Authorization: `Bearer ${userInfo!.token}` },
        }
      );

      dispatch({
        type: "CREATE_SUCCESS",
      });
      if (!product.reviews) product.reviews = [];
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      console.log(data.review._id);
      Alert.alert("Success", "Review submitted successfully");

      dispatch({ type: "REFRESH_PRODUCT", payload: product });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        Alert.alert("Not allowed!", getError(err));
        dispatch({ type: "CREATE_FAIL" });
      }
    }
  };

  return isLoading ? (
    <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />
  ) : error ? (
    <View>{getError(error as ApiError)}</View>
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
        <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 10 }}>
          Reviews
        </Text>

        <View style={{ marginBottom: 10 }}>
          {product.reviews.length === 0 && <Text>There is no review</Text>}
        </View>

        <View>
          {product.reviews.length > 5
            ? product.reviews
                .slice(0, 5)
                .map((item) => (
                  <ReviewFormat key={item._id} item={item} product={product} />
                ))
            : product.reviews?.map((item) => (
                <ReviewFormat key={item._id} item={item} product={product} />
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

        <View>
          {userInfo ? (
            <View
              style={{
                marginVertical: 20,
                borderWidth: 2,
                borderColor: "gray",
                padding: 12,
                borderRadius: 10,
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "bold", marginVertical: 10 }}
              >
                Leave a customer review
              </Text>
              <Text style={styles.title}>Rating</Text>
              <SelectDropdown
                data={data}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                  setRating(index + 1);
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {(selectedItem && selectedItem.title) ||
                          "Select a Rating"}
                      </Text>

                      {isOpened ? (
                        <Ionicons
                          name={"chevron-up"}
                          color={"#ffc000"}
                          size={24}
                          style={styles.dropdownButtonArrowStyle}
                        />
                      ) : (
                        <Ionicons
                          name={"chevron-down"}
                          size={24}
                          style={styles.dropdownButtonArrowStyle}
                        />
                      )}
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View
                      style={{
                        ...styles.dropdownItemStyle,
                        ...(isSelected && { backgroundColor: "#D2D9DF" }),
                      }}
                    >
                      <Text style={styles.dropdownItemTxtStyle}>
                        {item.title}
                      </Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />
              <Text style={styles.title}>Comment</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={3}
                value={comment}
                placeholder="Comment"
                onChangeText={setComment}
              />

              <TouchableOpacity
                style={{
                  backgroundColor: "#ff9900",
                  padding: 15,
                  borderRadius: 5,
                  alignItems: "center",
                }}
                onPress={submit}
                disabled={loadingCreateReview}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                >
                  Submit
                </Text>
              </TouchableOpacity>

              {loadingCreateReview && (
                <>
                  <Text>...loading</Text>
                  <ActivityIndicator size="large" color="#0000ff" />
                </>
              )}
            </View>
          ) : (
            <Text style={{ marginBottom: 15 }}>
              <Link href="/signin">Sign in to leave a review</Link>
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

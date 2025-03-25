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
  Button,
  StyleSheet,
} from "react-native";
import Rating from "../components/Rating";
import axios from "axios";
import { Product } from "./types/Product";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Store } from "@/Store";
import styles from "@/constants/styles";
import { getError } from "../utils";

import SelectDropdown from "react-native-select-dropdown";
import { useGetProductDetailsBySlugQuery } from "@/hooks/productHooks";
import { useEditReviewMutation } from "@/hooks/reviewHooks";
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
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
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
  const [isEdit, setIsEdit] = useState(false);
  const route = useRoute<ProductDetailRouteProp>();
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewId, setReviewId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(1);
  const [forceRender, setForceRender] = useState(false);
  const [showIcons, setShowIcons] = useState(true);

  //const { slug: slug } = useLocalSearchParams();
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

  const handleEdit = (review) => {
    setSelectedReview(review);
    setReviewId(review._id);
    console.log(review._id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const saveEdit = async () => {
    try {
      console.log({
        rating: editRating,
        comment: editComment,
        name: userInfo?.name,
        prodId: product._id,
        revId: reviewId,
      });
      const { data } = await axios.put(
        `https://temimartapi.onrender.com/api/products/${product._id}/reviews/${reviewId}`,

        { rating: editRating, comment: editComment, name: userInfo?.name },
        { headers: { Authorization: `Bearer ${userInfo!.token}` } }
      );

      Alert.alert("Success", "Review updated successfully");
      // dispatch({ type: "REFRESH_PRODUCT", payload: data.product });
      // Instead of just dispatching, manually refetch the product
      const { data: updatedProduct } = await axios.get(
        `https://temimartapi.onrender.com/api/products/${product._id}`
      );

      dispatch({ type: "REFRESH_PRODUCT", payload: updatedProduct });
      // Force re-render
      setForceRender((prev) => !prev);
      setSelectedReview(null); // Exit edit mode
    } catch (err) {
      Alert.alert("Error!", getError(err));
    }
  };

  // const handleEdit = () => {
  //   Alert.alert("Edit Review", "Edit Functionality to be implemented soon!");
  // };

  const handleDelete = async (reviewId: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await axios.delete(
                `https://temimartapi.onrender.com/api/products/${product._id}/reviews/${reviewId}`,
                { headers: { Authorization: `Bearer ${userInfo!.token}` } }
              );

              Alert.alert("Deleted", "Review deleted successfully");
              dispatch({ type: "REFRESH_PRODUCT", payload: product });
            } catch (err) {
              Alert.alert("Error", getError(err));
            }
          },
        },
      ]
    );
  };

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
          {product.reviews?.map((item) => (
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
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginVertical: 10 }}
              >
                {item.name}
              </Text>
              <Text>
                <Rating rating={item.rating} caption=" "></Rating>
              </Text>
              <Text>{item.createdAt.substring(0, 10)}</Text>
              <Text>{item.comment}</Text>
              {userInfo?.name === item.name && (
                <View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Ionicons
                      name={"pencil"}
                      size={24}
                      onPress={(e) => handleEdit(item)}
                      //onPress={(e) => selectElement(e, item)}
                    />
                    <Ionicons
                      name={"trash"}
                      size={24}
                      onPress={(e) => handleDelete(item._id)}
                    />
                  </View>
                  {/* Start Edit Form */}
                  {selectedReview && (
                    <View
                      style={{
                        marginTop: 50,
                        borderWidth: 2,
                        borderColor: "gray",
                        padding: 12,
                        borderRadius: 10,
                      }}
                    >
                      <Text style={{ textAlign: "center", fontSize: 20 }}>
                        Edit Your Review
                      </Text>
                      <Text style={styles.title}>Rating</Text>
                      <SelectDropdown
                        data={data}
                        onSelect={(selectedItem, index) => {
                          console.log(selectedItem, index);
                          setEditRating(index + 1);
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
                                ...(isSelected && {
                                  backgroundColor: "#D2D9DF",
                                }),
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
                      <TextInput
                        value={editComment}
                        onChangeText={setEditComment}
                        style={{
                          borderColor: "gray",
                          borderWidth: 2,
                          padding: 10,
                          marginVertical: 8,
                        }}
                      />
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <TouchableOpacity
                          style={stylez.saveButton}
                          onPress={saveEdit}
                        >
                          <Text style={{ color: "white", fontWeight: "700" }}>
                            Save
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={stylez.cancelButton}
                          onPress={() => setSelectedReview(null)}
                        >
                          <Text style={{ color: "white", fontWeight: "700" }}>
                            Cancel
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  {/* End Edit Form */}
                </View>
              )}
            </View>
          ))}
        </View>

        <View>
          {userInfo ? (
            <View style={styles.container}>
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
              <Button
                disabled={loadingCreateReview}
                title="Submit"
                onPress={submit}
              />
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

const stylez = StyleSheet.create({
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
});

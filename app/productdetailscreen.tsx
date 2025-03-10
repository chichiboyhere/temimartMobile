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
} from "react-native";
import Rating from "../components/Rating";
import axios from "axios";
import { Link, useRouter } from "expo-router";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Store } from "@/Store";
import styles from "@/constants/styles";
import { getError } from "../utils";
import SelectList from "react-native-dropdown-select-list";
import SelectDropdown from "react-native-select-dropdown";

import Ionicons from "@expo/vector-icons/Ionicons";

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
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
  const navigation = useNavigation();
  const { slug } = route.params;

  const router = useRouter();
  //const { addToCart } = useContext(CartContext);

  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  //const [product, setProduct] = useState<any>(null);
  // const [loading, setLoading] = useState(true);
  // const [loadingCreateReview, setLoadingCreateReview] = useState(false);

  const data = [
    { title: "1 - Poor" },
    { title: "2 - Fair" },
    { title: "3 - Good" },
    { title: "4 - Very Good" },
    { title: "5 - Excellent" },
  ];

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchProduct = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(
          `https://temimartapi.onrender.com/api/products/slug/${slug}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        // setProduct(data);
      } catch (error) {
        // console.error("Error fetching product:", error);
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
        // } finally {
        //setLoading(false);
        // }
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
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
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `https://temimartapi.onrender.com/api/products/${product._id}`
    );
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    router.navigate("/cart");
  };

  const submit = async () => {
    //setLoadingCreateReview(true);
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

      //setLoadingCreateReview(false);
      dispatch({
        type: "CREATE_SUCCESS",
      });
      Alert.alert("Success", "Review submitted successfully");
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: "REFRESH_PRODUCT", payload: product });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        dispatch({ type: "CREATE_FAIL" });
        //setLoadingCreateReview(false);
      }
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 15, backgroundColor: "#fff" }}>
      {/* Product Image */}
      {error && <Text>{error}</Text>}
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
          {product.reviews.map((item) => (
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

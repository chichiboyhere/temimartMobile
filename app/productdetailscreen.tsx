import React, {
  useEffect,
  useState,
  useContext,
  useReducer,
  useRef,
} from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
  StyleSheet,
} from "react-native";
import { Badge } from "react-native-elements";

// For audio and vibration feedback when items are added to cart
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

import axios from "axios";

import { Product } from "@/app/types/Product";

import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { RouteProp } from "@react-navigation/native";
import { Store } from "@/Store";
import Rating from "@/components/Rating";
import { Ionicons } from "@expo/vector-icons";
import { useGetProductsQuery } from "@/app/hooks/productHooks";
import { useGetProductDetailsBySlugQuery } from "@/app/hooks/productHooks";
import { ApiError } from "@/app/types/ApiError";
import { getError } from "../utils";
import CountdownTimer from "@/components/CountdownTimer";
import ProductCard from "@/components/ProductCard";
import ReviewFormModal from "@/components/ReviewFormModal";
import { format, addDays } from "date-fns";

// or MaterialIcons, etc.

import PromoStaticBanner from "@/components/PromoStaticBanner";

import ReviewList from "@/components/ReviewList";
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
    comment?: string;
    rating?: number;
  }>({});
  // An attempt at implementing related products to be displayed at the bottom of the productdetail screen
  const {
    data: products,
    isLoading: loadingProds,
    error: errorInLoadingProds,
  } = useGetProductsQuery();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  // Add to cart animation
  const animatedValue = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const cartScale = useRef(new Animated.Value(1)).current;

  const [showFlyImage, setShowFlyImage] = useState(false);

  const [productQtyInCart, setProductQtyInCart] = useState(0);

  const cartIconRef = useRef(null);

  const productImageLayout = useRef({ x: 0, y: 0 });
  const cartIconLayout = useRef({ x: 0, y: 0 });
  const [displayProdAdjumentButtons, setDisplayProdAdjumentButtons] =
    useState(false);
  const [disCountInFigures, setDisCountInFigures] = useState(0);
  const [newPrice, setNewPrice] = useState(0);

  const { slug } = useLocalSearchParams();

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
    const prodInCart = cart.cartItems.find((x) => x._id === product?._id);
    setDisplayProdAdjumentButtons(prodInCart ? true : false);
    setProductQtyInCart(prodInCart ? prodInCart.quantity : 0);
  }, [cart.cartItems]);

  useEffect(() => {
    const currentUser = userInfo?.name;
    const currentUsersReview = product?.reviews.find(
      (review) => review.name === currentUser
    );

    setCurrentUserExistingReview(currentUsersReview || {});
  }, [product?.reviews]);

  useEffect(() => {
    if (product?.reviews?.length) {
      const avg =
        product.reviews.reduce((a, b) => a + b.rating, 0) /
        product.reviews.length;
      product.rating = avg;
    }
  }, [product?.reviews]);

  useEffect(() => {
    const calcCartItems = () => {
      if (cart.cartItems.length > 0) {
        const count = cart.cartItems.reduce((a, c) => a + c.quantity, 0);
        setCartItemsCount(count);
      }
      if (cart.cartItems.length === 0) setCartItemsCount(0);
    };

    calcCartItems();
  }, [cart]); // Removed dependencies: cartItemsCount, setCartItemsCount,
  useEffect(() => {
    if (product?.discount) {
      const discount = (product.discount * product.price) / 100;
      setDisCountInFigures(discount);
      const newPrice = product.price - discount;
      setNewPrice(newPrice);
    }
  }, [product?.discount]);

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

  const updateCartHandler = (updateType: string) => {
    const item = cart.cartItems.find((x) => x._id === product?._id);
    if (updateType === "plus") {
      const quantity = item ? item.quantity + 1 : 1;
      setProductQtyInCart(quantity);
      if (product.countInStock < quantity) {
        Alert.alert("Product out of stock!", "Sorry. Product is out of stock");
        return;
      }
      ctxDispatch({
        type: "CART_ADD_ITEM",
        payload: { ...product, quantity },
      });
    } else if (updateType === "minus") {
      const quantity = item ? item.quantity - 1 : 0;
      setProductQtyInCart(quantity);
      ctxDispatch({
        type: "CART_ADD_ITEM",
        payload: { ...product, quantity },
      });

      if (item?.quantity === 1) {
        ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
        setDisplayProdAdjumentButtons(false);
      }
    }
  };

  const playAddToCartSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sounds/add-to-cart.wav")
    );
    await sound.playAsync();
  };

  const getDeliveryDate = () => {
    const now = new Date();
    const nextWeek = addDays(now, 7);
    const threeWksAway = addDays(now, 21);

    const start = format(nextWeek, "MMM dd");
    const end = format(threeWksAway, "MMM dd");
    return `${start} - ${end}`;
  };

  const addToCartHandler = async () => {
    setDisplayProdAdjumentButtons(true);
    startFlyAnimation();
    Haptics.selectionAsync(); // Gentle haptic

    playAddToCartSound(); // Optional: add sound

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
  };

  const startFlyAnimation = () => {
    const from = productImageLayout.current;
    const to = cartIconLayout.current;

    if (!from || !to) return; // At first render: if cart position(Layout hasn't been loaded) hasn't been decided

    animatedValue.setValue({ x: from.x, y: from.y });
    setShowFlyImage(true);

    Animated.timing(animatedValue, {
      toValue: { x: to.x, y: to.y },
      duration: 700,
      useNativeDriver: true,
    }).start(() => {
      setShowFlyImage(false);
      // Start bounce
      Animated.sequence([
        Animated.spring(cartScale, {
          toValue: 1.4,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(cartScale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start(); // bounce code ends
    });
  };

  const submit = async ({
    comment,
    rating,
  }: {
    comment: string;
    rating: string | number;
  }) => {
    if (!comment || !rating) {
      Alert.alert("Blank Field(s)", "Please fill in all the fields");
      return;
    }
    try {
      // Filter out the old review of the user
      let remainingReviews = product.reviews.filter(
        (review) => review.name !== userInfo!.name
      );

      dispatch({ type: "REFRESH_PRODUCT", payload: product });

      const { data } = await axios.post(
        `https://temimartapi.onrender.com/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo!.name },
        {
          headers: { Authorization: `Bearer ${userInfo!.token}` },
        }
      );

      dispatch({ type: "CREATE_SUCCESS" });

      if (!product.reviews) product.reviews = [];

      // Render new review at the top of the remaining reviews after the removed review
      product.reviews = [...remainingReviews];
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
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Image
          source={{ uri: product.image }}
          style={{ width: "100%", height: 300 }}
          onLayout={(event) => {
            productImageLayout.current = event.nativeEvent.layout;
          }}
        />
        <PromoStaticBanner />
        {/* Product Details */}
        <View style={{ padding: 15 }}>
          <Text
            style={{ fontSize: 24, fontWeight: "bold", marginVertical: 10 }}
          >
            {product.name}
          </Text>
          <Text style={{ fontSize: 18, marginVertical: 10 }}>
            {product.description}
          </Text>
          {/* Number of products sold and starred rating */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={{ fontSize: 13, color: "gray" }}>
                {product.numSold
                  ? product.numSold +
                    " sold " +
                    "|" +
                    " Sold by " +
                    product.brand.charAt(0).toUpperCase() +
                    product.brand.slice(1)
                  : null}
              </Text>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
              }}
            >
              <View>
                <Text style={{ fontSize: 10 }}>
                  {typeof product.discount === "number" && product.discount > 0
                    ? product.rating.toFixed(1)
                    : null}
                </Text>
              </View>
              {/* {product.rating && <Rating rating={product.rating} caption=" " />} */}
              {typeof product.discount === "number" && product.discount > 0 && (
                <Rating rating={product.rating} caption=" " />
              )}
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 14 }}>Est. &nbsp;</Text>
            <Text style={{ fontSize: 20, color: "green" }}>
              &#x20A6;
              {typeof product.discount === "number" && product.discount > 0
                ? newPrice.toLocaleString("en-US")
                : product.price.toLocaleString("en-US")}
            </Text>
          </View>

          {/* Discount offer */}
          {typeof product.discount === "number" && product.discount > 0 && (
            <View style={{ gap: 8, marginBottom: 10 }}>
              <View style={styles.discountViewPlusCountdown}>
                <View style={styles.discountedPriceContainer}>
                  <Text style={styles.saveText}>after applying promos to </Text>
                  <Text style={styles.nairaSymbolInDisc}>&#x20A6;</Text>
                  <Text style={styles.discountedPrice}>
                    {disCountInFigures?.toLocaleString("en-US") || "0"}
                  </Text>
                  <Text style={styles.saveText}> |</Text>
                  <CountdownTimer item={product} color="white" />
                </View>
                <Text
                  style={{
                    textDecorationLine: "line-through",
                    textDecorationColor: "red",
                  }}
                >
                  &#x20A6; {product.price}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  gap: 6,
                }}
              >
                <View style={styles.discountPromoContainer}>
                  <Text style={styles.discountPromoText}>
                    {product.discount} % OFF
                  </Text>
                </View>
                <View style={styles.discountPromoContainer}>
                  <Text style={styles.discountPromoText}>ALMOST SOLD OUT</Text>
                  <Ionicons
                    name="help-circle-outline"
                    size={16}
                    color="#F8921B"
                  />
                </View>
              </View>
            </View>
          )}
          {/* Shipping info */}
          <View style={styles.shippingHeader}>
            <Ionicons name="boat-sharp" color={"green"} size={16} />
            <Text style={{ color: "green", fontSize: 15, fontWeight: "600" }}>
              Free shipping on all orders
            </Text>
          </View>
          <View style={{ gap: 8, marginBottom: 10 }}>
            <Text style={{ fontSize: 15, color: "gray" }}>
              Delivery: {getDeliveryDate()}
            </Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={{ fontSize: 15, color: "gray" }}>
                Courier company:
              </Text>
              <Image
                source={require("../assets/images/speedaf.png")}
                style={{ width: 50, height: 20 }}
              />
              <Text>Speedaf</Text>
            </View>
          </View>
          <View style={styles.safePay}>
            <View style={styles.safePayInner}>
              <Ionicons name="shield-sharp" size={16} color="green" />
              <Text style={{ fontSize: 15, color: "green" }}>
                Safe payments
              </Text>
              <View style={styles.greenDotDivider}></View>
              <Text style={{ fontSize: 15, color: "green" }}>
                Secure privacy
              </Text>
            </View>
            <View>
              <Ionicons name="arrow-forward" size={20} color="gray" />
            </View>
          </View>
          <View style={styles.guaranteeHeader}>
            <View
              style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
            >
              <Ionicons name="bag-check" size={16} color="green" />
              <Text style={{ fontSize: 14, color: "green" }}>
                Order guarantee
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={{ fontSize: 15, color: "gray" }}>
                6 Temi guarantees
              </Text>
              <Ionicons name="arrow-forward" size={20} color="gray" />
            </View>
          </View>
          {/* Scrollable promotional features */}
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ borderBottomWidth: 6, borderColor: "#D3D3D3" }}
          >
            <View style={styles.scrollablePromoContainer}>
              <View style={styles.shippingScrollViewItem}>
                <Text style={styles.shippingScrollViewItemText}>
                  90-Day Returns
                </Text>
              </View>
              <View style={styles.shippingScrollViewItem}>
                <Text style={styles.shippingScrollViewItemText}>
                  &#x20A6; 1,600 Credit for delay
                </Text>
              </View>
              <View style={styles.shippingScrollViewItem}>
                <Text style={styles.shippingScrollViewItemText}>
                  Return if item damaged
                </Text>
              </View>
              <View style={styles.shippingScrollViewItem}>
                <Text style={styles.shippingScrollViewItemText}>
                  15-day no update refund
                </Text>
              </View>
              <View style={styles.shippingScrollViewItem}>
                <Text style={styles.shippingScrollViewItemText}>
                  60-day no delivery refund
                </Text>
              </View>
              <View style={styles.shippingScrollViewItem}>
                <Text style={styles.shippingScrollViewItemText}>
                  Price adjustment
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Reviews */}

          {product.reviews && product.reviews.length > 0 && (
            <>
              <View style={styles.averageStarReviewContainer}>
                <View style={styles.averageRatingContainer}>
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {product.rating && product.rating.toFixed(1)}
                  </Text>

                  {product.rating && (
                    <Rating rating={product.rating} caption=" " size={18} />
                  )}
                  {product.numReviews && (
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      ({product.numReviews})
                    </Text>
                  )}
                  <Ionicons
                    name="help-circle-outline"
                    size={18}
                    color="#F8921B"
                  />
                </View>
                <Ionicons name="arrow-forward" size={20} color="gray" />
              </View>
              <View style={styles.reviewHeader}>
                <View style={styles.verifiedUserDesign}>
                  <Ionicons name="shield" size={30} color="white" />
                  <Ionicons
                    name="person-sharp"
                    size={14}
                    color="green"
                    style={{ position: "absolute", left: 23, top: 22 }}
                  />
                </View>
                <View
                  style={{
                    gap: 1,
                  }}
                >
                  <Text style={styles.reviewTitle}>Reviews</Text>
                  <Text style={styles.reviewBodyText}>
                    All reviews are from verified purchasers
                  </Text>
                </View>
              </View>
            </>
          )}
          <View style={{ marginBottom: 10 }}>
            {product.reviews.length === 0 && (
              <Text style={{ fontStyle: "italic", color: "gray" }}>
                No reviews yet. Be the first to leave one!
              </Text>
            )}
          </View>

          {/* Review List */}
          <View style={{ marginBottom: 20 }}>
            <ReviewList
              product={product}
              userInfo={userInfo}
              dispatch={dispatch}
            />
          </View>

          <View>
            {userInfo ? (
              <View style={{ marginBottom: 25 }}>
                <ReviewFormModal
                  onSubmitReview={submit}
                  review={currentUserExistingReview} // ✅ passed as optional with correct structure
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
                <Text style={{ fontSize: 18 }}>to leave a review</Text>
              </View>
            )}
          </View>

          {/* Related Products   */}
          {products && products.length > 0 && (
            <View style={{ marginTop: 30 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 10,
                  paddingHorizontal: 15,
                }}
              >
                Related Products
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}
              >
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {products
                    .filter(
                      (p) =>
                        p._id !== product._id && p.category === product.category
                    )
                    .map((relatedProduct) => (
                      <ProductCard
                        key={relatedProduct._id}
                        item={relatedProduct}
                        onAddToCart={() => {
                          // Optional handler for adding related product to cart
                          const quantity = 1;
                          if (relatedProduct.countInStock < 1) {
                            Alert.alert(
                              "Out of stock",
                              "This product is unavailable."
                            );
                            return;
                          }
                          ctxDispatch({
                            type: "CART_ADD_ITEM",
                            payload: { ...relatedProduct, quantity },
                          });
                          Haptics.selectionAsync();
                        }}
                      />
                    ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
      {/* Stock and Add to Cart */}
      {product.countInStock > 0 && displayProdAdjumentButtons ? (
        <View style={styles.specialButtonsContainer}>
          <View style={styles.adjustmentButtonsContainer}>
            <TouchableOpacity
              style={styles.adjustmentButton}
              onPress={() => updateCartHandler("minus")}
            >
              <Text style={styles.signInText}>&minus;</Text>
            </TouchableOpacity>
            <Text style={styles.signInText}>{productQtyInCart}</Text>
            <TouchableOpacity
              style={styles.adjustmentButton}
              onPress={() => updateCartHandler("plus")}
            >
              <Text style={styles.signInText}>&#43;</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={addToCartHandler}
          >
            <Link href="/cart">
              <Text style={styles.addToCartButtonText}>Go To Cart</Text>
            </Link>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={styles.addNewProductToCartButton}
            onPress={addToCartHandler}
          >
            <Text style={styles.addToCartButtonText}>
              {product.discount
                ? "-" + product.discount + "% now!" + " Add to cart!"
                : "Add to cart!"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        ref={cartIconRef}
        onLayout={(event) => {
          cartIconLayout.current = event.nativeEvent.layout;
        }}
        style={{
          position: "absolute",
          //top: 30,
          bottom: 120,
          right: 20,
          zIndex: 10,
        }}
      >
        <View style={styles.outerConcentricCircle}>
          <View style={styles.innerConcentricCircle}>
            {cartItemsCount > 0 && (
              <Badge
                value={cartItemsCount}
                containerStyle={{
                  position: "absolute",
                  top: -5,
                  right: 5,
                }}
              />
            )}
            <Animated.View style={{ transform: [{ scale: cartScale }] }}>
              <Link href="/cart">
                <Ionicons name="cart-outline" size={30} color="green" />
              </Link>
            </Animated.View>
            <Text
              style={{
                color: "green",
                fontWeight: "bold",
                fontSize: 12,
                marginBottom: 5,
              }}
            >
              Cart
            </Text>
          </View>
        </View>
        <View style={styles.cartLabel}>
          <Text style={styles.cartText}>Free shipping</Text>
        </View>
      </TouchableOpacity>
      {showFlyImage && (
        <Animated.Image
          source={{ uri: product.image }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 30,
            position: "absolute",
            zIndex: 100,
            transform: animatedValue.getTranslateTransform(),
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  discountViewPlusCountdown: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    height: 20,
    width: "100%",
    justifyContent: "flex-start",
    gap: 8,
  },
  discountedPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8921B",
    paddingHorizontal: 4,
    height: "100%",
  },
  saveText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
    marginRight: 4,
  },
  nairaSymbolInDisc: {
    color: "white",
    fontWeight: "600",
    fontSize: 10,
    marginRight: 2,
  },
  discountedPrice: {
    color: "white",
    fontWeight: "600",
    fontSize: 10,
    marginRight: 4,
  },
  discountPromoContainer: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#F8921B",
    flexDirection: "row",
  },
  discountPromoText: {
    color: "#F8921B",
    fontWeight: "bold",
  },
  nairaSymbol: {
    color: "#F8921B",
    fontWeight: "600",
    fontSize: 12,
    marginRight: 2,
  },

  addToCartButton: {
    backgroundColor: "#ff9900",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    width: "45%",
  },

  outerConcentricCircle: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  innerConcentricCircle: {
    width: 58,
    height: 58,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  cartLabel: {
    position: "absolute",
    bottom: -5,
    right: 3,
    backgroundColor: "green",
    padding: 3,
    borderRadius: 8,
  },
  cartText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 10,
  },
  specialButtonsContainer: {
    position: "absolute",
    left: 10,
    bottom: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  adjustmentButtonsContainer: {
    backgroundColor: "#ff9900",
    padding: 8,
    borderRadius: 15,
    width: "45%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  adjustmentButton: {
    borderWidth: 2,

    borderColor: "white",
    height: 40,
    width: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    padding: 5,
  },
  signInText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  addToCartButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  addNewProductToCartButton: {
    position: "absolute",
    bottom: 20,
    width: "80%",
    marginHorizontal: "auto",
    backgroundColor: "#ff9900",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: "center",
  },

  shippingScrollViewItem: {
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  shippingScrollViewItemText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  shippingHeader: {
    borderTopWidth: 6,
    borderColor: "#D3D3D3",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 6,
  },
  safePay: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "gray",
    paddingVertical: 10,
  },
  safePayInner: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  greenDotDivider: {
    width: 3,
    height: 3,
    borderRadius: 50,
    backgroundColor: "green",
  },
  guaranteeHeader: {
    borderTopColor: "gray",
    borderTopWidth: 1,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scrollablePromoContainer: {
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    marginVertical: 10,
    height: 40,
    paddingVertical: 5,
  },

  averageStarReviewContainer: {
    marginTop: 19,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  averageRatingContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  reviewHeader: {
    marginTop: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "rgba(144, 238, 144, 0.3)",
    alignItems: "center",
    height: 60,
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
  },
  verifiedUserDesign: {
    backgroundColor: "green",
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  reviewTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "green",
    marginLeft: 10,
  },
  reviewBodyText: { fontSize: 12, color: "green", marginLeft: 10 },
});

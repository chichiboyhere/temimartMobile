import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList,
} from "react-native";
import Rating from "../components/Rating";
import axios from "axios";
import { Link } from "expo-router";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Store } from "@/Store";
import styles from "@/constants/styles";
import DropdownMenu, { MenuOption } from "@/components/DropDownMenu";
import SelectList from "react-native-dropdown-select-list";
//select menu
//https://www.npmjs.com/package/react-native-select-dropdown
// More props on SelectList: dropdownStyles={backgroundColor: 'gray'}, dropdownItemStyles={marginHorizontal:10, dropdownTextStyles={color: 'red'}} placeholder:"select"

type ProductDetailRouteProp = RouteProp<
  { ProductDetail: { productId: string } },
  "ProductDetail"
>;

export default function ProductDetailScreen() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation();
  const { slug } = route.params;
  //const { addToCart } = useContext(CartContext);

  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  const data = [
    { key: "1", value: "1 - Poor" },
    { key: "2", value: "1 - Fair" },
    { key: "3", value: "1 - Good" },
    { key: "4", value: "1 - Very Good" },
    { key: "5", value: "1 - Excellent" },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `https://temimartapi.onrender.com/api/products/slug/${slug}`
        );
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
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

  const handleAddToCart = () => {
    addToCart(product);
    Alert.alert("Success", `${product.name} has been added to your cart.`);
    navigation.navigate("Cart");
  };

  return (
    <ScrollView style={{ flex: 1, padding: 15, backgroundColor: "#fff" }}>
      {/* Product Image */}
      <Image
        source={{ uri: product.image }}
        style={{ width: "100%", height: 300, borderRadius: 10 }}
      />

      {/* Product Details */}
      <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 10 }}>
        {product.name}
      </Text>
      <Text style={{ fontSize: 18, color: "green" }}>$ {product.price}</Text>
      <Text style={{ fontSize: 16, marginVertical: 10 }}>
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
          // onPress={#}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Add to Cart
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={{ color: "red", fontWeight: "bold" }}>Out of Stock</Text>
      )}

      <View>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>
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
                padding: 6,
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
              <Text style={styles.title}>Leave a comment</Text>
              <Text style={styles.title}>Rating</Text>

              <Text style={styles.title}>Comment</Text>
              <TextInput
                style={styles.input}
                value={comment}
                placeholder="Comment"
                onChangeText={setComment}
              />
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

import React from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { ApiError } from "@/app/types/ApiError";
import { getError } from "../utils";
import { Product } from "@/app/types/Product";
import ProductCard from "./ProductCard";
interface Props {
  products: Product;
  loading: boolean;
  error: string;
  onAddToCart: (item: Product) => void;
}

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
const RelatedProducts: React.FC<Props> = ({
  products,
  loading,
  error,
  onAddToCart,
}) => {
  return (
    <View style={{ flex: 1, margin: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Related Products</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      ) : error ? (
        <Text
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {getError(error as ApiError)}
        </Text>
      ) : (
        <FlatList
          data={products}
          // style={{ padding: 10 }}
          numColumns={2}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ProductCard item={item} onAddToCart={onAddToCart} />
          )}
        />
      )}
    </View>
  );
};

export default RelatedProducts;

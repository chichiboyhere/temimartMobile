import { Text, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getError } from "@/utils";
import { ApiError } from "@/types/ApiError";
import { useGetProductByIdQuery } from "../hooks/productHooks";
import ReviewFormat from "@/components/ReviewFormat";
//import { Review } from "@/types/Product";
import { Review } from "../types/Review";
import { UserInfo } from "@/types/UserInfo";
import { Store } from "@/Store";
import { useContext, useReducer } from "react";
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
const Reviews = () => {
  const { id: productId } = useLocalSearchParams();
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductByIdQuery(productId as string);

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loadingCreateReview }, dispatch] = useReducer(reducer, {
    product: {} as Product,
    loading: true,
    error: "",
  });

  return isLoading ? (
    <ActivityIndicator
      size="large"
      color="#0000ff"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  ) : error ? (
    Alert.alert("Error", getError(error as ApiError))
  ) : !product ? (
    Alert.alert("Error", "Product Reviews not found!")
  ) : (
    <ScrollView
      style={{
        flex: 1,
        padding: 15,
        backgroundColor: "#fff",
        marginBottom: 25,
      }}
    >
      {/* <ReviewFormat
        product={product}
        userInfo={userInfo as UserInfo}
        dispatch={dispatch}
      /> */}
      <ReviewFormat
        product={product}
        userInfo={userInfo as UserInfo}
        dispatch={dispatch}
        refetch={refetch} // Add this line
      />
    </ScrollView>
  );
};

export default Reviews;

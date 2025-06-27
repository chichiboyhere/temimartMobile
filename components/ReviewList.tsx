// ReviewList

import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import Rating from "./Rating";
import { Product } from "@/app/types/Product";
import { UserInfo } from "@/app/types/UserInfo";

interface Props {
  product: Product;
  userInfo?: UserInfo;

  dispatch: any;
}

const ReviewList: React.FC<Props> = ({ product, userInfo, dispatch }) => {
  const [reviews, setReviews] = useState(product.reviews || []);
  const [visibleCount, setVisibleCount] = useState(5); // 👈 Number of reviews currently visible
  const [likedReviews, setLikedReviews] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});
  const [loadingLikes, setLoadingLikes] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Setup like counts, liked states, and loading states
  useEffect(() => {
    setReviews(product.reviews || []);
    const initialLiked: { [key: string]: boolean } = {};
    const initialCounts: { [key: string]: number } = {};
    const initialLoading: { [key: string]: boolean } = {};

    product.reviews?.forEach((review) => {
      initialCounts[review._id] = review.numOfLikes || 0;
      initialLiked[review._id] =
        review.likedBy?.includes(userInfo?._id) || false;
      initialLoading[review._id] = false;
    });

    setLikedReviews(initialLiked);
    setLikeCounts(initialCounts);
    setLoadingLikes(initialLoading);
  }, [product.reviews]);

  const handleLike = async (reviewId: string) => {
    const currentLiked = likedReviews[reviewId];
    const newLiked = !currentLiked;

    // Optimistically update UI
    setLikedReviews((prev) => ({ ...prev, [reviewId]: newLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [reviewId]: prev[reviewId] + (newLiked ? 1 : -1),
    }));
    setLoadingLikes((prev) => ({ ...prev, [reviewId]: true }));

    try {
      const url = `https://temimartapi.onrender.com/api/products/${product._id}/reviews/${reviewId}/like`;
      const config = {
        headers: { Authorization: `Bearer ${userInfo!.token}` },
      };
      const payload = newLiked ? { liked: true } : { unliked: true };
      const { data } = await axios.post(url, payload, config);

      setLikeCounts((prev) => ({ ...prev, [reviewId]: data.numOfLikes }));
    } catch (err) {
      console.error("Like request failed:", err);
      setLikedReviews((prev) => ({ ...prev, [reviewId]: currentLiked }));
    } finally {
      setLoadingLikes((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleDelete = (reviewId: string) => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const url = `https://temimartapi.onrender.com/api/products/${product._id}/reviews/${reviewId}`;
              const config = {
                headers: { Authorization: `Bearer ${userInfo!.token}` },
              };

              const { data } = await axios.delete(url, config);
              product.numReviews = data.numReviews;
              product.rating = data.rating;

              Alert.alert("Deleted", "Review deleted successfully");

              dispatch({ type: "REFRESH_PRODUCT", payload: product });

              setReviews((prevReviews) =>
                prevReviews.filter((r) => r._id !== reviewId)
              );
            } catch (err) {
              console.error("Delete request failed:", err);
              Alert.alert(
                "Error",
                "Could not delete review. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  // Slice the list of reviews to only what's currently visible
  const visibleReviews = [...reviews]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, visibleCount);

  return (
    <View>
      {visibleReviews.map((item) => (
        <View
          key={item._id}
          style={{
            flex: 1,
            borderBottomColor: "#555",
            borderBottomWidth: 0.5,
            paddingVertical: 6,
            paddingHorizontal: 10,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginBottom: 6,
              paddingRight: 14,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              {userInfo?.profileImage ? (
                <Image
                  source={{ uri: userInfo.profileImage }}
                  style={{ width: 30, height: 30, borderRadius: 15 }}
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
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {item.name[0]}
                  </Text>
                </View>
              )}
              <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            </View>
            <Text>{item.createdAt.substring(0, 10)}</Text>
          </View>

          <Rating rating={item.rating} caption=" " />
          <Text style={{ marginTop: 5, fontSize: 14 }}>{item.comment}</Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
            >
              <Text style={{ fontSize: 12, fontWeight: "700" }}>Helpful?</Text>

              <TouchableOpacity
                disabled={loadingLikes[item._id]}
                onPress={() => handleLike(item._id)}
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                {loadingLikes[item._id] ? (
                  <ActivityIndicator size="small" color="red" />
                ) : likedReviews[item._id] ? (
                  <Ionicons name="thumbs-up-sharp" size={20} color="#ff9900" />
                ) : (
                  <Ionicons name="thumbs-up-outline" size={20} color="gray" />
                )}

                {likeCounts[item._id] > 0 && (
                  <Text style={{ fontSize: 12, color: "green", marginLeft: 2 }}>
                    {likeCounts[item._id]}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {userInfo?.name === item.name && (
              // A unique button for the user to delete their own review
              // Also the trash/delete icon is disabled if the total number of reviews is just 1
              <TouchableOpacity
                onPress={() => handleDelete(item._id)}
                disabled={reviews.length === 1}
              >
                <Ionicons name="trash" size={18} color="gray" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}

      {/* When there are more than 5 reviews */}
      {visibleCount < reviews.length && (
        <View style={styles.expansionContainer}>
          <TouchableOpacity onPress={() => setVisibleCount(reviews.length)}>
            <Text style={styles.expansionText}>See all</Text>
          </TouchableOpacity>
          {visibleCount > 5 && (
            <TouchableOpacity onPress={() => setVisibleCount(5)}>
              <Text style={styles.expansionText}>See less</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() =>
              setVisibleCount((prev) => Math.min(prev + 10, reviews.length))
            }
          >
            <Text style={{ color: "#318CE7", fontWeight: "bold" }}>
              {reviews.length - visibleCount > 10
                ? "See next 10"
                : `See last ${reviews.length - visibleCount} review(s)`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {visibleCount === reviews.length && reviews.length > 5 && (
        <View style={styles.expansionContainer}>
          <TouchableOpacity onPress={() => setVisibleCount(5)}>
            <Text style={styles.expansionText}>See less</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  expansionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  expansionText: {
    color: "#318CE7",
    fontWeight: "bold",
  },
});

export default ReviewList;

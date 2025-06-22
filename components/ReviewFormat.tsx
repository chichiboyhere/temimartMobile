import React, { useState, useContext, useReducer, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Rating from "./Rating";
import { Product } from "@/app/types/Product";

import axios from "axios";

import Ionicons from "@expo/vector-icons/Ionicons";
import { UserInfo } from "@/app/types/UserInfo";

interface ReviewFormatProps {
  product: Product;
  userInfo: UserInfo;
  dispatch: any;
  refetch?: () => void; // Optional: passed from parent to refresh data
}

function ReviewFormat({
  product,
  userInfo,
  dispatch,
  refetch,
}: ReviewFormatProps) {
  const [reviews, setReviews] = useState(product?.reviews || []);
  const [likedReviews, setLikedReviews] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});
  const [loadingLikes, setLoadingLikes] = useState<{ [key: string]: boolean }>(
    {}
  );

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
        {
          text: "Cancel",
          style: "cancel",
        },
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

              if (refetch) await refetch();

              // Update UI
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

  const handleProductStarredRatingBreakdown = (numOfStars: number) => {
    // Implement the logic to display the product's starred rating breakdown

    // Step1: Map the frequency of a starred rating in the product's reviews
    type FrequencyType = {
      [key: string]: number;
    };

    const frequencyMapOfReviews: FrequencyType = {};
    reviews.forEach((r) => {
      frequencyMapOfReviews[r.rating] =
        (frequencyMapOfReviews[r.rating] || 0) + 1;
    });

    // Step2: Return the percentage of a starred rating in the product's reviews
    if (Object.keys(frequencyMapOfReviews).includes(numOfStars.toString())) {
      const percentageOfReviewRating =
        (frequencyMapOfReviews[numOfStars] / product.reviews!.length) * 100;

      return percentageOfReviewRating.toFixed(1);
    } else {
      return 0;
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          borderBottomWidth: 4,
          borderBottomColor: "gray",
          paddingBottom: 10,
          marginBottom: 10,
        }}
      >
        {/* Review starred rating breakdown  */}

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "50%",
            height: 150,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 45 }}>
            {product.rating.toFixed(1)}
          </Text>
        </View>
        <View
          style={{ flexDirection: "column", justifyContent: "space-between" }}
        >
          {/* Ratings according to starrs, horizontal progress bar and percentage of total reviews */}
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              justifyContent: "space-between",
            }}
          >
            <Rating rating={5} caption=" " size={16} />
            <View>
              <Text>5 stars</Text>
            </View>
            <Text>{handleProductStarredRatingBreakdown(5)} %</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              justifyContent: "space-between",
            }}
          >
            <Rating rating={4} caption=" " size={16} />
            <View>
              <Text> 4 stars</Text>
            </View>
            <Text>{handleProductStarredRatingBreakdown(4)} %</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              justifyContent: "space-between",
            }}
          >
            <Rating rating={3} caption=" " size={16} />
            <View>
              <Text> 3 stars</Text>
            </View>
            <Text>{handleProductStarredRatingBreakdown(3)} %</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              justifyContent: "space-between",
            }}
          >
            <Rating rating={2} caption=" " size={16} />
            <View>
              <Text> 2 stars</Text>
            </View>
            <Text>{handleProductStarredRatingBreakdown(2)} %</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              justifyContent: "space-between",
            }}
          >
            <Rating rating={1} caption=" " size={16} />
            <View>
              <Text> 1 star</Text>
            </View>
            <Text>{handleProductStarredRatingBreakdown(1)} %</Text>
          </View>
        </View>
      </View>
      <View>
        {reviews
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )

          .map((item) => (
            <View
              key={item._id}
              style={{
                flex: 1,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                paddingVertical: 6,
                paddingHorizontal: 10,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 6,
                  gap: 10,
                  alignItems: "center",
                }}
              >
                {userInfo?.profileImage ? (
                  <Image
                    source={{ uri: userInfo.profileImage }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
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
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      {item.name[0]}
                    </Text>
                  </View>
                )}
                <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                <Text>{item.createdAt.substring(0, 10)}</Text>
              </View>
              <View>
                <Rating rating={item.rating} caption=" " />
              </View>
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
                  style={{
                    flexDirection: "row",
                    gap: 6,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "700" }}>
                    Helpful?
                  </Text>

                  <TouchableOpacity
                    disabled={loadingLikes[item._id]}
                    onPress={() => handleLike(item._id)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {loadingLikes[item._id] ? (
                      <ActivityIndicator size="small" color="red" />
                    ) : likedReviews[item._id] ? (
                      <Ionicons
                        name="thumbs-up-sharp"
                        size={20}
                        color="#ff9900"
                      />
                    ) : (
                      <Ionicons
                        name="thumbs-up-outline"
                        size={20}
                        color="gray"
                      />
                    )}

                    {likeCounts[item._id] > 0 && (
                      <Text
                        style={{ fontSize: 12, color: "green", marginLeft: 2 }}
                      >
                        {likeCounts[item._id]}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                {userInfo?.name === item.name && (
                  <TouchableOpacity onPress={() => handleDelete(item._id)}>
                    <Ionicons name="trash" size={18} color="gray" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
      </View>
    </View>
  );
}
export default ReviewFormat;

const styles = StyleSheet.create({
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

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   Image,
//   ActivityIndicator,
// } from "react-native";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import Rating from "./Rating";
// import axios from "axios";
// import { Product } from "@/app/types/Product";
// import { UserInfo } from "@/app/types/UserInfo";

// interface ReviewFormatProps {
//   product: Product;
//   userInfo: UserInfo;
//   dispatch: React.Dispatch<any>;
//   refetch?: () => void; // Optional: passed from parent to refresh data
// }

// function ReviewFormat({
//   product,
//   userInfo,
//   dispatch,
//   refetch,
// }: ReviewFormatProps) {
//   const [reviews, setReviews] = useState(product?.reviews || []);
//   const [likedReviews, setLikedReviews] = useState<{ [key: string]: boolean }>(
//     {}
//   );
//   const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});
//   const [loadingLikes, setLoadingLikes] = useState<{ [key: string]: boolean }>(
//     {}
//   );

//   useEffect(() => {
//     const likeMap: any = {};
//     const countMap: any = {};
//     reviews.forEach((r) => {
//       likeMap[r._id] = r.likedBy?.includes(userInfo._id);
//       countMap[r._id] = r.numOfLikes || 0;
//     });
//     setLikedReviews(likeMap);
//     setLikeCounts(countMap);
//   }, [reviews]);

//   const handleLike = async (reviewId: string) => {
//     const currentLiked = likedReviews[reviewId];
//     const newLiked = !currentLiked;

//     // Optimistic update
//     setLikedReviews((prev) => ({ ...prev, [reviewId]: newLiked }));
//     setLikeCounts((prev) => ({
//       ...prev,
//       [reviewId]: prev[reviewId] + (newLiked ? 1 : -1),
//     }));
//     setLoadingLikes((prev) => ({ ...prev, [reviewId]: true }));

//     try {
//       const url = `https://temimartapi.onrender.com/api/products/${product._id}/reviews/${reviewId}/like`;
//       const config = {
//         headers: { Authorization: `Bearer ${userInfo.token}` },
//       };
//       const payload = newLiked ? { liked: true } : { unliked: true };

//       const { data } = await axios.post(url, payload, config);
//       setLikeCounts((prev) => ({ ...prev, [reviewId]: data.numOfLikes }));
//       if (refetch) await refetch(); // Refresh product data if passed
//     } catch (err) {
//       console.error("Like failed:", err);
//       setLikedReviews((prev) => ({ ...prev, [reviewId]: currentLiked }));
//     } finally {
//       setLoadingLikes((prev) => ({ ...prev, [reviewId]: false }));
//     }
//   };

//   const handleDelete = (reviewId: string) => {
//     Alert.alert(
//       "Delete Review",
//       "Are you sure you want to delete this review?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               const url = `https://temimartapi.onrender.com/api/products/${product._id}/reviews/${reviewId}`;
//               const config = {
//                 headers: { Authorization: `Bearer ${userInfo.token}` },
//               };

//               const { data } = await axios.delete(url, config); // data should be updated product

//               dispatch({ type: "REFRESH_PRODUCT", payload: data }); // backend returns updated product
//               setReviews(data.reviews); // sync local UI

//               if (refetch) await refetch(); // optional: revalidate from backend

//               Alert.alert("Deleted", "Review deleted successfully");
//             } catch (err) {
//               console.error("Delete failed:", err);
//               Alert.alert(
//                 "Error",
//                 "Could not delete review. Please try again."
//               );
//             }
//           },
//         },
//       ]
//     );
//   };

//   const getRatingPercentage = (star: number) => {
//     const total = reviews.length;
//     if (!total) return 0;
//     const count = reviews.filter((r) => r.rating === star).length;
//     return ((count / total) * 100).toFixed(1);
//   };

//   const renderRatingBar = (star: number) => {
//     const percentage = parseFloat(getRatingPercentage(star));
//     return (
//       <View
//         style={{
//           flexDirection: "row",
//           alignItems: "center",
//           marginVertical: 3,
//         }}
//         key={star}
//       >
//         <Rating rating={star} caption=" " size={14} />
//         <View
//           style={{
//             width: 100,
//             height: 8,
//             backgroundColor: "#ccc",
//             borderRadius: 4,
//             marginHorizontal: 6,
//           }}
//         >
//           <View
//             style={{
//               width: `${percentage}%`,
//               height: 8,
//               backgroundColor: "black",
//               borderRadius: 4,
//             }}
//           />
//         </View>
//         <Text style={{ fontSize: 14 }}>{percentage}%</Text>
//       </View>
//     );
//   };

//   return (
//     <View>
//       {/* Rating breakdown */}
//       <View
//         style={{
//           flexDirection: "row",
//           paddingBottom: 10,
//           marginBottom: 10,
//           borderBottomWidth: 2,
//           borderBottomColor: "#ccc",
//           height: 120,
//         }}
//       >
//         <View
//           style={{
//             justifyContent: "center",
//             alignItems: "center",
//             minWidth: "30%",
//             maxWidth: "50%",
//             //paddingHorizontal: 15,
//           }}
//         >
//           <Text style={{ fontWeight: "bold", fontSize: 45 }}>
//             {product.rating.toFixed(1)}
//           </Text>
//         </View>
//         <View style={{ justifyContent: "space-evenly" }}>
//           {[5, 4, 3, 2, 1].map((star) => renderRatingBar(star))}
//         </View>
//       </View>

//       {/* Reviews list */}
//       {reviews
//         .sort(
//           (a, b) =>
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         )
//         .map((item) => (
//           <View
//             key={item._id}
//             style={{
//               borderBottomColor: "#ddd",
//               borderBottomWidth: 1,
//               paddingVertical: 8,
//               paddingHorizontal: 10,
//             }}
//           >
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 marginBottom: 5,
//                 gap: 10,
//               }}
//             >
//               {item.profileImage ? (
//                 <Image
//                   source={{ uri: item.profileImage }}
//                   style={{ width: 30, height: 30, borderRadius: 15 }}
//                 />
//               ) : (
//                 <View
//                   style={{
//                     width: 30,
//                     height: 30,
//                     borderRadius: 15,
//                     backgroundColor: "#318CE7",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Text style={{ color: "white", fontWeight: "bold" }}>
//                     {item.name[0]}
//                   </Text>
//                 </View>
//               )}
//               <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
//               <Text>{item.createdAt.substring(0, 10)}</Text>
//             </View>
//             <Rating rating={item.rating} caption=" " />
//             <Text style={{ marginTop: 5 }}>{item.comment}</Text>
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginTop: 8,
//               }}
//             >
//               <View
//                 style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
//               >
//                 <Text style={{ fontSize: 12, fontWeight: "700" }}>
//                   Helpful?
//                 </Text>
//                 <TouchableOpacity
//                   disabled={loadingLikes[item._id]}
//                   onPress={() => handleLike(item._id)}
//                   style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
//                 >
//                   {loadingLikes[item._id] ? (
//                     <ActivityIndicator size="small" color="red" />
//                   ) : likedReviews[item._id] ? (
//                     <Ionicons
//                       name="thumbs-up-sharp"
//                       size={20}
//                       color="#ff9900"
//                     />
//                   ) : (
//                     <Ionicons name="thumbs-up-outline" size={20} color="gray" />
//                   )}
//                   {likeCounts[item._id] > 0 && (
//                     <Text style={{ fontSize: 12, color: "green" }}>
//                       {likeCounts[item._id]}
//                     </Text>
//                   )}
//                 </TouchableOpacity>
//               </View>
//               {userInfo?.name === item.name && (
//                 <TouchableOpacity onPress={() => handleDelete(item._id)}>
//                   <Ionicons name="trash" size={18} color="gray" />
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         ))}
//     </View>
//   );
// }

// export default ReviewFormat;

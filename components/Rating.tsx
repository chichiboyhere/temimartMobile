import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text } from "react-native";

function Rating(props: {
  rating: number;
  numReviews?: number;
  caption?: string;
}) {
  const { rating, numReviews, caption } = props;
  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      {rating >= 1 ? (
        <Ionicons name={"star-sharp"} color={"#ffc000"} size={24} />
      ) : rating >= 0.5 ? (
        <Ionicons name={"star-half-outline"} color={"#ffc000"} size={24} />
      ) : (
        <Ionicons name={"star-outline"} color={"#ffc000"} size={24} />
      )}

      {rating >= 2 ? (
        <Ionicons name={"star-sharp"} color={"#ffc000"} size={24} />
      ) : rating >= 1.5 ? (
        <Ionicons name={"star-half-outline"} color={"#ffc000"} size={24} />
      ) : (
        <Ionicons name={"star-outline"} color={"#ffc000"} size={24} />
      )}

      {rating >= 3 ? (
        <Ionicons name={"star-sharp"} color={"#ffc000"} size={24} />
      ) : rating >= 2.5 ? (
        <Ionicons name={"star-half-outline"} color={"#ffc000"} size={24} />
      ) : (
        <Ionicons name={"star-outline"} color={"#ffc000"} size={24} />
      )}

      {rating >= 4 ? (
        <Ionicons name={"star-sharp"} color={"#ffc000"} size={24} />
      ) : rating >= 3.5 ? (
        <Ionicons name={"star-half-outline"} color={"#ffc000"} size={24} />
      ) : (
        <Ionicons name={"star-outline"} color={"#ffc000"} size={24} />
      )}

      {rating >= 5 ? (
        <Ionicons name={"star-sharp"} color={"#ffc000"} size={24} />
      ) : rating >= 4.5 ? (
        <Ionicons name={"star-half-outline"} color={"#ffc000"} size={24} />
      ) : (
        <Ionicons name={"star-outline"} color={"#ffc000"} size={24} />
      )}

      {caption ? (
        <Text>{caption}</Text>
      ) : numReviews != 0 ? (
        <Text style={{ fontSize: 18 }}> ({numReviews})</Text>
      ) : (
        ""
      )}
    </View>
  );
}

export default Rating;

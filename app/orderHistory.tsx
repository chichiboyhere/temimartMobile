import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, Link } from "expo-router";

import styles from "@/constants/styles";

import { useGetOrderHistoryQuery } from "../hooks/orderHooks";
import { ApiError } from "../types/ApiError";
import { getError } from "../utils";

export default function OrderHistory() {
  const { data: orders, isLoading, error } = useGetOrderHistoryQuery();
  const router = useRouter();

  return isLoading ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : error ? (
    <View>{getError(error as ApiError)}</View>
  ) : orders?.length == 0 ? (
    <View>
      <Text style={{ textAlign: "center", marginTop: 300, fontSize: 20 }}>
        You have not made any orders yet!
      </Text>
    </View>
  ) : (
    <ScrollView style={{ flex: 1, margin: 10 }} nestedScrollEnabled={true}>
      <ScrollView horizontal={true}>
        <FlatList
          data={orders}
          keyExtractor={(item, index) =>
            item._id ? item._id.toString() : index.toString()
          }
          extraData={orders}
          ListHeaderComponent={() => {
            return (
              <>
                <View style={styles.resultHeader}>
                  <Text style={styles.repaymentText}>ID</Text>
                  <Text style={styles.repaymentText}>Date</Text>
                  <Text style={styles.repaymentText}>Total</Text>
                  <Text style={styles.repaymentText}>Paid</Text>
                  <Text style={styles.repaymentText}>Delivered</Text>
                  <Text style={styles.repaymentText}>Action</Text>
                </View>
              </>
            );
          }}
          renderItem={({ item }) => (
            <View style={styles.resultDisplay}>
              <View style={styles.resultDisplayItem}>
                <Text style={styles.resultDisplayText}>{item._id}</Text>
              </View>
              <View style={styles.resultDisplayItem}>
                <Text style={styles.resultDisplayText}>
                  {item.createdAt.substring(0, 10)}
                </Text>
              </View>
              <View style={styles.resultDisplayItem}>
                <Text style={styles.resultDisplayText}>
                  {item.totalPrice.toFixed(2)}
                </Text>
              </View>
              <View style={styles.resultDisplayItem}>
                <Text style={styles.resultDisplayText}>
                  {item.isPaid ? item.paidAt.substring(0, 10) : "No"}
                </Text>
              </View>
              <View style={styles.resultDisplayItem}>
                <Text style={styles.resultDisplayText}>
                  {item.isDelivered ? item.deliveredAt.substring(0, 10) : "No"}
                </Text>
              </View>
              <View style={styles.resultDisplayItem}>
                <TouchableOpacity>
                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "blue",
                      textDecorationLine: "underline",
                    }}
                  >
                    <Link href={`/orderDetail/${item._id}`}>Detail</Link>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          scrollEnabled={false}
        />
      </ScrollView>
    </ScrollView>
  );
}

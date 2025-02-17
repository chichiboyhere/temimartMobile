import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 10,
  },

  formContainer: {
    display: "flex",
    displayDirection: "column",
    marginVertical: 5,
  },

  input: {
    borderWidth: 3,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginVertical: 10,
  },
  inputField: {
    marginBottom: 8,
  },
  timeInputContainer: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 2,
    gap: 15,
  },
  timeInput: {
    borderWidth: 3,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
    width: "45%",
  },
  text: {
    fontWeight: "bold",
    marginBottom: 4,
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  calcButton: {
    width: "45%",
    backgroundColor: "green",
    padding: 8,
    color: "white",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  resetButton: {
    width: "45%",
    backgroundColor: "#eab308",
    color: "white",
    padding: 8,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  result: {
    marginTop: 10,
    overflow: "scroll",
  },
  repaymentTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 8,
  },
  repaymentText: {
    fontWeight: "bold",
  },
  resultHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 6,
  },
  resultContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 10,
  },
  resultDisplay: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 3,
  },
  resultDisplayItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
  },
  resultDisplayText: {
    color: "black",
  },
  outputContainer: {
    padding: 16,
    marginTop: 16,
    backgroundColor: "#dcfce7",
    borderWidth: 1,
    borderColor: "#4ade80",
    borderRadius: 4,
  },
  outputText: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
    color: "blue",
  },
  output: {
    color: "white",
    backgroundColor: "blue",
  },
  triggerStyle: {
    height: 40,
    backgroundColor: "blue",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  triggerText: {
    fontSize: 16,
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

export default styles;

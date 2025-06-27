import React, { useEffect, useReducer, useState } from "react";

import { Cart, CartItem, ShippingAddress } from "@/app/types/Cart";
import { UserInfo } from "@/app/types/UserInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AppState = {
  cart: Cart;
  userInfo?: UserInfo;
};

const initialState: AppState = {
  userInfo: undefined,
  cart: {
    cartItems: [],
    shippingAddress: {
      fullName: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
    },
    paymentMethod: "PayPal",
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
  },
};

type Action =
  | { type: "CART_ADD_ITEM"; payload: CartItem }
  | { type: "CART_REMOVE_ITEM"; payload: CartItem }
  | { type: "CART_RESTORE_ITEMS"; payload: CartItem }
  | { type: "CART_CLEAR" }
  | { type: "USER_SIGNIN"; payload: UserInfo }
  | { type: "USER_SIGNOUT" }
  | { type: "SAVE_SHIPPING_ADDRESS"; payload: ShippingAddress }
  | { type: "SAVE_PAYMENT_METHOD"; payload: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "CART_ADD_ITEM":
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item: CartItem) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item: CartItem) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      AsyncStorage.setItem("cartItems", JSON.stringify(cartItems));

      return { ...state, cart: { ...state.cart, cartItems } };

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item: CartItem) => item._id !== action.payload._id
      );
      AsyncStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_RESTORE_ITEMS":
      return { ...state, cart: { ...state.cart, cartItems: action.payload } };

    case "CART_CLEAR":
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };
    case "USER_SIGNOUT":
      return {
        cart: {
          cartItems: [],
          paymentMethod: "",
          shippingAddress: {
            fullName: "",
            address: "",
            postalCode: "",
            city: "",
            country: "",
          },
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      };
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    default:
      return state;
  }
}

const defaultDispatch: React.Dispatch<Action> = () => initialState;

const Store = React.createContext({
  state: initialState,
  dispatch: defaultDispatch,
});

function StoreProvider({ children }: React.PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer<React.Reducer<AppState, Action>>(
    reducer,
    initialState
  );

  const loadInitialData = async () => {
    const userInfo = await AsyncStorage.getItem("userInfo");
    const cartItems = await AsyncStorage.getItem("cartItems");
    const shippingAddress = await AsyncStorage.getItem("shippingAddress");
    const paymentMethod = await AsyncStorage.getItem("paymentMethod");

    if (userInfo) {
      dispatch({ type: "USER_SIGNIN", payload: JSON.parse(userInfo) });
    }

    if (cartItems) {
      dispatch({
        type: "CART_RESTORE_ITEMS",
        payload: JSON.parse(cartItems) as CartItem,
      });
    }

    // if (cartItems) {
    //   const parsedCartItems = JSON.parse(cartItems);
    //   if (Array.isArray(parsedCartItems)) {
    //     dispatch({
    //       type: "CART_RESTORE_ITEMS",
    //       payload: parsedCartItems [], // This should now be an array
    //     });
    //   } else {
    //     console.error("Cart items are not in the expected array format:", parsedCartItems);
    //   }
    // }

    if (shippingAddress) {
      dispatch({
        type: "SAVE_SHIPPING_ADDRESS",
        payload: JSON.parse(shippingAddress),
      });
    }

    if (paymentMethod) {
      dispatch({
        type: "SAVE_PAYMENT_METHOD",
        payload: paymentMethod,
      });
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
}

export { Store, StoreProvider };

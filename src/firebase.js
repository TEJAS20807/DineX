// This file connects our whole app to Firebase (our database).
// Every page calls functions from here instead of talking to Firebase directly.

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Firebase project settings (from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyAdolOwchdsIKhVFaGL_BHsTjAW4cnHkKI",
  authDomain: "dinex-3b529.firebaseapp.com",
  projectId: "dinex-3b529",
  storageBucket: "dinex-3b529.firebasestorage.app",
  messagingSenderId: "1076435980920",
  appId: "1:1076435980920:web:caab9168a56c34f196138d",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ---------------- MENU FUNCTIONS ----------------

// Get all menu items once (used when a page first loads)
export const getMenu = async () => {
  const snapshot = await getDocs(collection(db, "menu"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Add one new dish to the menu
export const addMenuItem = async (item) => {
  await addDoc(collection(db, "menu"), item);
};

// Remove one dish from the menu
export const deleteMenuItem = async (id) => {
  await deleteDoc(doc(db, "menu", id));
};

// ---------------- ORDER FUNCTIONS ----------------

// Customer places a new order. Status always starts as "New".
export const placeOrder = async (orderData) => {
  const docRef = await addDoc(collection(db, "orders"), {
    ...orderData,
    status: "New",
    createdAt: new Date().toISOString(),
  });
  return docRef.id; // used to redirect customer to their order tracking page
};

// Staff dashboard uses this to see ALL orders update live,
// without needing to refresh the page.
export const listenToOrders = (callback) => {
  return onSnapshot(collection(db, "orders"), (snapshot) => {
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(orders);
  });
};

// Staff clicks a button to move an order to the next stage
export const updateOrderStatus = async (orderId, newStatus) => {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, { status: newStatus });
};
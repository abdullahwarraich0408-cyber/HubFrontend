"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  OAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseApp() {
  if (!firebaseConfig.apiKey) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  const app = getFirebaseApp();
  if (!app) return null;
  return getAuth(app);
}

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

let recaptchaVerifier = null;

export function getRecaptchaVerifier(containerId = "recaptcha-container") {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase is not configured");

  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
    });
  }

  return recaptchaVerifier;
}

export async function sendWebPhoneOtp(phoneNumber) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase is not configured");

  const verifier = getRecaptchaVerifier();
  return signInWithPhoneNumber(auth, phoneNumber, verifier);
}

export async function verifyWebPhoneOtp(confirmation, code) {
  const result = await confirmation.confirm(code);
  return result.user.getIdToken();
}

export async function signInWithGooglePopup() {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase is not configured");

  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user.getIdToken();
}

export async function signInWithAppleWeb(idToken, nonce) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase is not configured");

  const provider = new OAuthProvider("apple.com");
  const credential = provider.credential({ idToken, rawNonce: nonce });
  const result = await signInWithCredential(auth, credential);
  return result.user.getIdToken();
}

export function resetRecaptcha() {
  recaptchaVerifier = null;
}

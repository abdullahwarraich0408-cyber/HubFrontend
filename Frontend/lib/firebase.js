"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithCustomToken,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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

export function signInWithGoogleGIS() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "1083815277954-9spbmn6ppfe4nnb3eong8dbihn44211a.apps.googleusercontent.com";
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("Browser environment required"));
    const loadScript = () => {
      if (window.google?.accounts?.id) return Promise.resolve();
      return new Promise((res, rej) => {
        const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (existingScript) {
          existingScript.addEventListener("load", res);
          existingScript.addEventListener("error", rej);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = res;
        script.onerror = rej;
        document.head.appendChild(script);
      });
    };

    loadScript()
      .then(() => {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              resolve(response.credential);
            } else {
              reject(new Error("Google sign-in failed: No credential returned."));
            }
          },
          auto_select: false,
        });

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            const tokenClient = window.google.accounts.oauth2.initTokenClient({
              client_id: clientId,
              scope: "email profile openid",
              callback: (tokenResponse) => {
                if (tokenResponse.id_token) {
                  resolve(tokenResponse.id_token);
                } else if (tokenResponse.access_token) {
                  resolve(tokenResponse.access_token);
                } else {
                  reject(new Error("Google sign-in was cancelled or failed."));
                }
              },
            });
            tokenClient.requestAccessToken();
          }
        });
      })
      .catch(reject);
  });
}

export async function signInWithGooglePopup() {
  const auth = getFirebaseAuth();
  if (auth) {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    provider.addScope("email");
    provider.addScope("profile");

    try {
      const result = await signInWithPopup(auth, provider);
      return result.user.getIdToken();
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
        await signInWithRedirect(auth, provider);
        return null;
      }
    }
  }

  return signInWithGoogleGIS();
}

export async function getGoogleRedirectIdToken() {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  const result = await getRedirectResult(auth);
  if (!result?.user) return null;
  return result.user.getIdToken();
}

export async function signInWithApplePopup() {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Apple sign-in is not configured.");

  const provider = new OAuthProvider("apple.com");
  provider.addScope("email");
  provider.addScope("name");

  try {
    const result = await signInWithPopup(auth, provider);
    return result.user.getIdToken();
  } catch (err) {
    const code = err?.code || "";
    if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw err;
  }
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

/**
 * Sign into Firebase using a custom token issued by the backend.
 * Call this after dev-login so firebase.auth().currentUser is populated
 * and any Firebase-based auth guards don't redirect back to login.
 */
export async function signInWithFirebaseCustomToken(customToken) {
  const auth = getFirebaseAuth();
  if (!auth) {
    // Firebase not configured (e.g. env vars missing) — skip silently
    return null;
  }
  return signInWithCustomToken(auth, customToken);
}

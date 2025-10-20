// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBhSo8fGRmeP7aYKmvAdpPgpGjJnnBAiWA",
  authDomain: "neverletit-tests.firebaseapp.com",
  databaseURL: "https://neverletit-tests-default-rtdb.firebaseio.com",
  projectId: "neverletit-tests",
  storageBucket: "neverletit-tests.firebasestorage.app",
  messagingSenderId: "82469623469",
  appId: "1:82469623469:web:0398dd21a66018da101824",
  measurementId: "G-EM5K1JF85L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Splash fade
window.onload = () => {
  setTimeout(() => {
    document.getElementById("splash").style.opacity = 0;
    setTimeout(() => {
      document.getElementById("splash").style.display = "none";
      document.getElementById("auth-section").style.display = "block";
    }, 1000);
  }, 2000);
};

// reCAPTCHA setup
window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
  size: "normal",
  callback: (response) => {
    console.log("reCAPTCHA verified");
  },
  "expired-callback": () => {
    alert("reCAPTCHA expired, please verify again");
  }
});

// Send Code
window.sendCode = async function() {
  const name = document.getElementById("name").value.trim();
  const phoneNumber = document.getElementById("phone").value.trim();
  if (!name || !phoneNumber.startsWith("+")) {
    alert("Please fill your name and full phone number (+20...)");
    return;
  }

  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, "users/" + phoneNumber.replace(/\+/g, "")));
  if (snapshot.exists()) {
    alert("This phone number is already registered!");
    return;
  }

  const appVerifier = window.recaptchaVerifier;
  signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      alert("✅ Code sent! Check your SMS.");
      document.getElementById("verify-section").style.display = "block";
    })
    .catch((error) => {
      alert("❌ " + error.message);
    });
};

// Verify Code
window.verifyCode = function() {
  const code = document.getElementById("code").value;
  const name = document.getElementById("name").value.trim();
  const phoneNumber = document.getElementById("phone").value.trim();

  confirmationResult.confirm(code)
    .then((result) => {
      const user = result.user;
      const phoneKey = phoneNumber.replace(/\+/g, "");

      // Save user info
      set(ref(db, "users/" + phoneKey), {
        name: name,
        phone: phoneNumber,
        uid: user.uid,
        verified: true
      });

      alert("✅ Verified and saved successfully! Welcome " + name + "!");
      window.location.href = "https://malek-neverletit.github.io/English-Tests/";
    })
    .catch((error) => {
      alert("❌ Invalid code: " + error.message);
    });
};

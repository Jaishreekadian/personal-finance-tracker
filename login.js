import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjj4U5kz63cdRKD4-SaXLoJAW4E6_s-cY",
  authDomain: "personal-finance-managem-656f5.firebaseapp.com",
  projectId: "personal-finance-managem-656f5",
  storageBucket: "personal-finance-managem-656f5.appspot.com",
  messagingSenderId: "14612765112",
  appId: "1:14612765112:web:4d07aa26062fccd7bc174d",
  measurementId: "G-9N85YFY9KL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Redirect if already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "index.html";
  }
});

// Login logic
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});

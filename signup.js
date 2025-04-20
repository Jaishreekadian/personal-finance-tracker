import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

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

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created!");
    window.location.href = "login.html";
  } catch (err) {
    alert(err.message);
  }
});

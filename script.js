import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Firebase config
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
const db = getFirestore(app);
const auth = getAuth(app);

// Elements
const balanceEl = document.getElementById("balance");
const amountEl = document.getElementById("amount");
const categoryEl = document.getElementById("category");
const dateEl = document.getElementById("date");
const typeEl = document.getElementById("type");
const saveBtn = document.getElementById("saveBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userEmailSpan = document.getElementById("userEmail");
let summaryChart = null;

let currentUID = null;

// Auth state handling
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    currentUID = user.uid;
    userEmailSpan.textContent = user.email;
    loadTransactions(currentUID);
  }
});

// Save transaction
async function saveTransaction() {
  const amount = parseFloat(amountEl.value);
  const category = categoryEl.value.trim();
  const date = dateEl.value;
  const type = typeEl.value;

  if (isNaN(amount) || !category || !date || !type) {
    alert("Please fill all fields correctly.");
    return;
  }

  await addDoc(collection(db, "transactions"), {
    amount,
    category,
    date,
    type,
    uid: currentUID
  });

  amountEl.value = "";
  categoryEl.value = "";
  dateEl.value = "";
  typeEl.value = "income";

  loadTransactions(currentUID);
}

// Load transactions from Firestore
async function loadTransactions(uid) {
  const snapshot = await getDocs(collection(db, "transactions"));
  const transactions = snapshot.docs
    .map(doc => doc.data())
    .filter(tx => tx.uid === uid);

  updateBalance(transactions);
  drawChart(transactions);
}

function updateBalance(transactions) {
  let total = 0;
  transactions.forEach(tx => {
    const amount = parseFloat(tx.amount);
    const type = (tx.type || "").toLowerCase();
    if (!isNaN(amount) && (type === "income" || type === "expense")) {
      total += type === "income" ? amount : -amount;
    }
  });
  balanceEl.textContent = `₹${total.toLocaleString()}`;
}

function drawChart(transactions) {
  const monthly = {};
  transactions.forEach(tx => {
    const month = tx.date?.slice(0, 7);
    const amount = parseFloat(tx.amount);
    const type = (tx.type || "").toLowerCase();
    if (!month || isNaN(amount) || !(type === "income" || type === "expense")) return;
    if (!monthly[month]) monthly[month] = { income: 0, expense: 0 };
    monthly[month][type] += amount;
  });

  const labels = Object.keys(monthly).sort();
  const incomeData = labels.map(m => monthly[m].income);
  const expenseData = labels.map(m => monthly[m].expense);

  const ctx = document.getElementById("summaryChart").getContext("2d");
  if (summaryChart) summaryChart.destroy();

  summaryChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Income", backgroundColor: "#4ade80", data: incomeData },
        { label: "Expense", backgroundColor: "#f87171", data: expenseData }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Monthly Summary" }
      }
    }
  });
}

saveBtn.addEventListener("click", saveTransaction);
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}

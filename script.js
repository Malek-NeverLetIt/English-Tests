import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, get, set, child } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

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
const db = getDatabase(app);

const splash = document.getElementById('splash');
const loginContainer = document.getElementById('loginContainer');
const mainContainer = document.getElementById('mainContainer');
const usernameDisplay = document.getElementById('usernameDisplay');
const testsList = document.getElementById('testsList');
const selectedTestText = document.getElementById('selectedTestText');
const startBtn = document.getElementById('startBtn');
const infoMsg = document.getElementById('infoMsg');
const tests = [
  "English-Test-Quick-Week-Test_2.html",
  "English-Test-Unit_1.html",
  "English_TestQ1.html",
  "English_TestQ2.html",
  "English_TestQ3.html"
];

let selectedTest = "";
let user = JSON.parse(localStorage.getItem('examUser'));

// Splash fade and check
setTimeout(() => {
  splash.classList.add('hide');
  setTimeout(() => {
    if(user) openMain(user);
    else loginContainer.classList.add('show');
  }, 1000);
}, 2500);

// Register button
document.getElementById('sendReq').onclick = async () => {
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  if(!name || !phone) return alert("Please fill all fields.");

  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, `users`));
  let data = snapshot.exists() ? snapshot.val() : {};
  let exists = Object.values(data).some(u => u.name === name || u.phone === phone);

  if(exists) {
    infoMsg.innerText = "❌ Username or phone number already taken.";
  } else {
    const pass = "NL" + Math.floor(1000 + Math.random() * 9000);
    const userObj = {name, phone, password: pass};
    await set(ref(db, `users/${phone}`), userObj);
    infoMsg.innerText = `✅ Approved! Your password: ${pass}`;
    localStorage.setItem('examUser', JSON.stringify(userObj));
    setTimeout(() => openMain(userObj), 2000);
  }
};

// Main page
function openMain(user) {
  loginContainer.classList.remove('show');
  usernameDisplay.innerText = user.name;
  mainContainer.classList.add('show');
  tests.forEach(test => {
    const btn = document.createElement('button');
    btn.innerText = test.replace('.html','');
    btn.onclick = () => {
      selectedTest = test;
      selectedTestText.innerText = "Selected: " + test;
      startBtn.style.display = "inline-block";
    };
    testsList.appendChild(btn);
  });
}

startBtn.onclick = () => {
  if(!selectedTest) return;
  window.location.href = "https://malek-neverletit.github.io/English-Tests/" + selectedTest;
};

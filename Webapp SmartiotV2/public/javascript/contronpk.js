// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAlzFuhs6xdfMegTzZBFawvVlj9uPibrmo",
    authDomain: "iotfirebase-96f81.firebaseapp.com",
    databaseURL: "https://iotfirebase-96f81-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iotfirebase-96f81",
    storageBucket: "iotfirebase-96f81.appspot.com",
    messagingSenderId: "344685924317",
    appId: "1:344685924317:web:eb9ed73ebb2a2d55f97034",
    measurementId: "G-RRYQJNM665"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Add this code for AutoTimenpk switch
const autoTimeNPKRef = ref(db, 'button/AutoTimenpk');

function handleAutoTimeNPKChange(event) {
    set(autoTimeNPKRef, event.target.checked);
}

onValue(autoTimeNPKRef, (snapshot) => {
    const checkbox = document.getElementById('AutoTimenpk');
    checkbox.checked = snapshot.val();
});

const autoTimeNPKCheckbox = document.getElementById('AutoTimenpk');
autoTimeNPKCheckbox.addEventListener('change', handleAutoTimeNPKChange);

// Code for pumnpk1 switch
const pumnpk1Ref = ref(db, 'button/pumnpk1');

function handlePumnpk1Change(event) {
    set(pumnpk1Ref, event.target.checked);
}

onValue(pumnpk1Ref, (snapshot) => {
    const checkbox = document.getElementById('pumnpk1');
    checkbox.checked = snapshot.val();
});

const pumnpk1Checkbox = document.getElementById('pumnpk1');
pumnpk1Checkbox.addEventListener('change', handlePumnpk1Change);

// Code for pumnpk2 switch
const pumnpk2Ref = ref(db, 'button/pumnpk2');

function handlePumnpk2Change(event) {
    set(pumnpk2Ref, event.target.checked);
}

onValue(pumnpk2Ref, (snapshot) => {
    const checkbox = document.getElementById('pumnpk2');
    checkbox.checked = snapshot.val();
});

const pumnpk2Checkbox = document.getElementById('pumnpk2');
pumnpk2Checkbox.addEventListener('change', handlePumnpk2Change);
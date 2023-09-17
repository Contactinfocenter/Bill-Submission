// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxIRNJhbFPUqjXzcirl2-g51WmrWSVg9A",
  authDomain: "conveyance-remote-validation.firebaseapp.com",
  databaseURL: "https://conveyance-remote-validation-default-rtdb.firebaseio.com",
  projectId: "conveyance-remote-validation",
  storageBucket: "conveyance-remote-validation.appspot.com",
  messagingSenderId: "847207278388",
  appId: "1:847207278388:web:58ca001a9786ee9e196761"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";

const db = getDatabase();

const name = document.getElementById('nameInp');
const email = document.getElementById('emailInp');
const username = document.getElementById('userInp');
const pass = document.getElementById('passInp');
const submit = document.getElementById('sub_btn');

function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

function Validation() {
  let nameregex = /^[a-zA-Z\s]+$/;
  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let userregex = /^[a-zA-Z0-9]{5,}$/;

  if (isEmptyOrSpaces(name.value) || isEmptyOrSpaces(email.value) || isEmptyOrSpaces(username.value) || isEmptyOrSpaces(pass.value)) {
    alert("You cannot leave any field empty");
    return false;
  }

  if (!nameregex.test(name.value)) {
    alert("The name should contain only alphabets and spaces!");
    return false;
  }

  // List of allowed domains
  const allowedDomains = ["carnival.com.bd", "ssd-tech.io"]; // Add your desired domains here

  // Get the domain part of the email address
  const emailDomain = email.value.split('@')[1];

  // Check if the email address is from one of the allowed domains
  if (!emailPattern.test(email.value) || !allowedDomains.includes(emailDomain)) {
    alert("Enter a valid email");
    return false;
  }

  if (!userregex.test(username.value)) {
    alert("- Username can only be alphanumeric\n- Username must be at least 5 characters\n- Username cannot contain spaces");
    return false;
  }
  return true;
}

function RegisterUser() {
  if (!Validation()) {
    return;
  }
  const dbRef = ref(db);

  get(child(dbRef, "Userslist/" + username.value)).then((snapshot) => {
    if (snapshot.exists()) {
      alert("Account already exists!");
    } else {
      set(ref(db, "Userslist/" + username.value), {
        fullname: name.value,
        email: email.value,
        username: username.value,
        password: encPass() // Encrypt the password
      })
        .then(() => {
          alert("User added successfully");
          // Reset the form
          document.getElementById('registrationForm').reset();
          
          // Redirect to the login page after successful registration
          window.location.href = 'login.html'; // Replace 'login.html' with your login page URL
        })
        .catch((error) => {
          alert("Error: " + error);
        });
    }
  });
}

function encPass() {
  var pass12 = CryptoJS.AES.encrypt(pass.value, pass.value);
  return pass12.toString();
}

// Prevent form submission and handle it through RegisterUser
document.getElementById('registrationForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission behavior
  RegisterUser();
});

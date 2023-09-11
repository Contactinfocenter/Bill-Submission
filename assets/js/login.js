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
        
        import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
        const db = getDatabase();
        
        const username = document.getElementById('userInp');
        const pass = document.getElementById('passInp');
        const submit = document.getElementById('sub_btn');
        
        function AuthenticateUser() {
            const dbRef = ref(db);
            get(child(dbRef, "Userslist/" + username.value)).then((snapshot) => {
                if (snapshot.exists()) {
                    let dbpass = decPass(snapshot.val().password);
                    if (dbpass == pass.value) {
                        login(snapshot.val());
                    } else {
                        alert("User or password is invalid");
                    }
                } else {
                    alert("User does not exist");
                }
            });
        }
        
        function decPass(dbpass) {
            var pass12 = CryptoJS.AES.decrypt(dbpass, pass.value);
            return pass12.toString(CryptoJS.enc.Utf8);
        }
        
        function login(user) {
            let keepLoggedIn = document.getElementById('customSwitch1').checked;
            if (!keepLoggedIn) {
                sessionStorage.setItem('user', JSON.stringify(user));
                window.location = "index.html";
            } else {
                localStorage.setItem('keepLoggedIn', 'yes');
                localStorage.setItem('user', JSON.stringify(user));
                window.location = "index.html";
            }
        }
        
        submit.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default form submission behavior
            AuthenticateUser();
        });
// To capture the authenticated username dynamically

function getUsername() {
    let keepLoggedIn = localStorage.getItem('keepLoggedIn');
    if (keepLoggedIn == "yes") {
        currentUser = JSON.parse(localStorage.getItem('user'));
    } else {
        currentUser = JSON.parse(sessionStorage.getItem('user'));
    }
  }
  
  function Signout() {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    localStorage.removeItem('keepLoggedIn');
    window.location = "login.html"; // Redirect to the login page after signout
  }
  
  window.onload = function () {
    getUsername();
    if (currentUser == null) {
        // Redirect to the login page
        window.location.href = "login.html";
    } else {
        // Update the userlink element with the authenticated username
        userlink.innerText = currentUser.username;
        header.innerText = "Welcome " + currentUser.fullname;
        userlink.classList.replace("btn", "nav-link");
        userlink.classList.remove("btn-primary");
        userlink.href = "#";
  
        signoutlink.innerText = "Sign out";
        signoutlink.classList.replace("btn", "nav-link");
        signoutlink.classList.remove("btn-success");
        signoutlink.href = "javascript:Signout()";
  
        // Update the authenticated username here
        const authenticatedUsername = currentUser.username;
  
        // Sample data (replace with your actual data)
        let data = [];
  
        // Fetch data from Google Sheets
        fetch('https://script.google.com/macros/s/AKfycbxcK_gP4qu1UXziEZN0dMEkcndX6L_Ycz0zi7n2D2HQRCxb0Dq1w3PFBMmLfuV3PNrfKA/exec')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(responseData => {
                // Store the fetched data in the "data" variable
                data = responseData.data;
  
                // Filter the data based on the authenticated username
                const filteredData = data.filter(item => item.Username === authenticatedUsername);
  
                // Call a function to populate the month filter dropdown
                populateMonthFilter();
  
                // Call a function to populate the HTML table with the filtered data
                populateTable(filteredData);
  
                // Event listener for the "Apply Filters" button
                document.getElementById('apply-filters').addEventListener('click', applyFilters);
  
                // Function to apply filters and update the table
                function applyFilters() {
                    const selectedMonth = document.getElementById('filter-month').value;
                    const selectedPurpose = document.getElementById('filter-purpose').value;
  
                    // Filter the data based on the selected month and purpose
                    const filteredData = data.filter(item => {
                        return (selectedMonth === '' || item.Month === selectedMonth) &&
                            (selectedPurpose === '' || item.Purpose === selectedPurpose) &&
                            item.Username === authenticatedUsername;
                    });
  
                    // Populate the HTML table with the filtered data
                    populateTable(filteredData);
                }
            })
            .catch(error => console.error('Error fetching or processing data:', error));
  
        // Function to populate the table with data
        function populateTable(data) {
            var table = document.getElementById('data-table');
            var tbody = table.getElementsByTagName('tbody')[0]; // Get the table body
  
            // Clear existing table rows
            tbody.innerHTML = '';
  
            for (var i = 0; i < data.length; i++) {
                var row = tbody.insertRow();
                for (var key in data[i]) {
                    if (data[i].hasOwnProperty(key)) {
                        var cell = row.insertCell();
                        // Format the date if the column name is 'Date'
                        if (key === 'Date') {
                            cell.textContent = formatDate(data[i][key]);
                        } else {
                            cell.textContent = data[i][key];
                        }
                    }
                }
            }
        }
  
        // Function to format the date as 'YYYY-MM-DD'
        function formatDate(dateString) {
            var date = new Date(dateString);
            var year = date.getFullYear();
            var month = String(date.getMonth() + 1).padStart(2, '0');
            var day = String(date.getDate()).padStart(2, '0');
            return year + '-' + month + '-' + day;
        }
  
        // Function to populate the month filter dropdown
        function populateMonthFilter() {
            const monthDropdown = document.getElementById('filter-month');
            const months = [...new Set(data.map(item => item.Month))]; // Get unique months
            months.sort(); // Sort the months
            months.forEach(month => {
                const option = document.createElement('option');
                option.value = month;
                option.textContent = month;
                monthDropdown.appendChild(option);
            });
        }
    }
  }
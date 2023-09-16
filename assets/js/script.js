// script.js
// Assuming you have captured the authenticated username in a variable called 'authenticatedUsername'
const authenticatedUsername = '101421'; // Replace this with the actual username

// Fetch data from Google Sheets
fetch('https://script.google.com/macros/s/AKfycbxcK_gP4qu1UXziEZN0dMEkcndX6L_Ycz0zi7n2D2HQRCxb0Dq1w3PFBMmLfuV3PNrfKA/exec')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Filter the data based on the authenticated username
    console.log("Data:", data);

// Filter the data based on the authenticated username
const authenticatedUsername = '101421'; // Replace with the authenticated user's username

// Filter the data based on the authenticated username
const filteredData = data.data.filter(item => item.Username === authenticatedUsername);

console.log("Filtered Data:", filteredData);
    // Call a function to populate the HTML table with the filtered data
    populateTable(filteredData);
  })
  .catch(error => console.error('Error fetching or processing data:', error));


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

var billCounter = 0;

function addBill() {
    billCounter++;
    var billDiv = document.createElement('div');
    billDiv.className = 'bill-item'; // Add the 'bill-item' class
    billDiv.innerHTML = `
        <hr>
        <h6>Date ${billCounter}</h6>
        <div class="form-row">
            <div class="col-md-2 mb-3">
                <label for="date${billCounter}">Date:</label>
                <input type="date" class="form-control" name="date${billCounter}" required>
            </div>
            <div class="col-md-2 mb-3">
                <label for="purpose${billCounter}">Purpose:</label>
                <select class="form-control" name="purpose${billCounter}" required>
                    <option value="2:00 PM to 11 PM">2:00 PM to 11 PM</option>
                    <option value="Remote">Remote</option>
                </select>
            </div>
            <div class="col-md-2 mb-3">
                <label for="from${billCounter}">From:</label>
                <input type="text" class="form-control" name="from${billCounter}" required>
            </div>
            <div class="col-md-2 mb-3">
                <label for="to${billCounter}">To:</label>
                <input type="text" class="form-control" name="to${billCounter}" required>
            </div>
            <div class="col-md-2 mb-3">
                <label for="transport${billCounter}">Mode of Transport:</label>
                <input type="text" class="form-control" name="transport${billCounter}" required>
            </div>
            <div class="col-md-2 mb-3">
                <label for="amount${billCounter}">Amount in Taka:</label>
                <input type="number" class="form-control bill-amount" name="amount${billCounter}" required>
            </div>
        </div>
    `;
    document.getElementById('billList').appendChild(billDiv);
}

function removeBill() {
    if (billCounter > 0) {
        var lastBill = document.getElementById('billList').lastChild;
        lastBill.parentNode.removeChild(lastBill);
        billCounter--;
    }
}

document.getElementById('conveyanceForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    formData.append('billCount', billCounter);

    // Set the timestamp to the current date and time
    var timestamp = new Date().toLocaleString();
    formData.set('timestamp', timestamp);

    var formDataObject = Object.fromEntries(formData);

    var billDetails = [];
    var totalAmount = 0;

    for (var i = 1; i <= billCounter; i++) {
        var billDetail = {
            employeeId: formDataObject['employeeId'],
            month: formDataObject['month'],
            date: formDataObject[`date${i}`],
            purpose: formDataObject[`purpose${i}`],
            from: formDataObject[`from${i}`],
            to: formDataObject[`to${i}`],
            transport: formDataObject[`transport${i}`],
            amount: parseFloat(formDataObject[`amount${i}`]) || 0
        };
        totalAmount += billDetail.amount;
        billDetails.push(billDetail);
    }

    document.getElementById('totalAmount').textContent = totalAmount;

    // Show the loading overlay and spinner
    document.getElementById('loading-overlay').style.display = 'block';

    // Example fetch request (replace with your actual endpoint)
    fetch('https://script.google.com/macros/s/AKfycbzariY2fIQ0OCTTlA4AsKg_b8o65ZStbHKAJ36UKl9MqB_LX5jx5iMCsjlRvKnt0BE/exec', {
        method: 'POST',
        body: JSON.stringify(billDetails)
    })
    .then(response => response.json())
    .then(data => {
        // Hide the loading overlay and spinner
        document.getElementById('loading-overlay').style.display = 'none';

        if (data.result === 'success') {
            $('#successModal').modal('show');
            document.getElementById('conveyanceForm').reset();
            billCounter = 0;
            document.getElementById('billList').innerHTML = '';
        } else {
            alert('Error submitting the form. Please try again.');
        }
    })
    .catch(error => {
        // Hide the loading overlay and spinner
        document.getElementById('loading-overlay').style.display = 'none';

        alert('Error submitting the form. Please try again.');
        console.error(error);
    });
});

// Initialize Bootstrap-datepicker for the Month Field
var datePickerInput = $('#month');
datePickerInput.datepicker({
    format: "MM",
    startView: "months",
    minViewMode: "months"
});

datePickerInput.on('changeMonth', function () {
    datePickerInput.datepicker('hide'); // Close the datepicker modal
});

function togglePreview() {
var formData = new FormData(document.getElementById('conveyanceForm'));
var billItems = document.querySelectorAll('.bill-item');
var invoiceContent = document.getElementById('invoiceContent');

if (billItems.length === 0) {
    alert('Please add bill details before previewing.');
    return;
}

// Create the invoice HTML
var invoiceHTML = '';

invoiceHTML += '<h6>Employee ID: ' + formData.get('employeeId') + '</h6>';
invoiceHTML += '<h6>Month: ' + formData.get('month') + '</h6>';

// Create a table for bill items
invoiceHTML += '<table class="table">';
invoiceHTML += '<tr>';
invoiceHTML += '<th>Date</th>';
invoiceHTML += '<th>Purpose</th>';
invoiceHTML += '<th>From</th>';
invoiceHTML += '<th>To</th>';
invoiceHTML += '<th>Mode of Transport</th>';
invoiceHTML += '<th>Amount in Taka</th>';
invoiceHTML += '</tr>';

var totalAmount = 0;

// Add rows for each bill item
billItems.forEach(function (billItem, index) {
    invoiceHTML += '<tr>';
    invoiceHTML += '<td>' + formData.get(`date${index + 1}`) + '</td>';
    invoiceHTML += '<td>' + formData.get(`purpose${index + 1}`) + '</td>';
    invoiceHTML += '<td>' + formData.get(`from${index + 1}`) + '</td>';
    invoiceHTML += '<td>' + formData.get(`to${index + 1}`) + '</td>';
    invoiceHTML += '<td>' + formData.get(`transport${index + 1}`) + '</td>';
    var amount = parseFloat(formData.get(`amount${index + 1}`)) || 0;
    totalAmount += amount;
    invoiceHTML += '<td>' + amount.toFixed(2) + '</td>';
    invoiceHTML += '</tr>';
});

// Add the total amount row
invoiceHTML += '<tr>';
invoiceHTML += '<td colspan="5"><strong>Total Amount:</strong></td>';
invoiceHTML += '<td><strong>' + totalAmount.toFixed(2) + '</strong></td>';
invoiceHTML += '</tr>';

// Close the table
invoiceHTML += '</table>';

invoiceContent.innerHTML = invoiceHTML;
$('#invoiceModal').modal('show');
}
// Book an appointment
function bookAppointment() {
    const name = document.getElementById('patient-name').value;
    const phone = document.getElementById('patient-phone').value;
    const gender = document.getElementById('patient-gender').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;

    if (!name || !phone || !date) {
        alert('Please fill in all required fields.');
        return;
    }

    const patientId = name.substring(0, 3).toUpperCase() + phone.substring(phone.length - 4);
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

    // Define time slots
    const timeSlots = generateTimeSlots();

    // Find the next available time slot
    let timeSlot = timeSlots[bookings.length % timeSlots.length];  // Cycles through the time slots

    const booking = {
        id: patientId,
        name: name,
        gender: gender,
        service: service,
        date: date,
        time: timeSlot,
        phone: phone
    };

    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    alert(`Booking confirmed!\n
    Patient ID: ${patientId}\n
    Name: ${name}\n
    Gender: ${gender}\n
    Service: ${service}\n
    Date: ${date}\n
    Time: ${timeSlot}\n
    Phone Number: ${phone}\n
    `);

    closePopup('booking-popup');
    renderCalendar();
}

// Generate time slots from 11:00 AM to 10:00 PM in 15-minute intervals
function generateTimeSlots() {
    const slots = [];
    let startTime = new Date();
    startTime.setHours(11, 0, 0, 0); // Start at 11:00 AM

    const endTime = new Date();
    endTime.setHours(22, 0, 0, 0); // End at 10:00 PM

    while (startTime < endTime) {
        slots.push(startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        startTime.setMinutes(startTime.getMinutes() + 15);
    }

    return slots;
}

// Render calendar for the current month with time slots
function renderCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    calendarContainer.innerHTML = '';

    const header = document.createElement('h2');
    header.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${year}`;
    calendarContainer.appendChild(header);

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
    grid.style.gap = '5px';
    grid.style.fontFamily = 'Montserrat, sans-serif';

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.style.fontWeight = 'bold';
        dayHeader.style.textAlign = 'center';
        dayHeader.textContent = day;
        grid.appendChild(dayHeader);
    });

    for (let i = 0; i < firstDay.getDay(); i++) {
        grid.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayCell = document.createElement('div');
        dayCell.style.border = '1px solid #ddd';
        dayCell.style.padding = '10px';
        dayCell.style.textAlign = 'center';
        dayCell.style.cursor = 'pointer';
        dayCell.style.overflowY = 'auto';
        dayCell.style.maxHeight = '150px';  // Set the max height to enable scrolling if needed

        dayCell.innerHTML = `<div>${day}</div>`;

        const bookingsForDay = bookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate.getDate() === day && bookingDate.getMonth() === month && bookingDate.getFullYear() === year;
        });

        bookingsForDay.forEach(booking => {
            const bookingElement = document.createElement('div');
            bookingElement.textContent = `${booking.time} - ${booking.name}`;
            bookingElement.style.backgroundColor = '#a5e0ff';
            bookingElement.style.marginTop = '5px';
            bookingElement.style.padding = '2px';
            bookingElement.style.borderRadius = '4px';
            bookingElement.style.fontSize = '12px';
            bookingElement.style.color = '#000';
            bookingElement.onclick = () => showBookingDetails(booking);
            dayCell.appendChild(bookingElement);
        });

        grid.appendChild(dayCell);
    }

    calendarContainer.appendChild(grid);
}

// Show booking details in a popup
function showBookingDetails(booking) {
    alert(`
        ID: ${booking.id}\n
        Name: ${booking.name}\n
        Gender: ${booking.gender}\n
        Service: ${booking.service}\n
        Date: ${booking.date}\n
        Time: ${booking.time}\n
        Phone: ${booking.phone}\n
    `);
}

// View patient history
function viewHistory() {
    const patientId = document.getElementById('patient-id').value.trim();
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const historyResult = document.getElementById('history-result');
    historyResult.innerHTML = ''; // Clear previous results

    const patientBookings = bookings.filter(booking => booking.id === patientId);

    if (patientBookings.length === 0) {
        historyResult.innerHTML = '<p>No history found for this patient ID.</p>';
    } else {
        patientBookings.forEach(booking => {
            historyResult.innerHTML += `
                <p>
                    <span>ID:</span> ${booking.id}<br>
                    <span>Name:</span> ${booking.name}<br>
                    <span>Gender:</span> ${booking.gender}<br>
                    <span>Service:</span> ${booking.service}<br>
                    <span>Date:</span> ${booking.date}<br>
                    <span>Time:</span> ${booking.time}<br>
                    <span>Phone:</span> ${booking.phone}<br>
                </p>
            `;
        });
    }
    
    // Open history popup to show the result
    openPopup('history-popup');
}

// Sign-in function
function signIn(username, password) {
    const validUsername = ['eyad', 'anas', 'heba', 'maher', 'reception'];
    const validPassword = 'Clinic14';

    if (validUsername.includes(username) && password === validPassword) {
        closePopup('sign-in-popup');
        openPopup('staff-calendar-popup');
        renderCalendar(); // Render the calendar on sign-in
    } else {
        alert('Invalid username or password.');
    }
}

// Open a popup
function openPopup(popupId) {
    const popup = document.getElementById(popupId);
    const overlay = document.getElementById('popup-overlay');
    if (popup && overlay) {
        popup.style.display = 'block';
        overlay.style.display = 'block';
    } else {
        console.error(`Popup or overlay with ID "${popupId}" not found.`);
    }
}

// Close a popup
function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    const overlay = document.getElementById('popup-overlay');
    if (popup && overlay) {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        console.error(`Popup or overlay with ID "${popupId}" not found.`);
    }
}

// Toggle visibility of canceled & no show bookings
function toggleCanceledNoShow() {
    const container = document.getElementById('canceled-no-show-container');
    const display = container.style.display === 'none' ? 'block' : 'none';
    container.style.display = display;

    if (display === 'block') {
        renderCanceledNoShowCalendar();
    }
}

// Render canceled & no show bookings
function renderCanceledNoShowCalendar() {
    const canceledList = document.getElementById('canceled-list');
    const noShowList = document.getElementById('noshow-list');
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

    canceledList.innerHTML = '';
    noShowList.innerHTML = '';

    bookings.forEach(booking => {
        if (booking.status === 'canceled') {
            const item = document.createElement('li');
            item.textContent = `${booking.date} - ${booking.time} - ${booking.name}`;
            canceledList.appendChild(item);
        } else if (booking.status === 'noshow') {
            const item = document.createElement('li');
            item.textContent = `${booking.date} - ${booking.time} - ${booking.name}`;
            noShowList.appendChild(item);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();  // Render the calendar when the page loads
});

function confirmCall() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
        if (confirm('Do you want to call this number?')) {
            window.location.href = 'tel:+201114654440';
        }
    } else {
        alert('Phone calls are not supported on this device. Please dial the number manually: +201114654440');
    }
}


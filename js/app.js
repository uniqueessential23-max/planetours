import { tourData, hotelData, flightData } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    // Navigation and Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // Dynamic Content Loading (Home Page)
    const featuredGrid = document.querySelector('#featured-tours');
    if (featuredGrid) {
        renderTours(tourData.slice(0, 3), featuredGrid);
    }

    // Tours Page Logic
    const toursGrid = document.querySelector('#tours-grid');
    if (toursGrid) {
        renderTours(tourData, toursGrid);
        
        // Filtering
        document.querySelector('#filter-dest')?.addEventListener('change', filterTours);
        document.querySelector('#filter-price')?.addEventListener('input', filterTours);
    }

    // Hotels Page Logic
    const hotelsGrid = document.querySelector('#hotels-grid');
    if (hotelsGrid) {
        renderHotels(hotelData, hotelsGrid);
    }

    // Flights Page Logic
    const flightsList = document.querySelector('#flights-list');
    if (flightsList) {
        renderFlights(flightData, flightsList);
    }

    // Booking Logic
    const bookingForm = document.querySelector('#booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBooking);
    }

    // WhatsApp Floating Button
    if (!document.querySelector('.whatsapp-btn')) {
        const wa = document.createElement('a');
        wa.href = "https://wa.me/211923348074"; // International format for South Sudan (+211)
        wa.className = "whatsapp-btn";
        wa.innerHTML = '<i class="fab fa-whatsapp"></i>';
        wa.target = "_blank";
        wa.title = "Chat with us on WhatsApp";
        document.body.appendChild(wa);
    }
});

export function bookViaWhatsApp(serviceType, details = "") {
    const numbers = ["211923348074", "211924838065"];
    const selectedNumber = numbers[0]; // Primary contact
    const message = encodeURIComponent(`Hello Planet Tours! I would like to book a ${serviceType}. ${details}`);
    window.open(`https://wa.me/${selectedNumber}?text=${message}`, '_blank');
}

function renderTours(tours, container) {
    container.innerHTML = tours.map(tour => `
        <div class="card">
            <div class="card-img" style="background-image: url('${tour.image}')"></div>
            <div class="card-content">
                <h3 class="card-title">${tour.title}</h3>
                <p class="text-grey"><i class="fas fa-map-marker-alt"></i> ${tour.destination}</p>
                <div class="card-info">
                    <span><i class="fas fa-clock"></i> ${tour.duration}</span>
                    <span class="card-price">$${tour.price}</span>
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 20px;" onclick="location.href='booking.html?id=${tour.id}&type=tour'">Book Now</button>
            </div>
        </div>
    `).join('');
}

function renderHotels(hotels, container) {
    container.innerHTML = hotels.map(hotel => `
        <div class="card">
            <div class="card-img" style="background-image: url('${hotel.image}')"></div>
            <div class="card-content">
                <h3 class="card-title">${hotel.title}</h3>
                <p class="text-grey"><i class="fas fa-city"></i> ${hotel.city}</p>
                <div class="card-info">
                    <span>${'★'.repeat(hotel.rating)}${'☆'.repeat(5-hotel.rating)}</span>
                    <span class="card-price">$${hotel.price}/night</span>
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 20px;" onclick="location.href='booking.html?id=${hotel.id}&type=hotel'">Reserve</button>
            </div>
        </div>
    `).join('');
}

function renderFlights(flights, container) {
    container.innerHTML = flights.map(flight => `
        <div class="card flex" style="padding: 20px; flex-direction: row; justify-content: space-between;">
            <div>
                <h4>${flight.airline}</h4>
                <p>${flight.from} → ${flight.to}</p>
            </div>
            <div class="text-center">
                <p class="text-grey">Departure</p>
                <strong>${flight.time}</strong>
            </div>
            <div class="text-right">
                <p class="card-price">$${flight.price}</p>
                <button class="btn btn-secondary" onclick="location.href='booking.html?id=${flight.id}&type=flight'">Reserve</button>
            </div>
        </div>
    `).join('');
}

function filterTours() {
    const dest = document.querySelector('#filter-dest').value;
    const price = document.querySelector('#filter-price').value;
    
    let filtered = tourData;
    if (dest !== 'all') {
        filtered = filtered.filter(t => t.destination.includes(dest));
    }
    filtered = filtered.filter(t => t.price <= price);
    
    renderTours(filtered, document.querySelector('#tours-grid'));
    document.querySelector('#price-val').textContent = `$${price}`;
}

function handleBooking(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate Payment
    const paymentModal = document.createElement('div');
    paymentModal.className = 'payment-modal';
    paymentModal.innerHTML = `
        <div class="booking-form text-center">
            <h2>Payment Gateway</h2>
            <p>Securely pay for your booking</p>
            <div class="flex" style="justify-content: center; margin: 20px 0;">
                <img src="https://img.icons8.com/color/48/000000/visa.png" />
                <img src="https://img.icons8.com/color/48/000000/mastercard.png" />
                <img src="https://img.icons8.com/color/48/000000/mobile-payment.png" />
            </div>
            <button class="btn btn-primary" id="confirm-pay">Pay Now ($${data.price || '500'})</button>
        </div>
    `;
    
    paymentModal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:2000;";
    document.body.appendChild(paymentModal);
    
    document.querySelector('#confirm-pay').addEventListener('click', () => {
        paymentModal.innerHTML = `
            <div class="booking-form text-center">
                <div style="font-size: 4rem; color: #2ecc71; margin-bottom: 20px;">✓</div>
                <h2>Payment Successful!</h2>
                <p>Your booking for <strong>${data.name}</strong> has been confirmed.</p>
                <p>A confirmation has been sent to your phone.</p>
                <button class="btn btn-primary" style="margin-top:20px" onclick="location.href='index.html'">Return Home</button>
            </div>
        `;
    });
}

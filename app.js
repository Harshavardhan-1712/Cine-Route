class CineBookApp {
    constructor() {
        this.presenter = new MoviePresenter();
        this.currentPage = 'movies';
        this.genres = ['All', 'Action', 'Adventure', 'Drama', 'Sci-Fi', 'Crime', 'Thriller'];
        this.selectedGenre = 'All';
        
        this.initializeApp();
    }

    // Initialize the application
    initializeApp() {
        this.setupEventListeners();
        this.loadMoviesPage();
        this.renderGenreFilter();
    }

    // Setup event listeners
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 300);
        });

        // Back button listeners
        document.getElementById('showtimes-back-btn').addEventListener('click', () => {
            this.showMovieDetails();
        });

        document.getElementById('seats-back-btn').addEventListener('click', () => {
            this.showShowtimes();
        });

        document.getElementById('payment-back-btn').addEventListener('click', () => {
            this.showSeatSelection();
        });
    }

    // Show specific page
    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId.replace('-page', '');
        }
    }

    // Load movies page
    loadMoviesPage() {
        this.showPage('movies-page');
        this.presenter.loadMovies(
            (movies) => this.renderMovies(movies),
            (error) => this.showError(error)
        );
    }

    // Handle search
    handleSearch(query) {
        if (query.trim()) {
            this.presenter.searchMovies(
                query,
                (movies) => this.renderMovies(movies),
                (error) => this.showError(error)
            );
        } else {
            this.loadMoviesPage();
        }
    }

    // Render genre filter
    renderGenreFilter() {
        const genreFilter = document.getElementById('genre-filter');
        genreFilter.innerHTML = '';

        this.genres.forEach(genre => {
            const button = document.createElement('button');
            button.className = `btn btn-sm ${this.selectedGenre === genre ? 'btn-primary' : 'btn-outline'}`;
            button.textContent = genre;
            
            button.addEventListener('click', () => {
                this.handleGenreFilter(genre);
            });

            genreFilter.appendChild(button);
        });
    }

    // Handle genre filter
    handleGenreFilter(genre) {
        this.selectedGenre = genre;
        this.renderGenreFilter();

        if (genre === 'All') {
            this.loadMoviesPage();
        } else {
            this.presenter.loadMovies(
                (allMovies) => {
                    const filtered = allMovies.filter(movie => 
                        movie.genre.includes(genre)
                    );
                    this.renderMovies(filtered);
                },
                (error) => this.showError(error)
            );
        }
    }

    // Render movies grid
    renderMovies(movies) {
        const moviesGrid = document.getElementById('movies-grid');
        
        if (movies.length === 0) {
            moviesGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <h3 class="text-lg font-semibold mb-2 text-foreground">No movies found</h3>
                    <p class="text-muted-foreground">No movies available at the moment</p>
                </div>
            `;
            return;
        }

        moviesGrid.innerHTML = movies.map(movie => `
            <div class="movie-card" onclick="app.showMovieDetails(${movie.id})">
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="movie-genre">${movie.genre.join(', ')}</p>
                    <div class="movie-rating">
                        <span>⭐</span>
                        <span>${movie.rating}/10</span>
                        <span class="text-muted-foreground ml-2">${movie.duration}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Show movie details
    showMovieDetails(movieId = null) {
        if (movieId) {
            this.presenter.loadMovieDetails(
                movieId,
                (movie) => this.renderMovieDetails(movie),
                (error) => this.showError(error)
            );
        } else {
            const movie = this.presenter.getCurrentMovie();
            if (movie) {
                this.renderMovieDetails(movie);
            }
        }
        this.showPage('movie-details-page');
    }

    // Render movie details
    renderMovieDetails(movie) {
        const heroSection = document.getElementById('movie-hero');
        const contentSection = document.getElementById('movie-details-content');

        heroSection.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" 
                 class="absolute inset-0 w-full h-full object-cover opacity-30">
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-cinema-dark"></div>
            <div class="relative container mx-auto px-4 h-full flex items-end pb-8">
                <div>
                    <button onclick="app.loadMoviesPage()" 
                            class="text-muted-foreground hover:text-foreground mb-4 flex items-center">
                        ← Back to Movies
                    </button>
                    <h1 class="text-4xl font-bold text-foreground mb-2">${movie.title}</h1>
                    <p class="text-muted-foreground text-lg">${movie.genre.join(' • ')}</p>
                </div>
            </div>
        `;

        contentSection.innerHTML = `
            <div class="grid lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2">
                    <div class="bg-card border border-border rounded-xl p-6 mb-6">
                        <h2 class="text-2xl font-bold text-foreground mb-4">About the Movie</h2>
                        <p class="text-muted-foreground mb-6">${movie.description}</p>
                        
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <h3 class="font-semibold text-foreground mb-2">Cast</h3>
                                <p class="text-muted-foreground">${movie.cast.join(', ')}</p>
                            </div>
                            <div>
                                <h3 class="font-semibold text-foreground mb-2">Director</h3>
                                <p class="text-muted-foreground">${movie.director}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <div class="bg-card border border-border rounded-xl p-6">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-cinema-gold">${movie.rating}</div>
                                <div class="text-sm text-muted-foreground">IMDb Rating</div>
                            </div>
                            <div class="text-center">
                                <div class="text-lg font-semibold text-foreground">${movie.duration}</div>
                                <div class="text-sm text-muted-foreground">Duration</div>
                            </div>
                        </div>
                        
                        <div class="space-y-3 mb-6">
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Language</span>
                                <span class="text-foreground">${movie.language}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Certification</span>
                                <span class="text-foreground">${movie.certification}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Release Date</span>
                                <span class="text-foreground">${this.presenter.formatDate(movie.releaseDate)}</span>
                            </div>
                        </div>
                        
                        <button onclick="app.showShowtimes()" class="btn btn-primary w-full">
                            Book Tickets
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Show showtimes page
    showShowtimes() {
        const movie = this.presenter.getCurrentMovie();
        if (!movie) return;

        this.showPage('showtimes-page');
        this.presenter.loadShowtimes(
            movie.id,
            (showtimes) => this.renderShowtimes(showtimes),
            (error) => this.showError(error)
        );
    }

    // Render showtimes
    renderShowtimes(showtimes) {
        const content = document.getElementById('showtimes-content');
        
        if (showtimes.length === 0) {
            content.innerHTML = `
                <div class="text-center py-12">
                    <h3 class="text-lg font-semibold mb-2 text-foreground">No showtimes available</h3>
                    <p class="text-muted-foreground">Please check back later for available showtimes.</p>
                </div>
            `;
            return;
        }

        // Group showtimes by theater
        const theaterGroups = {};
        showtimes.forEach(showtime => {
            const theaterId = showtime.theater.id;
            if (!theaterGroups[theaterId]) {
                theaterGroups[theaterId] = {
                    theater: showtime.theater,
                    showtimes: []
                };
            }
            theaterGroups[theaterId].showtimes.push(showtime);
        });

        content.innerHTML = Object.values(theaterGroups).map(group => `
            <div class="bg-card border border-border rounded-xl p-6 mb-6">
                <div class="mb-4">
                    <h3 class="text-xl font-bold text-foreground">${group.theater.name}</h3>
                    <p class="text-muted-foreground">${group.theater.location}</p>
                    <div class="flex gap-2 mt-2">
                        ${group.theater.facilities.map(facility => 
                            `<span class="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">${facility}</span>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    ${group.showtimes.map(showtime => `
                        <button onclick="app.selectShowtime(${showtime.id})" 
                                class="btn btn-outline text-center">
                            <div class="font-semibold">${showtime.time}</div>
                            <div class="text-sm text-muted-foreground">${this.presenter.formatCurrency(showtime.price)}</div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // Select showtime
    selectShowtime(showtimeId) {
        // Find and set the selected showtime
        this.presenter.loadShowtimes(
            this.presenter.getCurrentMovie().id,
            (showtimes) => {
                const showtime = showtimes.find(s => s.id === showtimeId);
                if (showtime) {
                    this.presenter.setSelectedShowtime(showtime);
                    this.showSeatSelection();
                }
            },
            (error) => this.showError(error)
        );
    }

    // Show seat selection page
    showSeatSelection() {
        const showtime = this.presenter.getSelectedShowtime();
        if (!showtime) return;

        this.showPage('seat-selection-page');
        this.presenter.loadSeats(
            showtime.id,
            (seats) => this.renderSeatSelection(seats),
            (error) => this.showError(error)
        );
    }

    // Render seat selection
    renderSeatSelection(seats) {
        const content = document.getElementById('seat-selection-content');
        
        content.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="seat-map">
                    <div class="mb-4">
                        <h2 class="text-xl font-bold text-foreground mb-2">Select Your Seats</h2>
                        <div class="flex justify-center gap-6 text-sm">
                            <div class="flex items-center gap-2">
                                <div class="w-4 h-4 bg-muted rounded"></div>
                                <span class="text-muted-foreground">Available</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-4 h-4 bg-cinema-red rounded"></div>
                                <span class="text-muted-foreground">Selected</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-4 h-4 bg-border rounded"></div>
                                <span class="text-muted-foreground">Occupied</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="screen mb-8"></div>
                    <p class="text-center text-muted-foreground mb-4">SCREEN</p>
                    
                    <div id="seats-grid" class="seats-grid">
                        ${this.renderSeats(seats)}
                    </div>
                </div>
                
                <div class="mt-8 bg-card border border-border rounded-xl p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-foreground">Booking Summary</h3>
                        <div id="selected-seats-info" class="text-muted-foreground">
                            No seats selected
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="font-semibold text-foreground" id="total-amount">₹0</div>
                            <div class="text-sm text-muted-foreground">Total Amount</div>
                        </div>
                        <button id="proceed-payment" onclick="app.proceedToPayment()" 
                                class="btn btn-primary" disabled>
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.updateSeatSelection(seats);
    }

    // Render individual seats
    renderSeats(seats) {
        return seats.map(seat => {
            let className = 'seat ';
            if (seat.isOccupied) {
                className += 'occupied';
            } else if (seat.isSelected) {
                className += 'selected';
            } else {
                className += 'available';
            }

            return `
                <button class="${className}" 
                        onclick="app.toggleSeat('${seat.id}')"
                        ${seat.isOccupied ? 'disabled' : ''}>
                    ${seat.id}
                </button>
            `;
        }).join('');
    }

    // Toggle seat selection
    toggleSeat(seatId) {
        const showtime = this.presenter.getSelectedShowtime();
        if (!showtime) return;

        this.presenter.loadSeats(
            showtime.id,
            (seats) => {
                const updatedSeats = this.presenter.toggleSeatSelection(seatId, seats);
                this.updateSeatSelection(updatedSeats);
                
                // Re-render seats
                document.getElementById('seats-grid').innerHTML = this.renderSeats(updatedSeats);
            },
            (error) => this.showError(error)
        );
    }

    // Update seat selection display
    updateSeatSelection(seats) {
        const selectedSeats = seats.filter(seat => seat.isSelected);
        const total = this.presenter.calculateTotal(seats);
        
        // Update selected seats info
        const seatsInfo = document.getElementById('selected-seats-info');
        if (selectedSeats.length > 0) {
            seatsInfo.textContent = `${selectedSeats.length} seat(s) selected: ${selectedSeats.map(s => s.id).join(', ')}`;
        } else {
            seatsInfo.textContent = 'No seats selected';
        }
        
        // Update total amount
        document.getElementById('total-amount').textContent = this.presenter.formatCurrency(total);
        
        // Enable/disable proceed button
        const proceedBtn = document.getElementById('proceed-payment');
        proceedBtn.disabled = selectedSeats.length === 0;
    }

    // Proceed to payment
    proceedToPayment() {
        const selectedSeats = this.presenter.getSelectedSeats();
        if (selectedSeats.length === 0) {
            this.presenter.showToast('Please select at least one seat.', 'error');
            return;
        }
        
        this.showPayment();
    }

    // Show payment page
    showPayment() {
        this.showPage('payment-page');
        this.renderPayment();
    }

    // Render payment form
    renderPayment() {
        const content = document.getElementById('payment-content');
        const movie = this.presenter.getCurrentMovie();
        const showtime = this.presenter.getSelectedShowtime();
        const selectedSeats = this.presenter.getSelectedSeats();
        
        // Calculate total from seat selection
        const total = selectedSeats.length * showtime.price; // Simplified calculation
        
        content.innerHTML = `
            <div class="max-w-2xl mx-auto">
                <div class="grid md:grid-cols-2 gap-8">
                    <div>
                        <div class="bg-card border border-border rounded-xl p-6 mb-6">
                            <h3 class="text-lg font-bold text-foreground mb-4">Booking Details</h3>
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-muted-foreground">Movie</span>
                                    <span class="text-foreground">${movie.title}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-muted-foreground">Theater</span>
                                    <span class="text-foreground">${showtime.theater.name}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-muted-foreground">Date & Time</span>
                                    <span class="text-foreground">${showtime.time}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-muted-foreground">Seats</span>
                                    <span class="text-foreground">${selectedSeats.join(', ')}</span>
                                </div>
                                <div class="flex justify-between font-bold">
                                    <span class="text-foreground">Total</span>
                                    <span class="text-cinema-red">${this.presenter.formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <form id="payment-form" class="payment-form">
                            <h3 class="text-lg font-bold text-foreground mb-4">Payment Details</h3>
                            
                            <div class="form-group">
                                <label class="form-label">Cardholder Name</label>
                                <input type="text" name="cardholderName" class="form-input" 
                                       placeholder="Enter cardholder name" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Card Number</label>
                                <input type="text" name="cardNumber" class="form-input" 
                                       placeholder="1234 5678 9012 3456" maxlength="19" required>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div class="form-group">
                                    <label class="form-label">Expiry Date</label>
                                    <input type="text" name="expiryDate" class="form-input" 
                                           placeholder="MM/YY" maxlength="5" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">CVV</label>
                                    <input type="text" name="cvv" class="form-input" 
                                           placeholder="123" maxlength="3" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Email (Optional)</label>
                                <input type="email" name="email" class="form-input" 
                                       placeholder="Enter email for booking confirmation">
                            </div>
                            
                            <button type="submit" class="btn btn-primary w-full mt-6">
                                Pay ${this.presenter.formatCurrency(total)}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Setup payment form handler
        document.getElementById('payment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processPayment(e.target, total);
        });

        // Format card number input
        const cardNumberInput = document.querySelector('input[name="cardNumber"]');
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = formattedValue;
        });

        // Format expiry date input
        const expiryInput = document.querySelector('input[name="expiryDate"]');
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // Process payment
    processPayment(form, totalAmount) {
        const formData = new FormData(form);
        const paymentData = {
            cardNumber: formData.get('cardNumber'),
            expiryDate: formData.get('expiryDate'),
            cvv: formData.get('cvv'),
            cardholderName: formData.get('cardholderName'),
            email: formData.get('email'),
            paymentMethod: 'Credit Card',
            totalAmount: totalAmount
        };

        this.presenter.processPayment(
            paymentData,
            (booking) => this.showBookingConfirmation(booking),
            (error) => this.showError(error)
        );
    }

    // Show booking confirmation
    showBookingConfirmation(booking) {
        this.showPage('confirmation-page');
        this.renderBookingConfirmation(booking);
    }

    // Render booking confirmation
    renderBookingConfirmation(booking) {
        const content = document.getElementById('confirmation-content');
        
        content.innerHTML = `
            <div class="max-w-2xl mx-auto text-center">
                <div class="mb-8">
                    <div class="w-16 h-16 bg-cinema-red rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-2xl">✓</span>
                    </div>
                    <h1 class="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
                    <p class="text-muted-foreground">Your tickets have been booked successfully</p>
                </div>
                
                <div class="bg-card border border-border rounded-xl p-6 mb-6">
                    <h3 class="text-lg font-bold text-foreground mb-4">Booking Details</h3>
                    
                    <div class="space-y-3 text-left">
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Booking ID</span>
                            <span class="text-foreground font-mono">#${booking.id}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Movie</span>
                            <span class="text-foreground">${booking.movie.title}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Theater</span>
                            <span class="text-foreground">${booking.showtime.theater.name}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Date & Time</span>
                            <span class="text-foreground">${booking.showtime.time}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Seats</span>
                            <span class="text-foreground">${booking.selectedSeats.join(', ')}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Customer</span>
                            <span class="text-foreground">${booking.customerName}</span>
                        </div>
                        <div class="flex justify-between font-bold border-t border-border pt-3">
                            <span class="text-foreground">Total Paid</span>
                            <span class="text-cinema-red">${this.presenter.formatCurrency(booking.totalAmount)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-card border border-border rounded-xl p-6 mb-6">
                    <h3 class="text-lg font-bold text-foreground mb-4">E-Ticket QR Code</h3>
                    <div class="qr-code">
                        QR Code
                        <br>
                        <small>Booking #${booking.id}</small>
                    </div>
                    <p class="text-sm text-muted-foreground mt-4">
                        Show this QR code at the theater entrance
                    </p>
                </div>
                
                <div class="flex gap-4 justify-center">
                    <button onclick="app.downloadTicket()" class="btn btn-outline">
                        Download Ticket
                    </button>
                    <button onclick="app.backToMovies()" class="btn btn-primary">
                        Book More Tickets
                    </button>
                </div>
            </div>
        `;
    }

    // Download ticket (simulate)
    downloadTicket() {
        this.presenter.showToast('Ticket downloaded successfully!', 'success');
    }

    // Back to movies
    backToMovies() {
        this.presenter.reset();
        this.loadMoviesPage();
    }

    // Show error message
    showError(message) {
        this.presenter.showToast(message, 'error');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CineBookApp();
});
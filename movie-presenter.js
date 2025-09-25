class MoviePresenter {
    constructor() {
        this.model = new MovieModel();
        this.loadingStates = {};
        this.errorStates = {};
        this.currentMovie = null;
        this.selectedShowtime = null;
        this.selectedSeats = [];
        this.bookingData = null;
    }

    // Show loading state
    setLoading(operation, isLoading) {
        this.loadingStates[operation] = isLoading;
        
        if (isLoading) {
            document.getElementById('loading-overlay').classList.remove('hidden');
        } else {
            document.getElementById('loading-overlay').classList.add('hidden');
        }
    }

    // Show error state
    setError(operation, error) {
        this.errorStates[operation] = error;
        if (error) {
            this.showToast(error, 'error');
        }
    }

    // Get loading state
    getLoadingState(operation) {
        return this.loadingStates[operation] || false;
    }

    // Get error state
    getErrorState(operation) {
        return this.errorStates[operation] || null;
    }

    // Show toast notification
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
    }

    // Load movies
    async loadMovies(onSuccess, onError) {
        try {
            this.setLoading('movies', true);
            this.setError('movies', null);
            
            const movies = await this.model.loadMovies();
            onSuccess(movies);
        } catch (error) {
            const errorMessage = 'Failed to load movies. Please try again.';
            this.setError('movies', errorMessage);
            onError(errorMessage);
        } finally {
            this.setLoading('movies', false);
        }
    }

    // Search movies
    async searchMovies(query, onSuccess, onError) {
        try {
            this.setLoading('search', true);
            this.setError('search', null);
            
            const movies = await this.model.searchMovies(query);
            onSuccess(movies);
        } catch (error) {
            const errorMessage = 'Search failed. Please try again.';
            this.setError('search', errorMessage);
            onError(errorMessage);
        } finally {
            this.setLoading('search', false);
        }
    }

    // Load movie details
    async loadMovieDetails(movieId, onSuccess, onError) {
        try {
            this.setLoading('movieDetails', true);
            this.setError('movieDetails', null);
            
            const movie = await this.model.getMovieById(movieId);
            if (movie) {
                this.currentMovie = movie;
                onSuccess(movie);
            } else {
                throw new Error('Movie not found');
            }
        } catch (error) {
            const errorMessage = 'Failed to load movie details.';
            this.setError('movieDetails', errorMessage);
            onError(errorMessage);
        } finally {
            this.setLoading('movieDetails', false);
        }
    }

    // Load showtimes
    async loadShowtimes(movieId, onSuccess, onError) {
        try {
            this.setLoading('showtimes', true);
            this.setError('showtimes', null);
            
            const showtimes = await this.model.getShowtimes(movieId);
            onSuccess(showtimes);
        } catch (error) {
            const errorMessage = 'Failed to load showtimes.';
            this.setError('showtimes', errorMessage);
            onError(errorMessage);
        } finally {
            this.setLoading('showtimes', false);
        }
    }

    // Load seats
    async loadSeats(showtimeId, onSuccess, onError) {
        try {
            this.setLoading('seats', true);
            this.setError('seats', null);
            
            const seats = await this.model.getSeats(showtimeId);
            onSuccess(seats);
        } catch (error) {
            const errorMessage = 'Failed to load seats.';
            this.setError('seats', errorMessage);
            onError(errorMessage);
        } finally {
            this.setLoading('seats', false);
        }
    }

    // Handle seat selection
    toggleSeatSelection(seatId, seats) {
        const seat = seats.find(s => s.id === seatId);
        if (!seat || seat.isOccupied) return seats;

        // Toggle seat selection
        seat.isSelected = !seat.isSelected;

        // Update selected seats array
        if (seat.isSelected) {
            this.selectedSeats.push(seatId);
        } else {
            this.selectedSeats = this.selectedSeats.filter(id => id !== seatId);
        }

        return [...seats];
    }

    // Calculate total amount
    calculateTotal(seats) {
        const selectedSeats = seats.filter(seat => seat.isSelected);
        return selectedSeats.reduce((total, seat) => total + seat.price, 0);
    }

    // Process payment and booking
    async processPayment(paymentData, onSuccess, onError) {
        try {
            this.setLoading('payment', true);
            this.setError('payment', null);

            // Validate payment data
            if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
                throw new Error('Please fill in all payment details.');
            }

            // Validate selected seats
            if (this.selectedSeats.length === 0) {
                throw new Error('Please select at least one seat.');
            }

            // Prepare booking data
            const booking = {
                movieId: this.currentMovie.id,
                movie: this.currentMovie,
                showtimeId: this.selectedShowtime.id,
                showtime: this.selectedShowtime,
                selectedSeats: [...this.selectedSeats],
                totalAmount: paymentData.totalAmount,
                paymentMethod: paymentData.paymentMethod,
                customerName: paymentData.cardholderName,
                customerEmail: paymentData.email || 'customer@example.com'
            };

            // Process booking
            const confirmedBooking = await this.model.processBooking(booking);
            this.bookingData = confirmedBooking;
            
            // Clear selections
            this.selectedSeats = [];
            
            onSuccess(confirmedBooking);
            this.showToast('Booking confirmed successfully!', 'success');
        } catch (error) {
            const errorMessage = error.message || 'Payment failed. Please try again.';
            this.setError('payment', errorMessage);
            onError(errorMessage);
        } finally {
            this.setLoading('payment', false);
        }
    }

    // Set selected showtime
    setSelectedShowtime(showtime) {
        this.selectedShowtime = showtime;
    }

    // Get current movie
    getCurrentMovie() {
        return this.currentMovie;
    }

    // Get selected showtime
    getSelectedShowtime() {
        return this.selectedShowtime;
    }

    // Get selected seats
    getSelectedSeats() {
        return [...this.selectedSeats];
    }

    // Get booking data
    getBookingData() {
        return this.bookingData;
    }

    // Reset presenter state
    reset() {
        this.currentMovie = null;
        this.selectedShowtime = null;
        this.selectedSeats = [];
        this.bookingData = null;
        this.loadingStates = {};
        this.errorStates = {};
    }

    // Format currency
    formatCurrency(amount) {
        return `₹${amount}`;
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Format time
    formatTime(timeString) {
        return timeString;
    }
}
class MovieModel {
    constructor() {
        this.movies = [
            {
              id: 1,
    title: "Michael",
    genre: ["Biography", "Drama", "Music"],
    rating: 0,
    duration: "TBA",
    poster: "https://via.placeholder.com/300x450?text=Michael+(2026)",
    description: "A biopic exploring the life and rise of pop icon Michael Jackson.",
    cast: ["Jaafar Jackson"],
    director: "Antoine Fuqua",
    releaseDate: "2026-04-24",
    language: "English",
    certification: "TBA"
            },
            {
                id: 2,
                title: "The Mummy",
    genre: ["Horror", "Adventure"],
    rating: 0,
    duration: "TBA",
    poster: "https://via.placeholder.com/300x450?text=The+Mummy+(2026)",
    description: "A reboot of the classic monster franchise with a darker tone.",
    cast: ["TBA"],
    director: "Lee Cronin",
    releaseDate: "2026-07-10",
    language: "English",
    certification: "TBA"
            },
            {
                id: 3,
                title: "Spider-Man: Brand New Day",
    genre: ["Action", "Adventure", "Sci-Fi"],
    rating: 0,
    duration: "TBA",
    poster:"https://via.placeholder.com/300x450?text=Spider-Man+2026",
    description: "Peter Parker faces new threats in a world that no longer remembers him.",
    cast: ["Tom Holland"],
    director: "TBA",
    releaseDate: "2026-07-31",
    language: "English",
    certification: "PG-13"
            },
            {
                id: 4,
               title: "Avengers: Doomsday",
    genre: ["Action", "Sci-Fi"],
    rating: 0,
    duration: "TBA",
    poster: "https://via.placeholder.com/300x450?text=Coming+Soon",
    description: "Marvel heroes unite to face Doctor Doom in a massive crossover event.",
    cast: ["Multiple MCU Cast"],
    director: "TBA",
    releaseDate: "2026-12-18",
    language: "English",
    certification: "PG-13"
            }
        ];

        this.theaters = [
            {
                id: 1,
                name: "PVR Cinemas",
                location: "Downtown Mall",
                facilities: ["IMAX", "Dolby Atmos", "Recliner Seats"]
            },
            {
                id: 2,
                name: "INOX Multiplex",
                location: "City Center",
                facilities: ["4DX", "Premium Seating", "Food Court"]
            },
            {
                id: 3,
                name: "Cineplex Theater",
                location: "Metro Plaza",
                facilities: ["Standard", "Parking Available"]
            }
        ];

        this.showtimes = [
            { id: 1, movieId: 1, theaterId: 1, time: "10:00 AM", date: "2024-01-15", price: 250 },
            { id: 2, movieId: 1, theaterId: 1, time: "2:00 PM", date: "2024-01-15", price: 300 },
            { id: 3, movieId: 1, theaterId: 1, time: "6:00 PM", date: "2024-01-15", price: 350 },
            { id: 4, movieId: 1, theaterId: 1, time: "9:30 PM", date: "2024-01-15", price: 300 },
            
            { id: 5, movieId: 1, theaterId: 2, time: "11:00 AM", date: "2024-01-15", price: 280 },
            { id: 6, movieId: 1, theaterId: 2, time: "3:00 PM", date: "2024-01-15", price: 320 },
            { id: 7, movieId: 1, theaterId: 2, time: "7:00 PM", date: "2024-01-15", price: 380 },
            
            { id: 8, movieId: 2, theaterId: 1, time: "12:00 PM", date: "2024-01-15", price: 250 },
            { id: 9, movieId: 2, theaterId: 1, time: "4:00 PM", date: "2024-01-15", price: 300 },
            { id: 10, movieId: 2, theaterId: 1, time: "8:00 PM", date: "2024-01-15", price: 350 }
        ];

        // Generate seat data
        this.seats = this.generateSeats();
        
        // Load booking history from localStorage
        this.bookingHistory = this.loadBookingHistory();
    }

    // Generate seat layout for theaters
    generateSeats() {
        const seats = {};
        const seatLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        
        this.showtimes.forEach(showtime => {
            seats[showtime.id] = [];
            seatLabels.forEach(row => {
                for (let i = 1; i <= 12; i++) {
                    const seatId = `${row}${i}`;
                    const isOccupied = Math.random() < 0.3; // 30% chance of being occupied
                    seats[showtime.id].push({
                        id: seatId,
                        row: row,
                        number: i,
                        isOccupied: isOccupied,
                        isSelected: false,
                        price: this.getSeatPrice(row, showtime.price)
                    });
                }
            });
        });
        
        return seats;
    }

    getSeatPrice(row, basePrice) {
        // Premium rows (A, B, C) cost more
        const premiumRows = ['A', 'B', 'C'];
        return premiumRows.includes(row) ? basePrice + 50 : basePrice;
    }

    // Simulate API delay
    simulateApiDelay() {
        return new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    }

    // Load movies
    async loadMovies() {
        await this.simulateApiDelay();
        return [...this.movies];
    }

    // Search movies
    async searchMovies(query) {
        await this.simulateApiDelay();
        const lowercaseQuery = query.toLowerCase();
        return this.movies.filter(movie => 
            movie.title.toLowerCase().includes(lowercaseQuery) ||
            movie.genre.some(g => g.toLowerCase().includes(lowercaseQuery)) ||
            movie.cast.some(actor => actor.toLowerCase().includes(lowercaseQuery))
        );
    }

    // Get movie by ID
    async getMovieById(id) {
        await this.simulateApiDelay();
        return this.movies.find(movie => movie.id === parseInt(id));
    }

    // Get showtimes for a movie
    async getShowtimes(movieId) {
        await this.simulateApiDelay();
        const movieShowtimes = this.showtimes.filter(showtime => showtime.movieId === parseInt(movieId));
        
        return movieShowtimes.map(showtime => ({
            ...showtime,
            theater: this.theaters.find(t => t.id === showtime.theaterId)
        }));
    }

    // Get seats for a showtime
    async getSeats(showtimeId) {
        await this.simulateApiDelay();
        return this.seats[showtimeId] || [];
    }

    // Process booking
    async processBooking(bookingData) {
        await this.simulateApiDelay();
        
        // Simulate booking success (90% success rate)
        if (Math.random() < 0.9) {
            const booking = {
                id: Date.now(),
                ...bookingData,
                bookingDate: new Date().toISOString(),
                status: 'confirmed'
            };
            
            // Save to booking history
            this.bookingHistory.push(booking);
            this.saveBookingHistory();
            
            // Update seat status
            if (this.seats[bookingData.showtimeId]) {
                bookingData.selectedSeats.forEach(seatId => {
                    const seat = this.seats[bookingData.showtimeId].find(s => s.id === seatId);
                    if (seat) {
                        seat.isOccupied = true;
                    }
                });
            }
            
            return booking;
        } else {
            throw new Error('Booking failed. Please try again.');
        }
    }

    // Load booking history from localStorage
    loadBookingHistory() {
        try {
            const history = localStorage.getItem('cinebook_booking_history');
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Error loading booking history:', error);
            return [];
        }
    }

    // Save booking history to localStorage
    saveBookingHistory() {
        try {
            localStorage.setItem('cinebook_booking_history', JSON.stringify(this.bookingHistory));
        } catch (error) {
            console.error('Error saving booking history:', error);
        }
    }

    // Get booking history
    getBookingHistory() {
        return [...this.bookingHistory];
    }
}

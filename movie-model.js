class MovieModel {
    constructor() {
        this.movies = [
            {
                id: 1,
                title: "Dune: Part Two",
                genre: ["Sci-Fi", "Adventure", "Drama"],
                rating: 8.8,
                duration: "2h 46m",
                poster: "src/assets/dune-poster.jpg",
                description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
                cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
                director: "Denis Villeneuve",
                releaseDate: "2024-03-01",
                language: "English",
                certification: "PG-13"
            },
            {
                id: 2,
                title: "Inception",
                genre: ["Sci-Fi", "Thriller", "Action"],
                rating: 8.8,
                duration: "2h 28m",
                poster: "src/assets/inception-poster.jpg",
                description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
                cast: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
                director: "Christopher Nolan",
                releaseDate: "2010-07-16",
                language: "English",
                certification: "PG-13"
            },
            {
                id: 3,
                title: "The Dark Knight",
                genre: ["Action", "Crime", "Drama"],
                rating: 9.0,
                duration: "2h 32m",
                poster: "src/assets/batman-poster.jpg",
                description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
                cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
                director: "Christopher Nolan",
                releaseDate: "2008-07-18",
                language: "English",
                certification: "PG-13"
            },
            {
                id: 4,
                title: "Avengers: Endgame",
                genre: ["Action", "Adventure", "Drama"],
                rating: 8.4,
                duration: "3h 1m",
                poster: "src/assets/avengers-poster.jpg",
                description: "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
                cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
                director: "Russo Brothers",
                releaseDate: "2019-04-26",
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
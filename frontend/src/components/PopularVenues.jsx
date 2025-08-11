import React, { useState ,useEffect} from "react";
import { ArrowRight, Star, MapPin } from 'lucide-react';
function PopularVenues() {
  const [venues] = useState([
      {
        id: 1,
        name: "City Badminton Arena",
        sports: ["Badminton"],
        price: 300,
        location: "Downtown",
        rating: 4.8,
        review: 124,
        image: "https://placehold.co/400x250/dc2626/ffffff?text=Badminton+Arena",
        description: "State-of-the-art badminton facility with 8 courts, professional lighting, and coaching services.",
        amenities: ["Floodlights", "Pro Shop", "Locker Rooms", "Coaching"],
        courts: [
          { id: 1, name: "Court A", sport: "Badminton", price: 300, available: true },
          { id: 2, name: "Court B", sport: "Badminton", price: 300, available: true },
          { id: 3, name: "Court C", sport: "Badminton", price: 350, available: true }
        ],
        photos: [
          "https://placehold.co/800x400/dc2626/ffffff?text=Badminton+Court+1",
          "https://placehold.co/800x400/dc2626/ffffff?text=Badminton+Court+2",
          "https://placehold.co/800x400/dc2626/ffffff?text=Facility+Interior"
        ],
        reviews: [
          { user: "Rahul K.", rating: 5, comment: "Excellent courts and well-maintained. Highly recommended!", date: "2024-01-15" },
          { user: "Priya M.", rating: 4, comment: "Good facility, staff is helpful. Lights could be brighter.", date: "2024-01-10" }
        ]
      },
      {
        id: 2,
        name: "Urban Sports Turf",
        sports: ["Football", "Cricket"],
        price: 1500,
        location: "Westside",
        rating: 4.6,
        review: 89,
        image: "https://placehold.co/400x250/16a34a/ffffff?text=Sports+Turf",
        description: "Multi-sport turf ground perfect for football, cricket, and other outdoor games.",
        amenities: ["Floodlights", "Changing Rooms", "Water Supply", "Equipment Rental"],
        courts: [
          { id: 4, name: "Main Turf", sport: "Football", price: 1500, available: true },
          { id: 5, name: "Practice Ground", sport: "Cricket", price: 800, available: true }
        ],
        photos: [
          "https://placehold.co/800x400/16a34a/ffffff?text=Turf+Ground",
          "https://placehold.co/800x400/16a34a/ffffff?text=Changing+Rooms"
        ],
        reviews: [
          { user: "Amit S.", rating: 5, comment: "Perfect for weekend matches. Booking system works great!", date: "2024-01-12" }
        ]
      },
      {
        id: 3,
        name: "Premier Tennis Club",
        sports: ["Tennis", "Squash"],
        price: 500,
        location: "North District",
        rating: 4.9,
        review: 156,
        image: "https://placehold.co/400x250/0891b2/ffffff?text=Tennis+Club",
        description: "Premium tennis and squash facility with indoor and outdoor courts.",
        amenities: ["Indoor Courts", "Fitness Center", "Coaching", "Cafeteria"],
        courts: [
          { id: 6, name: "Indoor Court 1", sport: "Tennis", price: 500, available: true },
          { id: 7, name: "Outdoor Court 2", sport: "Tennis", price: 450, available: true },
          { id: 8, name: "Squash Court", sport: "Squash", price: 400, available: true }
        ],
        photos: [
          "https://placehold.co/800x400/0891b2/ffffff?text=Tennis+Court",
          "https://placehold.co/800x400/0891b2/ffffff?text=Squash+Court"
        ],
        reviews: [
          { user: "Neha P.", rating: 5, comment: "Best tennis facility in the city. Courts are always well-prepared.", date: "2024-01-08" }
        ]
      }
    ]);
  
  return (
    <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Venues</h2>
              <p className="text-gray-600">Top-rated sports facilities in your area</p>
            </div>
            <button
              onClick={() => setCurrentView('venues')}
              className="text-green-600 hover:text-green-700 font-medium flex items-center"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {venues.slice(0, 3).map((venue) => (
              <div key={venue.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{venue.rating}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{venue.name}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{venue.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-wrap gap-2">
                      {venue.sports.map((sport) => (
                        <span key={sport} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {sport}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      From ₹{venue.price}/hr
                    </div>
                  </div>

                  <button
                    onClick={() => handleBooking(venue)}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
}
export default PopularVenues;
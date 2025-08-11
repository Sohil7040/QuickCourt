import React, { useState ,useEffect} from "react";

function VenuesPage() {
   return (
     <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentView('home')}
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium"
              >
                ← Back to Home
              </button>
            </div>
            <h1 className="text-xl font-bold text-gray-900">All Venues</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search venues by name..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">All Sports</option>
                <option value="badminton">Badminton</option>
                <option value="football">Football</option>
                <option value="tennis">Tennis</option>
                <option value="cricket">Cricket</option>
              </select>
            </div>
            <div className="flex-1">
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">All Locations</option>
                <option value="downtown">Downtown</option>
                <option value="westside">Westside</option>
                <option value="north">North District</option>
                <option value="east">East End</option>
              </select>
            </div>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{venues.length} Venues Found</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>Rating (High to Low)</option>
              <option>Price (Low to High)</option>
              <option>Newest First</option>
            </select>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map((venue) => (
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

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedVenue(venue);
                      setCurrentView('venue-detail');
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleBooking(venue)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <nav className="inline-flex rounded-md shadow">
            <button className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 bg-green-600 border border-green-600 text-sm font-medium text-white">
              1
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50">
              3
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
   );
 }
 export default VenuesPage;
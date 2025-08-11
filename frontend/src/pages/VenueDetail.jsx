import React, { useState ,useEffect} from "react";

function VenueDetail() {
  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setCurrentView('venues')}
                  className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium"
                >
                  ← Back to Venues
                </button>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Venue Details</h1>
              <div></div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
            <img
              src={selectedVenue.image}
              alt={selectedVenue.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedVenue.name}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{selectedVenue.location}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
                    {selectedVenue.rating} <Star className="inline h-4 w-4 fill-current" />
                  </div>
                  <button
                    onClick={() => handleBooking(selectedVenue)}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center"
                  >
                    Book Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {selectedVenue.sports.map((sport) => (
                  <span key={sport} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {sport}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Venue</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{selectedVenue.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                    <ul className="space-y-2">
                      {selectedVenue.amenities.map((amenity, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing</h3>
                    <div className="space-y-2">
                      {selectedVenue.courts.map((court) => (
                        <div key={court.id} className="flex justify-between text-gray-600">
                          <span>{court.name} ({court.sport})</span>
                          <span className="font-medium">₹{court.price}/hr</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Photos */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedVenue.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Venue photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews ({selectedVenue.reviews.length})</h2>
                <div className="space-y-6">
                  {selectedVenue.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{review.user}</h3>
                        <div className="flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{review.comment}</p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              {/* Booking Widget */}
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Book This Venue</h3>
                <button
                  onClick={() => handleBooking(selectedVenue)}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
                >
                  Book Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <div className="mt-4 text-center text-sm text-gray-500">
                  Instant confirmation • Free cancellation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}   
export default VenueDetail;
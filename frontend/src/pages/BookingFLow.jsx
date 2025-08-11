import React, { useState ,useEffect} from "react";

function BookingFlow() {
  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setCurrentView('venue-detail')}
                  className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium"
                >
                  ← Back
                </button>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Book {selectedVenue.name}</h1>
              <div></div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Steps */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className={`flex items-center ${bookingStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="ml-2 font-medium">Select Court & Time</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
              <div className={`flex items-center ${bookingStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="ml-2 font-medium">Review Booking</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
              <div className={`flex items-center ${bookingStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
            </div>
          </div>

          {bookingStep === 1 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Court & Time</h2>
              
              {/* Court Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Courts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedVenue.courts.map((court) => (
                    <div
                      key={court.id}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        bookingData.court === court.id
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => setBookingData({...bookingData, court: court.id})}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{court.name}</h4>
                          <p className="text-sm text-gray-600">{court.sport}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{court.price}/hr</p>
                          <p className="text-sm text-green-600">Available</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date and Time Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <select
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select time</option>
                    {Array.from({ length: 12 }, (_, i) => i + 6).map((hour) => (
                      <option key={hour} value={`${hour}:00`}>
                        {hour}:00 {hour < 12 ? 'AM' : 'PM'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duration Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <div className="flex space-x-4">
                  {[1, 2, 3, 4].map((hours) => (
                    <button
                      key={hours}
                      onClick={() => setBookingData({...bookingData, duration: hours})}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        bookingData.duration === hours
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {hours} hour{hours > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleBookingNext}
                  disabled={!bookingData.court || !bookingData.date || !bookingData.time}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {bookingStep === 2 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Booking</h2>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedVenue.name}</h3>
                    <p className="text-gray-600">{selectedVenue.location}</p>
                  </div>
                  <img
                    src={selectedVenue.image}
                    alt={selectedVenue.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Court</span>
                    <span className="font-medium">
                      {selectedVenue.courts.find(c => c.id === bookingData.court)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{bookingData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{bookingData.time} for {bookingData.duration} hour{bookingData.duration > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-semibold text-gray-900">
                      ₹{selectedVenue.courts.find(c => c.id === bookingData.court)?.price * bookingData.duration}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleBookingPrev}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleBookingNext}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {bookingStep === 3 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment</h2>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-green-800">Booking Summary</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Venue</span>
                    <span>{selectedVenue.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Court</span>
                    <span>{selectedVenue.courts.find(c => c.id === bookingData.court)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time</span>
                    <span>{bookingData.date} at {bookingData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span>{bookingData.duration} hour{bookingData.duration > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200 font-semibold">
                    <span>Total</span>
                    <span>₹{selectedVenue.courts.find(c => c.id === bookingData.court)?.price * bookingData.duration}</span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleBookingPrev}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setCurrentView('booking-confirmation');
                    setBookingStep(1);
                  }}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
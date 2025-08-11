import React, { useState ,useEffect} from "react";

function BookingConfirm(){
    const court = selectedVenue?.courts.find(c => c.id === bookingData.court);
    const totalPrice = court ? court.price * bookingData.duration : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-6">Your court is reserved and ready for play.</p>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">{selectedVenue?.name}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Court:</span>
                <span>{court?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{bookingData.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{bookingData.time} for {bookingData.duration} hour{bookingData.duration > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                <span>Total:</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => setCurrentView('bookings')}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                View My Bookings
              </button>
              <button
                onClick={() => setCurrentView('home')}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}
export default BookingConfirm;
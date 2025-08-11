import React, { useState ,useEffect} from "react";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch('/api/bookings');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
            <h1 className="text-xl font-bold text-gray-900">My Bookings</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex-1">
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Filter by date"
              />
            </div>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="md:w-2/3">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{booking.venue}</h3>
                    {booking.status === 'confirmed' && (
                      <span className="ml-3 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Confirmed
                      </span>
                    )}
                    {booking.status === 'pending' && (
                      <span className="ml-3 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        Pending
                      </span>
                    )}
                    {booking.status === 'completed' && (
                      <span className="ml-3 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{booking.sport} • {booking.court}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      <span>{booking.time} • {booking.duration} hour{booking.duration > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>₹{booking.total}</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3 md:text-right mt-4 md:mt-0">
                  {booking.status === 'confirmed' && (
                    <button className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors">
                      Cancel Booking
                    </button>
                  )}
                  {booking.status === 'pending' && (
                    <button className="w-full bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-medium">
                      Payment Pending
                    </button>
                  )}
                  {booking.status === 'completed' && (
                    <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium">
                      Booking Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">You haven't made any bookings. Start exploring venues and book your first session!</p>
            <button
              onClick={() => setCurrentView('venues')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Find Venues
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default MyBookings;
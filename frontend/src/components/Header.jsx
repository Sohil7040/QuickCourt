import React, { useState ,useEffect} from "react";

function Header({ currentView, setCurrentView, isAuthenticated, handleLogout, userRole }) {
    return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">QC</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">QuickCourt</h1>
                  <p className="text-xs text-gray-500">Book & Play</p>
                </div>
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${currentView === 'home' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView('venues')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${currentView === 'venues' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
              >
                Venues
              </button>
              {isAuthenticated && (
                <>
                  <button
                    onClick={() => setCurrentView('bookings')}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${currentView === 'bookings' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
                  >
                    My Bookings
                  </button>
                  {userRole === 'owner' && (
                    <button
                      onClick={() => setCurrentView('owner-dashboard')}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${currentView === 'owner-dashboard' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
                    >
                      Dashboard
                    </button>
                  )}
                  {userRole === 'admin' && (
                    <button
                      onClick={() => setCurrentView('admin-dashboard')}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${currentView === 'admin-dashboard' ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
                    >
                      Admin
                    </button>
                  )}
                </>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">User</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setCurrentView('auth')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>)
}
export default Header;
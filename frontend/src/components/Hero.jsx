import React, { useState ,useEffect} from "react";
import { Search, MapPin, ArrowRight } from 'lucide-react';
function Hero(){
    return(
    <section className="bg-gradient-to-br from-green-600 via-blue-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find & Book Sports Facilities
              <span className="block text-blue-100">in Minutes</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
              Discover the best sports venues near you. Quick, easy, and hassle-free booking for badminton, football, tennis, and more.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-2xl p-2 max-w-4xl mx-auto mb-8">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search for sports facilities..."
                    className="w-full pl-10 pr-4 py-3 border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full pl-10 pr-4 py-3 border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900"
                  />
                </div>
                <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center">
                  Search
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-blue-100">Sports Facilities</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">10k+</div>
                <div className="text-blue-100">Active Players</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">1M+</div>
                <div className="text-blue-100">Bookings Made</div>
              </div>
            </div>
          </div>
        </div>
      </section>)
}
export default Hero;
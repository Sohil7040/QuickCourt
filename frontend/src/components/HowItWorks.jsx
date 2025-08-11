import React, { useState ,useEffect} from "react";
import { Search,Calendar,CheckCircle } from 'lucide-react';
function HowItWorks() {
  return (
    <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How QuickCourt Works</h2>
            <p className="text-gray-600 text-lg">Simple steps to book your perfect sports venue</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. Search & Discover</h3>
              <p className="text-gray-600">Find sports facilities near you with our advanced search and filtering options. See real-time availability and detailed facility information.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. Book Instantly</h3>
              <p className="text-gray-600">Reserve your spot in seconds with our seamless booking process. Select your preferred time slot and get instant confirmation.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. Play & Enjoy</h3>
              <p className="text-gray-600">Get ready for your game! Access your booking details, venue information, and directions. Focus on your game while we handle the booking.</p>
            </div>
          </div>
        </div>
      </section>

  );
}
export default HowItWorks;
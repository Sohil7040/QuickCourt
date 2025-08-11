import React, { useState ,useEffect} from "react";

function Footer() {
  return (
     <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">QC</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">QuickCourt</h3>
                  <p className="text-gray-400">Book & Play</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The easiest way to find and book sports facilities. Whether you're a casual player or a competitive athlete, we've got you covered.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setCurrentView('home')} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => setCurrentView('venues')} className="hover:text-white transition-colors">Venues</button></li>
                <li><button onClick={() => setCurrentView('bookings')} className="hover:text-white transition-colors">My Bookings</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 QuickCourt. All rights reserved.</p>
          </div>
        </div>
      </footer>
  );
}
export default Footer;
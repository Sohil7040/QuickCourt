import React, { useState ,useEffect} from "react";
import{ArrowRight} from 'lucide-react';
function PopularSports() {
  return (
    <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Sports</h2>
            <p className="text-gray-600 text-lg">Find venues for your favorite sports</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Badminton', 'Football', 'Tennis', 'Cricket', 'Squash', 'Table Tennis', 'Basketball', 'Volleyball'].map((sport) => (
              <div key={sport} className="bg-gray-50 rounded-xl p-6 text-center hover:bg-green-50 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">
                    {sport === 'Badminton' && '🏸'}
                    {sport === 'Football' && '⚽'}
                    {sport === 'Tennis' && '🎾'}
                    {sport === 'Cricket' && '🏏'}
                    {sport === 'Squash' && '🪀'}
                    {sport === 'Table Tennis' && '🏓'}
                    {sport === 'Basketball' && '🏀'}
                    {sport === 'Volleyball' && '🏐'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{sport}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

  );
}
export default PopularSports;
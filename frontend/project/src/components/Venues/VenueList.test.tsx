import React from 'react';
import { render, screen } from '@testing-library/react';
import VenueList from '../../components/Venues/VenueList';

const VenuesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Sports Venues</h1>
          <p className="text-gray-600">Discover and book the perfect venue for your next game</p>
        </div>
        
        <VenueList showFilters={true} />
      </div>
    </div>
  );
};

export default VenuesPage;

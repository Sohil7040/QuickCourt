import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Clock, DollarSign, Users } from 'lucide-react';
import { venuesAPI } from '../../services/api';
import { Venue } from '../../types';

interface VenueListProps {
  limit?: number;
  showFilters?: boolean;
}

const VenueList: React.FC<VenueListProps> = ({ limit, showFilters = true }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVenues, setTotalVenues] = useState(0);

  const sports = ['basketball', 'tennis', 'football', 'badminton', 'volleyball', 'cricket', 'swimming', 'other'];

  const fetchVenues = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        search: searchQuery || undefined,
        sportType: selectedSport || undefined,
        page,
        limit: limit || 12,
        sortBy,
      };

      if (priceRange) {
        const priceMap = {
          low: { minPrice: 0, maxPrice: 50 },
          medium: { minPrice: 50, maxPrice: 100 },
          high: { minPrice: 100, maxPrice: 500 },
        };
        Object.assign(filters, priceMap[priceRange as keyof typeof priceMap]);
      }

      const response = await venuesAPI.getAllVenues(filters);
      
      if (response.success) {
        setVenues(response.data);
        setTotalVenues(response.count || response.data.length);
        setTotalPages(Math.ceil((response.count || response.data.length) / (limit || 12)));
      }
    } catch (err) {
      setError('Failed to load venues. Please try again.');
      console.error('Error fetching venues:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedSport, priceRange, sortBy, limit]);

  useEffect(() => {
    fetchVenues(currentPage);
  }, [fetchVenues, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchVenues(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSport('');
    setPriceRange('');
    setSortBy('name');
    setCurrentPage(1);
  };

  if (loading && venues.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => fetchVenues(currentPage)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sport Type</label>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sports</option>
                {sports.map(sport => (
                  <option key={sport} value={sport}>
                    {sport.charAt(0).toUpperCase() + sport.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Price</option>
                <option value="low">Under $50/hour</option>
                <option value="medium">$50-100/hour</option>
                <option value="high">$100+/hour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="pricePerHour">Price (Low to High)</option>
                <option value="-pricePerHour">Price (High to Low)</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            <div className="flex items-end space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Search
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {venues.length} of {totalVenues} venues
        </p>
      </div>

      {/* Venue Grid */}
      {venues.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No venues found matching your criteria.</p>
          <button
            onClick={resetFilters}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue._id} venue={venue} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-md ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Venue Card Component
const VenueCard: React.FC<{ venue: Venue }> = ({ venue }) => {
  const imageUrl = venue.images?.[0] || '/placeholder-venue.jpg';
  
  return (
    <Link to={`/venues/${venue._id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={imageUrl}
            alt={venue.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-venue.jpg';
            }}
          />
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
            {venue.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {venue.address || 'Location not specified'}
          </p>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{venue.sportType}</span>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm">{venue.rating || 0}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600">
              ${venue.pricePerHour}/hour
            </span>
            <span className="text-sm text-gray-500">
              <Users className="w-4 h-4 inline mr-1" />
              {venue.capacity || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VenueList;

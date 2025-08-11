import React, { useState ,useEffect} from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PopularSports from "./components/PopularSports";
import VenuesPage from "./pages/VenuesPage";
import MyBookings from "./pages/MyBookings";
import VenueDetail from "./pages/VenueDetail";
import BookingConfirm from "./pages/BookingConfirm";
import PopularVenues from "./components/PopularVenues";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
function App() {
  
  const [bookings] = useState([
    {
      id: 1,
      venue: "City Badminton Arena",
      sport: "Badminton",
      court: "Court A",
      date: "2024-01-20",
      time: "18:00",
      duration: 2,
      status: "confirmed",
      total: 600
    },
    {
      id: 2,
      venue: "Urban Sports Turf",
      sport: "Football",
      court: "Main Turf",
      date: "2024-01-22",
      time: "19:00",
      duration: 3,
      status: "pending",
      total: 4500
    }
  ]);

  const [ownerStats] = useState({
    totalBookings: 45,
    activeCourts: 8,
    earnings: 67500,
    bookingTrends: [
      { date: "2024-01-01", bookings: 3 },
      { date: "2024-01-02", bookings: 5 },
      { date: "2024-01-03", bookings: 7 },
      { date: "2024-01-04", bookings: 6 },
      { date: "2024-01-05", bookings: 8 },
      { date: "2024-01-06", bookings: 9 },
      { date: "2024-01-07", bookings: 4 }
    ],
    earningsData: [
      { month: "Jan", earnings: 12000 },
      { month: "Feb", earnings: 15000 },
      { month: "Mar", earnings: 18000 },
      { month: "Apr", earnings: 22500 }
    ]
  });

  const [adminStats] = useState({
    totalUsers: 1250,
    totalOwners: 45,
    totalBookings: 3200,
    activeCourts: 280,
    bookingActivity: [
      { date: "2024-01-01", bookings: 85 },
      { date: "2024-01-02", bookings: 92 },
      { date: "2024-01-03", bookings: 105 },
      { date: "2024-01-04", bookings: 112 },
      { date: "2024-01-05", bookings: 130 },
      { date: "2024-01-06", bookings: 145 },
      { date: "2024-01-07", bookings: 120 }
    ],
    userTrends: [
      { month: "Jan", users: 280 },
      { month: "Feb", users: 320 },
      { month: "Mar", users: 350 },
      { month: "Apr", users: 300 }
    ],
    facilityApprovals: [
      { status: "approved", count: 38 },
      { status: "pending", count: 7 },
      { status: "rejected", count: 2 }
    ]
  });

  const [pendingFacilities] = useState([
    {
      id: 1,
      name: "New Horizon Sports Center",
      owner: "Rajesh Kumar",
      email: "rajesh@email.com",
      phone: "+91 9876543210",
      location: "East End",
      sports: ["Badminton", "Table Tennis"],
      courts: 6,
      submissionDate: "2024-01-18",
      photos: [
        "https://placehold.co/800x400/7c3aed/ffffff?text=New+Facility+1",
        "https://placehold.co/800x400/7c3aed/ffffff?text=New+Facility+2"
      ]
    }
  ]);
  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('home');
    setActiveTab('home');
  };

  const handleBooking = (venue) => {
    setSelectedVenue(venue);
    setBookingStep(1);
    setCurrentView('booking');
  };

  const handleBookingNext = () => {
    if (bookingStep < 3) {
      setBookingStep(bookingStep + 1);
    }
  };

  const handleBookingPrev = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
    }
  };
  return (
    <div className="App">
    <Header/>
    <Hero/>
    <PopularSports />
    <PopularVenues/>
    <HowItWorks/>
    <Footer/>
    </div>
  );
}
export default App;
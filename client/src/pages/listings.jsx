import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/common/Header"; // Adjust path as needed
import Footer from "../components/common/Footer"; // Adjust path as needed

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

const Listings = () => {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  // Fetch user's listings from the server
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching listings...');
        
        const response = await axios.get("/api/customer/listings", {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('📦 Response:', response.data);

        if (response.data.success) {
          setListings(response.data.listings);
          setFilteredListings(response.data.listings);
          console.log('✅ Listings loaded:', response.data.listings.length);
        } else {
          setError(response.data.message || "Failed to load listings");
        }
      } catch (error) {
        console.error("❌ Error fetching listings:", error);
        
        if (error.response?.status === 401) {
          setError("Please login to view your listings");
          // Redirect to login after 2 seconds
          setTimeout(() => navigate('/sign-in'), 2000);
        } else {
          setError(error.response?.data?.message || "Error loading listings. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [navigate]);

  // Calculate counts for filter buttons
  const counts = useMemo(() => {
    const all = listings.length;
    const pending = listings.filter(listing => listing.status === "pending").length;
    const processing = listings.filter(listing => listing.status === "processing").length;
    const completed = listings.filter(listing => 
      ["approved", "added_to_inventory"].includes(listing.status)
    ).length;
    const rejected = listings.filter(listing => listing.status === "rejected").length;

    return { all, pending, processing, completed, rejected };
  }, [listings]);

  // Filter listings based on active filter
  const handleFilter = (filter) => {
    setActiveFilter(filter);

    if (filter === "all") {
      setFilteredListings(listings);
      return;
    }

    const filtered = listings.filter((listing) => {
      if (filter === "pending") return listing.status === "pending";
      if (filter === "processing") return listing.status === "processing";
      if (filter === "completed") 
        return ["approved", "added_to_inventory"].includes(listing.status);
      if (filter === "rejected") return listing.status === "rejected";
      return true;
    });

    setFilteredListings(filtered);
  };

  // Open modal with listing details
  const openModal = (listing) => {
    setSelectedListing(listing);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedListing(null);
  };

  // Filter buttons configuration
  const filterButtons = [
    { label: "All Listings", value: "all", count: counts.all },
    { label: "Pending", value: "pending", count: counts.pending },
    { label: "On Processing", value: "processing", count: counts.processing },
    { label: "Previous Listings", value: "completed", count: counts.completed },
    { label: "Rejected", value: "rejected", count: counts.rejected },
  ];

  // Modal content component
  const ModalContent = ({ listing }) => {
    if (!listing) return null;
    
    const isLaptop = listing.type === "laptop";
    const isRejected = listing.status === "rejected";
    const showPrice = (listing.status === "approved" || listing.status === "added_to_inventory") && listing.price;

    return (
      <div className="space-y-3 text-left">
        <p><strong>Type:</strong> {isLaptop ? "Laptop" : "Phone"}</p>
        <p><strong>Brand:</strong> {listing.brand}</p>
        <p><strong>Model:</strong> {listing.model}</p>

        {isLaptop ? (
          <>
            <p><strong>RAM:</strong> {listing.ram}</p>
            <p><strong>Storage:</strong> {listing.storage}</p>
            <p><strong>Processor:</strong> {listing.processor}</p>
            <p><strong>Generation:</strong> {listing.generation || "N/A"}</p>
            <p><strong>Display Size:</strong> {listing.display_size || "N/A"}</p>
            <p><strong>Weight:</strong> {listing.weight || "N/A"}</p>
            <p><strong>OS:</strong> {listing.os || "N/A"}</p>
            <p><strong>Device Age:</strong> {listing.device_age || "N/A"}</p>
            <p><strong>Battery Issues:</strong> {listing.battery_issues || "N/A"}</p>
          </>
        ) : (
          <>
            <p><strong>RAM:</strong> {listing.ram}</p>
            <p><strong>ROM:</strong> {listing.rom}</p>
            <p><strong>Processor:</strong> {listing.processor}</p>
            <p><strong>Network:</strong> {listing.network}</p>
            <p><strong>Size:</strong> {listing.size || "N/A"}</p>
            <p><strong>Weight:</strong> {listing.weight || "N/A"}</p>
            <p><strong>Device Age:</strong> {listing.device_age || "N/A"}</p>
            <p><strong>Switching On:</strong> {listing.switching_on || "N/A"}</p>
            <p><strong>Phone Calls:</strong> {listing.phone_calls || "N/A"}</p>
            <p><strong>Cameras Working:</strong> {listing.cameras_working || "N/A"}</p>
            <p><strong>Battery Issues:</strong> {listing.battery_issues || "N/A"}</p>
            <p><strong>Physically Damaged:</strong> {listing.physically_damaged || "N/A"}</p>
            <p><strong>Sound Issues:</strong> {listing.sound_issues || "N/A"}</p>
            <p><strong>Battery:</strong> {listing.battery} mAh</p>
            <p><strong>Camera:</strong> {listing.camera}</p>
            <p><strong>OS:</strong> {listing.os}</p>
          </>
        )}

        <p><strong>Location:</strong> {listing.location}</p>
        <p><strong>Email:</strong> {listing.email}</p>
        <p><strong>Phone:</strong> {listing.phone}</p>

        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
              isRejected ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {listing.status}
          </span>
        </p>

        {showPrice && (
          <p><strong>Price:</strong> ₹{parseFloat(listing.price).toFixed(2)}</p>
        )}

        {isRejected && listing.rejection_reason && (
          <p><strong>Rejection Reason:</strong> {listing.rejection_reason}</p>
        )}

        <p><strong>Submitted On:</strong> {new Date(listing.created_at).toLocaleString()}</p>

        {listing.image_path && (
          <img
            src={`http://localhost:3000/${listing.image_path.replace(/\\/g, '/')}`}
            alt="Device"
            className="mt-4 w-full max-h-80 object-contain rounded-lg border"
            onError={(e) => {
              console.log('Image failed to load:', listing.image_path);
              e.target.style.display = 'none';
            }}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Listings</h1>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            {filterButtons.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleFilter(filter.value)}
                className={`px-5 py-2 rounded-full font-medium transition flex items-center gap-1.5 ${
                  activeFilter === filter.value
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-white text-gray-700 border hover:bg-gray-50"
                }`}
              >
                {filter.label}
                {filter.count > 0 && (
                  <span className="bg-white/30 text-xs rounded-full px-1.5 py-0.5 min-w-[1.5rem]">
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Listings Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-500">Loading listings...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <p className="text-gray-500 text-lg">No listings found.</p>
              <button
                onClick={() => navigate('/sell-phone')}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Create New Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => {
                const isLaptop = listing.type === "laptop";
                const isRejected = listing.status === "rejected";
                const showPrice = (listing.status === "approved" || listing.status === "added_to_inventory") && listing.price;

                return (
                  <div
                    key={listing._id || listing.id}
                    onClick={() => openModal(listing)}
                    className="bg-white rounded-xl shadow-md p-5 cursor-pointer hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-bold text-gray-800">
                      {isLaptop ? "Laptop" : "Phone"}: {listing.brand} {listing.model}
                    </h3>

                    <p className="mt-2">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          isRejected
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {listing.status}
                      </span>
                    </p>

                    <p className="text-sm text-gray-600">
                      <strong>Submitted:</strong>{" "}
                      {new Date(listing.created_at).toLocaleDateString()}
                    </p>

                    {showPrice && (
                      <p className="mt-2 text-indigo-600 font-semibold">
                        <strong>Price:</strong> ₹{parseFloat(listing.price).toFixed(2)}
                      </p>
                    )}

                    {isRejected && listing.rejection_reason && (
                      <p className="mt-2 text-red-600 text-sm">
                        <strong>Rejection:</strong> {listing.rejection_reason}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Listing Details
            </h2>
            <ModalContent listing={selectedListing} />
          </div>
        </div>
      )}
    </>
  );
};

export default Listings;

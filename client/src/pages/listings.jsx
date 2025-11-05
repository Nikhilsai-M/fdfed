import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const Listings = () => {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");   // NEW
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  /* --------------------------------------------------------------
     1. FETCH LISTINGS
     -------------------------------------------------------------- */
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get("/customer/listings");
        if (res.data.success) {
          setListings(res.data.listings);
          setFiltered(res.data.listings);
        } else {
          alert(res.data.message || "Failed to load listings");
        }
      } catch (err) {
        console.error(err);
        alert("Error loading listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  /* --------------------------------------------------------------
     2. COUNTS (memoised – cheap & fast)
     -------------------------------------------------------------- */
  const counts = useMemo(() => {
    const all = listings.length;
    const pending = listings.filter(l => l.status === "pending").length;
    const processing = listings.filter(l => l.status === "processing").length; // adjust if needed
    const completed = listings.filter(l =>
      ["approved", "added_to_inventory"].includes(l.status)
    ).length;
    const rejected = listings.filter(l => l.status === "rejected").length;

    return { all, pending, processing, completed, rejected };
  }, [listings]);

  /* --------------------------------------------------------------
     3. FILTER HANDLER
     -------------------------------------------------------------- */
  const handleFilter = (filter) => {
    setActiveFilter(filter);

    if (filter === "all") {
      setFiltered(listings);
      return;
    }

    const result = listings.filter((l) => {
      if (filter === "pending") return l.status === "pending";
      if (filter === "processing") return l.status === "processing"; // change to "on_processing" if needed
      if (filter === "completed")
        return ["approved", "added_to_inventory"].includes(l.status);
      if (filter === "rejected") return l.status === "rejected";
      return false;
    });

    setFiltered(result);
  };

  /* --------------------------------------------------------------
     4. MODAL HELPERS
     -------------------------------------------------------------- */
  const openModal = (listing) => {
    setSelectedListing(listing);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedListing(null);
  };

  /* --------------------------------------------------------------
     5. FILTER BUTTON DEFINITION (label + count)
     -------------------------------------------------------------- */
  const filterButtons = [
    { label: "All Listings", value: "all", count: counts.all },
    { label: "Pending", value: "pending", count: counts.pending },
    { label: "On Processing", value: "processing", count: counts.processing },
    { label: "Previous Listings", value: "completed", count: counts.completed },
    { label: "Rejected", value: "rejected", count: counts.rejected },
  ];

  /* --------------------------------------------------------------
     6. MODAL CONTENT (unchanged)
     -------------------------------------------------------------- */
  const ModalContent = ({ listing }) => {
    if (!listing) return null;
    const isLaptop = listing.type === "laptop";
    const isRejected = listing.status === "rejected";

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

        {["approved", "added_to_inventory"].includes(listing.status) && listing.price && (
          <p><strong>Price:</strong> ₹{parseFloat(listing.price).toFixed(2)}</p>
        )}

        {isRejected && listing.rejection_reason && (
          <p><strong>Rejection Reason:</strong> {listing.rejection_reason}</p>
        )}

        <p><strong>Submitted On:</strong> {new Date(listing.created_at).toLocaleString()}</p>

        {listing.image_path && (
          <img
            src={listing.image_path}
            alt="Device"
            className="mt-4 w-full max-h-80 object-contain rounded-lg border"
          />
        )}
      </div>
    );
  };

  /* --------------------------------------------------------------
     7. RENDER
     -------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Listings</h1>

        {/* FILTER BUTTONS WITH COUNTS */}
        <div className="flex flex-wrap gap-3 mb-8">
          {filterButtons.map((f) => (
            <button
              key={f.value}
              onClick={() => handleFilter(f.value)}
              className={`px-5 py-2 rounded-full font-medium transition flex items-center gap-1.5 ${
                activeFilter === f.value
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-white text-gray-700 border hover:bg-gray-50"
              }`}
            >
              {f.label}
              {/* Show count only when > 0 */}
              {f.count > 0 && (
                <span className="bg-white/30 text-xs rounded-full px-1.5 py-0.5 min-w-[1.5rem]">
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* LISTINGS GRID */}
        {loading ? (
          <p className="text-center text-gray-500">Loading listings...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">No listings found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((listing) => {
              const isLaptop = listing.type === "laptop";
              const isRejected = listing.status === "rejected";

              return (
                <div
                  key={listing.id}
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

                  {["approved", "added_to_inventory"].includes(listing.status) &&
                    listing.price && (
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

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto p-6 relative">
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

      <Footer />
    </div>
  );
};

export default Listings;
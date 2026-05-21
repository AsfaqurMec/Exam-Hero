import React, { useEffect, useState, useCallback } from 'react';
import { FaMobileAlt, FaQrcode, FaDatabase, FaVideo, FaClock, FaUserTie } from 'react-icons/fa';
import { Link } from 'react-router';
import { toast } from 'react-toastify';

const ExamHeroHighlightListDisplay = () => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (highlight) => {
    setSelectedHighlight(highlight);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedHighlight(null);
    setIsModalOpen(false);
  };

  // Fetch data
  const fetchHighlights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://exam-hero-server-main.vercel.app/exam-hero-highlights');
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setHighlights(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch highlights.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  // Carousel auto-rotate
  useEffect(() => {
    if (highlights.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % highlights.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [highlights.length]);

  // Filter highlights
  const filteredHighlights = highlights.filter((h) => {
    const matchesFilter = filter === 'all' || h.category === filter;
    const matchesSearch =
      h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = ['all', ...new Set(highlights.map((h) => h.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading Exam Highlights</p>
          <p className="text-sm text-gray-500 mt-2">Preparing the best resources for your success</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Content</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex justify-center gap-3">
            <button onClick={fetchHighlights} className="btn btn-primary px-6 py-2 rounded-lg font-medium">Try Again</button>
            <button onClick={() => window.location.reload()} className="btn btn-outline px-6 py-2 rounded-lg font-medium">Refresh Page</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Content */}
          <div className="lg:w-2/3">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Exam Hero Highlights</h1>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              আপনার প্রস্তুতি সর্বাধিক করার জন্য দক্ষভাবে নির্বাচিত পরীক্ষা সংক্রান্ত সম্পদ, পরামর্শ এবং কৌশল আবিষ্কার করুন।
              </p>
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-1/3">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search highlights..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => setFilter(cat)}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Highlight Cards */}
            {filteredHighlights.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500">
                  {searchTerm ? 'No matching highlights found.' : 'No highlights available yet.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {filteredHighlights.slice(0, 4).map((h) => (
                  <div key={h._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md border border-gray-100 flex flex-col transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img src={h.image} alt={h.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      {h.category && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                          {h.category}
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">{h.title}</h2>
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{h.description}</p>
                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">{new Date(h.createdAt).toLocaleDateString()}</span>
                        <button 
                          onClick={() => openModal(h)} 
                          className="text-primary hover:text-primary-dark font-medium flex items-center transition-colors"
                        >
                          Read More
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-8">
              {highlights.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="relative h-80 overflow-hidden">
                    <img src={highlights[currentImageIndex].image} alt={highlights[currentImageIndex].title} className="w-full h-full object-cover transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                      <h3 className="text-xl font-semibold mb-2">{highlights[currentImageIndex].title}</h3>
                      <p className="text-sm line-clamp-2">{highlights[currentImageIndex].description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Carousel */}
              {highlights.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Featured Highlights</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {highlights.slice(0, 6).map((h, idx) => (
                      <div
                        key={h._id}
                        className={`relative h-24 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-primary scale-105' : 'border-transparent'}`}
                        onClick={() => setCurrentImageIndex(idx)}
                      >
                        <img src={h.image} alt={h.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-medium text-center px-1 line-clamp-2">{h.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-4 space-x-2">
                    {highlights.slice(0, 6).map((_, idx) => (
                      <button
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === idx ? 'bg-primary scale-125' : 'bg-gray-300'}`}
                        onClick={() => setCurrentImageIndex(idx)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Exam Tips Panel */}
              <div className="bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Exam Preparation Tips</h3>
                <ul className="space-y-3">
                  {[
                    'Create a consistent study schedule',
                    'Take regular breaks to improve retention',
                    'Practice with previous exam papers',
                    'Focus on understanding concepts, not just memorization'
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlight Modal */}
      {isModalOpen && selectedHighlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              &times;
            </button>
            <img src={selectedHighlight.image} alt={selectedHighlight.title} className="w-full h-64 object-cover rounded-lg mb-4" />
            <h2 className="text-2xl font-bold mb-2">{selectedHighlight.title}</h2>
            <p className="text-gray-700 mb-4">{selectedHighlight.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{new Date(selectedHighlight.createdAt).toLocaleDateString()}</span>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {selectedHighlight.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamHeroHighlightListDisplay;
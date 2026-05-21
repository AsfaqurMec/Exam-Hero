import React, { useState, useEffect, useRef } from "react";

const Hero = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const slideInterval = useRef(null);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://exam-hero-server-main.vercel.app/banners");
        if (!res.ok) throw new Error("Failed to fetch banners");
        const data = await res.json();
       // console.log(data);
        setBanners(data);
        setCurrentSlide(0);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Auto slide
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    startAutoSlide();
    return () => clearInterval(slideInterval.current);
  }, [banners.length, isPaused]);

  const startAutoSlide = () => {
    if (banners.length <= 1) return; // একটাই বা কোন ব্যানার থাকলে স্লাইড বন্ধ
    clearInterval(slideInterval.current);
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3000);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    startAutoSlide(); // ম্যানুয়াল ক্লিকের পরে অটো স্লাইড রিস্টার্ট
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gradient-to-r from-gray-900 to-gray-800">
        <p className="text-white text-lg font-medium">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="text-center p-6 bg-red-900/30 rounded-lg">
          <h3 className="text-xl font-semibold text-red-300 mb-2">
            একটি সমস্যা ঘটেছে
          </h3>
          <p className="text-red-200">{error}</p>
          <button
            className="mt-4 px-6 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="text-center p-6 bg-blue-900/30 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-300 mb-2">
            কোন ব্যানার পাওয়া যায়নি
          </h3>
          <p className="text-blue-200">দয়া করে পরে আবার চেষ্টা করুন</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative max-w-7xl mx-auto h-[55vh] mt-8 overflow-hidden rounded-lg shadow-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* SLIDER WRAPPER */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner._id}
            className="w-full flex-shrink-0 relative h-full bg-center bg-cover"
            style={{ backgroundImage: `url(${banner.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 md:px-8">
              <div className="text-center text-white max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  {banner.heading}
                </h1>
                <p className="text-lg md:text-xl mb-6">{banner.description}</p>
                {banner.ctaText && (
                  <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg">
                    {banner.ctaText}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-blue-500 scale-125 shadow-md"
                : "bg-white/70 hover:bg-white"
            }`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Hero;

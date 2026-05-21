import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router";
import {
  FaChalkboardTeacher,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const AllTeachersDisplay = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const teacherRefs = useRef([]);

  const API_URL = "https://exam-hero-server-main.vercel.app";

  // Fetch approved teachers only
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/teachers`);
      setTeachers(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch teachers", error);
      setError("শিক্ষকদের ডেটা লোড করতে সমস্যা হয়েছে।");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    teacherRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      teacherRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [teachers]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">শিক্ষকদের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">ত্রুটি</h3>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchTeachers}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with animation */}
        <div className="text-center mb-12 opacity-0 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            আমাদের <span className="text-blue-600">শিক্ষকবৃন্দ</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            দক্ষ ও অভিজ্ঞ শিক্ষকমণ্ডলী যারা আপনাকে গাইড করবে সাফল্যের পথে
          </p>
        </div>

        {teachers.length === 0 ? (
          <div className="text-center py-12 opacity-0 animate-fade-in">
            <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-4 mb-4">
              <FaChalkboardTeacher className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              কোনো শিক্ষক পাওয়া যায়নি
            </h3>
            <p className="text-gray-500">
              বর্তমানে আমাদের শিক্ষক তালিকায় কেউ নেই।
            </p>
          </div>
        ) : (
          <>
            {/* Teachers Grid (✅ Slice করা হলো ৬ জন পর্যন্ত) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teachers.slice(0, 6).map((teacher, index) => (
                <div
                  key={teacher._id}
                  ref={(el) => (teacherRefs.current[index] = el)}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 opacity-0"
                >
                  {/* Teacher Image */}
                  <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center relative">
                    {teacher.profilePic ? (
                      <img
                        src={teacher.profilePic}
                        alt={teacher.fullName}
                        className="h-40 w-40 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="h-40 w-40 rounded-full bg-blue-300 flex items-center justify-center border-4 border-white shadow-lg">
                        <span className="text-4xl text-white font-bold">
                          {teacher.fullName
                            ? teacher.fullName.charAt(0).toUpperCase()
                            : "T"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Teacher Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {teacher.fullName}
                    </h3>
                    <p className="text-blue-600 font-medium mb-3">
                      {teacher.subject}
                    </p>

                    <div className="mt-6 flex space-x-3">
                      {teacher.email && (
                        <a
                          href={`mailto:${teacher.email}`}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm flex items-center justify-center transition-colors"
                        >
                          <FaEnvelope className="h-4 w-4 mr-1" />
                          ইমেইল
                        </a>
                      )}

                      {teacher.phone && (
                        <a
                          href={`tel:${teacher.phone}`}
                          className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded-lg text-sm flex items-center justify-center transition-colors"
                        >
                          <FaPhone className="h-4 w-4 mr-1" />
                          কল
                        </a>
                      )}
                    </div>

                    {/* আরও জানুন */}
                    <Link
                      to={`/teachers/${teacher._id}`}
                      className="block w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium text-center transition-colors"
                    >
                      আরও জানুন →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ নিচে সব শিক্ষক দেখুন বাটন */}
            {teachers.length > 6 && (
              <div className="mt-10 text-center opacity-0 animate-fade-in-delayed">
                <Link
                  to="/allteachers"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-blue-700 transition-all transform hover:scale-105"
                >
                  সব শিক্ষক দেখুন
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delayed {
          animation: fadeIn 1s ease-out 0.5s forwards;
        }
        
        /* Staggered animation for teacher cards */
        .grid > div:nth-child(1) { animation-delay: 0.1s; }
        .grid > div:nth-child(2) { animation-delay: 0.2s; }
        .grid > div:nth-child(3) { animation-delay: 0.3s; }
        .grid > div:nth-child(4) { animation-delay: 0.4s; }
        .grid > div:nth-child(5) { animation-delay: 0.5s; }
        .grid > div:nth-child(6) { animation-delay: 0.6s; }
      `}</style>
    </div>
  );
};

export default AllTeachersDisplay;
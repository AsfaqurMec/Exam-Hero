import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import {
  FaSearch,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaBook,
  FaClock,
} from "react-icons/fa";

const AllTeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 6;

  const API_URL = "https://exam-hero-server-main.vercel.app";

  // Fetch teachers
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

  // Filter teachers by search
  const filteredTeachers = teachers.filter((teacher) => {
    const query = searchQuery.toLowerCase();
    return (
      teacher.fullName?.toLowerCase().includes(query) ||
      teacher.subject?.toLowerCase().includes(query)
    );
  });

  // Pagination logic
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(
    indexOfFirstTeacher,
    indexOfLastTeacher
  );
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            আমাদের <span className="text-blue-600">শিক্ষকবৃন্দ</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            এখানে সকল শিক্ষককে খুঁজে নিন এবং তাদের সম্পর্কে জানুন
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="শিক্ষক বা বিষয় অনুসন্ধান করুন..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-3 pl-10 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
        </div>

        {/* Teacher Cards */}
        {filteredTeachers.length === 0 ? (
          <div className="text-center py-12">
            <FaChalkboardTeacher className="mx-auto h-12 w-12 text-blue-500 mb-3" />
            <h3 className="text-lg font-medium text-gray-700">
              কোনো শিক্ষক পাওয়া যায়নি
            </h3>
            <p className="text-gray-500">দয়া করে অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন।</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentTeachers.map((teacher) => (
                <div
                  key={teacher._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center">
                    {teacher.profilePic ? (
                      <img
                        src={teacher.profilePic}
                        alt={teacher.fullName}
                        className="h-40 w-40 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="h-40 w-40 rounded-full bg-blue-300 flex items-center justify-center border-4 border-white shadow-lg">
                        <span className="text-4xl text-white font-bold">
                          {teacher.fullName?.charAt(0).toUpperCase() || "T"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {teacher.fullName}
                    </h3>
                    <p className="text-blue-600 font-medium">{teacher.subject}</p>

                    {teacher.experience && (
                      <p className="mt-2 text-gray-600 text-sm flex items-center">
                        <FaClock className="h-4 w-4 mr-1 text-blue-500" />
                        {teacher.experience} বছর অভিজ্ঞতা
                      </p>
                    )}

                    <Link
                      to={`/teachers/${teacher._id}`}
                      className="block mt-4 text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      বিস্তারিত দেখুন
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-10">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  ←
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllTeachersPage;

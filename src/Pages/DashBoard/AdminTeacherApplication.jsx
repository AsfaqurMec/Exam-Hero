import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const AdminTeacherApplication = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = "https://exam-hero-server-main.vercel.app";

  // Fetch all teachers (admin view)
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/teachers`);
      setTeachers(res.data);
      
      // Calculate stats
      const pending = res.data.filter(t => t.status === "pending").length;
      const approved = res.data.filter(t => t.status === "approved").length;
      const rejected = res.data.filter(t => t.status === "rejected").length;
      
      setStats({
        pending,
        approved,
        rejected,
        total: res.data.length
      });
    } catch (error) {
      console.error("❌ Failed to fetch teachers", error);
      Swal.fire({
        icon: 'error',
        title: 'ত্রুটি!',
        text: 'শিক্ষকদের ডেটা লোড করতে সমস্যা হয়েছে।'
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // শিক্ষকের আবেদন স্ট্যাটাস আপডেট ফাংশন
  const updateStatus = async (id, status, comment = "") => {
    try {
      await axios.patch(`${API_URL}/teachers/${id}/status`, { status, adminComment: comment });
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'সফল!',
        text: `শিক্ষকের আবেদন ${status === 'approved' ? 'অনুমোদন' : 'প্রত্যাখ্যান'} করা হয়েছে।`,
        timer: 2000,
        showConfirmButton: false
      });
      
      fetchTeachers(); // Refresh list after status change
    } catch (error) {
      console.error(`❌ Failed to update status`, error);
      Swal.fire({
        icon: 'error',
        title: 'ত্রুটি!',
        text: 'স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।'
      });
    }
  };

  // শিক্ষক ডিলিট ফাংশন
  const deleteTeacher = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'আপনি কি নিশ্চিত?',
        text: "এই শিক্ষকের আবেদনটি সম্পূর্ণভাবে মুছে ফেলা হবে!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'হ্যাঁ, মুছে ফেলুন!',
        cancelButtonText: 'বাতিল করুন'
      });
      
      if (result.isConfirmed) {
        await axios.delete(`${API_URL}/teachers/${id}`);
        
        Swal.fire({
          icon: 'success',
          title: 'মুছে ফেলা হয়েছে!',
          text: 'শিক্ষকের আবেদনটি সফলভাবে মুছে ফেলা হয়েছে।',
          timer: 2000,
          showConfirmButton: false
        });
        
        fetchTeachers(); // Refresh list after deletion
      }
    } catch (error) {
      console.error("❌ Failed to delete teacher", error);
      Swal.fire({
        icon: 'error',
        title: 'ত্রুটি!',
        text: 'শিক্ষক মুছে ফেলতে সমস্যা হয়েছে।'
      });
    }
  };

  const handleApprove = async (teacher) => {
    const { value: comment } = await Swal.fire({
      title: 'আবেদন অনুমোদন করুন',
      input: 'textarea',
      inputLabel: 'মন্তব্য (ঐচ্ছিক)',
      inputPlaceholder: 'যেকোনো বিশেষ মন্তব্য লিখুন...',
      showCancelButton: true,
      confirmButtonText: 'অনুমোদন করুন',
      cancelButtonText: 'বাতিল করুন',
      inputValidator: (value) => {
        return new Promise((resolve) => {
          resolve();
        });
      }
    });

    if (comment !== undefined) {
      updateStatus(teacher._id, "approved", comment || "কোনো মন্তব্য নেই");
    }
  };

  const handleReject = async (teacher) => {
    const { value: comment } = await Swal.fire({
      title: 'আবেদন প্রত্যাখ্যান করুন',
      input: 'textarea',
      inputLabel: 'কারণ লিখুন*',
      inputPlaceholder: 'আবেদন প্রত্যাখ্যানের কারণ লিখুন...',
      inputValidator: (value) => {
        if (!value) {
          return 'আপনাকে কারণ লিখতে হবে!';
        }
      },
      showCancelButton: true,
      confirmButtonText: 'প্রত্যাখ্যান করুন',
      cancelButtonText: 'বাতিল করুন'
    });

    if (comment) {
      updateStatus(teacher._id, "rejected", comment);
    }
  };

  // Filter and search functionality
  const filteredTeachers = useMemo(() => {
    let result = teachers;
    
    // Apply status filter
    if (filter !== "all") {
      result = result.filter(t => t.status === filter);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t => 
        (t.fullName || t.name).toLowerCase().includes(term) ||
        (t.email || '').toLowerCase().includes(term) ||
        (t.subject || '').toLowerCase().includes(term) ||
        (t.phone || '').includes(term)
      );
    }
    
    return result;
  }, [teachers, filter, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTeachers.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredTeachers, itemsPerPage]);

  // Reset to first page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const statusBadge = (status) => {
    const statusConfig = {
      pending: { class: "bg-yellow-100 text-yellow-800", text: "বিচারাধীন" },
      approved: { class: "bg-green-100 text-green-800", text: "অনুমোদিত" },
      rejected: { class: "bg-red-100 text-red-800", text: "প্রত্যাখ্যানিত" }
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[status].class}`}>
        {statusConfig[status].text}
      </span>
    );
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
        <div className="text-sm text-gray-600">
          {filteredTeachers.length}টি আবেদনের মধ্যে {(currentPage-1)*itemsPerPage+1} থেকে {Math.min(currentPage*itemsPerPage, filteredTeachers.length)} দেখানো হচ্ছে
        </div>
        
        <nav className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            পূর্ববর্তী
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}
          
          {pageNumbers.map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                currentPage === page 
                  ? "bg-blue-600 text-white border border-blue-600" 
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            পরবর্তী
          </button>
        </nav>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">প্রতি পৃষ্ঠায়:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">শিক্ষক আবেদন ব্যবস্থাপনা</h1>
            <p className="text-gray-600">অ্যাডমিন প্যানেল - শিক্ষকদের আবেদন পর্যালোচনা ও অনুমোদন করুন</p>
          </div>
          
          <div className="mt-4 md:mt-0 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="শিক্ষক খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64 transition-colors duration-200"
            />
          </div>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm transition-transform duration-200 hover:scale-[1.02]">
            <div className="text-blue-600 font-bold text-2xl">{stats.total}</div>
            <div className="text-blue-800 font-medium text-sm">মোট আবেদন</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200 shadow-sm transition-transform duration-200 hover:scale-[1.02]">
            <div className="text-yellow-600 font-bold text-2xl">{stats.pending}</div>
            <div className="text-yellow-800 font-medium text-sm">বিচারাধীন</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 shadow-sm transition-transform duration-200 hover:scale-[1.02]">
            <div className="text-green-600 font-bold text-2xl">{stats.approved}</div>
            <div className="text-green-800 font-medium text-sm">অনুমোদিত</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200 shadow-sm transition-transform duration-200 hover:scale-[1.02]">
            <div className="text-red-600 font-bold text-2xl">{stats.rejected}</div>
            <div className="text-red-800 font-medium text-sm">প্রত্যাখ্যানিত</div>
          </div>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button 
            onClick={() => setFilter("all")} 
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${filter === "all" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            সকল আবেদন
          </button>
          <button 
            onClick={() => setFilter("pending")} 
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${filter === "pending" ? "bg-yellow-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            বিচারাধীন ({stats.pending})
          </button>
          <button 
            onClick={() => setFilter("approved")} 
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${filter === "approved" ? "bg-green-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            অনুমোদিত ({stats.approved})
          </button>
          <button 
            onClick={() => setFilter("rejected")} 
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${filter === "rejected" ? "bg-red-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            প্রত্যাখ্যানিত ({stats.rejected})
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <p className="text-gray-600 text-sm">
          {filteredTeachers.length}টি আবেদন পাওয়া গেছে {searchTerm && <span>"{searchTerm}" অনুসন্ধানে</span>}
          {filter !== "all" && <span>, ফিল্টার: {filter === "pending" ? "বিচারাধীন" : filter === "approved" ? "অনুমোদিত" : "প্রত্যাখ্যানিত"}</span>}
        </p>
        
        {filteredTeachers.length > 0 && (
          <div className="text-sm text-gray-600">
            পৃষ্ঠা {currentPage} / {totalPages}
          </div>
        )}
      </div>

      {filteredTeachers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-700">কোনো আবেদন পাওয়া যায়নি</h3>
          <p className="text-gray-500 mt-2">
            {filter === "pending" 
              ? "বর্তমানে কোনো বিচারাধীন আবেদন নেই" 
              : filter === "approved" 
                ? "কোনো অনুমোদিত আবেদন নেই" 
                : filter === "rejected" 
                  ? "কোনো প্রত্যাখ্যানিত আবেদন নেই" 
                  : searchTerm
                    ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো আবেদন নেই"
                    : "কোনো আবেদন পাওয়া যায়নি"}
          </p>
          {(filter !== "all" || searchTerm) && (
            <button 
              onClick={() => {
                setFilter("all");
                setSearchTerm("");
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              সকল আবেদন দেখুন
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map(teacher => (
              <div key={teacher._id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg border border-gray-100">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-semibold text-gray-800">{teacher.fullName || teacher.name}</h2>
                    {statusBadge(teacher.status)}
                  </div>
                  
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>{teacher.subject}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{teacher.email}</span>
                    </div>
                    
                    {teacher.phone && (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{teacher.phone}</span>
                      </div>
                    )}
                    
                    {teacher.experience && (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{teacher.experience} বছর অভিজ্ঞতা</span>
                      </div>
                    )}
                  </div>
                  
                  {teacher.adminComment && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">অ্যাডমিন মন্তব্য:</span> {teacher.adminComment}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-5 flex flex-wrap gap-2">
                    {teacher.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(teacher)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          অনুমোদন
                        </button>
                        <button
                          onClick={() => handleReject(teacher)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          প্রত্যাখ্যান
                        </button>
                      </>
                    )}
                    
                    {/* ডিলিট বাটন - সকল স্ট্যাটাসের জন্য দেখাবে */}
                    <button
                      onClick={() => deleteTeacher(teacher._id)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      মুছুন
                    </button>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => setSelectedTeacher(teacher)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200"
                    >
                      সম্পূর্ণ বিবরণ দেখুন
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Pagination />
        </>
      )}
      
      {/* Teacher Detail Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">শিক্ষক বিবরণ</h3>
                <button 
                  onClick={() => setSelectedTeacher(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">পূর্ণ নাম</h4>
                    <p className="mt-1 p-2 bg-gray-50 rounded-lg">{selectedTeacher.fullName || selectedTeacher.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">বিষয়</h4>
                    <p className="mt-1 p-2 bg-gray-50 rounded-lg">{selectedTeacher.subject}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">ইমেইল</h4>
                    <p className="mt-1 p-2 bg-gray-50 rounded-lg">{selectedTeacher.email}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">ফোন নম্বর</h4>
                    <p className="mt-1 p-2 bg-gray-50 rounded-lg">{selectedTeacher.phone || "প্রদান করা হয়নি"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">অভিজ্ঞতা</h4>
                    <p className="mt-1 p-2 bg-gray-50 rounded-lg">{selectedTeacher.experience || "প্রদান করা হয়নি"} বছর</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">শিক্ষাগত যোগ্যতা</h4>
                    <p className="mt-1 p-2 bg-gray-50 rounded-lg">{selectedTeacher.qualification || "প্রদান করা হয়নি"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">বিভাগ</h4>
                    <p className="mt-1 p-2 bg-gray-50 rounded-lg">{selectedTeacher.department || "প্রদান করা হয়নি"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">যোগদানের তারিখ</h4>
                    <p className="mt-1 p-2 bg-gray-50 rounded-lg">{selectedTeacher.joiningDate || "প্রদান করা হয়নি"}</p>
                  </div>
                </div>
                
                {selectedTeacher.bio && (
                  <div>
                    <h4 className="font-medium text-gray-700">জীবনবৃত্তান্ত</h4>
                    <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedTeacher.bio}</p>
                  </div>
                )}
                
                {selectedTeacher.adminComment && (
                  <div>
                    <h4 className="font-medium text-gray-700">অ্যাডমিন মন্তব্য</h4>
                    <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedTeacher.adminComment}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-700">আবেদনের অবস্থা</h4>
                  <div className="mt-1">
                    {statusBadge(selectedTeacher.status)}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3 justify-end">
                {selectedTeacher.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        handleApprove(selectedTeacher);
                        setSelectedTeacher(null);
                      }}
                      className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      অনুমোদন করুন
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedTeacher);
                        setSelectedTeacher(null);
                      }}
                      className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      প্রত্যাখ্যান করুন
                    </button>
                  </>
                )}
                
                {/* ডিটেইল মোডালে ডিলিট বাটন */}
                <button
                  onClick={() => {
                    deleteTeacher(selectedTeacher._id);
                    setSelectedTeacher(null);
                  }}
                  className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  মুছুন
                </button>
                
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeacherApplication;
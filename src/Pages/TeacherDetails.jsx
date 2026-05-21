import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiArrowLeft, FiMail, FiPhone, FiAward, FiBook, 
  FiUser, FiBriefcase, FiCalendar, FiMapPin, FiGlobe,
  FiEdit, FiTrash2, FiStar, FiDownload, FiClock, FiVideo,
  FiMessageSquare, FiDollarSign, FiUsers, FiBookOpen, FiLinkedin,
  FiTwitter, FiFacebook, FiYoutube, FiInstagram, FiGitlab, FiSend,
  FiBarChart2, FiPieChart, FiTrendingUp, FiBookmark, FiHeart
} from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "https://exam-hero-server-main.vercel.app";

const TeacherDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [relatedTeachers, setRelatedTeachers] = useState([]);
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    reviews: 0,
    experience: 0
  });

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/teachers/${id}`);
        setTeacher(res.data);
        setError(null);
        
        // Fetch related teachers (same subject)
        const relatedRes = await axios.get(`${API_URL}/teachers?subject=${res.data.subject}&limit=4`);
        setRelatedTeachers(relatedRes.data.filter(t => t._id !== res.data._id));
        
        // Set stats (simulated data)
        setStats({
          students: Math.floor(Math.random() * 1000) + 100,
          courses: Math.floor(Math.random() * 20) + 5,
          reviews: Math.floor(Math.random() * 200) + 30,
          experience: res.data.experience || 5
        });
      } catch (error) {
        console.error("❌ Failed to fetch teacher", error);
        setError("শিক্ষকের তথ্য লোড করতে সমস্যা হয়েছে");
        toast.error("শিক্ষকের তথ্য লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/teachers/${id}`);
      toast.success("শিক্ষকের তথ্য সফলভাবে মুছে ফেলা হয়েছে");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("❌ Failed to delete teacher", error);
      toast.error("শিক্ষকের তথ্য মুছতে সমস্যা হয়েছে");
    }
    setShowDeleteConfirm(false);
  };

  const downloadVCard = () => {
    if (!teacher) return;
    
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${teacher.fullName}
ORG:${teacher.department || 'শিক্ষা প্রতিষ্ঠান'}
TITLE:${teacher.subject}
EMAIL:${teacher.email || ''}
TEL:${teacher.phone || ''}
END:VCARD`;
    
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${teacher.fullName.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("ভিসিটিং কার্ড ডাউনলোড করা হয়েছে");
  };

  const scheduleMeeting = () => {
    toast.info("শীঘ্রই মিটিং শিডিউল করার ব্যবস্থা যোগ করা হবে");
  };

  const startVideoCall = () => {
    toast.info("শীঘ্রই ভিডিও কলের ব্যবস্থা যোগ করা হবে");
  };

  const StatsCard = ({ icon, value, label, color }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-white p-4 rounded-xl shadow-md border-l-4 ${color} flex items-center`}
    >
      <div className="mr-4 text-2xl">{icon}</div>
      <div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"
          ></motion.div>
          <p className="text-gray-600 font-medium">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-red-500 text-5xl mb-4"
          >
            ⚠️
          </motion.div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">শিক্ষক পাওয়া যায়নি</h2>
          <p className="text-gray-600 mb-6">{error || "আপনি যে শিক্ষক খুঁজছেন তিনি পাওয়া যায়নি"}</p>
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 bg-blue-50 px-4 py-2 rounded-lg"
          >
            <FiArrowLeft className="mr-2" /> হোমে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200"
          >
            <FiArrowLeft className="mr-2" /> হোমে ফিরে যান
          </Link>
          
          <div className="flex space-x-3">
            <button
              onClick={downloadVCard}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200"
            >
              <FiDownload className="mr-2" /> ভি-কার্ড
            </button>
            {/* <Link
              to={`/teachers/edit/${teacher._id || id}`}
              className="inline-flex items-center text-green-600 hover:text-green-800 font-medium transition-colors duration-200 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200"
            >
              <FiEdit className="mr-2" /> সম্পাদনা
            </Link> */}
            {/* <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center text-red-600 hover:text-red-800 font-medium transition-colors duration-200 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200"
            >
              <FiTrash2 className="mr-2" /> মুছুন
            </button> */}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Teacher Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Profile Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                <div className="flex flex-col md:flex-row items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                    className="relative mb-6 md:mb-0 md:mr-8"
                  >
                    {teacher.profilePic ? (
                      <img
                        src={teacher.profilePic}
                        alt={teacher.fullName}
                        className="h-40 w-40 rounded-full object-cover border-4 border-white shadow-2xl"
                      />
                    ) : (
                      <div className="h-40 w-40 rounded-full bg-blue-500 flex items-center justify-center border-4 border-white shadow-2xl">
                        <FiUser className="text-5xl" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 h-10 w-10 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="h-3 w-3 bg-white rounded-full"></div>
                    </div>
                  </motion.div>

                  <div className="text-center md:text-left flex-1">
                    <motion.h1 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-4xl font-bold mb-2"
                    >
                      {teacher.fullName}
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="text-blue-100 text-xl mb-3"
                    >
                      {teacher.subject}
                    </motion.p>
                    {teacher.department && (
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="text-blue-100 flex items-center justify-center md:justify-start mb-4"
                      >
                        <FiBriefcase className="mr-2" /> {teacher.department}
                      </motion.p>
                    )}
                    
                    {/* Rating */}
                    {teacher.rating && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex items-center justify-center md:justify-start"
                      >
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={`${i < Math.floor(teacher.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} text-lg mr-1`} 
                          />
                        ))}
                        <span className="ml-2 text-blue-100">({teacher.rating})</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-gray-100">
                <StatsCard 
                  icon={<FiUsers className="text-blue-500" />} 
                  value={stats.students} 
                  label="শিক্ষার্থী" 
                  color="border-l-blue-500" 
                />
                <StatsCard 
                  icon={<FiBookOpen className="text-green-500" />} 
                  value={stats.courses} 
                  label="কোর্স" 
                  color="border-l-green-500" 
                />
                <StatsCard 
                  icon={<FiStar className="text-yellow-500" />} 
                  value={stats.reviews} 
                  label="রিভিউ" 
                  color="border-l-yellow-500" 
                />
                <StatsCard 
                  icon={<FiAward className="text-purple-500" />} 
                  value={`${stats.experience}+`} 
                  label="বছর অভিজ্ঞতা" 
                  color="border-l-purple-500" 
                />
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200 px-6">
                <nav className="flex -mb-px">
                  {['overview', 'schedule', 'reviews', 'documents'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors duration-200 ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab === 'overview' && 'ওভারভিউ'}
                      {tab === 'schedule' && 'শিডিউল'}
                      {tab === 'reviews' && 'রিভিউ'}
                      {tab === 'documents' && 'নথিপত্র'}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                          {teacher.experience && (
                            <motion.div 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6, duration: 0.5 }}
                              className="flex items-start"
                            >
                              <div className="bg-blue-100 p-3 rounded-xl mr-4">
                                <FiAward className="text-blue-600 text-xl" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-600">অভিজ্ঞতা</h3>
                                <p className="text-gray-800">{teacher.experience} বছর</p>
                              </div>
                            </motion.div>
                          )}

                          {teacher.qualification && (
                            <motion.div 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7, duration: 0.5 }}
                              className="flex items-start"
                            >
                              <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                                <FiBook className="text-indigo-600 text-xl" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-600">শিক্ষাগত যোগ্যতা</h3>
                                <p className="text-gray-800">{teacher.qualification}</p>
                              </div>
                            </motion.div>
                          )}
                          
                          {teacher.joinDate && (
                            <motion.div 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8, duration: 0.5 }}
                              className="flex items-start"
                            >
                              <div className="bg-purple-100 p-3 rounded-xl mr-4">
                                <FiCalendar className="text-purple-600 text-xl" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-600">যোগদানের তারিখ</h3>
                                <p className="text-gray-800">{new Date(teacher.joinDate).toLocaleDateString('bn-BD')}</p>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                          {teacher.email && (
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6, duration: 0.5 }}
                              className="flex items-start"
                            >
                              <div className="bg-green-100 p-3 rounded-xl mr-4">
                                <FiMail className="text-green-600 text-xl" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-600">ইমেইল</h3>
                                <p className="text-gray-800">{teacher.email}</p>
                              </div>
                            </motion.div>
                          )}

                          {teacher.phone && (
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7, duration: 0.5 }}
                              className="flex items-start"
                            >
                              <div className="bg-purple-100 p-3 rounded-xl mr-4">
                                <FiPhone className="text-purple-600 text-xl" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-600">ফোন নম্বর</h3>
                                <p className="text-gray-800">{teacher.phone}</p>
                              </div>
                            </motion.div>
                          )}
                          
                          {teacher.address && (
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8, duration: 0.5 }}
                              className="flex items-start"
                            >
                              <div className="bg-orange-100 p-3 rounded-xl mr-4">
                                <FiMapPin className="text-orange-600 text-xl" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-600">ঠিকানা</h3>
                                <p className="text-gray-800">{teacher.address}</p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Bio Section */}
                      {teacher.bio && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9, duration: 0.5 }}
                          className="mt-8 pt-8 border-t border-gray-100"
                        >
                          <h3 className="font-semibold text-gray-700 mb-4 text-xl">জীবনবৃত্তান্ত</h3>
                          <p className="text-gray-600 leading-relaxed">{teacher.bio}</p>
                        </motion.div>
                      )}

                      {/* Action Buttons */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
                      >
                        {teacher.email && (
                          <a
                            href={`mailto:${teacher.email}`}
                            className="flex flex-col items-center justify-center p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200 border border-blue-100"
                          >
                            <FiMail className="text-xl mb-2" /> 
                            <span className="text-sm">ইমেইল</span>
                          </a>
                        )}
                        {teacher.phone && (
                          <a
                            href={`tel:${teacher.phone}`}
                            className="flex flex-col items-center justify-center p-4 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors duration-200 border border-green-100"
                          >
                            <FiPhone className="text-xl mb-2" /> 
                            <span className="text-sm">কল করুন</span>
                          </a>
                        )}
                        <button
                          onClick={scheduleMeeting}
                          className="flex flex-col items-center justify-center p-4 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors duration-200 border border-purple-100"
                        >
                          <FiClock className="text-xl mb-2" /> 
                          <span className="text-sm">মিটিং</span>
                        </button>
                        <button
                          onClick={startVideoCall}
                          className="flex flex-col items-center justify-center p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors duration-200 border border-red-100"
                        >
                          <FiVideo className="text-xl mb-2" /> 
                          <span className="text-sm">ভিডিও কল</span>
                        </button>
                      </motion.div>
                    </motion.div>
                  )}

                  {activeTab === 'schedule' && (
                    <motion.div
                      key="schedule"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center py-8">
                        <FiCalendar className="text-4xl text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">শিডিউল তথ্য</h3>
                        <p className="text-gray-500 mb-6">শিক্ষকের শিডিউল শীঘ্রই যোগ করা হবে</p>
                        
                        <div className="bg-gray-50 p-6 rounded-xl">
                          <h4 className="font-medium text-gray-700 mb-4">সাধারণ উপলব্ধতা</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                              <p className="text-sm text-gray-600">শনিবার - বুধবার</p>
                              <p className="font-medium">সকাল ৯টা - বিকাল ৫টা</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                              <p className="text-sm text-gray-600">বৃহস্পতিবার</p>
                              <p className="font-medium">সকাল ১০টা - দুপুর ১টা</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'reviews' && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center py-8">
                        <FiStar className="text-4xl text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">রিভিউ</h3>
                        <p className="text-gray-500">শিক্ষকের রিভিউ শীঘ্রই যোগ করা হবে</p>
                        
                        <div className="mt-6 bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                          <div className="flex items-center justify-center mb-4">
                            {[...Array(5)].map((_, i) => (
                              <FiStar 
                                key={i} 
                                className={`${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} text-2xl mr-1`} 
                              />
                            ))}
                            <span className="ml-2 text-gray-700 font-medium text-xl">4.5/5</span>
                          </div>
                          <p className="text-gray-600">২৫টি রিভিউ এর ভিত্তিতে</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'documents' && (
                    <motion.div
                      key="documents"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center py-8">
                        <FiBookOpen className="text-4xl text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">নথিপত্র</h3>
                        <p className="text-gray-500">শিক্ষকের নথিপত্র শীঘ্রই যোগ করা হবে</p>
                        
                        <div className="mt-6 bg-gray-50 p-6 rounded-xl">
                          <h4 className="font-medium text-gray-700 mb-4 text-left">দেখানো হচ্ছে ৩টি নথি</h4>
                          <div className="space-y-4">
                            <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
                              <div className="flex items-center">
                                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                  <FiBook className="text-blue-600 text-xl" />
                                </div>
                                <div>
                                  <p className="font-medium">শিক্ষাগত যোগ্যতার সার্টিফিকেট</p>
                                  <p className="text-sm text-gray-500">PDF, 2.5 MB</p>
                                </div>
                              </div>
                              <button className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg">
                                <FiDownload />
                              </button>
                            </div>
                            
                            <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
                              <div className="flex items-center">
                                <div className="bg-green-100 p-3 rounded-lg mr-4">
                                  <FiAward className="text-green-600 text-xl" />
                                </div>
                                <div>
                                  <p className="font-medium">প্রশিক্ষণ সার্টিফিকেট</p>
                                  <p className="text-sm text-gray-500">PDF, 1.8 MB</p>
                                </div>
                              </div>
                              <button className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg">
                                <FiDownload />
                              </button>
                            </div>
                            
                            <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
                              <div className="flex items-center">
                                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                                  <FiUsers className="text-purple-600 text-xl" />
                                </div>
                                <div>
                                  <p className="font-medium">অভিজ্ঞতার সার্টিফিকেট</p>
                                  <p className="text-sm text-gray-500">PDF, 3.2 MB</p>
                                </div>
                              </div>
                              <button className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg">
                                <FiDownload />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">দ্রুত যোগাযোগ</h3>
              
              <div className="space-y-4">
                {teacher.email && (
                  <a
                    href={`mailto:${teacher.email}`}
                    className="flex items-center justify-between p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200 border border-blue-100"
                  >
                    <div className="flex items-center">
                      <FiMail className="mr-3" /> ইমেইল
                    </div>
                    <span className="text-xs bg-blue-100 px-2 py-1 rounded">দ্রুত উত্তর</span>
                  </a>
                )}
                
                {teacher.phone && (
                  <a
                    href={`tel:${teacher.phone}`}
                    className="flex items-center justify-between p-4 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors duration-200 border border-green-100"
                  >
                    <div className="flex items-center">
                      <FiPhone className="mr-3" /> ফোন করুন
                    </div>
                    <span className="text-xs bg-green-100 px-2 py-1 rounded">এখনই কল</span>
                  </a>
                )}
                
                <button
                  onClick={scheduleMeeting}
                  className="w-full flex items-center justify-between p-4 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors duration-200 border border-purple-100"
                >
                  <div className="flex items-center">
                    <FiClock className="mr-3" /> মিটিং শিডিউল
                  </div>
                </button>
                
                <button
                  onClick={startVideoCall}
                  className="w-full flex items-center justify-between p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors duration-200 border border-red-100"
                >
                  <div className="flex items-center">
                    <FiVideo className="mr-3" /> ভিডিও কল
                  </div>
                  <span className="text-xs bg-red-100 px-2 py-1 rounded">নতুন</span>
                </button>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-700 mb-3">বার্তা পাঠান</h4>
                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <FiMessageSquare className="mr-2" /> মেসেজ
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                    <FiMail className="mr-2" /> ইমেইল
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-700 mb-3">সোশ্যাল মিডিয়া</h4>
                <div className="flex space-x-2">
                  <a href="#" className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    <FiFacebook />
                  </a>
                  <a href="#" className="p-3 bg-blue-100 text-blue-400 rounded-lg hover:bg-blue-200 transition-colors">
                    <FiTwitter />
                  </a>
                  <a href="#" className="p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                    <FiLinkedin />
                  </a>
                  <a href="#" className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    <FiYoutube />
                  </a>
                </div>
              </div>
            </motion.div>
            
            {/* Related Teachers */}
            {relatedTeachers.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="font-semibold text-gray-800 mb-4 text-lg">সম্পর্কিত শিক্ষকবৃন্দ</h3>
                
                <div className="space-y-4">
                  {relatedTeachers.slice(0, 3).map((relatedTeacher) => (
                    <Link 
                      key={relatedTeacher._id} 
                      to={`/teachers/${relatedTeacher._id}`}
                      className="flex items-center p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
                    >
                      {relatedTeacher.profilePic ? (
                        <img
                          src={relatedTeacher.profilePic}
                          alt={relatedTeacher.fullName}
                          className="h-12 w-12 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                          <FiUser className="text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{relatedTeacher.fullName}</p>
                        <p className="text-sm text-gray-600">{relatedTeacher.subject}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <Link 
                  to={`/allteachers`}
                  className="block mt-4 text-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  আরও দেখুন →
                </Link>
              </motion.div>
            )}

            {/* Skills Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">দক্ষতা</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">শিক্ষণ পদ্ধতি</span>
                    <span className="text-sm font-medium text-gray-700">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">বিষয় জ্ঞান</span>
                    <span className="text-sm font-medium text-gray-700">88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">যোগাযোগ</span>
                    <span className="text-sm font-medium text-gray-700">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">শিক্ষার্থী সহায়তা</span>
                    <span className="text-sm font-medium text-gray-700">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">শিক্ষক মুছুন</h3>
                <p className="text-gray-600 mb-6">আপনি কি নিশ্চিত যে আপনি {teacher.fullName} এর প্রোফাইল মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।</p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    বাতিল
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    মুছুন
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeacherDetails;
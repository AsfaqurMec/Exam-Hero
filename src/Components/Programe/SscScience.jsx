import React, { useState, useEffect } from 'react';
import { FaBook, FaChalkboardTeacher, FaDownload, FaMobileAlt, FaQrcode, FaTimes, FaDatabase, FaVideo, FaClock, FaUserTie } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SSC_SCIENCE_SUBJECTS = [
  {
    id: 1,
    name: "পদার্থবিজ্ঞান",
    description: "Physics এর সম্পূর্ণ পাঠ্যক্রম ও গুরুত্বপূর্ণ সূত্র",
    chapters: 14,
    color: "from-blue-500 to-indigo-500",
    icon: "⚛️"
  },
  {
    id: 2,
    name: "রসায়ন",
    description: "Chemistry এর মৌলিক ধারণা ও পরীক্ষামূলক সমাধান",
    chapters: 12,
    color: "from-red-500 to-pink-500",
    icon: "🧪"
  },
  {
    id: 3,
    name: "জীববিজ্ঞান",
    description: "Biology এর গুরুত্বপূর্ণ টপিক ও নোটস",
    chapters: 16,
    color: "from-green-500 to-emerald-500",
    icon: "🧬"
  },
  {
    id: 4,
    name: "গণিত",
    description: "Mathematics এর সব মৌলিক ও Advanced বিষয়",
    chapters: 18,
    color: "from-yellow-500 to-amber-500",
    icon: "📐"
  },
  {
    id: 5,
    name: "উচ্চতর গণিত",
    description: "Advanced Mathematics এবং Problem Solving",
    chapters: 10,
    color: "from-purple-500 to-violet-500",
    icon: "📊"
  }
];

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
        >
          <FaTimes className="text-2xl" />
        </button>
        {children}
      </div>
    </div>
  );
};

const AppDownloadModal = ({ isOpen, onClose }) => {
  const handleComingSoon = () => {
    toast.success("আমাদের অ্যাপ শীঘ্রই আসছে! অনুগ্রহ করে আমাদের সঙ্গে থাকুন।");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 md:p-8 max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl mb-4">
            <FaMobileAlt className="text-2xl md:text-3xl" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            এক্সাম হিরো অ্যাপ ডাউনলোড করুন
          </h3>
          <p className="text-gray-600 text-sm md:text-base">
            SSC Science এর সম্পূর্ণ পাঠ্যক্রম পেতে এখনই ডাউনলোড করুন। আমাদের অ্যাপ শীঘ্রই আসছে!
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <button 
            onClick={handleComingSoon} 
            className="flex flex-col items-center justify-center p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md transition"
          >
            <FaQrcode className="text-4xl mb-2" />
            <span className="font-medium">Google Play</span>
          </button>

          <button 
            onClick={handleComingSoon} 
            className="flex flex-col items-center justify-center p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md transition"
          >
            <FaQrcode className="text-4xl mb-2" />
            <span className="font-medium">App Store</span>
          </button>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl mb-6">
          <h4 className="font-semibold text-lg mb-3 text-blue-800">অ্যাপের বিশেষ সুবিধাসমূহ</h4>
          <ul className="space-y-2">
            <li className="flex items-center">
              <FaDatabase className="text-blue-500 mr-2" />
              <span className="text-gray-700">লক্ষাধিক প্রশ্নের ডাটাবেজ</span>
            </li>
            <li className="flex items-center">
              <FaVideo className="text-red-500 mr-2" />
              <span className="text-gray-700">ভিডিও সমাধান</span>
            </li>
            <li className="flex items-center">
              <FaClock className="text-purple-500 mr-2" />
              <span className="text-gray-700">লাইভ এক্সাম</span>
            </li>
            <li className="flex items-center">
              <FaUserTie className="text-green-500 mr-2" />
              <span className="text-gray-700">মেন্টর সাথে লাইভ চ্যাট</span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            পরে দেখবো
          </button>
        </div>
      </div>
    </Modal>
  );
};

const SubjectCard = ({ subject, onOpenModal }) => (
  <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100`}>
    <div className={`h-2 bg-gradient-to-r ${subject.color}`}></div>
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{subject.icon}</span>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          {subject.chapters} অধ্যায়
        </span>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{subject.name}</h3>
      <p className="text-gray-600 mb-4">{subject.description}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded">SSC Science</span>
      </div>
      <button 
        onClick={() => onOpenModal(subject)}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center"
      >
        <FaBook className="mr-2" />
        বিস্তারিত দেখুন
      </button>
    </div>
  </div>
);

const SubjectDetailModal = ({ isOpen, onClose, subject }) => {
  if (!isOpen || !subject) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <div className="flex items-center mb-6">
          <span className="text-4xl mr-4">{subject.icon}</span>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{subject.name}</h3>
            <p className="text-gray-600">{subject.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{subject.chapters}</div>
            <div className="text-gray-600">অধ্যায়</div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-lg mb-3 text-gray-800">এই বিষয়ে যা পাচ্ছেন</h4>
          <ul className="space-y-2">
            <li className="flex items-center"><span className="text-green-500 mr-2">✔</span><span className="text-gray-700">বিষয়ভিত্তিক নোটস</span></li>
            <li className="flex items-center"><span className="text-green-500 mr-2">✔</span><span className="text-gray-700">বোর্ড প্রশ্নের সমাধান</span></li>
            <li className="flex items-center"><span className="text-green-500 mr-2">✔</span><span className="text-gray-700">মডেল টেস্ট</span></li>
            <li className="flex items-center"><span className="text-green-500 mr-2">✔</span><span className="text-gray-700">ভিডিও লেকচার</span></li>
            <li className="flex items-center"><span className="text-green-500 mr-2">✔</span><span className="text-gray-700">মক টেস্ট</span></li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

const SSCScience = () => {
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const openAppModal = () => setIsAppModalOpen(true);
  const closeAppModal = () => setIsAppModalOpen(false);
  const openSubjectModal = (subject) => { setSelectedSubject(subject); setIsSubjectModalOpen(true); };
  const closeSubjectModal = () => { setIsSubjectModalOpen(false); setSelectedSubject(null); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            SSC <span className="text-blue-600">Science</span> Program
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            বৈজ্ঞানিক বিভাগের সম্পূর্ণ পাঠ্যক্রম একত্রে। নোটস, মডেল টেস্ট এবং এক্সপার্ট গাইডেন্স সহ প্রস্তুতি নিন সেরা ফলাফলের জন্য।
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">বিষয়সমূহ</h2>
          <p className="text-gray-600 text-center mb-12">নিচের বিষয়গুলো থেকে পছন্দসই বিষয় নির্বাচন করুন</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SSC_SCIENCE_SUBJECTS.map(subject => (
              <SubjectCard key={subject.id} subject={subject} onOpenModal={openSubjectModal} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">SSC Science এর বিশেষ সুবিধা</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <FaBook className="text-xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2">বিষয়ভিত্তিক নোটস</h3>
              <p className="text-gray-600">সহজে বুঝার জন্য বাংলা নোটস</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                <FaChalkboardTeacher className="text-xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Teachers</h3>
              <p className="text-gray-600">অভিজ্ঞ শিক্ষকদের গাইডলাইন</p>
            </div>
            <div className="text-center p-6 bg-amber-50 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-600 rounded-full mb-4">
                <FaMobileAlt className="text-xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2">মোবাইল অ্যাপ</h3>
              <p className="text-gray-600">যেকোনো সময় পড়ার সুযোগ</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
                <FaDownload className="text-xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2">অফলাইন এক্সেস</h3>
              <p className="text-gray-600">ইন্টারনেট ছাড়াই পড়ুন</p>
            </div>
          </div>
        </div>

        <div className="text-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">আজই শুরু করুন আপনার প্রস্তুতি</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            SSC Science এর সম্পূর্ণ পাঠ্যক্রম, নোটস এবং মডেল টেস্ট পেতে এখনই Exam Hero অ্যাপ ডাউনলোড করুন
          </p>
          <button 
            onClick={openAppModal}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center"
          >
            <FaDownload className="mr-2" />
            অ্যাপ ডাউনলোড করুন
          </button>
        </div>
      </div>

      <AppDownloadModal isOpen={isAppModalOpen} onClose={closeAppModal} />
      <SubjectDetailModal isOpen={isSubjectModalOpen} onClose={closeSubjectModal} subject={selectedSubject} />
    </div>
  );
};

export default SSCScience;

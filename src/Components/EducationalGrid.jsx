import React, { useEffect, useRef, useState } from 'react';
import { 
  FaBook, 
  FaChartBar, 
  FaClock, 
  FaTrophy, 
  FaBookmark, 
  FaComments,
  FaUsers,
  FaShoppingCart,
  FaRobot,
  FaArrowRight,
  FaGraduationCap,
  FaRegLightbulb,
  FaRegStar,
  FaRegCheckCircle,
  FaTimes,
  FaGooglePlay,
  FaAppStore,
  FaQrcode,
  FaDatabase,
  FaVideo,
  FaUserTie,
  FaMobileAlt,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const cards = [
  {
    title: 'বোর্ড MCQ',
    description: 'প্রতিটি বোর্ড প্রশ্ন থেকে ব্যাখ্যাসহ পড়ার সুবিধা, পরীক্ষা দেওয়ার সুযোগ এবং সলভিং ভিডিও।',
    color: 'from-amber-500 to-yellow-400',
    icon: <FaBook className="text-xl" />,
    delay: 0,
    features: ['ব্যাখ্যাসহ সমাধান', 'পরীক্ষার সুযোগ', 'ভিডিও টিউটোরিয়াল']
  },
  {
    title: 'বোর্ড CQ',
    description: 'প্রতিটি সৃজনশীল প্রশ্নের জন্য আলাদা ভিডিও ও সমাধানকৃত PDF।',
    color: 'from-purple-600 to-indigo-500',
    icon: <FaChartBar className="text-xl" />,
    delay: 100,
    features: ['সৃজনশীল প্রশ্ন', 'ভিডিও সমাধান', 'PDF ডাউনলোড']
  },
  {
    title: 'লাইভ এক্সাম',
    description: 'প্রতিদিন লাইভ এক্সাম মাধ্যমে নিজেকে যাচাই এর সুযোগ।',
    color: 'from-rose-600 to-pink-500',
    icon: <FaClock className="text-xl" />,
    delay: 200,
    features: ['নিয়মিত পরীক্ষা', 'রিয়েল-টাইম ফলাফল', 'বিশ্লেষণ']
  },
  {
    title: 'লিডারবোর্ড',
    description: 'পরীক্ষার পর বিশ্লেষণ, দক্ষতা চিহ্নিতকরণ এবং স্মার্ট প্রস্তুতির সুযোগ।',
    color: 'from-cyan-600 to-blue-500',
    icon: <FaTrophy className="text-xl" />,
    delay: 300,
    features: ['পজিশন ট্র্যাকিং', 'দক্ষতা বিশ্লেষণ', 'প্রোগ্রেস রিপোর্ট']
  },
  {
    title: 'বুকমার্ক',
    description: 'অতি গুরুত্বপূর্ণ প্রশ্নগুলো একজায়গায় সংরক্ষণ করার সুবিধা।',
    color: 'from-orange-600 to-amber-500',
    icon: <FaBookmark className="text-xl" />,
    delay: 400,
    features: ['প্রিয় প্রশ্ন সংরক্ষণ', 'দ্রুত এক্সেস', 'বিষয়ভিত্তিক']
  },
  {
    title: 'লাইভ সাপোর্ট',
    description: 'সার্বক্ষণিক আমাদের চ্যাট প্যানেলের সঙ্গে যোগাযোগ করার সুবিধা।',
    color: 'from-lime-600 to-green-500',
    icon: <FaComments className="text-xl" />,
    delay: 500,
    features: ['২৪/৭ সাপোর্ট', 'দ্রুত প্রতিক্রিয়া', 'বিশেষজ্ঞ পরামর্শ']
  },
  {
    title: 'স্টুডেন্ট কমিউনিটি',
    description: 'যেখানে শিক্ষার্থীরা প্রশ্ন, অভিজ্ঞতা ও আইডিয়া শেয়ার করে একে অপরকে সাহায্য করবে।',
    color: 'from-emerald-600 to-teal-500',
    icon: <FaUsers className="text-xl" />,
    delay: 600,
    features: ['কমিউনিটি ফোরাম', 'গ্রুপ স্টাডি', 'জ্ঞান বিনিময়']
  },
  {
    title: 'স্টুডেন্ট শপ',
    description: 'Exam Hero App-এ রয়েছে Student Shop, যেখানে শিক্ষার্থীরা সহজেই প্রয়োজনীয় বই, মডেল টেস্ট ও স্টেশনারি পাবে।',
    color: 'from-amber-600 to-orange-500',
    icon: <FaShoppingCart className="text-xl" />,
    delay: 700,
    features: ['একাডেমিক বই', 'মডেল টেস্ট', 'স্টেশনারি']
  },
  {
    title: 'AI অ্যাসিস্ট্যান্ট',
    description: 'Exam Hero App-এ AI ফিচার শিক্ষার্থীদের দেয় তাৎক্ষণিক সমাধান, পাঠানুযায়ী সাজেশন আর স্মার্ট রিভিশনের সুবিধা।',
    color: 'from-blue-600 to-indigo-500',
    icon: <FaRobot className="text-xl" />,
    delay: 800,
    features: ['তাৎক্ষণিক সমাধান', 'পাঠ্যক্রম সাজেশন', 'স্মার্ট রিভিশন']
  },
];

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

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
  const [appLinks, setAppLinks] = useState({ googlePlay: '', appStore: '' });

  useEffect(() => {
    if (isOpen) {
      fetchAppLinks();
    }
  }, [isOpen]);

  const fetchAppLinks = async () => {
    try {
      const response = await axios.get("https://exam-hero-server-main.vercel.app/app-links");
    //  console.log(response.data);
      if (response.data) {
        setAppLinks({
          googlePlay: response.data.googlePlay || '',
          appStore: response.data.appStore || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch app links:', error);
    }
  };

  const handleGooglePlayClick = () => {
    if (appLinks.googlePlay) {
      window.open(appLinks.googlePlay, '_blank');
    } else {
      toast.info("আমাদের অ্যাপ শীঘ্রই আসছে! অনুগ্রহ করে আমাদের সঙ্গে থাকুন।");
    }
  };

  const handleAppStoreClick = () => {
    if (appLinks.appStore) {
      window.open(appLinks.appStore, '_blank');
    } else {
      toast.info("আমাদের অ্যাপ শীঘ্রই আসছে! অনুগ্রহ করে আমাদের সঙ্গে থাকুন।");
    }
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
          SSC & HSC এর সম্পূর্ণ পাঠ্যক্রম পেতে এখনই ডাউনলোড করুন।
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <button 
            onClick={handleGooglePlayClick}
            className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-md transition-all duration-200 ${
              appLinks.googlePlay 
                ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-105' 
                : 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
            }`}
          >
            <FaGooglePlay className="text-4xl mb-2" />
            <span className="font-medium">Google Play</span>
            {appLinks.googlePlay && (
              <FaExternalLinkAlt className="text-xs mt-1 opacity-70" />
            )}
          </button>

          <button 
            onClick={handleAppStoreClick}
            className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-md transition-all duration-200 ${
              appLinks.appStore 
                ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105' 
                : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
            }`}
          >
            <FaAppStore className="text-4xl mb-2" />
            <span className="font-medium">App Store</span>
            {appLinks.appStore && (
              <FaExternalLinkAlt className="text-xs mt-1 opacity-70" />
            )}
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


const EducationalGrid = () => {
  const cardRefs = useRef([]);
  const [visibleCards, setVisibleCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target);
            if (index !== -1) {
              setVisibleCards(prev => [...prev, index]);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="py-20 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 left-5 w-80 h-80 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-5 w-96 h-96 bg-purple-200 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            আমাদের <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">বিশেষ সুবিধাসমূহ</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Exam Hero অ্যাপে রয়েছে নানাবিধ সুবিধা যা আপনার শিক্ষাজীবনকে করবে আরও সহজ এবং কার্যকর
          </p>
        </div>
        
        {/* Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`rounded-2xl p-8 transition-all duration-700 transform bg-white shadow-xl hover:shadow-2xl border border-gray-100 relative overflow-hidden group ${
                visibleCards.includes(index) 
                  ? 'animate-fade-in-up opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                transitionDelay: `${card.delay}ms`,
                animationDelay: `${card.delay}ms` 
              }}
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${card.color}`}></div>
              
              {/* Icon with gradient background */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-r ${card.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors">{card.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{card.description}</p>
              
              {/* Features list */}
              <ul className="mb-8">
                {card.features.map((feature, i) => (
                  <li key={i} className="flex items-center mb-3 text-gray-700">
                    <FaRegCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* Learn More Button */}
              <button 
                onClick={openModal}
                className="w-full py-3 px-4 bg-gray-50 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center justify-center group-hover:text-blue-600"
              >
                আরও জানুন
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-20 bg-gradient-to-r from-blue-50 to-purple-50 p-12 rounded-3xl border border-gray-200 shadow-inner">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl mb-6 shadow-lg">
            <FaRegLightbulb className="text-2xl" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">এক্সাম হিরো অ্যাপ ডাউনলোড করুন</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            আজই জয়েন করুন এবং আপনার শিক্ষাজীবনকে একটি নতুন মাত্রা দিন
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={openModal}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 transform flex items-center justify-center"
            >
              <FaRegStar className="mr-3" />
              ফ্রি ট্রায়াল শুরু করুন
            </button>
            <button 
              onClick={openModal}
              className="bg-white text-gray-800 border border-gray-300 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 transform flex items-center justify-center"
            >
              আরও জানুন
              <FaArrowRight className="ml-3" />
            </button>
          </div>
        </div>
      </div>

      {/* App Download Modal */}
      <AppDownloadModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Custom CSS for animations */}
      <style jsx>{`
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
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EducationalGrid;
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../Provider/AuthProvider';
import { toast } from 'react-toastify';
import { FaMobileAlt, FaQrcode, FaDatabase, FaVideo, FaClock, FaUserTie, FaEdit } from 'react-icons/fa';

const Profile = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showAppModal, setShowAppModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    displayName: user?.displayName || 'Student',
    email: user?.email || '',
    phone: '',
    institution: 'Dhaka College',
    class: 'HSC 2nd Year'
  });

  const handleLogout = () => {
    logOut()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => console.error(error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically update the user profile in your backend
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  // Mock data for demonstration
  const userStats = {
    examsCompleted: 12,
    averageScore: 82,
    rank: 156,
    studyHours: 47
  };

  const upcomingExams = [
    { id: 1, name: 'SSC Physics Model Test', date: '15 October 2023' },
    { id: 2, name: 'HSC Higher Mathematics', date: '22 October 2023' },
    { id: 3, name: 'English 2nd Paper', date: '29 October 2023' }
  ];

  const handleClick = () => {
    toast.success("Coming soon");
  };

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Banner */}
        <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content mb-6">
          <div className="card-body py-4">
            <h2 className="card-title justify-center text-2xl mb-2">অভিনন্দন প্রিয় শিক্ষার্থী!</h2>
            <p className="text-center">
              Exam Hero তে রেজিস্ট্রেশন করার জন্য ধন্যবাদ। আমাদের সকল কার্যক্রম আপাতত আমাদের Exam Hero App এ অনুষ্ঠিত হবে।
            </p>
            <div className="card-actions justify-center mt-2">
              <button 
                className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-primary"
                onClick={() => setShowAppModal(true)}
              >
                অ্যাপ ডাউনলোড করুন
              </button>
            </div>
          </div>
        </div>

        {/* App Download Notice */}
        <div className="alert alert-info mb-6">
          <div className="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <label>
              <span className="font-bold">বিঃদ্রঃ</span> আমাদের সকল সার্ভিস উপভোগ করতে আমাদের অ্যাপ ইন্সটল করুন। <span className="font-bold">অবশ্যই নতুন করে রেজিস্ট্রেশন করতে হবে App ডাউনলোড করার পর।</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Card */}
          <div className="card w-full lg:w-1/3 bg-base-100 shadow-xl h-fit">
            <figure className="px-10 pt-10 relative">
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={user?.photoURL || 'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg'} alt="User Avatar" />
                </div>
              </div>
              <button 
                className="absolute bottom-2 right-14 btn btn-circle btn-sm btn-primary"
                onClick={() => setIsEditing(!isEditing)}
              >
                <FaEdit className="text-xs" />
              </button>
            </figure>
            <div className="card-body items-center text-center">
              {isEditing ? (
                <div className="w-full space-y-4">
                  <input 
                    type="text" 
                    name="displayName"
                    value={userData.displayName}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                  <input 
                    type="email" 
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                  <input 
                    type="text" 
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className="input input-bordered w-full"
                  />
                  <input 
                    type="text" 
                    name="institution"
                    value={userData.institution}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                  <select 
                    name="class"
                    value={userData.class}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option>SSC</option>
                    <option>HSC 1st Year</option>
                    <option>HSC 2nd Year</option>
                  </select>
                  <div className="flex gap-2 w-full">
                    <button className="btn btn-primary flex-1" onClick={handleSave}>Save</button>
                    <button className="btn btn-ghost flex-1" onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="card-title text-2xl font-bold">{userData.displayName}</h2>
                  <p className="text-sm text-gray-500">{userData.email}</p>
                  
                  <div className="divider my-2"></div>
                  
                  <div className="w-full space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Phone</span>
                      <span className="text-gray-600">{userData.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Institution</span>
                      <span className="text-gray-600">{userData.institution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Class</span>
                      <span className="text-gray-600">{userData.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Member since</span>
                      <span className="text-gray-600">Jan 2023</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Account type</span>
                      <span className="text-gray-600">Premium</span>
                    </div>
                  </div>
                  
                  <div className="card-actions mt-6 w-full">
                    <button className="btn btn-primary w-full" onClick={handleLogout}>Log Out</button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Content Section */}
          <div className="w-full lg:w-2/3 space-y-6">
        
            
            {/* Upcoming Exams */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Upcoming Exams</h2>
                <div className="space-y-4">
                  {upcomingExams.map(exam => (
                    <div key={exam.id} className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                      <div>
                        <h3 className="font-semibold">{exam.name}</h3>
                        <p className="text-sm text-gray-500">Scheduled: {exam.date}</p>
                      </div>
                      <button onClick={handleClick} className="btn btn-sm btn-primary">Prepare</button>
                    </div>
                  ))}
                </div>
                <div className="card-actions justify-end mt-4">
                  <button onClick={handleClick} className="btn btn-ghost btn-sm">View all exams</button>
                </div>
              </div>
            </div>
            
            {/* Recommended Content */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Recommended For You</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Physics 2nd Paper MCQ Practice</h3>
                      <p className="text-sm text-gray-600">Based on your recent performance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-secondary/20 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">English 1st Paper Grammar Test</h3>
                      <p className="text-sm text-gray-600">Improve your grammar skills</p>
                    </div>
                  </div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button onClick={handleClick} className="btn btn-primary btn-sm">Explore more content</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* App Download Modal */}
      {showAppModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <button 
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setShowAppModal(false)}
            >
              ✕
            </button>
            <div className="p-6 md:p-8">
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
                  onClick={handleClick} 
                  className="flex flex-col items-center justify-center p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md transition"
                >
                  <FaQrcode className="text-4xl mb-2" />
                  <span className="font-medium">Google Play</span>
                </button>

                <button 
                  onClick={handleClick} 
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
                  onClick={() => setShowAppModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  পরে দেখবো
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
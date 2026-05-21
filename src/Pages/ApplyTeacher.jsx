import React, { useState } from "react";
import UseAxiosSecure from "../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import axios from "axios";
import "sweetalert2/dist/sweetalert2.min.css";

const ApplyTeacher = () => {
  const axiosSecure = UseAxiosSecure();
  const [teacher, setTeacher] = useState({
    fullName: "",
    subject: "",
    email: "",
    phone: "",
    experience: "",
    qualification: "",
    department: "",
    joiningDate: "",
    bio: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ফর্ম ভ্যালিডেশন - ইমেইল এবং ফোন অপশনাল করুন
  const validateForm = () => {
    const newErrors = {};
    if (!teacher.fullName.trim()) newErrors.fullName = "নাম প্রয়োজন";
    if (!teacher.subject.trim()) newErrors.subject = "বিষয় প্রয়োজন";
    
    // ইমেইল অপশনাল - শুধু থাকলে ভ্যালিডেট করবে
    if (teacher.email.trim() && !/^\S+@\S+\.\S+$/.test(teacher.email)) {
      newErrors.email = "সঠিক ইমেইল ঠিকানা লিখুন";
    }
    
    // ফোন নম্বর অপশনাল - শুধু থাকলে ভ্যালিডেট করবে
    if (teacher.phone.trim() && !/^(?:\+88|01)?\d{11}$/.test(teacher.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "সঠিক ফোন নম্বর লিখুন";
    }
    
    if (!teacher.experience) newErrors.experience = "অভিজ্ঞতা প্রয়োজন";
    if (!teacher.qualification) newErrors.qualification = "যোগ্যতা প্রয়োজন";
    if (!teacher.department.trim()) newErrors.department = "বিভাগ প্রয়োজন";
    if (!teacher.joiningDate) newErrors.joiningDate = "যোগদানের তারিখ প্রয়োজন";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ইনপুট হ্যান্ডলার
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher({ ...teacher, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // ইমেজ আপলোড ফাংশন (ImgBB)
  const uploadImageToImgBB = async (imageFile) => {
    try {
      setUploadError("");
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`,
        formData
      );

      return res.data.data.display_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploadError("ইমেজ আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      return null;
    }
  };

  // ইমেজ প্রিভিউ হ্যান্ডলার
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setUploadError("ছবির আকার 5MB এর বেশি হতে পারবে না");
      return;
    }
    setProfilePic(file);
    setUploadError("");
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  };

  // ফর্ম সাবমিট
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "দয়া করে সমস্ত প্রয়োজনীয় তথ্য প্রদান করুন",
      });
      return;
    }

    setLoading(true);
    setIsSubmitting(true);

    try {
      let imageUrl = "";
      if (profilePic) {
        imageUrl = await uploadImageToImgBB(profilePic);
        if (!imageUrl) {
          setLoading(false);
          setIsSubmitting(false);
          return;
        }
      }

      const res = await axiosSecure.post("/teachers", {
        ...teacher,
        profilePic: imageUrl,
      });

      if (res.status === 201 || res.status === 200) {
        // সাফল্য অ্যানিমেশন
        document.querySelector('.form-container').classList.add('submitted');
        
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            title: "সফল",
            text: "শিক্ষক সফলভাবে যুক্ত হয়েছে!",
          });

          // ফর্ম রিসেট
          setTeacher({
            fullName: "",
            subject: "",
            email: "",
            phone: "",
            experience: "",
            qualification: "",
            department: "",
            joiningDate: "",
            bio: "",
          });
          setProfilePic(null);
          setPreviewUrl("");
          setErrors({});
          setLoading(false);
          setIsSubmitting(false);
          document.querySelector('.form-container').classList.remove('submitted');
        }, 1500);
      } else {
        setIsSubmitting(false);
        Swal.fire({
          icon: "error",
          title: "ত্রুটি",
          text: res.data.error || "শিক্ষক যোগ করতে ব্যর্থ হয়েছে",
        });
      }
    } catch (error) {
      console.error("Post Error:", error);
      setIsSubmitting(false);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "সার্ভার সমস্যা, আবার চেষ্টা করুন।",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto form-container">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 transform hover:shadow-2xl">
          {/* হেডার গ্রেডিয়েন্ট সহ */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 text-center">
            <h2 className="text-3xl font-bold mb-2">শিক্ষক নিয়োগ ফর্ম</h2>
            <p className="opacity-90">নিচের ফর্মটি পূরণ করে শিক্ষক হিসেবে আবেদন করুন</p>
            {/* <p className="text-sm mt-2 opacity-80">ইমেইল এবং ফোন নম্বর অপশনাল - না দিলেও সমস্যা নেই</p> */}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* পূর্ণ নাম */}
              <div className="form-group">
                <label className="block mb-2 font-medium text-gray-700">
                  পূর্ণ নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={teacher.fullName}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    errors.fullName ? "border-red-500 shake-animation" : "border-gray-300"
                  }`}
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500 fade-in">{errors.fullName}</p>
                )}
              </div>

              {/* বিষয় */}
              <div className="form-group">
                <label className="block mb-2 font-medium text-gray-700">
                  বিষয় <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={teacher.subject}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    errors.subject ? "border-red-500 shake-animation" : "border-gray-300"
                  }`}
                  placeholder="যে বিষয়ে আপনি পড়াবেন"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-500 fade-in">{errors.subject}</p>
                )}
              </div>

              {/* ইমেইল (অপশনাল) */}
              <div className="form-group">
                <label className="block mb-2 font-medium text-gray-700">
                  ইমেইল ঠিকানা
                </label>
                <input
                  type="email"
                  name="email"
                  value={teacher.email}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    errors.email ? "border-red-500 shake-animation" : "border-gray-300"
                  }`}
                  placeholder="আপনার ইমেইল ঠিকানা"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 fade-in">{errors.email}</p>
                )}
              </div>

              {/* ফোন নম্বর (অপশনাল) */}
              <div className="form-group">
                <label className="block mb-2 font-medium text-gray-700">
                  ফোন নম্বর
                </label>
                <input
                  type="text"
                  name="phone"
                  value={teacher.phone}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    errors.phone ? "border-red-500 shake-animation" : "border-gray-300"
                  }`}
                  placeholder="আপনার ফোন নম্বর"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500 fade-in">{errors.phone}</p>
                )}
              </div>

              {/* অভিজ্ঞতা */}
              <div className="form-group">
                <label className="block mb-2 font-medium text-gray-700">
                  অভিজ্ঞতা (বছর) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="experience"
                  value={teacher.experience}
                  onChange={handleChange}
                  min="0"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    errors.experience ? "border-red-500 shake-animation" : "border-gray-300"
                  }`}
                  placeholder="শিক্ষকতা অভিজ্ঞতা (বছরে)"
                />
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-500 fade-in">{errors.experience}</p>
                )}
              </div>

              {/* শিক্ষাগত যোগ্যতা */}
              <div className="form-group">
                <label className="block mb-2 font-medium text-gray-700">
                  শিক্ষাগত যোগ্যতা <span className="text-red-500">*</span>
                </label>
                <select
                  name="qualification"
                  value={teacher.qualification}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    errors.qualification ? "border-red-500 shake-animation" : "border-gray-300"
                  }`}
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="Bachelor">স্নাতক</option>
                  <option value="Masters">স্নাতকোত্তর</option>
                  <option value="PhD">পিএইচডি</option>
                </select>
                {errors.qualification && (
                  <p className="mt-1 text-sm text-red-500 fade-in">{errors.qualification}</p>
                )}
              </div>

              {/* বিভাগ */}
              <div className="form-group">
                <label className="block mb-2 font-medium text-gray-700">
                  বিভাগ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={teacher.department}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    errors.department ? "border-red-500 shake-animation" : "border-gray-300"
                  }`}
                  placeholder="আপনার বিভাগ"
                />
                {errors.department && (
                  <p className="mt-1 text-sm text-red-500 fade-in">{errors.department}</p>
                )}
              </div>

              {/* যোগদানের তারিখ */}
              <div className="form-group">
                <label className="block mb-2 font-medium text-gray-700">
                  যোগদানের তারিখ <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  value={teacher.joiningDate}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    errors.joiningDate ? "border-red-500 shake-animation" : "border-gray-300"
                  }`}
                />
                {errors.joiningDate && (
                  <p className="mt-1 text-sm text-red-500 fade-in">{errors.joiningDate}</p>
                )}
              </div>
            </div>

            {/* প্রোফাইল ছবি */}
            <div className="form-group">
              <label className="block mb-2 font-medium text-gray-700">
                প্রোফাইল ছবি
              </label>
              <div className="flex flex-col items-center gap-3">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-blue-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-xs text-gray-500">
                      {profilePic ? profilePic.name : "SVG, PNG, JPG or GIF (MAX. 5MB)"}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* ইমেজ প্রিভিউ */}
                {previewUrl && (
                  <div className="relative group">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-24 w-24 object-cover rounded-full border-2 border-white shadow-lg transition-all duration-300 group-hover:scale-110"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        setProfilePic(null);
                        setPreviewUrl("");
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              {uploadError && <p className="text-red-500 text-sm mt-1 fade-in">{uploadError}</p>}
            </div>

            {/* জীবনবৃত্তান্ত */}
            <div className="form-group">
              <label className="block mb-2 font-medium text-gray-700">
                সংক্ষিপ্ত জীবনবৃত্তান্ত
              </label>
              <textarea
                name="bio"
                value={teacher.bio}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="আপনার শিক্ষাগত যোগ্যতা এবং অভিজ্ঞতা সম্পর্কে সংক্ষেপে লিখুন"
              ></textarea>
            </div>

            {/* সাবমিট বাটন */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg transition-all duration-500 font-medium flex items-center justify-center 
                  ${isSubmitting 
                    ? 'bg-green-500 text-white transform scale-95' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg transform hover:-translate-y-1'
                  } 
                  disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    জমা দেওয়া হচ্ছে...
                  </>
                ) : isSubmitting ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    সফলভাবে আবেদন করা হয়েছে!
                  </>
                ) : (
                  "আবেদন জমা দিন"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CSS অ্যানিমেশন */}
      <style jsx>{`
        .shake-animation {
          animation: shake 0.5s;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .fade-in {
          animation: fadeIn 0.5s;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .form-group {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .form-container.submitted {
          animation: successPulse 1.5s;
        }
        
        @keyframes successPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ApplyTeacher;
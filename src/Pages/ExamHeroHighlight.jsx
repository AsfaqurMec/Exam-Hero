import React, { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const ExamHeroHighlight = () => {
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState({ text: "", type: "" });
  const [imagePreview, setImagePreview] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [highlights, setHighlights] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const fileInputRef = useRef(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({ mode: "onChange" });

  const watchImage = watch("image");

  // Fetch highlights on component mount and when tab changes
  useEffect(() => {
    if (activeTab === "manage") {
      fetchHighlights();
    }
  }, [activeTab]);

  // Fetch all highlights
  const fetchHighlights = async () => {
    try {
      const response = await axios.get("https://exam-hero-server-main.vercel.app/exam-hero-highlights", {
        timeout: 10000,
      });
      setHighlights(response.data);
    } catch (error) {
      console.error("Error fetching highlights:", error);
      setServerMessage({
        text: "❌ হাইলাইটগুলি লোড করতে সমস্যা হয়েছে",
        type: "error",
      });
    }
  };

  // Handle drag events
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  }, []);

  // Image upload handler
  const handleImageUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("শুধুমাত্র ইমেজ ফাইল আপলোড করুন (JPEG, PNG, GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("ইমেজের সাইজ 5MB এর কম হতে হবে");
      return;
    }

    setUploading(true);
    setUploadError("");

    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const apiKey = import.meta.env.VITE_image_upload_key;
      if (!apiKey) throw new Error("VITE_image_upload_key not found in .env file");

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        }
      );

      setValue("image", response.data.data.display_url, { shouldValidate: true });
      clearErrors("image");
      setServerMessage({
        text: "✅ ইমেজ সফলভাবে আপলোড হয়েছে!",
        type: "success",
      });

      setTimeout(() => setServerMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      console.error("Image upload error:", error.response?.data || error.message);
      const errorMsg =
        error.response?.data?.error?.message ||
        `ইমেজ আপলোড ব্যর্থ হয়েছে: ${error.message}`;
      setUploadError(errorMsg);
      setError("image", { type: "manual", message: "ইমেজ আপলোড করা প্রয়োজন" });
      setImagePreview("");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setValue("image", "", { shouldValidate: true });
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setServerMessage({ text: "", type: "" });

    try {
      await axios.post("https://exam-hero-server-main.vercel.app/exam-hero-highlights", data, {
        timeout: 10000,
      });

      setServerMessage({
        text: "✅ হাইলাইট সফলভাবে যোগ করা হয়েছে!",
        type: "success",
      });
      reset();
      setImagePreview();

      setTimeout(() => setServerMessage({ text: "", type: "" }), 5000);
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      let errorMessage = "❌ হাইলাইট যোগ করতে সমস্যা হয়েছে";

      if (error.code === "ECONNABORTED") {
        errorMessage = "❌ রিকোয়েস্ট টাইমআউট হয়েছে। আবার চেষ্টা করুন";
      } else if (error.response?.status === 409) {
        errorMessage = "❌ এই নামে একটি হাইলাইট ইতিমধ্যে রয়েছে";
      } else if (error.response?.data?.message) {
        errorMessage = `❌ ${error.response.data.message}`;
      }

      setServerMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setImagePreview("");
    setUploadError("");
    setServerMessage({ text: "", type: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageUpload(e.target.files[0]);
    }
  };

  // Delete a highlight
  const handleDeleteHighlight = async (id) => {
    if (!window.confirm("আপনি কি নিশ্চিত যে আপনি এই হাইলাইটটি মুছতে চান?")) {
      return;
    }

    setDeleteLoading(id);
    try {
      await axios.delete(`https://exam-hero-server-main.vercel.app/exam-hero-highlights/${id}`, {
        timeout: 10000,
      });

      toast.success("✅ হাইলাইট সফলভাবে মুছে ফেলা হয়েছে!");
      
      // Refresh the highlights list
      fetchHighlights();
      
      setTimeout(() => setServerMessage({ text: "", type: "" }), 5000);
    } catch (error) {
      console.error("Deletion error:", error);
      setServerMessage({
        text: "❌ হাইলাইট মুছতে সমস্যা হয়েছে",
        type: "error",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden mt-8 border border-gray-200">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Exam Hero Highlight Manager</h2>
            <p className="text-blue-100 opacity-90">নতুন একটি এক্সাম হাইলাইট তৈরি করুন এবং ম্যানেজ করুন</p>
          </div>
          <div className="bg-white/10 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex -mb-px">
          <button
            onClick={() => setActiveTab("create")}
            className={`py-4 px-6 font-medium text-sm flex-1 text-center ${
              activeTab === "create"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            নতুন হাইলাইট তৈরি
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`py-4 px-6 font-medium text-sm flex-1 text-center ${
              activeTab === "manage"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            হাইলাইট ম্যানেজ করুন
          </button>
        </div>
      </div>

      <div className="p-8">
        <AnimatePresence>
          {serverMessage.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-6 p-4 rounded-lg flex items-center ${
                serverMessage.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {serverMessage.type === "success" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {serverMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === "create" ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                শিরোনাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="হাইলাইটের শিরোনাম লিখুন"
                {...register("title", {
                  required: "শিরোনাম প্রয়োজন",
                })}
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition ${
                  errors.title
                    ? "border-red-500 ring-red-200 bg-red-50"
                    : "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                বিবরণ <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="সংক্ষিপ্ত বিবরণ লিখুন"
                {...register("description", {
                  required: "বিবরণ প্রয়োজন",
                  minLength: {
                    value: 10,
                    message: "ন্যূনতম ১০টি অক্ষর প্রয়োজন",
                  },
                  maxLength: {
                    value: 500,
                    message: "বিবরণ ৫০০ অক্ষরের কম হতে হবে",
                  },
                })}
                rows={4}
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition ${
                  errors.description
                    ? "border-red-500 ring-red-200 bg-red-50"
                    : "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                }`}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Image Upload Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ইমেজ আপলোড <span className="text-red-500">*</span>
              </label>

              {!imagePreview ? (
                <motion.div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer
                    ${
                      dragOver
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400"
                    }
                    ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    disabled={uploading}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-gray-600 font-medium">
                      {dragOver ? "ইমেজ ড্রপ করুন" : "ক্লিক করুন বা ইমেজ ড্রাগ করুন"}
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF - 5MB সর্বোচ্চ</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="relative border rounded-lg p-4 bg-gray-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-sm text-gray-600 mb-2 font-medium">ইমেজ প্রিভিউ:</p>
                  <div className="flex items-center justify-center p-2 bg-white rounded-md border">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-40 object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </motion.div>
              )}

              <input type="hidden" {...register("image", { required: "ইমেজ প্রয়োজন" })} />

              {uploading && (
                <div className="mt-3 flex items-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 animate-spin" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  ইমেজ আপলোড হচ্ছে...
                </div>
              )}
              {uploadError && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {uploadError}
                </p>
              )}
              {errors.image && !uploadError && !watchImage && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
              <motion.button
                type="button"
                onClick={handleReset}
                disabled={loading || uploading}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                রিসেট
              </motion.button>

              <motion.button
                type="submit"
                disabled={loading || uploading || !isDirty || !isValid}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-spin" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    যোগ করা হচ্ছে...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    হাইলাইট যোগ করুন
                  </>
                )}
              </motion.button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">সকল হাইলাইট</h3>
            
            {highlights.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2 text-gray-500">কোন হাইলাইট পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {highlights.map((highlight) => (
                  <motion.div 
                    key={highlight._id} 
                    className="border rounded-lg p-4 bg-white shadow-sm flex items-start justify-between"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                        <img 
                          src={highlight.image} 
                          alt={highlight.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{highlight.title}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{highlight.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(highlight.createdAt).toLocaleDateString('bn-BD')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteHighlight(highlight._id)}
                      disabled={deleteLoading === highlight._id}
                      className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50"
                    >
                      {deleteLoading === highlight._id ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamHeroHighlight;
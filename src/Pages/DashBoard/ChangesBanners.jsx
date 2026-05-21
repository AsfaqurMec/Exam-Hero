import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const ChangesBanners = ({ onBannerAdded, onBannerDeleted }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [activeTab, setActiveTab] = useState("add");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [banners, setBanners] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get("https://exam-hero-server-main.vercel.app/banners");
      setBanners(response.data);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
      setMessage("Failed to load existing banners");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage("❌ Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage("❌ Image size should be less than 5MB");
        return;
      }
      setImage(file);
      setMessage("");
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToImgBB = async (imageFile) => {
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("image", imageFile);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`,
        formData,
        { timeout: 30000 }
      );
      return response.data.data.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error(
        error.code === "ECONNABORTED"
          ? "Image upload timed out. Please try again."
          : "Image upload failed. Please try again."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setMessage("");
      if (!image) {
        setMessage("❌ Please select an image");
        return;
      }
      const imageUrl = await uploadImageToImgBB(image);
      const response = await axios.post("https://exam-hero-server-main.vercel.app/banners", {
        heading: data.heading,
        description: data.description,
        imageUrl,
        createdAt: new Date(),
      });
      setMessage("✅ Banner added successfully!");
      setShowSuccessModal(true);
      reset();
      setImage(null);
      setImagePreview("");
      fetchBanners();
      if (onBannerAdded) onBannerAdded(response.data.result);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || "❌ Failed to add banner.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    try {
      setDeleting(true);
      await axios.delete(`https://exam-hero-server-main.vercel.app/banners/${bannerId}`);
      setMessage("✅ Banner deleted successfully!");
      setBanners(banners.filter((b) => b._id !== bannerId));
      setDeleteConfirm(null);
      if (onBannerDeleted) onBannerDeleted(bannerId);
    } catch (error) {
      console.error("Failed to delete banner:", error);
      setMessage("❌ Failed to delete banner. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const closeSuccessModal = () => setShowSuccessModal(false);
  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  return (
    <div className="max-w-6xl mx-auto mt-5 p-6 bg-white rounded-lg shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        Banner Management System
      </h2>
      <p className="text-gray-600 mb-6">
        Add new banners or manage existing ones with our intuitive tab system
      </p>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("add")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "add"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Add New Banner
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "manage"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Manage Banners
          </button>
        </nav>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-md ${
            message.includes("✅")
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Add Banner Tab */}
      {activeTab === "add" && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Heading */}
            <input
              type="text"
              {...register("heading")}
              className="w-full p-3 border rounded-md"
              placeholder="Enter banner heading"
            />
            {errors.heading && (
              <p className="text-sm text-red-600">{errors.heading.message}</p>
            )}

            {/* Description */}
            <textarea
              {...register("description", )}
              className="w-full p-3 border rounded-md"
              placeholder="Enter banner description"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}

            {/* Image */}
            {!imagePreview ? (
              <input type="file" accept="image/*" onChange={handleImageChange} />
            ) : (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-contain" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-red-500 text-white p-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || uploadingImage || !image}
              className="px-6 py-2 bg-blue-600 text-white rounded-md"
            >
              {uploadingImage ? "Uploading Image..." : loading ? "Adding Banner..." : "Add Banner"}
            </button>
          </form>
        </div>
      )}

      {/* Manage Banners Tab */}
      {activeTab === "manage" && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          {fetchLoading ? (
            <p>Loading banners...</p>
          ) : banners.length === 0 ? (
            <p>No banners found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((banner) => (
                <div key={banner._id} className="bg-white border rounded-lg shadow-sm">
                  <img src={banner.imageUrl} alt={banner.heading} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h4 className="font-semibold">{banner.heading}</h4>
                    <p className="text-sm text-gray-600">{banner.description}</p>
                    <button
                      onClick={() => setDeleteConfirm(banner._id)}
                      className="mt-3 px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 text-center">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-500 text-center mt-2">
              Are you sure you want to delete this banner?
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBanner(deleteConfirm)}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangesBanners;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const AppLink = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [appLinks, setAppLinks] = useState({
    googlePlay: "",
    appStore: ""
  });
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchAppLinks();
  }, []);

  const fetchAppLinks = async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get("https://exam-hero-server-main.vercel.app/app-links");
      if (response.data) {
        const links = response.data;
        setAppLinks({
          googlePlay: links.googlePlay || "",
          appStore: links.appStore || ""
        });
        reset({
          googlePlay: links.googlePlay || "",
          appStore: links.appStore || ""
        });
      }
    } catch (error) {
      console.error("Failed to fetch app links:", error);
      setMessage("Failed to load existing app links");
    } finally {
      setFetchLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setMessage("");

      // Check if app links already exist
      const existingResponse = await axios.get("https://exam-hero-server-main.vercel.app/app-links");
      
      if (existingResponse.data && existingResponse.data.length > 0) {
        // Update existing app links
        const response = await axios.put(`https://exam-hero-server-main.vercel.app/app-links/${existingResponse.data[0]._id}`, {
          googlePlay: data.googlePlay,
          appStore: data.appStore,
          updatedAt: new Date(),
        });
        setMessage("✅ App links updated successfully!");
      } else {
        // Create new app links
        const response = await axios.post("https://exam-hero-server-main.vercel.app/app-links", {
          googlePlay: data.googlePlay,
          appStore: data.appStore,
          createdAt: new Date(),
        });
        setMessage("✅ App links saved successfully!");
      }

      // Update local state
      setAppLinks({
        googlePlay: data.googlePlay,
        appStore: data.appStore
      });

    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || "❌ Failed to save app links.");
    } finally {
      setLoading(false);
    }
  };

  const validateUrl = (value) => {
    if (!value) return true; // Allow empty values
    const urlPattern = /^https?:\/\/.+/;
    return urlPattern.test(value) || "Please enter a valid URL starting with http:// or https://";
  };

  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-5 p-6 bg-white rounded-lg shadow-xl border border-gray-100">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading app links...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-5 p-6 bg-white rounded-lg shadow-xl border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          App Store Links Management
        </h2>
        <p className="text-gray-600">
          Manage your mobile app download links for Google Play Store and Apple App Store
        </p>
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

      <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Google Play Store Link */}
          <div>
            <label htmlFor="googlePlay" className="block text-sm font-medium text-gray-700 mb-2">
              Google Play Store Link
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="url"
                id="googlePlay"
                {...register("googlePlay", { 
                  validate: validateUrl 
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="https://play.google.com/store/apps/details?id=com.yourapp"
              />
            </div>
            {errors.googlePlay && (
              <p className="mt-2 text-sm text-red-600">{errors.googlePlay.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Enter the complete Google Play Store URL for your app
            </p>
          </div>

          {/* Apple App Store Link */}
          <div>
            <label htmlFor="appStore" className="block text-sm font-medium text-gray-700 mb-2">
              Apple App Store Link
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="url"
                id="appStore"
                {...register("appStore", { 
                  validate: validateUrl 
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="https://apps.apple.com/app/your-app/id123456789"
              />
            </div>
            {errors.appStore && (
              <p className="mt-2 text-sm text-red-600">{errors.appStore.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Enter the complete Apple App Store URL for your app
            </p>
          </div>

          {/* Current Links Display */}
          {(appLinks.googlePlay || appLinks.appStore) && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium text-blue-800 mb-3">Current App Links</h3>
              <div className="space-y-2">
                {appLinks.googlePlay && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Google Play:</span>
                    <a 
                      href={appLinks.googlePlay} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline truncate max-w-xs"
                    >
                      {appLinks.googlePlay}
                    </a>
                  </div>
                )}
                {appLinks.appStore && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">App Store:</span>
                    <a 
                      href={appLinks.appStore} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline truncate max-w-xs"
                    >
                      {appLinks.appStore}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Save App Links
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-medium text-yellow-800 mb-3">💡 How to get your app store links</h3>
        <div className="space-y-3 text-sm text-yellow-700">
          <div>
            <strong>Google Play Store:</strong>
            <p>1. Go to your app in Google Play Console</p>
            <p>2. Copy the "View on Google Play" link</p>
            <p>3. Format: https://play.google.com/store/apps/details?id=com.yourapp</p>
          </div>
          <div>
            <strong>Apple App Store:</strong>
            <p>1. Go to your app in App Store Connect</p>
            <p>2. Copy the "View in App Store" link</p>
            <p>3. Format: https://apps.apple.com/app/your-app/id123456789</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLink;

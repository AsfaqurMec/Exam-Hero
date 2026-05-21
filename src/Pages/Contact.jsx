import React, { useState, useRef } from "react";
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock,
  FaChalkboardTeacher, FaBookReader, FaGraduationCap,
  FaUsers, FaStar, FaAward, FaLaptop,
  FaChartLine, FaHandshake, FaUserTie, FaInfoCircle,
} from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import UseAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const AnimatedCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeIn}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Contact = () => {
  const axiosSecure = UseAxiosSecure();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentType: "",
    subject: "",
    message: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9]{11,14}$/;

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "নাম প্রয়োজন";
    if (!emailRegex.test(formData.email)) errors.email = "সঠিক ইমেইল দিন";
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) errors.phone = "সঠিক ফোন নম্বর দিন";
    if (!formData.studentType) errors.studentType = "শ্রেণী নির্বাচন করুন";
    if (!formData.subject) errors.subject = "বিষয় নির্বাচন করুন";
    if (!formData.message.trim()) errors.message = "বার্তা লিখুন";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error on change
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const showAlert = (type, title, message) => {
    Swal.fire({
      title,
      text: message,
      icon: type,
      confirmButtonText: type === "success" ? "ঠিক আছে" : "পুনরায় চেষ্টা করুন",
      confirmButtonColor: type === "success" ? "#4F46E5" : "#EF4444",
      customClass: {
        popup: 'rounded-xl',
        title: 'text-2xl font-bold',
        confirmButton: 'px-6 py-2 rounded-lg'
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axiosSecure.post("/contacts", formData);
      if (response.data.success || response.data.message) {
        showAlert("success", "বার্তা পাঠানো হয়েছে!", "আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব");
        setFormData({ name: "", email: "", phone: "", studentType: "", subject: "", message: "" });
      } else {
        showAlert("error", "ত্রুটি হয়েছে", "কিছু সমস্যা হয়েছে, দয়া করে আবার চেষ্টা করুন।");
      }
    } catch (error) {
      console.error(error);
      showAlert("error", "ত্রুটি হয়েছে", "সার্ভার ত্রুটি হয়েছে, পরে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            শিক্ষক-শিক্ষার্থী সংযোগ প্ল্যাটফর্ম
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            এসএসসি ও এইচএসসি শিক্ষার্থীদের জন্য বিশেষায়িত শিক্ষক সংযোগ সেবা
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-4">কেন আমাদের প্ল্যাটফর্ম বেছে নিবেন?</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            বাংলাদেশের অন্যতম নির্ভরযোগ্য শিক্ষক-শিক্ষার্থী সংযোগ প্ল্যাটফর্ম
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FaAward className="text-3xl text-amber-500" />, title: "প্রমাণিত শিক্ষক", description: "সকল শিক্ষকের যোগ্যতা যাচাইকৃত এবং অভিজ্ঞ" },
              { icon: <FaLaptop className="text-3xl text-blue-500" />, title: "অনলাইন/অফলাইন ক্লাস", description: "আপনার পছন্দমতো উপায়ে ক্লাস করার সুযোগ" },
              { icon: <FaChartLine className="text-3xl text-green-500" />, title: "৯৫% সাফল্যের হার", description: "আমাদের শিক্ষার্থীদের অসাধারণ সাফল্যের হার" },
              { icon: <FaHandshake className="text-3xl text-purple-500" />, title: "নির্ভরযোগ্য সেবা", description: "২০২৫ সাল থেকে বিশ্বস্ততার সাথে সেবা প্রদান" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card bg-white shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 rounded-xl border border-gray-100"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Contact Info */}
            <AnimatedCard className="card bg-white shadow-xl border-t-4 border-primary rounded-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6 flex items-center">
                  <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                    <FaPhone className="text-white text-sm" />
                  </span>
                  যোগাযোগ তথ্য
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4 mt-1">
                      <FaPhone className="text-primary text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">ফোন নম্বর</h3>
                      <p className="text-gray-600">+880 1817-337750</p>
                    
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4 mt-1">
                      <FaEnvelope className="text-primary text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">ইমেইল</h3>
                     
                      <p className="text-gray-600">support@examhero.app</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4 mt-1">
                      <FaMapMarkerAlt className="text-primary text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">ঠিকানা</h3>
                      <p className="text-gray-600">হোল্ডিং নং ৪৩৯, জানকিখিলা, শ্রীবরদী, শেরপুর, ময়মনসিংহ, বাংলাদেশ</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4 mt-1">
                      <FaClock className="text-primary text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">কর্মঘণ্টা</h3>
                      <p className="text-gray-600">শনিবার-শুক্রবার: সকাল ৯টা - রাত ১০টা</p>
                     
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* Stats */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[
                { icon: <FaChalkboardTeacher className="text-secondary text-xl" />, count: "৫০+", label: "সক্রিয় শিক্ষক", color: "secondary" },
                { icon: <FaBookReader className="text-accent text-xl" />, count: "৩,৫০০+", label: "নিবন্ধিত শিক্ষার্থী", color: "accent" },
                { icon: <FaGraduationCap className="text-primary text-xl" />, count: "৯৫%", label: "সাফল্যের হার", color: "primary" },
                { icon: <FaUsers className="text-info text-xl" />, count: "১০+", label: "বছরের অভিজ্ঞতা", color: "info" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  variants={fadeIn}
                  className={`card bg-white shadow-lg border-t-4 border-${stat.color} rounded-xl`}
                >
                  <div className="card-body p-6 flex items-center">
                    <div className={`bg-${stat.color}/10 p-3 rounded-full mr-4`}>
                      {stat.icon}
                    </div>
                    <div>
                      <h3 className={`font-bold text-2xl text-${stat.color}`}>{stat.count}</h3>
                      <p className="text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Testimonials */}
            <AnimatedCard className="card bg-white shadow-xl border-t-4 border-accent rounded-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6 flex items-center">
                  <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mr-3">
                    <FaStar className="text-white text-sm" />
                  </span>
                  শিক্ষার্থীদের মতামত
                </h2>
                <div className="space-y-6">
                  {[ 
                    { name: "রিয়া ইসলাম", course: "এসএসসি পদার্থবিজ্ঞান", comment: "শিক্ষক স্যার খুব ভালোভাবে বুঝিয়ে দেন। তার কারণে আমার পদার্থবিজ্ঞানে ভীতি দূর হয়েছে।" },
                    { name: "আরাফাত হোসেন", course: "এইচএসসি রসায়ন", comment: "অনলাইন ক্লাসগুলো খুবই interactive হয়। যে কোনো সময় প্রশ্ন করার সুযোগ পাওয়া যায়।" },
                    { name: "তাসনিমা আক্তার", course: "এসএসসি গণিত", comment: "মাস্টার স্যারের শেখানোর স্টাইল আমার গণিতের ভীতি দূর করেছে। এখন গণিত আমার প্রিয় বিষয়।" }
                  ].map((t, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex items-start mb-2">
                        <div className="bg-accent/20 p-2 rounded-full mr-3">
                          <FaUserTie className="text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{t.name}</h3>
                          <p className="text-sm text-gray-500">{t.course}</p>
                        </div>
                      </div>
                      <p className="text-gray-700">"{t.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          </div>

          {/* Right Column - Contact Form */}
          <AnimatedCard className="card bg-white shadow-xl border-t-4 border-secondary rounded-xl">
            <div className="card-body">
              <div className="text-center mb-6">
                <h2 className="card-title text-2xl mb-2">যোগাযোগ করুন</h2>
                <p className="text-gray-600">
                  নিচের ফর্মটি পূরণ করুন এবং আমরা আপনার সাথে যোগাযোগ করব
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="label font-semibold">আপনার নাম*</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="আপনার পুরো নাম লিখুন" 
                    className={`input input-bordered w-full bg-gray-50 ${formErrors.name ? 'input-error' : ''} rounded-lg`}
                  />
                  {formErrors.name && (
                    <p className="text-error text-sm flex items-center mt-1">
                      <FaInfoCircle className="mr-1 text-xs" /> {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label font-semibold">ইমেইল ঠিকানা*</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="example@email.com" 
                      className={`input input-bordered w-full bg-gray-50 ${formErrors.email ? 'input-error' : ''} rounded-lg`}
                    />
                    {formErrors.email && (
                      <p className="text-error text-sm flex items-center mt-1">
                        <FaInfoCircle className="mr-1 text-xs" /> {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label font-semibold">ফোন নম্বর*</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="+৮৮০ ১XXXXXXXXX" 
                      className={`input input-bordered w-full bg-gray-50 ${formErrors.phone ? 'input-error' : ''} rounded-lg`}
                    />
                    {formErrors.phone && (
                      <p className="text-error text-sm flex items-center mt-1">
                        <FaInfoCircle className="mr-1 text-xs" /> {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Student Type + Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label font-semibold">শিক্ষার্থীর শ্রেণী*</label>
                    <select 
                      name="studentType" 
                      value={formData.studentType} 
                      onChange={handleChange} 
                      className={`select select-bordered w-full bg-gray-50 ${formErrors.studentType ? 'select-error' : ''} rounded-lg`}
                    >
                      <option value="">শ্রেণী নির্বাচন করুন</option>
                      <option value="SSC">এসএসসি</option>
                      <option value="HSC">এইচএসসি</option>
                    </select>
                    {formErrors.studentType && (
                      <p className="text-error text-sm flex items-center mt-1">
                        <FaInfoCircle className="mr-1 text-xs" /> {formErrors.studentType}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label font-semibold">শিক্ষার বিভাগ</label>
                    <select 
                      name="subject" 
                      value={formData.subject} 
                      onChange={handleChange} 
                      className={`select select-bordered w-full bg-gray-50 ${formErrors.subject ? 'select-error' : ''} rounded-lg`}
                    >
                      
                      <option value="Science">বিজ্ঞান</option>
                      <option value="Arts">মানবিক</option>
                      <option value="Commerce">বাণিজ্য</option>
                      
                    </select>
                    {formErrors.subject && (
                      <p className="text-error text-sm flex items-center mt-1">
                        <FaInfoCircle className="mr-1 text-xs" /> {formErrors.subject}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="label font-semibold">আপনার বার্তা*</label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    placeholder="আপনার প্রয়োজনীয়তা এবং প্রশ্ন লিখুন..." 
                    className={`textarea textarea-bordered w-full bg-gray-50 h-28 ${formErrors.message ? 'textarea-error' : ''} rounded-lg`}
                  ></textarea>
                  {formErrors.message && (
                    <p className="text-error text-sm flex items-center mt-1">
                      <FaInfoCircle className="mr-1 text-xs" /> {formErrors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button 
                  type="submit" 
                  className={`btn btn-primary w-full rounded-lg ${isSubmitting ? 'loading' : ''}`} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}
                </button>

                <div className="text-center text-sm text-gray-500 mt-4">
                  ফর্ম জমা দেওয়ার মাধ্যমে, আপনি আমাদের <a href="#" className="text-primary hover:underline">গোপনীয়তা নীতি</a> এবং <a href="#" className="text-primary hover:underline">সেবার শর্তাবলী</a> মেনে নিচ্ছেন
                </div>
              </form>
            </div>
          </AnimatedCard>
        </div>


   
      </div>
    </div>
  );
};

export default Contact;

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-toastify';

// Animation variants (same as before)
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.2 } }
};

// Animated component wrapper (same as before)
const AnimatedSection = ({ children, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={staggerChildren}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const About = () => {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "বিশেষজ্ঞ শিক্ষক",
      description: "এসএসসি ও এইচএসসি পরীক্ষার অভিজ্ঞ শিক্ষক দ্বারা তৈরি করা কোর্স এবং গাইডলাইন। আমাদের শিক্ষকরা বিভিন্ন বিষয়ে বিশেষজ্ঞ এবং বছরের পর বছর শিক্ষাদানের অভিজ্ঞতা সম্পন্ন।"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "বিস্তারিত এনালিটিক্স",
      description: "বিস্তারিত পারফরমেন্স বিশ্লেষণ এবং উন্নয়নের পরামর্শ। তোমার দুর্বলতা চিহ্নিত করে সেগুলো কাটিয়ে উঠার জন্য ব্যক্তিগতকৃত পরামর্শ প্রদান।"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "কমিউনিটি সাপোর্ট",
      description: "শিক্ষক এবং সহপাঠীদের সাথে আলোচনা এবং সংশয় দূরীকরণ। গ্রুপ স্টাডি, লাইভ সেশন এবং ফোরামের মাধ্যমে শেখার অভিজ্ঞতা সম্পন্ন করুন।"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      title: "নিয়মিত আপডেট",
      description: "পরীক্ষার সিলেবাস এবং প্রশ্ন প্যাটার্নের পরিবর্তন অনুযায়ী নিয়মিত কন্টেন্ট আপডেট। সর্বশেষ পরীক্ষার ট্রেন্ড অনুসারে স্টাডি মেটেরিয়ালস উন্নত করা।"
    }
  ];

  const teamMembers = [
    {
      name: "প্রফেসর মোঃ রফিকুল ইসলাম",
      role: "প্রধান একাডেমিক উপদেষ্টা",
      bio: "২০ বছরের বেশি অভিজ্ঞতা সহ শিক্ষাবিদ এবং এসএসসি/এইচএসসি পরীক্ষা বিশেষজ্ঞ।",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "ড. সেলিনা আক্তার",
      role: "কন্টেন্ট ডিরেক্টর",
      bio: "১৫ বছরের বেশি সময় ধরে এসএসসি/এইচএসসি পরীক্ষা প্রস্তুতি বিষয়ে কোর্স ডিজাইন করছেন।",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "মোঃ রিয়াদুল ইসলাম",
      role: "সিনিয়র শিক্ষক (গণিত)",
      bio: "গণিত বিষয়ে বিশেষজ্ঞ এবং বাংলাদেশের শীর্ষস্থানীয় শিক্ষক।",
      image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "তানজিনা আহমেদ",
      role: "শিক্ষার্থী সহায়তা ব্যবস্থাপক",
      bio: "শিক্ষার্থীদের প্রয়োজন বুঝে এবং তাদের সাফল্যের পথ সুগম করতে বিশেষভাবে দক্ষ।",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const milestones = [
    { year: "2018", event: "এক্সামহিরো চালু", description: "৫০০ শিক্ষার্থী নিয়ে এসএসসি প্রস্তুতি দিয়ে যাত্রা শুরু" },
    { year: "2019", event: "১০০০+ সফল শিক্ষার্থী", description: "প্রথমবারের মতো ১০০০ শিক্ষার্থী জিপিএ-৫ অর্জন" },
    { year: "2020", event: "মোবাইল অ্যাপ লঞ্চ", description: "Android এবং iOS অ্যাপ চালু, শিক্ষার্থীদের জন্য আরও সুবিধা" },
    { year: "2021", event: "৫০+ বিশেষজ্ঞ শিক্ষক", description: "বিষয়ভিত্তিক বিশেষজ্ঞ শিক্ষকদের একটি শক্তিশালী টিম গঠন" },
    { year: "2023", event: "২৫,০০০+ সফল শিক্ষার্থী", description: "মাইলস্টোন অর্জন - ২৫,০০০+ শিক্ষার্থীর সাফল্য" }
  ];

  const testimonials = [
    {
      name: "আয়েশা সিদ্দিকা",
      role: "এসএসসি পরীক্ষার্থী, গাজীপুর",
      content: "এক্সামহিরোর মাধ্যমে আমি আমার এসএসসি পরীক্ষার জন্য সম্পূর্ণ প্রস্তুতি নিতে পেরেছি। বিশেষ করে স্মার্ট নোটস এবং লাইভ ক্লাসগুলো অসাধারণ।",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "আরফাতুল ইসলাম",
      role: "এইচএসসি পরীক্ষার্থী, ঢাকা",
      content: "শিক্ষকদের উপযুক্ত গাইডলাইন এবং নোটস আমার এইচএসসি পরীক্ষায় সফল হতে সহায়তা করেছে। কমিউনিটি সাপোর্টও খুব ভালো।",
      image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "নুসরাত জাহান",
      role: "এসএসসি পরীক্ষার্থী, চট্টগ্রাম",
      content: "নিয়মিত আপডেটেড কন্টেন্ট এবং লাইভ ক্লাসের মাধ্যমে আমি আমার পড়ালেখা অনেক улучিত করতে পেরেছি। ধন্যবাদ এক্সামহিরো টিমকে।",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    }
  ];

  const handleClick = ()=>{
    toast.success("আমাদের অ্যাপ শীঘ্রই আসছে! অনুগ্রহ করে আমাদের সঙ্গে থাকুন।")
    return;
  }

  return (
    <section className="py-20 bg-base-100 overflow-hidden" id="about">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <AnimatedSection className="text-center mb-16">
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-primary mb-4">
            About ExamHero
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            বাংলাদেশের এসএসসি ও এইচএসসি শিক্ষার্থীদের জন্য সবচেয়ে বিশ্বস্ত অনলাইন পরীক্ষা প্রস্তুতি প্ল্যাটফর্ম
          </motion.p>
          <motion.div variants={fadeInUp} className="w-24 h-1 bg-secondary mx-auto"></motion.div>
        </AnimatedSection>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-xl flex items-center justify-center overflow-hidden">
                <div className="text-white text-center p-8 relative z-10">
                  <h3 className="text-3xl font-bold mb-4">সাফল্যের গল্প</h3>
                  <p className="text-xl">৩০০০+ শিক্ষার্থী আমাদের মাধ্যমে তাদের পরীক্ষায় জিপিএ-৫ অর্জন করেছেন</p>
                </div>
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                ২০২৫ থেকে
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">কেন এক্সামহিরো নির্বাচন করবেন?</h3>
              <p className="text-lg text-gray-600 mb-6">
                আমরা বাংলাদেশের এসএসসি ও এইচএসসি শিক্ষার্থীদের জন্য সবচেয়ে কার্যকরী পরীক্ষা প্রস্তুতি সেবা প্রদান করি। আমাদের বিশেষজ্ঞ শিক্ষকদের দ্বারা ডিজাইন করা কোর্স এবং মডেল টেস্টের মাধ্যমে আপনি পাবেন সেরা প্রস্তুতি।
              </p>
              <p className="text-lg text-gray-600">
                ২০২৫ সাল থেকে আমরা পরীক্ষা প্রস্তুতিতে শিক্ষার্থীদের সাহায্য করে আসছি। আমাদের বিশেষজ্ঞ শিক্ষকরা প্রতিটি শিক্ষার্থীর দুর্বলতা চিহ্নিত করে তা কাটিয়ে উঠার জন্য প্রয়োজনীয় গাইডেন্স প্রদান করে থাকেন।
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-bold text-lg text-primary">৩০০০+ </h4>
                <p className="text-gray-600">সফল শিক্ষার্থী</p>
              </div>
              <div className="bg-secondary/10 p-4 rounded-lg">
                <h4 className="font-bold text-lg text-secondary">১ লাখ + </h4>
                <p className="text-gray-600">প্রশ্নব্যাংক</p>
              </div>
              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-bold text-lg text-accent">৫০+</h4>
                <p className="text-gray-600">বিশেষজ্ঞ শিক্ষক</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-bold text-lg text-primary">৯৫%</h4>
                <p className="text-gray-600">সাফল্যের হার</p>
              </div>
            </div>

            
          </motion.div>
        </div>

        {/* Features Section */}
        <AnimatedSection className="mb-20">
          <motion.h3 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            আমাদের বিশেষ সুবিধাসমূহ
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-base-200 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="text-primary mb-4 flex justify-center">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Mission Vision Section */}
        <AnimatedSection className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div variants={fadeInRight} className="bg-primary/10 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="bg-primary p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-primary">আমাদের লক্ষ্য</h3>
              </div>
              <p className="text-lg text-gray-700">
                বাংলাদেশের প্রতিটি এসএসসি ও এইচএসসি শিক্ষার্থী যেন তাদের পূর্ণ সম্ভাবনা বিকাশ করতে পারে এবং পরীক্ষায় সাফল্য অর্জন করতে পারে—এটাই আমাদের মূল লক্ষ্য। আমরা চাই প্রতিটি মেধাবী শিক্ষার্থী যেন উপযুক্ত নির্দেশনা ও সহায়তা পায়।
              </p>
            </motion.div>
            
            <motion.div variants={fadeInLeft} className="bg-secondary/10 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="bg-secondary p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-secondary">আমাদের ভিশন</h3>
              </div>
              <p className="text-lg text-gray-700">
                ডিজিটাল বাংলাদেশের ভিশন কে সামনে রেখে আমরা গড়ে তুলতে চাই একটি comprehensive learning platform, যেখানে এসএসসি ও এইচএসসি শিক্ষার্থীরা তাদের প্রয়োজনীয় সব রিসোর্সেস পাবে একই জায়গায়।
              </p>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="text-center py-16 bg-gradient-to-r from-primary to-secondary rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <motion.h3 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-white mb-6">
              তোমার সাফল্যের যাত্রা শুরু করুন আজই!
            </motion.h3>
            <motion.p variants={fadeInUp} className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              বাংলাদেশের সেরা এসএসসি/এইচএসসি পরীক্ষা প্রস্তুতি প্ল্যাটফর্মে যোগ দিন এবং পরীক্ষায় A+ অর্জনের স্বপ্ন পূরণ করুন।
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <button onClick={handleClick} className="btn btn-accent px-8 text-white">ফ্রী ট্রায়াল শুরু করুন</button>
              <button onClick={handleClick} className="btn btn-outline btn-white px-8">কোর্স এক্সপ্লোর করুন</button>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default About;
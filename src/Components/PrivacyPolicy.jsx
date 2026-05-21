import React, { useState } from 'react';
import { Link } from 'react-router';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Exam Hero গোপনীয়তা নীতি</h1>
          <p className="text-lg opacity-75 max-w-3xl mx-auto">
            আপনার গোপনীয়তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। এই নীতি ব্যাখ্যা করে কিভাবে আমরা আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করি।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-base-100 rounded-lg shadow-md p-4 sticky top-4">
              <h2 className="text-xl font-bold mb-4">নীতি বিভাগসমূহ</h2>
              <ul className="menu bg-base-100 w-full p-2 rounded-box">
                {[
                  { id: 1, title: "আমরা কোন তথ্য সংগ্রহ করি" },
                  { id: 2, title: "কিভাবে তথ্য ব্যবহার করি" },
                  { id: 3, title: "তথ্য শেয়ারিং" },
                  { id: 4, title: "তথ্য সুরক্ষা" },
                  { id: 5, title: "শিশুদের গোপনীয়তা" },
                  { id: 6, title: "আপনার অধিকার" },
                  { id: 7, title: "তৃতীয় পক্ষের লিংক" },
                  { id: 8, title: "নীতি পরিবর্তন" },
                  { id: 9, title: "যোগাযোগ" }
                ].map(item => (
                  <li key={item.id}>
                    <a 
                      href={`#section-${item.id}`}
                      className={`block py-2 px-4 rounded-md transition-colors ${activeSection === item.id ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSection(item.id);
                      }}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-base-100 rounded-lg shadow-md p-6">
              {/* Section 1 */}
              <div id="section-1" className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="mr-2">1.</span>
                  আমরা কোন তথ্য সংগ্রহ করি
                  <button 
                    className="btn btn-ghost btn-sm ml-2"
                    onClick={() => toggleSection(1)}
                  >
                    {activeSection === 1 ? '▲' : '▼'}
                  </button>
                </h2>
                {activeSection === 1 && (
                  <div className="pl-8">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">ব্যক্তিগত তথ্য:</h3>
                      <p>নাম, ইমেইল ঠিকানা, ফোন নম্বর, বা রেজিস্ট্রেশনের সময় প্রদানকৃত অন্যান্য বিবরণ।</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">শিক্ষাগত তথ্য:</h3>
                      <p>ক্লাস, বোর্ড, বিষয়, পরীক্ষার পছন্দ, এবং পড়ার কার্যক্রম।</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">ব্যবহারের তথ্য:</h3>
                      <p>ডিভাইসের বিবরণ, আইপি ঠিকানা, ব্রাউজার প্রকার, অ্যাপ ব্যবহারের আচরণ, এবং বিশ্লেষণ ডেটা।</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">পেমেন্ট তথ্য:</h3>
                      <p>প্রিমিয়াম বৈশিষ্ট্যের জন্য পেমেন্ট বিবরণ সুরক্ষিত তৃতীয় পক্ষের পেমেন্ট গেটওয়ের মাধ্যমে প্রক্রিয়াজাত করা হয়। আমরা সম্পূর্ণ পেমেন্ট বিবরণ সংরক্ষণ করি না।</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2 */}
              <div id="section-2" className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="mr-2">2.</span>
                  কিভাবে তথ্য ব্যবহার করি
                  <button 
                    className="btn btn-ghost btn-sm ml-2"
                    onClick={() => toggleSection(2)}
                  >
                    {activeSection === 2 ? '▲' : '▼'}
                  </button>
                </h2>
                {activeSection === 2 && (
                  <div className="pl-8">
                    <ul className="list-disc pl-6">
                      <li className="mb-2">আমাদের শিক্ষাগত সেবা প্রদান এবং উন্নত করা।</li>
                      <li className="mb-2">আপনার পড়ার অভিজ্ঞতাকে ব্যক্তিগতকৃত করা।</li>
                      <li className="mb-2">সাবস্ক্রিপশন পরিচালনা এবং পেমেন্ট প্রক্রিয়াকরণ।</li>
                      <li className="mb-2">পরীক্ষা, র‍্যাঙ্কিং সিস্টেম এবং কমিউনিটি বৈশিষ্ট্য সক্ষম করা।</li>
                      <li className="mb-2">আপনাকে গুরুত্বপূর্ণ আপডেট এবং নোটিফিকেশন পাঠানো।</li>
                      <li>সুরক্ষা নিশ্চিত করা এবং অ্যাপের অপব্যবহার রোধ করা।</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Section 3 */}
              <div id="section-3" className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="mr-2">3.</span>
                  তথ্য শেয়ারিং
                  <button 
                    className="btn btn-ghost btn-sm ml-2"
                    onClick={() => toggleSection(3)}
                  >
                    {activeSection === 3 ? '▲' : '▼'}
                  </button>
                </h2>
                {activeSection === 3 && (
                  <div className="pl-8">
                    <p className="mb-4">আমরা আপনার ব্যক্তিগত তথ্য বিক্রি বা ভাড়া দিই না। তবে, নিম্নলিখিত ক্ষেত্রে আমরা তথ্য শেয়ার করতে পারি:</p>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">সেবা প্রদানকারী:</h3>
                      <p>বিশ্বস্ত তৃতীয় পক্ষের সাথে যারা হোস্টিং, পেমেন্ট প্রসেসিং, বা প্রযুক্তিগত সহায়তায় আমাদের সাহায্য করে।</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">আইনী প্রয়োজন:</h3>
                      <p>আইন, আদালতের আদেশ, বা সরকারী কর্তৃপক্ষ দ্বারা প্রয়োজন হলে।</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">ব্যবসায়িক স্থানান্তর:</h3>
                      <p>অধিগ্রহণ, বা সম্পদ বিক্রির ক্ষেত্রে।</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 4 */}
              <div id="section-4" className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="mr-2">4.</span>
                  তথ্য সুরক্ষা
                  <button 
                    className="btn btn-ghost btn-sm ml-2"
                    onClick={() => toggleSection(4)}
                  >
                    {activeSection === 4 ? '▲' : '▼'}
                  </button>
                </h2>
                {activeSection === 4 && (
                  <div className="pl-8">
                    <p>আমরা আপনার তথ্য সুরক্ষিত করতে প্রযুক্তিগত এবং সাংগঠনিক ব্যবস্থা ব্যবহার করি। তবে, কোন সিস্টেম 100% সুরক্ষিত নয়, তাই আমরা সম্পূর্ণ সুরক্ষার গ্যারান্টি দিতে পারি না।</p>
                  </div>
                )}
              </div>

              {/* Section 5 */}
              <div id="section-5" className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="mr-2">5.</span>
                  শিশুদের গোপনীয়তা
                  <button 
                    className="btn btn-ghost btn-sm ml-2"
                    onClick={() => toggleSection(5)}
                  >
                    {activeSection === 5 ? '▲' : '▼'}
                  </button>
                </h2>
                {activeSection === 5 && (
                  <div className="pl-8">
                    <p>আমাদের অ্যাপ 13 বছর এবং  শিক্ষার্থীদের জন্য তৈরি। আমরা knowingly 13 বছর শিশুদের কাছ থেকে তথ্য সংগ্রহ করি না। যদি দুর্ঘটনাবশত such তথ্য সংগ্রহ করা হয়, আমরা  মুছে ফেলব।</p>
                  </div>
                )}
              </div>

              {/* Section 6 */}
              <div id="section-6" className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="mr-2">6.</span>
                  আপনার অধিকার
                  <button 
                    className="btn btn-ghost btn-sm ml-2"
                    onClick={() => toggleSection(6)}
                  >
                    {activeSection === 6 ? '▲' : '▼'}
                  </button>
                </h2>
                {activeSection === 6 && (
                  <div className="pl-8">
                   
                    <ul className="list-disc pl-6">
                      <li className="mb-2">আপনার ব্যক্তিগত তথ্য অ্যাক্সেস, আপডেট, বা মুছে ফেলা।</li>
                      <li className="mb-2">প্রচারমূলক বার্তা থেকে opt out করা।</li>
                      <li className="mb-2">আপনার সংরক্ষিত ডেটার একটি কপি অনুরোধ করা।</li>
                    </ul>
                    <p className="mt-4">এই ধরনের কোনো অনুরোধের জন্য, আমাদের সাথে যোগাযোগ করুন: support@examhero.app</p>
                  </div>
                )}
              </div>

              {/* Section 7 */}
              <div id="section-7" className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="mr-2">7.</span>
                  তৃতীয় পক্ষের লিংক
                  <button 
                    className="btn btn-ghost btn-sm ml-2"
                    onClick={() => toggleSection(7)}
                  >
                    {activeSection === 7 ? '▲' : '▼'}
                  </button>
                </h2>
                {activeSection === 7 && (
                  <div className="pl-8">
                    <p>আমাদের অ্যাপে তৃতীয় পক্ষের ওয়েবসাইট বা পরিষেবার লিংক থাকতে পারে। আমরা তাদের গোপনীয়তা অনুশীলনের জন্য দায়ী নই। তাদের পরিষেবা ব্যবহার করার আগে তাদের নীতি পর্যালোচনা করুন।</p>
                  </div>
                )}
              </div>

              {/* Section 8 */}
              <div id="section-8" className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="mr-2">8.</span>
                  নীতি পরিবর্তন
                  <button 
                    className="btn btn-ghost btn-sm ml-2"
                    onClick={() => toggleSection(8)}
                  >
                    {activeSection === 8 ? '▲' : '▼'}
                  </button>
                </h2>
                {activeSection === 8 && (
                  <div className="pl-8">
                    <p>আমরা সময়ে সময়ে এই গোপনীয়তা নীতি আপডেট করতে পারি। কোনো পরিবর্তন অ্যাপের মধ্যে通知 করা হবে। আপডেট后的 অ্যাপ ব্যবহার চালিয়ে যাওয়া মানে আপনি নতুন শর্তাবলী গ্রহণ করেছেন।</p>
                  </div>
                )}
              </div>

              {/* Section 9 */}
              <div id="section-9" className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="mr-2">9.</span>
                  যোগাযোগ
                  <button 
                    className="btn btn-ghost btn-sm ml-2"
                    onClick={() => toggleSection(9)}
                  >
                    {activeSection === 9 ? '▲' : '▼'}
                  </button>
                </h2>
                {activeSection === 9 && (
                  <div className="pl-8">
                    <p className="mb-4">যদি আপনার কোনো প্রশ্ন বা উদ্বেগ থাকে, তাহলে আমাদের সাথে যোগাযোগ করুন:</p>
                    <div className="bg-primary text-primary-content p-4 rounded-box">
                      <p className="font-semibold">📧 support@examhero.app</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="divider"></div>

              <div className="text-center mt-8">
                <p className="text-sm opacity-75">
                  এই গোপনীয়তা নীতি শেষ আপডেট করা হয়েছে: {new Date().toLocaleDateString('bn-BD')}
                </p>
                <div className="mt-4">
                  <Link to="/" className="btn btn-primary">হোমপেজে ফিরে যান</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
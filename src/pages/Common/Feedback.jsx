// import { X } from "lucide-react";
// import { useState } from "react";

// const reviews = [
//   {
//     name: "Google",
//     rating: 4.4,
//     total: "1,517 Google Reviews",
//     logo: "https://d1i3enf1i5tb1f.cloudfront.net/assets/Whitelabel/img/google.png",
//   },
//   {
//     name: "Tripadvisor",
//     rating: 4.5,
//     total: "12,416 Reviews",
//     logo: "https://d1i3enf1i5tb1f.cloudfront.net/assets/Whitelabel/img/trip-advisor.png",
//   },
//   {
//     name: "Trustpilot",
//     rating: 4.9,
//     total: "34,840 Reviews",
//     logo: "https://d1i3enf1i5tb1f.cloudfront.net/assets/Whitelabel/img/trust-pilot.png",
//   },
//   {
//     name: "Get Tour Guide",
//     rating: 4.6,
//     total: "28,000 Reviews",
//     logo: "https://i.postimg.cc/rwMfMZr6/logo-1-pages-to-jpg-0001.jpg",
//   },
// ];

// const Feedback = () => {
//   const [showFeedback, setShowFeedback] = useState(false);

//   return (
//     <div className="relative">
//       {/* Feedback Button - Left Side */}
//       <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50">
//         <button
//           onClick={() => setShowFeedback(true)}
//           className="bg-[#FAD20A] text-black px-2 py-4 rounded-r-lg shadow-lg hover:bg-[#e8c309] transition-all transform hover:scale-105 font-medium text-sm"
//           style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
//         >
//           Reviews
//         </button>
//       </div>

//       {/* Popup Modal showing all reviews */}
//       {showFeedback && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
//           <div className="bg-white rounded-lg p-6 w-full max-w-4xl relative shadow-xl">
//             <button
//               onClick={() => setShowFeedback(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//             >
//               <X size={24} />
//             </button>
//             <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
//               Trusted by 25 Million customers
//             </h2>
//             <p className="text-gray-600 text-center mb-6 text-sm sm:text-base">
//               Become a part of our happy community
//             </p>

//             {/* Responsive Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
//               {reviews.map((review, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
//                 >
//                   <img
//                     src={review.logo}
//                     alt={review.name}
//                     className="h-10 sm:h-12 mb-2 sm:mb-3 object-contain"
//                   />
//                   <div className="flex items-center mb-1 sm:mb-2">
//                     <svg
//                       className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-1"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.947c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.07 9.374c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.947z" />
//                     </svg>
//                     <span className="font-semibold text-gray-800 text-sm sm:text-base">
//                       {review.rating}
//                     </span>
//                   </div>
//                   <p className="text-gray-500 text-xs sm:text-sm">
//                     {review.total}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Feedback;

import { X } from "lucide-react";
import { useState } from "react";

const reviews = [
  {
    name: "Google",
    rating: 4.4,
    total: "1,517 Google Reviews",
    logo: "https://d1i3enf1i5tb1f.cloudfront.net/assets/Whitelabel/img/google.png",
  },
  {
    name: "Tripadvisor",
    rating: 4.5,
    total: "12,416 Reviews",
    logo: "https://d1i3enf1i5tb1f.cloudfront.net/assets/Whitelabel/img/trip-advisor.png",
  },
  {
    name: "Trustpilot",
    rating: 4.9,
    total: "34,840 Reviews",
    logo: "https://d1i3enf1i5tb1f.cloudfront.net/assets/Whitelabel/img/trust-pilot.png",
  },
  {
    name: "Get Tour Guide",
    rating: 4.6,
    total: "28,000 Reviews",
    logo: "https://i.postimg.cc/rwMfMZr6/logo-1-pages-to-jpg-0001.jpg",
  },
];

const Feedback = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="relative">
      {/* Feedback Button - Left Side */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={() => setShowFeedback(true)}
          className="bg-[#FAD20A] text-black px-2 py-4 rounded-r-lg shadow-lg hover:bg-[#e8c309] transition-all transform hover:scale-105 font-medium text-sm"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Feedback
        </button>
      </div>

      {/* Popup Modal showing all reviews */}
      {showFeedback && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-6xl relative shadow-xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowFeedback(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-1 shadow-md"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
              Trusted by 25 Million customers
            </h2>
            <p className="text-gray-600 text-center mb-6 text-sm sm:text-base">
              Become a part of our happy community
            </p>

            {/* Responsive Grid for Review Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
                >
                  <img
                    src={review.logo}
                    alt={review.name}
                    className="h-10 sm:h-12 mb-2 sm:mb-3 object-contain"
                  />
                  <div className="flex items-center mb-1 sm:mb-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.947c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.07 9.374c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.947z" />
                    </svg>
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">
                      {review.rating}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    {review.total}
                  </p>
                </div>
              ))}
            </div>

            {/* TripAdvisor Iframe Section */}
            <div className="mt-6 sm:mt-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-4">
                See What Our Customers Say on TripAdvisor
              </h3>

              {/* White Background Iframe Container */}
              <div className="relative w-full bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <div
                  className="w-full relative"
                  style={{
                    height: "0",
                    paddingBottom: "75%", // 4:3 aspect ratio for better mobile view
                    minHeight: "400px",
                  }}
                >
                  <iframe
                    src="https://www.tripadvisor.com/Attraction_Review-g295424-d25266287-Reviews-GetTourGuide-Dubai_Emirate_of_Dubai.html"
                    title="TripAdvisor Reviews for GetTourGuide Dubai"
                    className="absolute top-0 left-0 w-full h-full border-0 bg-white"
                    loading="lazy"
                    allowFullScreen
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    style={{ backgroundColor: "white" }}
                  />
                </div>
              </div>

              {/* Loading State */}
              <div className="text-center mt-3">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-blue-600 text-sm font-medium">
                    Loading TripAdvisor Reviews...
                  </span>
                </div>
              </div>

              {/* Mobile Notice */}
              <div className="mt-4 text-center">
                <p className="text-xs sm:text-sm text-gray-500 bg-yellow-50 inline-block px-3 py-2 rounded-lg">
                  📱 <strong>Mobile Tip:</strong> Scroll inside the white box to
                  see all reviews
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;

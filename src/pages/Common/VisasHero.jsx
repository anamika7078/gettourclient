// import { useEffect, useMemo, useState } from "react";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// export default function VisasHero({
//   whatsappNumber = "+971521234567",
//   backgroundUrl,
//   backgroundUrls,
//   rotateIntervalMs = 8000,
//   defaultNationality = "",
//   defaultDestination = "",
// }) {
//   const [nationality, setNationality] = useState(defaultNationality);
//   const [destination, setDestination] = useState(defaultDestination);
//   const API_BASE = import.meta.env.VITE_API_URL;
//   const [apiBackgrounds, setApiBackgrounds] = useState([]);

//   const defaultBackgrounds = useMemo(
//     () => [
//       "./visas/v1.jpg",
//       "./visas/v2.jpg",
//       "./visas/v3.jpg",
//       "./visas/v4.jpg",
//       "./visas/v5.jpg",
//     ],
//     []
//   );

//   useEffect(() => {
//     fetch(`${API_BASE}/api/hero/visas`)
//       .then((r) => r.json())
//       .then((res) => {
//         const imgs = res?.data?.images || [];
//         if (imgs.length) setApiBackgrounds(imgs.map((p) => `${API_BASE}${p}`));
//       })
//       .catch(() => {});
//   }, [API_BASE]);

//   const rotationList = useMemo(() => {
//     if (apiBackgrounds.length) return apiBackgrounds;
//     if (backgroundUrls?.length) return backgroundUrls;
//     if (backgroundUrl) return [backgroundUrl, ...defaultBackgrounds.slice(1)];
//     return defaultBackgrounds;
//   }, [apiBackgrounds, backgroundUrl, backgroundUrls, defaultBackgrounds]);

//   const [bgIndex, setBgIndex] = useState(0);
//   useEffect(() => {
//     if (!rotationList?.length) return;
//     const id = setInterval(() => {
//       setBgIndex((i) => (i + 1) % rotationList.length);
//     }, rotateIntervalMs);
//     return () => clearInterval(id);
//   }, [rotationList, rotateIntervalMs]);

//   const handlePrev = () => {
//     setBgIndex((prev) => (prev === 0 ? rotationList.length - 1 : prev - 1));
//   };

//   const handleNext = () => {
//     setBgIndex((prev) => (prev + 1) % rotationList.length);
//   };

//   const handleApplyWhatsApp = () => {
//     const msg = `Hello, I want to apply for a visa. Nationality: ${nationality}, Destination: ${destination}`;
//     const phone = whatsappNumber.replace(/\D/g, "");
//     const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
//     window.open(url, "_blank");
//   };

//   return (
//     <section className="relative h-[20vh] sm:h-[50vh] md:h-[350px] w-full overflow-hidden select-none flex items-center justify-center">
//       {/* Background Slides */}
//       <div className="absolute inset-0 -z-10">
//         {rotationList.map((src, idx) => (
//           <img
//             key={idx}
//             src={src}
//             alt="Visa background"
//             className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-1000 ${
//               idx === bgIndex ? "opacity-100" : "opacity-0"
//             }`}
//           />
//         ))}
//         <div className="absolute inset-0 bg-black/40" />
//       </div>

//       {/* Search Section */}
//       {/* <div className="absolute  inset-0 flex flex-col sm:flex-row items-center justify-center text-center z-10 px-4"> */}
//       <div
//         className="
//     absolute inset-0
//     flex flex-col sm:flex-row items-center justify-center text-center z-10 px-4
//     top-[30px]
//   "
//       >
//         <div className="bg-white/90 backdrop-blur-sm rounded-xl flex flex-col sm:flex-row items-center justify-center gap-3 p-4 shadow-lg max-w-3xl w-full">
//           {/* Nationality Input */}
//           <div className="relative w-full sm:w-[250px]">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-5 h-5"
//                 fill="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6Zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
//               </svg>
//             </span>
//             <select
//               value={nationality}
//               onChange={(e) => setNationality(e.target.value)}
//               className="w-full px-10 py-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
//             >
//               <option value="">Your Nationality</option>
//               <option value="India">India</option>
//               <option value="USA">USA</option>
//               <option value="UK">UK</option>
//             </select>
//           </div>

//           {/* Destination Input */}
//           <div className="relative w-full sm:w-[250px]">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-5 h-5"
//                 fill="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6Zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
//               </svg>
//             </span>
//             <select
//               value={destination}
//               onChange={(e) => setDestination(e.target.value)}
//               className="w-full px-10 py-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
//             >
//               <option value="">Destination Country</option>
//               <option value="Saudi Arabia">Saudi Arabia</option>
//               <option value="UAE">UAE</option>
//               <option value="Bahrain">Bahrain</option>
//             </select>
//           </div>

//           {/* Apply Button */}
//           <button
//             onClick={handleApplyWhatsApp}
//             className="w-full sm:w-[220px] px-3 py-3 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
//           >
//             Apply on WhatsApp
//           </button>
//         </div>
//       </div>

//       {/* Desktop Left/Right Arrows (Bottom-Right Corner) */}
//       <div className="absolute bottom-6 right-6 gap-3 z-20 hidden md:flex">
//         <button
//           onClick={handlePrev}
//           className="w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition"
//         >
//           <FaArrowLeft className="text-gray-800" />
//         </button>
//         <button
//           onClick={handleNext}
//           className="w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition"
//         >
//           <FaArrowRight className="text-gray-800" />
//         </button>
//       </div>
//     </section>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function VisasHero({
  whatsappNumber = "+971521234567",
  backgroundUrl,
  backgroundUrls,
  rotateIntervalMs = 8000,
  defaultNationality = "",
  defaultDestination = "",
}) {
  const [nationality, setNationality] = useState(defaultNationality);
  const [destination, setDestination] = useState(defaultDestination);
  const API_BASE = import.meta.env.VITE_API_URL;
  const [apiBackgrounds, setApiBackgrounds] = useState([]);

  const defaultBackgrounds = useMemo(
    () => [
      "./visas/v1.jpg",
      "./visas/v2.jpg",
      "./visas/v3.jpg",
      "./visas/v4.jpg",
      "./visas/v5.jpg",
    ],
    []
  );

  useEffect(() => {
    fetch(`${API_BASE}/api/hero/visas`)
      .then((r) => r.json())
      .then((res) => {
        const imgs = res?.data?.images || [];
        if (imgs.length) setApiBackgrounds(imgs.map((p) => `${API_BASE}${p}`));
      })
      .catch(() => {});
  }, [API_BASE]);

  const rotationList = useMemo(() => {
    if (apiBackgrounds.length) return apiBackgrounds;
    if (backgroundUrls?.length) return backgroundUrls;
    if (backgroundUrl) return [backgroundUrl, ...defaultBackgrounds.slice(1)];
    return defaultBackgrounds;
  }, [apiBackgrounds, backgroundUrl, backgroundUrls, defaultBackgrounds]);

  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    if (!rotationList?.length) return;
    const id = setInterval(() => {
      setBgIndex((i) => (i + 1) % rotationList.length);
    }, rotateIntervalMs);
    return () => clearInterval(id);
  }, [rotationList, rotateIntervalMs]);

  const handlePrev = () => {
    setBgIndex((prev) => (prev === 0 ? rotationList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setBgIndex((prev) => (prev + 1) % rotationList.length);
  };

  const handleApplyWhatsApp = () => {
    const msg = `Hello, I want to apply for a visa. Nationality: ${nationality}, Destination: ${destination}`;
    const phone = whatsappNumber.replace(/\D/g, "");
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[20vh] sm:h-[50vh] md:h-[350px] w-full overflow-hidden select-none">
        {/* Background Slides */}
        <div className="absolute inset-0 -z-10">
          {rotationList.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt="Visa background"
              className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-1000 ${
                idx === bgIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Desktop Search Section - Only visible on medium screens and up */}
        <div className="hidden md:flex absolute inset-0 items-center justify-center text-center z-10 px-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl flex flex-row items-center justify-center gap-3 p-4 shadow-lg max-w-3xl w-full">
            {/* Nationality Input */}
            <div className="relative w-[250px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6Zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                </svg>
              </span>
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full px-10 py-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
              >
                <option value="">Your Nationality</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
              </select>
            </div>

            {/* Destination Input */}
            <div className="relative w-[250px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6Zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                </svg>
              </span>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-10 py-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
              >
                <option value="">Destination Country</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="UAE">UAE</option>
                <option value="Bahrain">Bahrain</option>
              </select>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApplyWhatsApp}
              className="w-[220px] px-3 py-3 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
            >
              Apply on WhatsApp
            </button>
          </div>
        </div>

        {/* Desktop Left/Right Arrows (Bottom-Right Corner) */}
        <div className="absolute bottom-6 right-6 gap-3 z-20 hidden md:flex">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition"
          >
            <FaArrowLeft className="text-gray-800" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition"
          >
            <FaArrowRight className="text-gray-800" />
          </button>
        </div>
      </section>

      {/* Mobile Search Section - Appears below hero image on small screens */}
      <div className="md:hidden bg-white p-4 shadow-lg">
        <div className="bg-white rounded-xl flex flex-col items-center justify-center gap-3 p-4 max-w-3xl mx-auto border border-gray-200">
          {/* Nationality Input */}
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6Zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
              </svg>
            </span>
            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full px-10 py-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
            >
              <option value="">Your Nationality</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>
          </div>

          {/* Destination Input */}
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6Zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
              </svg>
            </span>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-10 py-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
            >
              <option value="">Destination Country</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="UAE">UAE</option>
              <option value="Bahrain">Bahrain</option>
            </select>
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApplyWhatsApp}
            className="w-full px-3 py-3 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
          >
            Apply on WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}

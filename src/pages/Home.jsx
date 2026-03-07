// import ActivityCards from "./Common/ActivityCards";
// import Footer from "./Common/Footer";
// import Hero from "./Common/Hero";
// import TopActivity from "./Common/TopAcitivity";

// export default function App() {
//   return (
//     <div className="bg-white text-slate-800 min-h-screen">
//           <Hero />
//           <TopActivity />
//       <ActivityCards />
//       <Footer />
//     </div>
//   );
// }

import ActivityCards from "./Common/ActivityCards";
import Footer from "./Common/Footer";
import Hero from "./Common/Hero";
import TopActivity from "./Common/TopAcitivity";

export default function App() {
  return (
    <div className="bg-white text-slate-800 min-h-screen">
      <Hero />
      <TopActivity />
      <div className="pt-0.5">
        {" "}
        {/* Extra small gap */}
        <ActivityCards />
      </div>
      <Footer />
    </div>
  );
}

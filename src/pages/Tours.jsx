import HolidayHero from "./Common/HolidayHero";
import ToursAllComp from "./Tours/ToursAllComp";
import Footer from "../pages/Common/Footer";
import TopActivity from "./Common/TopAcitivity";


const Tours = () => {
  return (
      <>
        <HolidayHero />
        <TopActivity />
        <div className="pt-0.5">
          {" "}
          {/* Extra small gap */}
          <ToursAllComp />
        </div>
        <Footer />
      </>
  );
};

export default Tours;

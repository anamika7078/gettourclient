import CruisesHero from "./Common/CruisesHero";
import Footer from "./Common/Footer";
import TopActivity from "./Common/TopAcitivity";
import AllCruises from "./Cruises/AllCruises.jsx";

const Cruises = () => {
  return (
    <>
      <CruisesHero />
      <TopActivity />

      <AllCruises />
      <Footer />
    </>
  );
};

export default Cruises;

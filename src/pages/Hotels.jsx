import { useCallback, useState } from "react";
import HotelHero from "../pages/Common/HotelHero";
import Footer from "./Common/Footer";
import AllRooms from "./Hotels/AllRooms";

const Hotels = () => {
  const [query, setQuery] = useState("");

  const handleSearch = useCallback(({ destination }) => {
    setQuery(destination || "");
  }, []);

  return (
    <>
      <HotelHero onSearch={handleSearch} />
      <AllRooms filterQuery={query} />
      <Footer />
    </>
  );
};

export default Hotels;

import React from "react";
import Feedback from "./Feedback";
import WhatsApp from "./WhatsApp";
import ScrollToTop from "./ScrollToTop";

const Layout = ({ children }) => {
  return (
    <>
      {/* Main Content */}
      {children}

      {/* Global Components that appear on all pages */}
      <Feedback />
      <WhatsApp />
      <ScrollToTop />
    </>
  );
};

export default Layout;

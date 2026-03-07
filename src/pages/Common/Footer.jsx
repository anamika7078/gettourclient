import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="hidden md:block py-8"
      style={{ backgroundColor: "#FEF7F5" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo at Top Center */}
        <div className="mb-6">
          <img
            src="./logo.png"
            alt="Rayna Tours"
            className="h-16 w-18 mx-auto"
          />
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 mb-4 text-gray-800">
          <a
            href="https://www.facebook.com/share/1Cf2hGmUm7/?mibextid=wwXIfr"
            className="hover:text-orange-500"
          >
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-orange-500">
            <FaTwitter />
          </a>
          <a
            href="https://www.instagram.com/gettourguide?igsh=aWd1b3h3MDV3OTNn&utm_source=qr"
            className="hover:text-orange-500"
          >
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-orange-500">
            <FaLinkedinIn />
          </a>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-4 text-gray-800">
          <a href="/about" className="hover:text-orange-500">
            About Us
          </a>
          <a href="/contact" className="hover:text-orange-500">
            Contact Us
          </a>
          <a href="/privacy" className="hover:text-orange-500">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-orange-500">
            Terms & Conditions
          </a>
        </div>

        {/* Copyright */}
        <p className="text-gray-500 text-sm">© Get Tour Guide</p>
      </div>
    </footer>
  );
}

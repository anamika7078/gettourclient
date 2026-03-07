import { createContext, useContext, useEffect, useState } from "react";

const CurrencyContext = createContext();
export const useCurrency = () => useContext(CurrencyContext);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem("app_currency") || "AED";
    } catch {
      return "AED";
    }
  });
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);

  // fetch currency rates from free API
  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/AED");
        const data = await res.json();
        if (data?.rates) {
          setRates(data.rates);
        }
      } catch (err) {
        console.error("Failed to load exchange rates:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  // convert AED → selected currency
  const convertPrice = (price) => {
    const p = Number(price || 0);
    if (currency === "AED") return p;
    const r = rates[currency];
    if (!r || isNaN(r)) return p;
    return p * r;
  };

  // format price with symbol
  //   const formatCurrency = (price) => {
  //     if (price == null || isNaN(price)) return "—";
  //     const symbols = {
  //       AED: "AED",
  //       USD: "$",
  //       EUR: "€",
  //       GBP: "£",
  //       INR: "₹",
  //     };
  //     const symbol = symbols[currency] || currency;
  //     return `${symbol} ${Number(price).toLocaleString("en-IN", {
  //       maximumFractionDigits: 2,
  //     })}`;
  //   };
  const formatCurrency = (price) => {
    if (price == null || isNaN(price)) return "—";
    const symbols = {
      AED: "AED",
      USD: "$",
      EUR: "€",
      GBP: "£",
      INR: "₹",
      SAR: "﷼",
      SGD: "S$",
      MYR: "RM",
      ZAR: "R",
      THB: "฿",
      OMR: "ر.ع",
      AUD: "A$",
      GEL: "ლ",
      AMD: "Դ",
      HKD: "HK$",
      MOP: "MOP",
      JPY: "¥",
      KZT: "₸",
      UZS: "лв",
      AZN: "₼",
      MUR: "MUR",
      TRY: "TRY",
      DKK: "KR",
      VND: "₫",
      IDR: "Rp",
    };
    const symbol = symbols[currency] || currency;
    return `${symbol} ${Number(price).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  // convenience: convert from AED then format in selected currency
  const convertAndFormat = (priceInAed) => {
    const converted = convertPrice(priceInAed);
    return formatCurrency(converted);
  };

  // persist selected currency
  useEffect(() => {
    try {
      localStorage.setItem("app_currency", currency);
    } catch {
      // ignore storage errors
    }
  }, [currency]);

  //   const supportedCurrencies = ["AED", "USD", "EUR", "GBP", "INR"];
  // supported currencies (all listed)
  const supportedCurrencies = [
    "AED",
    "USD",
    "EUR",
    "GBP",
    "INR",
    "SAR",
    "SGD",
    "MYR",
    "ZAR",
    "THB",
    "OMR",
    "AUD",
    "GEL",
    "AMD",
    "HKD",
    "MOP",
    "JPY",
    "KZT",
    "UZS",
    "AZN",
    "MUR",
    "TRY",
    "DKK",
    "VND",
    "IDR",
  ];

  const value = {
    currency,
    setCurrency,
    rates,
    convertPrice,
    formatCurrency, // ✅ make sure this is included
    convertAndFormat,
    supportedCurrencies,
    loading,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

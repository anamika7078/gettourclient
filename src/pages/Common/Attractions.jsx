import "./Style/activities.css";

const ACTIVITIES = [
  {
    title: "Abu Dhabi",
    image: "./Activity/a1.png",
  },
  {
    title: "Baku",
    image: "./Activity/a2.png",
  },
  {
    title: "Bangkok",
    image: "./Activity/a3.png",
  },
  {
    title: "Dubai",
    image: "./Activity/a4.png",
  },
  {
    title: "Istanbul",
    image: "./Activity/a5.png",
  },
  {
    title: "Jaipur",
    image: "./Activity/a6.jpg",
  },
  {
    title: "Moscow",
    image: "./Activity/a7.png",
  },
  {
    title: "Ras al Khaimah",
    image: "./Activity/a8.png",
  },
  {
    title: "Singapore",
    image: "./Activity/a9.png",
  },
  {
    title: "Tbilisi",
    image: "./Activity/a10.png",
  },
];

export default function Activities() {
  const LOOP = ACTIVITIES.concat(ACTIVITIES);

  return (
    <section className="relative overflow-x-clip bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        {/* Heading row */}
        <div className="mx-auto max-w-[1320px] flex items-center gap-3 pt-8 sm:pt-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F37B2C]">
            Your Next Adventure Awaits
          </h2>

          <div className="ml-2 ring-wrap text-[#F37B2C]">
            <svg
              className="ring-svg animate-spin-slower"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r="47"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="0.1 10.5"
              />
            </svg>

            <button
              type="button"
              aria-label="See all"
              className="ring-btn bg-[#F37B2C] text-white focus:outline-none focus-visible:ring-4 ring-[#F37B2C]/40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[55%] w-[55%]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M7 17 17 7M9 7h8v8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Full-width marquee track */}
        <div className="relative mt-6">
          <div className="activities-marquee-mask">
            <div className="activities-marquee-track gap-4 md:gap-5 lg:gap-6">
              {LOOP.map((a, idx) => (
                <ActivityCard key={`${a.title}-${idx}`} activity={a} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivityCard({ activity }) {
  const { title, image } = activity;

  return (
    <div
      className="
        group relative overflow-hidden rounded-[22px]
        shrink-0
        w-[260px] sm:w-[280px] md:w-[300px] lg:w-[300px] xl:w-[300px]
        h-[420px] md:h-[440px] lg:h-[460px]
        bg-black
        transition-all
      "
    >
      {/* Image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        loading="lazy"
        decoding="async"
      />

      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-[#F37B2C]/0 group-hover:bg-[#F37B2C]/10 transition-colors duration-300 pointer-events-none" />

      {/* Title */}
      <div className="absolute inset-x-4 sm:inset-x-5 bottom-4 sm:bottom-5">
        <h3
          className="
            text-white text-[20px] sm:text-[22px] font-extrabold drop-shadow-md
            transition-colors duration-300 group-hover:text-[#F37B2C]
          "
        >
          {title}
        </h3>
      </div>

      {/* Hover ring */}
      <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-0 group-hover:ring-4 ring-[#F37B2C]/25 transition-all duration-300" />
    </div>
  );
}

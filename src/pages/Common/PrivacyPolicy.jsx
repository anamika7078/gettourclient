export default function PrivacyPolicy() {
  const lastUpdated = "November 2, 2025";
  return (
    <main className="min-h-screen pb-24 bg-neutral-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-white/90 max-w-2xl">
            Your privacy matters to us. This page explains what data we collect,
            why we collect it, and how we protect it.
          </p>
          <p className="mt-3 text-sm text-white/80">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* TOC (desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 sticky top-20">
              <h2 className="text-sm font-semibold text-neutral-800">
                On this page
              </h2>
              <nav className="mt-3 text-sm space-y-2">
                <a
                  className="block text-neutral-700 hover:text-orange-600"
                  href="#use"
                >
                  How We Use Guest Information
                </a>
                <a
                  className="block text-neutral-700 hover:text-orange-600"
                  href="#legal"
                >
                  Legal Basis for Processing
                </a>
                <a
                  className="block text-neutral-700 hover:text-orange-600"
                  href="#media"
                >
                  Photos & Media Consent
                </a>
                <a
                  className="block text-neutral-700 hover:text-orange-600"
                  href="#children"
                >
                  Children’s Privacy
                </a>
                <a
                  className="block text-neutral-700 hover:text-orange-600"
                  href="#updates"
                >
                  Updates to This Policy
                </a>
                <a
                  className="block text-neutral-700 hover:text-orange-600"
                  href="#summary"
                >
                  Quick Summary
                </a>
              </nav>
            </div>
          </aside>

          {/* Main */}
          <div className="lg:col-span-9 space-y-6">
            <section
              id="use"
              className="rounded-2xl bg-white ring-1 ring-black/5 p-5 sm:p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900">
                1. How We Use Guest Information
              </h3>
              <p className="mt-2 text-neutral-700">
                We collect and process your information to:
              </p>
              <ul className="mt-3 list-disc pl-5 text-neutral-700 space-y-1">
                <li>Confirm and manage your safari booking.</li>
                <li>Arrange pickup, drop-off, and activity schedules.</li>
                <li>
                  Ensure your safety and comply with UAE regulations for
                  adventure tourism.
                </li>
                <li>
                  Communicate important details about your booking or any
                  changes.
                </li>
                <li>Process secure payments.</li>
              </ul>
            </section>

            <section
              id="legal"
              className="rounded-2xl bg-white ring-1 ring-black/5 p-5 sm:p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900">
                2. Legal Basis for Processing
              </h3>
              <p className="mt-2 text-neutral-700">
                We process guest information under the following legal grounds:
              </p>
              <ul className="mt-3 list-disc pl-5 text-neutral-700 space-y-1">
                <li>
                  <span className="font-medium">Consent:</span> You voluntarily
                  provide your information when booking or joining our tours.
                </li>
                <li>
                  <span className="font-medium">Contractual necessity:</span> To
                  deliver the safari experience you have booked.
                </li>
              </ul>
            </section>

            <section
              id="media"
              className="rounded-2xl bg-white ring-1 ring-black/5 p-5 sm:p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900">
                3. Photos & Media Consent
              </h3>
              <p className="mt-2 text-neutral-700">
                During desert safaris, our staff or photographers may take
                photos or videos of the experience. These may be used for
                marketing or social media only with your consent. If you prefer
                not to appear, please inform our guide or photographer at the
                start.
              </p>
            </section>

            <section
              id="children"
              className="rounded-2xl bg-white ring-1 ring-black/5 p-5 sm:p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900">
                4. Children’s Privacy
              </h3>
              <p className="mt-2 text-neutral-700">
                Our Desert Safaris are family-friendly, but we do not knowingly
                collect personal data from children under 18 years without
                parental consent. Parents or guardians must accompany minors
                during all activities.
              </p>
            </section>

            <section
              id="updates"
              className="rounded-2xl bg-white ring-1 ring-black/5 p-5 sm:p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900">
                5. Updates to This Policy
              </h3>
              <p className="mt-2 text-neutral-700">
                We may update this Privacy Policy periodically to comply with
                legal changes or improve our practices. Any updates will be
                posted on our website with the revised “Last Updated” date.
              </p>
            </section>

            <section
              id="summary"
              className="rounded-2xl bg-white ring-1 ring-black/5 p-5 sm:p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900">
                Quick Summary for Guests
              </h3>
              <ul className="mt-3 list-disc pl-5 text-neutral-700 space-y-1">
                <li>
                  We only collect the data needed to manage your booking and
                  ensure safety.
                </li>
                <li>We never sell or misuse your personal data.</li>
                <li>Photos/videos are only used with your consent.</li>
              </ul>
              <p className="mt-4 text-sm text-neutral-600">
                Have questions? Reach out via our social links in the footer.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

import { Link } from "react-router-dom";

export default function TermsConditions() {
  const lastUpdated = "November 2, 2025";
  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-white/90 max-w-2xl">
            Please read these terms carefully before booking or participating in
            any tour or service.
          </p>
          <p className="mt-3 text-sm text-white/80">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 sticky top-20">
              <h2 className="text-sm font-semibold text-neutral-800">
                On this page
              </h2>
              <nav className="mt-3 text-sm space-y-2">
                <a
                  className="block text-neutral-700 hover:text-orange-600"
                  href="#booking"
                >
                  Booking & Payments
                </a>
                <a
                  className="block text-neutral-700 hover:text-orange-600"
                  href="#cancellations"
                >
                  Cancellations Policy
                </a>
                <a
                  className="block text-neutral-700 hover:text-orange-600"
                  href="#safety"
                >
                  Health, Safety & Conduct
                </a>
                <a
                  className="block text-neutral-700 hover:text-orange-600"
                  href="#insurance"
                >
                  Insurance
                </a>
                <a
                  className="block text-neutral-700 hover:text-orange-600"
                  href="#complaints"
                >
                  Complaints & Dispute Resolution
                </a>
                <a
                  className="block text-neutral-700 hover:text-orange-600"
                  href="#law"
                >
                  Governing Law
                </a>
                <a
                  className="block text-neutral-700 hover:text-orange-600"
                  href="#ip"
                >
                  Intellectual Property
                </a>
                <a
                  className="block text-neutral-700 hover:text-orange-600"
                  href="#privacy"
                >
                  Privacy
                </a>
                <a
                  className="block text-neutral-700 hover:text-orange-600"
                  href="#accept"
                >
                  Acceptance of Terms
                </a>
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-9 space-y-6">
            <section
              id="booking"
              className="rounded-2xl bg-white ring-1 ring-black/5 p-5 sm:p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900">
                1. Booking & Payments
              </h3>
              <ul className="mt-3 list-disc pl-5 text-neutral-700 space-y-1">
                <li>
                  All bookings are subject to confirmation and availability.
                </li>
                <li>
                  Prices are quoted in UAE Dirhams (AED) unless otherwise
                  specified.
                </li>
                <li>
                  Payment methods: bank transfer, credit/debit card, or approved
                  online payment gateway. Group or corporate bookings may have
                  specific terms communicated separately.
                </li>
              </ul>
            </section>

            <section
              id="cancellations"
              className="rounded-2xl bg-white ring-1 ring-black/5 p-5 sm:p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900">
                2. Cancellations Policy
              </h3>
              <p className="mt-2 text-neutral-700">By the Client:</p>
              <ul className="mt-2 list-disc pl-5 text-neutral-700 space-y-1">
                <li>Cancellation requests must be made in writing.</li>
                <li>
                  Cancellations made less than 24 hours before the trip are
                  non-refundable.
                </li>
              </ul>
            </section>

            <section
              id="safety"
              className="rounded-2xl bg-white ring-1 ring-black/5 p-5 sm:p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900">
                3. Health, Safety & Conduct
              </h3>
              <ul className="mt-3 list-disc pl-5 text-neutral-700 space-y-1">
                <li>
                  Disclose any medical conditions or disabilities that may
                  affect participation.
                </li>
                <li>
                  We reserve the right to refuse service to anyone posing a
                  safety risk or behaving inappropriately.
                </li>
                <li>
                  Participants must comply with UAE laws, cultural norms, and
                  guide instructions at all times.
                </li>
                <li>
                  Alcohol consumption, public indecency, and disrespect toward
                  local customs or religion are prohibited.
                </li>
              </ul>
            </section>

            <section
              id="insurance"
              className="rounded-2xl bg-white ring-1 ring-black/5 p-5 sm:p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900">
                4. Insurance
              </h3>
              <p className="mt-2 text-neutral-700">
                All travelers are strongly advised to have valid travel
                insurance covering medical expenses, cancellation, and personal
                accidents. For adventure activities, ensure your insurance
                covers high-risk activities.
              </p>
            </section>

            <section
              id="complaints"
              className="rounded-2xl bg-white ring-1 ring-black/5 p-5 sm:p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900">
                5. Complaints & Dispute Resolution
              </h3>
              <ul className="mt-3 list-disc pl-5 text-neutral-700 space-y-1">
                <li>
                  Report any complaint immediately to your guide or company
                  representative for prompt resolution.
                </li>
                <li>
                  If unresolved, submit a written complaint within 10 days after
                  the tour ends.
                </li>
              </ul>
            </section>

            <section
              id="law"
              className="rounded-2xl bg-white ring-1 ring-black/5 p-5 sm:p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900">
                6. Governing Law
              </h3>
              <p className="mt-2 text-neutral-700">
                These Terms & Conditions are governed by the laws of the United
                Arab Emirates.
              </p>
            </section>

            <section
              id="ip"
              className="rounded-2xl bg-white ring-1 ring-black/5 p-5 sm:p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900">
                7. Intellectual Property
              </h3>
              <p className="mt-2 text-neutral-700">
                All materials on our website, brochures, and promotional
                content—including text, photos, logos, and designs—are owned by
                Get Tour Guide. Reproduction or misuse is strictly prohibited.
              </p>
            </section>

            <section
              id="privacy"
              className="rounded-2xl bg-white ring-1 ring-black/5 p-5 sm:p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900">
                8. Privacy Policy
              </h3>
              <p className="mt-2 text-neutral-700">
                Your personal data is collected and processed in accordance with
                UAE data protection regulations. We will not share your personal
                information with third parties except as required to complete
                your booking or as required by law. See our{" "}
                <Link
                  to="/privacy"
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Privacy Policy
                </Link>{" "}
                for details.
              </p>
            </section>

            <section
              id="accept"
              className="rounded-2xl bg-white ring-1 ring-black/5 p-5 sm:p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900">
                9. Acceptance of Terms
              </h3>
              <p className="mt-2 text-neutral-700">
                By booking or participating in any of our tours, you confirm
                that you have read, understood, and agreed to abide by these
                Terms & Conditions.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

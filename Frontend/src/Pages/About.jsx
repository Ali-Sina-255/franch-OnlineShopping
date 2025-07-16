import React from "react";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Headphones,
} from "lucide-react";
import { FaPaypal } from "react-icons/fa";

import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-gradient-to-b from-indigo-50/20 to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[url('about.png')] bg-cover bg-center bg-no-repeat text-white py-20 h-[400px]">
        <div className="absolute inset-0 bg-black opacity-50 z-0" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About ChigFrip
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Your trusted destination for premium secondhand fashion at
            unbeatable prices
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        {/* Our Story */}
        <section className="mb-20">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-indigo-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-700 mb-4 text-lg">
                Founded in 2023, ChigFrip began as a small passion project to
                make sustainable fashion accessible to everyone. What started as
                a local initiative has now grown into a thriving online
                community of fashion enthusiasts.
              </p>
              <p className="text-gray-700 mb-4 text-lg">
                We believe in the circular economy - giving pre-loved items a
                second life while helping our customers discover unique pieces
                at a fraction of retail prices.
              </p>
              <p className="text-gray-700 text-lg">
                Every item in our collection is carefully curated and
                authenticated by our team of fashion experts.
              </p>
            </div>
            <div className="lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Our team"
                className="rounded-xl shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-indigo-900 mb-12 text-center">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ShieldCheck size={40} className="text-indigo-600" />,
                title: "Authenticity",
                desc: "Every item is thoroughly verified for authenticity before listing.",
              },
              {
                icon: <Truck size={40} className="text-indigo-600" />,
                title: "Fast Shipping",
                desc: "Items ship within 1-2 business days with tracking provided.",
              },
              {
                icon: <CreditCard size={40} className="text-indigo-600" />,
                title: "Secure Payments",
                desc: "Your payment information is always protected.",
              },
              {
                icon: <Headphones size={40} className="text-indigo-600" />,
                title: "24/7 Support",
                desc: "Our customer service team is always ready to help.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Methods - Focus on PayPal */}
        <section className="mb-20 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-3xl font-bold text-indigo-900 mb-8">
            Secure Payment Options
          </h2>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 flex items-center">
                <FaPaypal size={32} className="text-blue-500 mr-3" />
                PayPal Payments
              </h3>
              <p className="text-gray-700 mb-4 text-lg">
                We've integrated PayPal to provide you with the most secure and
                convenient checkout experience.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Secure encryption for all transactions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Buyer protection on all purchases</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Pay with credit card or PayPal balance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Instant payment confirmation</span>
                </li>
              </ul>
              <p className="text-gray-700 text-lg">
                Don't have a PayPal account? You can still checkout as a guest
                using your credit or debit card.
              </p>
            </div>
            <div className="lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1604591259955-dc4b81eafe44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Payment security"
                className="rounded-xl w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
              Other Payment Methods
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Credit/Debit Cards",
                  methods: ["Visa", "Mastercard", "American Express"],
                },
                {
                  title: "Bank Transfer",
                  desc: "Direct bank transfers available for wholesale orders",
                },
                {
                  title: "Cryptocurrency",
                  desc: "Coming soon in Q4 2023",
                },
              ].map((item, index) => (
                <div key={index} className="bg-indigo-50 p-6 rounded-lg">
                  <h4 className="font-medium text-lg mb-3 text-indigo-900">
                    {item.title}
                  </h4>
                  {item.methods ? (
                    <ul className="space-y-2">
                      {item.methods.map((method, i) => (
                        <li key={i} className="text-gray-700">
                          {method}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">{item.desc}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Shop Sustainably?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who've found their perfect style
            with ChigFrip
          </p>
          <Link
            to="/"
            className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Shopping Now
          </Link>
        </section>
      </div>
    </div>
  );
};

export default About;

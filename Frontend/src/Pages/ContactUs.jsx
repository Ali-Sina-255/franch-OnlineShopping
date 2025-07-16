import React from "react";
import { MapPin, Mail, Phone, Clock, MessageSquare } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="bg-gradient-to-b from-indigo-50/20 to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            We're here to help! Reach out to our team for any questions or
            concerns.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-8">
              Get in Touch
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <MapPin className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Our Location</h3>
                  <p className="text-gray-600">
                    123 Fashion Avenue, Suite 456
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Mail className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Us</h3>
                  <p className="text-gray-600">
                    <a
                      href="mailto:info@chigfrip.com"
                      className="hover:text-indigo-600 transition-colors"
                    >
                      info@chigfrip.com
                    </a>
                    <br />
                    <a
                      href="mailto:support@chigfrip.com"
                      className="hover:text-indigo-600 transition-colors"
                    >
                      support@chigfrip.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Phone className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Call Us</h3>
                  <p className="text-gray-600">
                    <a
                      href="tel:+18005551234"
                      className="hover:text-indigo-600 transition-colors"
                    >
                      +1 (800) 555-1234
                    </a>
                    <br />
                    Mon-Fri: 9am-6pm EST
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Clock className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Business Hours
                  </h3>
                  <p className="text-gray-600">
                    Monday-Friday: 9:00 AM - 6:00 PM
                    <br />
                    Saturday: 10:00 AM - 4:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-8">
              Send Us a Message
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  required
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                question: "How long does shipping take?",
                answer:
                  "Standard shipping takes 3-5 business days. Express options are available at checkout.",
              },
              {
                question: "What is your return policy?",
                answer:
                  "We offer 30-day returns for unused items with original tags. Final sale items are non-returnable.",
              },
              {
                question: "How do I track my order?",
                answer:
                  "You'll receive a tracking number via email once your order ships. You can also check in your account dashboard.",
              },
              {
                question: "Do you offer international shipping?",
                answer:
                  "Yes! We ship to over 50 countries worldwide. Shipping costs vary by destination.",
              },
            ].map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Chat CTA */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-8 text-center text-white">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="bg-white/20 p-4 rounded-full">
              <MessageSquare size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Need Immediate Help?</h2>
              <p className="text-lg mb-4 max-w-2xl">
                Our customer support team is available via live chat from
                9am-6pm EST.
              </p>
              <button className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                Start Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

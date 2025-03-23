"use client";
import React from "react";
import Footer from "../Components/Footer";
import { useRouter } from "next/navigation";
import {
  LogIn,
  LogOut,
  Notebook,
  Phone,
  Projector,
  Mail,
  MapPin,
  Clock,
  Globe,
  MessageSquare,
  User2,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      toast("Logout Successful");
      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast("Error while Logout");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
    // Reset form here if needed
  };

  return (
    <>
      {session?.user.role === "freelancer" ? (
        <header className="fixed w-full bg-[#111] text-gray-400 flex justify-between items-center py-4 px-6 shadow-md z-50">
          <div
            className="text-4xl font-extrabold text-white cursor-pointer"
            onClick={() => router.replace("/")}
          >
            Ski↑↑<span className="text-blue-500">Pay</span>
          </div>
          <nav className="flex space-x-6">
            {[
              {
                href: "/internships",
                icon: <Projector className="w-6 h-6 text-white" />,
                label: "Internships",
              },
              {
                href: "/about",
                icon: <Notebook className="w-6 h-6 text-white" />,
                label: "About",
              },
              {
                href: "/contactUs",
                icon: <Phone className="w-6 h-6 text-white" />,
                label: "Contact Us",
              },
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => router.push(item.href)}
                className="relative group cursor-pointer"
                aria-label={item.label}
              >
                <div className="flex items-center justify-center relative">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 group-hover:bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg group-hover:scale-110">
                    {item.icon}
                  </div>
                  <p className="absolute top-full mt-1 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:translate-y-1 shadow-md">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
            {/* Login / Logout Button */}
            {session ? (
              <div
                onClick={handleLogout}
                className="relative group flex items-center cursor-pointer justify-center"
                aria-label="Logout"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 group-hover:bg-gradient-to-r from-red-500 to-pink-500 shadow-lg group-hover:scale-110">
                  <LogOut className="w-6 h-6 text-white" />
                </div>
                <p className="absolute top-full mt-1 px-3 py-1 bg-red-500 text-white rounded-lg text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:translate-y-1 shadow-md">
                  Logout
                </p>
              </div>
            ) : (
              <div
                onClick={() => router.push("/signIn")}
                className="relative group flex items-center justify-center cursor-pointer"
                aria-label="Login"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 group-hover:bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg group-hover:scale-110">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <p className="absolute top-full mt-1 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:translate-y-1 shadow-md">
                  Login
                </p>
              </div>
            )}
          </nav>
        </header>
      ) : (
        <header className="fixed w-full bg-[#111] text-gray-400 flex justify-between items-center py-4 px-6 shadow-md z-50">
          <div
            className="text-4xl font-extrabold text-white cursor-pointer"
            onClick={() => router.push("/")}
          >
            Ski↑↑<span className="text-blue-500">Pay</span>
          </div>
          <nav className="flex space-x-6">
            {[
              {
                href: "/addProject",
                icon: <Projector className="w-6 h-6 text-white" />,
                label: "Add Project",
              },
              {
                href: "/freelancers",
                icon: <User2 className="w-6 h-6 text-white" />,
                label: "Freelancers",
              },
              {
                href: "/about",
                icon: <Notebook className="w-6 h-6 text-white" />,
                label: "About",
              },
              {
                href: "/contactUs",
                icon: <Phone className="w-6 h-6 text-white" />,
                label: "Contact Us",
              },
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => router.push(item.href)}
                className="relative group cursor-pointer"
                aria-label={item.label}
              >
                <div className="flex items-center justify-center relative">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 group-hover:bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg group-hover:scale-110">
                    {item.icon}
                  </div>
                  <p className="absolute top-full mt-1 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:translate-y-1 shadow-md">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
            {/* Login / Logout Button */}
            {session ? (
              <div
                onClick={handleLogout}
                className="relative group flex items-center cursor-pointer justify-center"
                aria-label="Logout"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 group-hover:bg-gradient-to-r from-red-500 to-pink-500 shadow-lg group-hover:scale-110">
                  <LogOut className="w-6 h-6 text-white" />
                </div>
                <p className="absolute top-full mt-1 px-3 py-1 bg-red-500 text-white rounded-lg text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:translate-y-1 shadow-md">
                  Logout
                </p>
              </div>
            ) : (
              <div
                onClick={() => router.push("/signIn")}
                className="relative group flex items-center justify-center cursor-pointer"
                aria-label="Login"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 group-hover:bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg group-hover:scale-110">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <p className="absolute top-full mt-1 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:translate-y-1 shadow-md">
                  Login
                </p>
              </div>
            )}
          </nav>
        </header>
      )}

      {/* Hero Section with Background Image */}
      <div className="relative pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/400')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <section className="text-center mb-16">
            <h1 className="text-6xl font-bold text-white mb-4">Get In Touch</h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
            <p className="mt-6 text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Have questions about our internships or payment programs? Our
              support team is here to help you every step of the way.
            </p>
          </section>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {/* Contact Form and Info Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <section className="bg-white py-8 px-8 rounded-xl shadow-xl">
            <div className="flex items-center mb-6">
              <MessageSquare className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-800">
                Send Us a Message
              </h2>
            </div>
            <div className="w-16 h-1 bg-blue-500 mb-8"></div>
            <p className="text-gray-600 mb-8">
              Fill out the form below, and our team will get back to you within
              24 hours.
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500 transition"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-700">
                    Your Email
                  </label>
                  <input
                    type="email"
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500 transition"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500 transition"
                  placeholder="What is this regarding?"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700">
                  Message
                </label>
                <textarea
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500 transition"
                  rows="6"
                  placeholder="Tell us how we can help you"
                  required
                ></textarea>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="privacy"
                  className="mr-2 h-5 w-5 text-blue-600"
                  required
                />
                <label htmlFor="privacy" className="text-gray-600">
                  I agree to the privacy policy and terms of service
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg flex items-center justify-center"
              >
                <Mail className="mr-2 h-5 w-5" />
                Send Message
              </button>
            </form>
          </section>

          {/* Contact Information */}
          <section className="flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Contact Information
              </h2>
              <div className="w-16 h-1 bg-blue-500 mb-8"></div>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We're here to provide you with more information, answer any
                questions you may have, and create an effective solution for
                your internship and payment needs.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Our Location
                    </h3>
                    <p className="mt-2 text-gray-600">
                      123 Skill Street, Learning City, SK 56789
                      <br />
                      Tech Innovation Hub, Floor 8
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Phone Number
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Main: +1 (123) 456-7890
                      <br />
                      Support: +1 (123) 456-7891
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Email Address
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Support: support@skillpay.com
                      <br />
                      Partnerships: partners@skillpay.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Working Hours
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Monday-Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 2:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Connect With Us
              </h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <svg
                    className="w-6 h-6 text-pink-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <svg
                    className="w-6 h-6 text-blue-700"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Map Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Our Location
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visit our office at the Tech Innovation Hub. We're conveniently
              located in the heart of Learning City.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-xl h-96 relative">
            <div className="absolute inset-0 bg-blue-100 flex items-center justify-center">
              <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  SkillPay Headquarters
                </h3>
                <p className="text-gray-600">
                  123 Skill Street, Learning City, SK 56789
                  <br />
                  Tech Innovation Hub, Floor 8
                </p>
                <div className="mt-4 p-2 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Public Transport:</strong> Bus lines 42, 58, and 67
                    <br />
                    <strong>Parking:</strong> Available on-site
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our services and
              support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: "How quickly will I receive a response?",
                answer:
                  "Our team typically responds to all inquiries within 24 business hours. For urgent matters, we recommend calling our support line directly.",
              },
              {
                question: "Do you offer international support?",
                answer:
                  "Yes, we provide support to users worldwide. Our team is available across multiple time zones to ensure prompt assistance regardless of your location.",
              },
              {
                question: "Can I schedule a video consultation?",
                answer:
                  "Absolutely! You can request a video consultation through our contact form. Our team will reach out to schedule a convenient time for you.",
              },
              {
                question: "What information should I include in my message?",
                answer:
                  "For the fastest resolution, please include your account details (if applicable), a clear description of your question or issue, and any relevant screenshots or documentation.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Meet Our Support Team
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our dedicated team is committed to providing you with exceptional
              service and support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Customer Support Lead",
                shortName: "SJ",
                description:
                  "With over 8 years of experience in technical support, Sarah leads our customer service team with expertise and compassion.",
              },
              {
                name: "Michael Chen",
                role: "Technical Support Specialist",
                shortName: "MC",
                description:
                  "Michael specializes in solving complex technical issues and ensuring smooth user experiences across all our platforms.",
              },
              {
                name: "Olivia Rodriguez",
                role: "Account Manager",
                shortName: "OR",
                description:
                  "Olivia works directly with our enterprise clients to ensure their needs are met and their experience with SkillPay is exceptional.",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                    <div className="flex justify-center items-center font-extrabold text-3xl w-28 h-28 rounded-full bg-gray-200 text-center">
                      {member.shortName}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl overflow-hidden shadow-xl mb-20">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Stay Updated
              </h2>
              <p className="text-blue-100 mb-8 text-lg">
                Subscribe to our newsletter for the latest updates on
                internships, payment solutions, and educational resources.
              </p>
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 rounded-lg flex-grow focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors shadow-md"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-blue-200 text-sm mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
            <div className="hidden md:block h-full">
              <div className="h-full w-full bg-blue-900 flex items-center justify-center p-12">
                <Globe className="w-48 h-48 text-white opacity-20" />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Whether you're a student looking for internships or a business
            seeking payment solutions, we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/internships")}
              className="bg-blue-600 cursor-pointer text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center"
            >
              <Projector className="mr-2 h-5 w-5" />
              Browse Internships
            </button>
            <button
              onClick={() => router.push("/about")}
              className="bg-indigo-600 cursor-pointer text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg flex items-center justify-center"
            >
              <Notebook className="mr-2 h-5 w-5" />
              Learn More
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Page;

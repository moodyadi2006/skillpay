import Image from "next/image";
import Footer from "./(app)/Components/Footer";
import Header from "./(app)/Components/Header";
import Link from "next/link";
import { ArrowRight, Check, Globe, Shield, Award, Users } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* Hero Section with enhanced gradient and animation */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
          {/* Abstract shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute w-96 h-96 rounded-full bg-blue-400 -top-20 -left-20 blur-3xl"></div>
            <div className="absolute w-96 h-96 rounded-full bg-indigo-400 bottom-0 right-0 blur-3xl"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full font-medium text-sm mb-4">
                  Freelance Marketplace
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-800 leading-tight">
                  Find the <span className="text-blue-600">Perfect</span>{" "}
                  Freelancer for Your Project
                </h1>
                <p className="text-xl mb-8 text-gray-600 leading-relaxed">
                  Connect with skilled professionals worldwide and get your
                  projects done with confidence and peace of mind.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/signUpEmployer"
                    className="group px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
                  >
                    Hire a Freelancer
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition" />
                  </Link>
                  <Link
                    href="/signUpFreelancer"
                    className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition flex items-center justify-center"
                  >
                    Find Work
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                {/* Decorative elements */}
                <div className="absolute w-full h-full -top-4 -left-4 border-2 border-blue-200 rounded-lg opacity-50"></div>
                <div className="absolute w-full h-full -bottom-4 -right-4 border-2 border-indigo-200 rounded-lg opacity-50"></div>

                <div className="relative rounded-lg shadow-2xl overflow-hidden bg-white">
                  <Image
                    src="/assets/payment.png"
                    alt="Freelancers working"
                    width={600}
                    height={400}
                    className="rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                    <div className="flex items-center text-sm">
                      <span className="bg-green-500 rounded-full w-2 h-2 mr-2"></span>
                      <span>10,000+ Active Projects</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating stats banner */}
        <section className="relative z-20 mx-auto max-w-5xl px-6 -mt-8">
          <div className="bg-white rounded-xl shadow-xl grid grid-cols-2 md:grid-cols-4 py-6 px-8">
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-blue-600">15k+</p>
              <p className="text-gray-600">Freelancers</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-blue-600">95%</p>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-blue-600">50k+</p>
              <p className="text-gray-600">Projects</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-blue-600">24/7</p>
              <p className="text-gray-600">Support</p>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <span className="text-blue-600 font-medium">WHY CHOOSE US</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-800">
                Features Built for Success
              </h2>
              <p className="mt-4 text-gray-600">
                Our platform is designed with features that ensure secure
                collaboration and successful project completion.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {/* Milestone Payments Feature */}
              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition group hover:-translate-y-2 duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors">
                  Milestone-Based Payments
                </h3>
                <p className="text-gray-600">
                  Break projects into milestones and release payments only when
                  you're satisfied with the completed work.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">
                      Escrow protection for both parties
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">
                      Clear payment structure
                    </span>
                  </li>
                </ul>
              </div>

              {/* Dispute Resolution Feature */}
              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition group hover:-translate-y-2 duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-green-600 transition-colors">
                  Dispute Resolution Agent
                </h3>
                <p className="text-gray-600">
                  Our expert mediation team helps resolve any issues between
                  clients and freelancers fairly and quickly.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">
                      Fair and impartial mediation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">
                      Quick resolution process
                    </span>
                  </li>
                </ul>
              </div>

              {/* Secure Payments Feature */}
              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition group hover:-translate-y-2 duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-purple-600 transition-colors">
                  Safe & Trusted Payments
                </h3>
                <p className="text-gray-600">
                  Securely process payments with encryption and fraud protection
                  for complete peace of mind.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">
                      Bank-level security
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">
                      Multiple payment methods
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50 relative overflow-hidden">
          <div className="absolute h-full w-1 bg-blue-200 left-1/2 transform -translate-x-1/2 top-0 z-0 md:block hidden"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <span className="text-blue-600 font-medium">THE PROCESS</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-800">
                How It Works
              </h2>
              <p className="mt-4 text-gray-600">
                Our streamlined process makes it easy to find talent and get
                work done.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center relative">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold z-10 relative shadow-lg">
                  1
                </div>
                <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition">
                  <h3 className="font-bold text-lg mb-3">Post a Project</h3>
                  <p className="text-gray-600">
                    Describe your project requirements and budget clearly
                  </p>
                </div>
              </div>

              <div className="text-center relative">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold z-10 relative shadow-lg">
                  2
                </div>
                <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition">
                  <h3 className="font-bold text-lg mb-3">Review Proposals</h3>
                  <p className="text-gray-600">
                    Compare proposals from skilled freelancers worldwide
                  </p>
                </div>
              </div>

              <div className="text-center relative">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold z-10 relative shadow-lg">
                  3
                </div>
                <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition">
                  <h3 className="font-bold text-lg mb-3">Collaborate</h3>
                  <p className="text-gray-600">
                    Work together through our secure collaboration tools
                  </p>
                </div>
              </div>

              <div className="text-center relative">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold z-10 relative shadow-lg">
                  4
                </div>
                <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition">
                  <h3 className="font-bold text-lg mb-3">Pay Securely</h3>
                  <p className="text-gray-600">
                    Release payments for completed milestones with confidence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <span className="text-blue-600 font-medium">
                BROWSE CATEGORIES
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-800">
                Explore Popular Skills
              </h2>
              <p className="mt-4 text-gray-600">
                Find skilled professionals across a wide range of categories.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl hover:shadow-md transition text-center border border-gray-100 group hover:border-blue-200">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-white text-blue-600 rounded-lg shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2 text-lg">Web Development</h3>
                <p className="text-sm text-blue-600 font-medium">
                  1,234 Freelancers
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl hover:shadow-md transition text-center border border-gray-100 group hover:border-purple-200">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-white text-purple-600 rounded-lg shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2 text-lg">Design & Creative</h3>
                <p className="text-sm text-purple-600 font-medium">
                  987 Freelancers
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl hover:shadow-md transition text-center border border-gray-100 group hover:border-green-200">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-white text-green-600 rounded-lg shadow-sm group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2 text-lg">Content Writing</h3>
                <p className="text-sm text-green-600 font-medium">
                  756 Freelancers
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl hover:shadow-md transition text-center border border-gray-100 group hover:border-orange-200">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-white text-orange-600 rounded-lg shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2 text-lg">Digital Marketing</h3>
                <p className="text-sm text-orange-600 font-medium">
                  543 Freelancers
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-xl hover:shadow-md transition text-center border border-gray-100 group hover:border-red-200">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-white text-red-600 rounded-lg shadow-sm group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2 text-lg">Mobile Apps</h3>
                <p className="text-sm text-red-600 font-medium">
                  432 Freelancers
                </p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-sky-50 p-6 rounded-xl hover:shadow-md transition text-center border border-gray-100 group hover:border-cyan-200">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-white text-cyan-600 rounded-lg shadow-sm group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2 text-lg">Video & Animation</h3>
                <p className="text-sm text-cyan-600 font-medium">
                  321 Freelancers
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-6 rounded-xl hover:shadow-md transition text-center border border-gray-100 group hover:border-indigo-200">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-white text-indigo-600 rounded-lg shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2 text-lg">Data Entry</h3>
                <p className="text-sm text-indigo-600 font-medium">
                  210 Freelancers
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl hover:shadow-md transition text-center border border-gray-100 group hover:border-blue-200">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-white text-blue-600 rounded-lg shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2 text-lg">View All Categories</h3>
                <p className="text-sm text-blue-600 font-medium">
                  10,000+ Freelancers
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <span className="text-blue-600 font-medium">TESTIMONIALS</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-800">
                What Our Users Say
              </h2>
              <p className="mt-4 text-gray-600">
                Read what our satisfied clients and freelancers have to say
                about their experience.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition relative">
                <div className="absolute -top-4 -right-2 text-blue-300 text-6xl opacity-20">
                &quot;
                </div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                    SJ
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Sarah Johnson</h4>
                    <p className="text-sm text-gray-600 flex items-center">
                      Project Manager
                      <span className="inline-block w-1 h-1 rounded-full bg-gray-400 mx-2"></span>
                      <span className="flex items-center text-yellow-500">
                        ★★★★★
                      </span>
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                &quot;The milestone payment system gave me complete control over my
                  project budget. I only paid for work I was satisfied with.&quot;
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition relative">
                <div className="absolute -top-4 -right-2 text-blue-300 text-6xl opacity-20">
                &quot;
                </div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl mr-4">
                    DC
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">David Chen</h4>
                    <p className="text-sm text-gray-600 flex items-center">
                      Freelance Developer
                      <span className="inline-block w-1 h-1 rounded-full bg-gray-400 mx-2"></span>
                      <span className="flex items-center text-yellow-500">
                        ★★★★★
                      </span>
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                &quot;As a freelancer, I appreciate the secure payment system. I
                  know I'll get paid for my work without any hassle.&quot;
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition relative">
                <div className="absolute -top-4 -right-2 text-blue-300 text-6xl opacity-20">
                &quot;
                </div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl mr-4">
                    ER
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Emily Rodriguez</h4>
                    <p className="text-sm text-gray-600 flex items-center">
                      Small Business Owner
                      <span className="inline-block w-1 h-1 rounded-full bg-gray-400 mx-2"></span>
                      <span className="flex items-center text-yellow-500">
                        ★★★★★
                      </span>
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                &quot;When we had a misunderstanding with a freelancer, the dispute
                  resolution team stepped in and helped us reach a fair
                  solution.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
          {/* Abstract shape backgrounds */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mt-20 -mr-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -mb-20 -ml-20"></div>

          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-10 leading-relaxed opacity-90">
                Join thousands of businesses and freelancers who trust our
                platform for secure, milestone-based project collaboration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signUpEmployer"
                  className="group px-8 py-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition flex items-center justify-center shadow-lg"
                >
                  Post a Project
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>
                <Link
                  href="/signUpFreelancer"
                  className="px-8 py-4 border-2 border-white text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
                >
                  Sign Up as Freelancer
                </Link>
              </div>

              <div className="mt-12 inline-flex items-center bg-blue-800 bg-opacity-30 px-6 py-3 rounded-full">
                <Shield className="w-5 h-5 mr-2" />
                <span className="text-sm">
                  Trusted by 10,000+ businesses worldwide
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

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
  Star,
  Users,
  ShieldCheck,
  Calendar,
  CreditCard,
  Briefcase,
  Lock,
  Scale,
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

      {/* Hero Section with Background Gradient */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 pt-32 pb-20">
        <div className="container mx-auto px-4">
          <section className="text-center mb-16">
            <div className="animate-fade-in-down">
              <h1 className="text-6xl font-bold text-white mb-4">
                About Ski↑↑Pay
              </h1>
              <div className="h-1 w-24 bg-blue-500 mx-auto mb-8 rounded-full"></div>
              <p className="mt-6 text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
                SkillPay is a revolutionary platform designed to connect skilled
                professionals with individuals eager to learn and employers with
                talented freelancers. Our secure milestone-based payment system
                ensures fair compensation while our expert mediation team
                resolves any disputes for a seamless experience.
              </p>
            </div>
          </section>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16 -mt-16">
        {/* Mission & Vision Cards - with animated hover */}
        <section className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="p-8 bg-white shadow-2xl rounded-xl hover:shadow-blue-100 transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-800">
                Our Mission
              </h2>
            </div>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              At SkillPay, our mission is to create a trusted ecosystem where
              freelancers and employers collaborate with confidence. We ensure
              fair and secure transactions through a milestone-based payment
              system, guaranteeing that freelancers are paid for their work and
              employers receive the quality they expect. Our platform bridges
              the gap between talent and opportunity while promoting
              transparency and accountability.
            </p>
          </div>

          <div className="p-8 bg-white shadow-2xl rounded-xl hover:shadow-purple-100 transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-800">
                Our Vision
              </h2>
            </div>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              We envision a future where freelancers and businesses collaborate
              seamlessly without fear of non-payment or unfulfilled commitments.
              By leveraging secure milestone-based transactions and proof of
              work (POW), we ensure fairness, trust, and efficiency in the
              global freelance economy. Our goal is to empower professionals and
              businesses alike, fostering a thriving marketplace built on
              transparency and mutual success.
            </p>
          </div>
        </section>

        {/* Employer-Freelancer Section NEW */}
        <section className="mb-24 bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-6 rounded-2xl">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Connecting Employers & Freelancers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                Milestone-Based Projects
              </h3>
              <p className="text-gray-600 text-center">
                We help employers find freelancers to work with by breaking work
                into clear milestones and facilitating secure payments at each
                completed stage.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Scale className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                Expert Mediation
              </h3>
              <p className="text-gray-600 text-center">
                Our expert mediation agent &quot;Neutra&quot; helps resolve any issues
                between clients and freelancers fairly, ensuring a smooth
                working relationship for all parties.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Lock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                Secure Transactions
              </h3>
              <p className="text-gray-600 text-center">
                We securely process payments with encryption and fraud
                protection for peace of mind, protecting both freelancers and
                clients throughout the entire process.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works - with step numbers and better spacing */}
        <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16 px-6 rounded-2xl mb-24">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-2">
            How SkillPay Works
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Our platform makes it easy to connect, learn, and earn
          </p>
          <div className="grid md:grid-cols-3 gap-12 mt-10">
            <div className="p-8 bg-white shadow-xl rounded-xl text-center relative transform transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold absolute -top-6 left-1/2 transform -translate-x-1/2">
                1
              </div>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Register & Create Your Profile
              </h3>
              <p className="text-lg text-gray-600">
                Sign up as freelancer, or employer. Create a detailed profile
                showcasing your skills or requirements.
              </p>
            </div>

            <div className="p-8 bg-white shadow-xl rounded-xl text-center relative transform transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xl font-bold absolute -top-6 left-1/2 transform -translate-x-1/2">
                2
              </div>
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Book & Schedule Sessions
              </h3>
              <p className="text-lg text-gray-600">
                Employers can hire freelancers and establish milestone-based
                projects with clear deliverables.
              </p>
            </div>

            <div className="p-8 bg-white shadow-xl rounded-xl text-center relative transform transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold absolute -top-6 left-1/2 transform -translate-x-1/2">
                3
              </div>
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Learn & Earn Securely
              </h3>
              <p className="text-lg text-gray-600">
                freelancers get paid securely for completed work, while
                employers receive quality services with payment protection.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose SkillPay - card design with icons */}
        <section className="mb-24">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Why Choose Ski↑↑Pay?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-white shadow-lg rounded-xl flex items-start transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Wide Range of Skills
                </h3>
                <p className="text-lg text-gray-600">
                  From coding and design to music and business, SkillPay offers
                  a vast array of skill categories and expert freelancers.
                </p>
              </div>
            </div>

            <div className="p-8 bg-white shadow-lg rounded-xl flex items-start transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Flexible Learning & Working
                </h3>
                <p className="text-lg text-gray-600">
                  Learn at your own pace with scheduled one-on-one sessions or
                  join interactive group classes. Employers can hire freelancers
                  for custom project timelines.
                </p>
              </div>
            </div>

            <div className="p-8 bg-white shadow-lg rounded-xl flex items-start transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Secure Milestone Payments
                </h3>
                <p className="text-lg text-gray-600">
                  Our secure payment system with milestone-based releases
                  ensures that instructors and freelancers receive their
                  earnings promptly while clients maintain payment control.
                </p>
              </div>
            </div>

            <div className="p-8 bg-white shadow-lg rounded-xl flex items-start transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Scale className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Mediation & Support
                </h3>
                <p className="text-lg text-gray-600">
                  Get access to an engaging community with round-the-clock
                  support. Our expert mediation team helps resolve any issues
                  between all parties fairly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials - with avatars and card design */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 px-6 rounded-2xl mb-24">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white shadow-lg rounded-xl relative transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gray-200 border-4 border-white overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
                  AJ
                </div>
              </div>
              <div className="pt-8 mt-2">
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-lg text-gray-600 italic text-center mb-4">
                  &quot;SkillPay helped me turn my passion for teaching into a source
                  of income. The milestone payments keep everything
                  transparent!&quot;
                </p>
                <h4 className="text-xl font-semibold text-center text-gray-800">
                  Alex J.
                </h4>
                <p className="text-sm text-center text-gray-500">
                  Web Developer
                </p>
              </div>
            </div>

            <div className="p-8 bg-white shadow-lg rounded-xl relative transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gray-200 border-4 border-white overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                  PM
                </div>
              </div>
              <div className="pt-8 mt-2">
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-lg text-gray-600 italic text-center mb-4">
                &quot;I found an amazing coding instructor on SkillPay. The
                  sessions were interactive and their mediation team is super
                  helpful!&quot;
                </p>
                <h4 className="text-xl font-semibold text-center text-gray-800">
                  Priya M.
                </h4>
                <p className="text-sm text-center text-gray-500">Student</p>
              </div>
            </div>

            <div className="p-8 bg-white shadow-lg rounded-xl relative transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gray-200 border-4 border-white overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold">
                  DR
                </div>
              </div>
              <div className="pt-8 mt-2">
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-lg text-gray-600 italic text-center mb-4">
                &quot;As an employer, I&apos;ve found amazing talent through SkillPay.
                  The secure milestone payment system gives me complete peace of
                  mind.&quot;
                </p>
                <h4 className="text-xl font-semibold text-center text-gray-800">
                  Daniel R.
                </h4>
                <p className="text-sm text-center text-gray-500">
                  Business Owner
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section with gradient button */}
        <section className="text-center mb-16 bg-white py-16 px-8 rounded-2xl shadow-xl">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Join Ski↑↑Pay Today
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Whether you&apos;re looking to teach, learn, find talent, or showcase
            your skills, SkillPay offers a unique opportunity to grow and earn.
            Sign up today and become part of a thriving community with secure
            payments and expert support.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/signIn")}
              className="px-8 py-4 bg-gradient-to-r cursor-pointer from-blue-500 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              Get Started Now
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Page;

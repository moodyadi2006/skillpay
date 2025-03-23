"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Footer from "../../Components/Footer";
import {
  LogIn,
  LogOut,
  CheckCircle,
  XCircle,
  MessageSquare,
  DollarSign,
  Clock,
  BarChart,
  ChevronRight,
  Notebook,
  Phone,
  Projector,
  User2,
} from "lucide-react";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationsModalOpen, setNotificationsModelOpen] = useState(false);
  const [resumeList, setResumeList] = useState([]);
  const [workReviews, setWorkReviews] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [amount, setAmount] = useState(0);
  const [feedback, setFeedback] = useState("");

  const fetchPaymentStatus = async (orderId, paymentAmount, freelancerId) => {
    try {
      await axios.patch("/api/updateEscrowAccount", {
        email: session.user.email,
        recipentId: freelancerId,
        amount: paymentAmount,
        orderId: orderId,
      });
      toast.success(
        "Payment has been successfully made by the Employer to Freelancer"
      );
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while processing the payment."
      );
    }
  };

  useEffect(() => {
    const fetchEscrows = async () => {
      try {
        if (activeTab === "reviews") {
          // Extract jobIds from projects array
          const projectIds = projects.map((project) => project._id).join(",");

          const response = await axios.get(
            `/api/fetchEscrows?jobIds=${encodeURIComponent(projectIds)}`
          );
          setWorkReviews(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching escrows:", error);
      }
    };

    fetchEscrows();
  }, [activeTab, projects, amount]);
  // Sample data for demonstration
  useEffect(() => {
    const fetchProjects = async () => {
      if (!session?.user?.email) return; // Ensure email exists

      try {
        const response = await axios.get(
          `/api/jobPosts?email=${encodeURIComponent(session.user.email)}`
        );
        setProjects(response.data.data);
      } catch (error) {
        console.error("Error fetching job posts:", error);
      }
    };

    fetchProjects();
  }, [session?.user?.email]); // Ensure it runs when email is available

  useEffect(() => {
    const fetchFreelancerProfile = async () => {
      if (notifications.length === 0) return; // Prevent unnecessary requests

      try {
        const response = await axios.get(
          `/api/fetchResume?resume=${encodeURIComponent(notifications.join(","))}`
        );
        setResumeList(response.data.data);
      } catch (error) {
        console.error("Error fetching resumes:", error);
      }
    };

    fetchFreelancerProfile();
  }, [projects, notifications]);

  const handleAccept = async (resume) => {
    await axios.patch(
      "/api/updateJob",
      { resume },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    setNotificationsModelOpen(false);
  };

  const handleReject = async (resume) => {
    await axios.patch(
      "/api/removeResume",
      { resume },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    setNotificationsModelOpen(false);
  };

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

  const handleApproveWork = async (reviewId) => {
    console.log(reviewId)
    try {
      const response = await axios.patch(
        "/api/escrow/approve",
        { reviewId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        toast.success("Work approved successfully");
        const paymentAmount = response.data.data.totalAmount;
        const freelancerId = response.data.data.freelancerId;
        setAmount(paymentAmount);
        // Pass the amount directly to handlePayment
        await handlePayment(paymentAmount, freelancerId);
      } else {
        toast.error("Failed to approve work. Please try again.");
      }
    } catch (error) {
      console.error("Error approving work:", error);
      toast.error("An error occurred while approving the work.");
    }
  };

  // Separate function for loading Razorpay script
  const loadScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    });
  };

  // Separate function for handling payment
  const handlePayment = async (paymentAmount, freelancerId) => {
    if (!session) {
      toast.error("Please Login first...");
      return;
    }

    try {
      const response = await axios.post("/api/checkout", {
        amount: paymentAmount,
      });
      const order = response.data.message;
      await loadScript();

      const finalOrderObject = {
        key: process.env.RAZORPAY_PUBLIC_KEY,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        handler: function (response) {
          const options2 = {
            razorpayPaymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          axios.post("/api/verifyPayment", options2).then((res) => {
            if (res.data.isOk) {
              toast.success("Payment Successful");
              fetchPaymentStatus(order.id, paymentAmount, freelancerId);
            }
          });
        },
      };

      const rzp1 = new window.Razorpay(finalOrderObject);
      rzp1.open();

      rzp1.on("payment.failed", function (response) {
        console.error(response.error.code);
        console.error(response.error.description);
        console.error(response.error.source);
        console.error(response.error.step);
        console.error(response.error.reason);
        console.error(response.error.metadata.order_id);
        console.error(response.error.metadata.payment_id);
        toast.error("Payment failed. Please try again.");
      });
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("An error occurred while processing payment.");
    }
  };

  const handleRejectWork = async (reviewId) => {
    try {
      const response = await axios.patch(
        "/api/escrow/reject",
        { reviewId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        toast.success("Work rejected successfully");
      } else {
        toast.error("Failed to rejected work. Please try again.");
      }
    } catch (error) {
      console.error("Error rejecting work:", error);
      toast.error("An error occurred while rejecting the work.");
    }
  };

  const handleSendFeedback = async (reviewId) => {
    try {
      if (!feedback.trim()) {
        toast.error("Feedback cannot be empty");
        return;
      }
      const response = await axios.patch(
        "/api/escrow/sendMessage",
        { reviewId, feedback },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        setFeedback("");
        toast.success("Work approved successfully");
      } else {
        toast.error("Failed to approve work. Please try again.");
      }
    } catch (error) {
      console.error("Error approving work:", error);
      toast.error("An error occurred while approving the work.");
    }
  };

  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-500 flex justify-center items-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your payment has been successfully transferred to freelancer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
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

      <main className="pt-24 pb-16 px-6 min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Employer Dashboard
          </h1>

          {/* Dashboard Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="flex border-b">
              {[
                {
                  id: "overview",
                  label: "Overview",
                  icon: <BarChart className="w-5 h-5 mr-2" />,
                },
                {
                  id: "mileStones",
                  label: "Payment Milestones",
                  icon: <DollarSign className="w-5 h-5 mr-2" />,
                },
                {
                  id: "reviews",
                  label: "Work Reviews",
                  icon: <CheckCircle className="w-5 h-5 mr-2" />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 font-medium ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Current Projects
                </h2>
                {projects.map((project) => (
                  <div key={project._id} className="mb-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="p-4 bg-white shadow-lg rounded-lg">
                        <h3 className="font-semibold text-xl text-gray-800">
                          {project.title}
                        </h3>

                        <p className="text-gray-600 mt-2">
                          <span className="font-medium">Freelancer:</span>{" "}
                          {project.freelancer?.fullName ||
                            project.mileStones?.find(
                              (milestone) => milestone.freelancer
                            )?.freelancer?.fullName ||
                            "Not Assigned"}
                        </p>
                      </div>

                      <div className="flex gap-1">
                        <Link
                          href={`/project/${project._id}`}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {project.status === "in-progress"
                            ? "In Progress"
                            : project.status}
                        </Link>
                        {project.freelancersResume &&
                          project.freelancersResume.length > 0 && (
                            <button
                              onClick={() => {
                                setNotificationsModelOpen(true);
                                setNotifications(project.freelancersResume);
                              }}
                              className="bg-blue-100 cursor-pointer hover:bg-blue-400 hover:text-white text-red-500 px-3 py-1 rounded-full text-sm"
                            >
                              {project.freelancersResume.length}
                            </button>
                          )}
                      </div>
                    </div>

                    {notificationsModalOpen && resumeList.length > 0 && (
                      <div className="fixed inset-0 z-10 bg-opacity-20 backdrop-blur-sm flex justify-center items-center p-4">
                        <div className="bg-white p-6 rounded-lg w-3/4 max-w-3xl shadow-lg">
                          <h2 className="text-2xl font-bold mb-4 text-center">
                            Freelancer Resumes
                          </h2>

                          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                            {resumeList.map((resume, index) => (
                              <div
                                key={index}
                                className="border border-gray-300 rounded-lg p-4 shadow-sm bg-gray-50"
                              >
                                {/* Resume Header */}
                                <div className="text-lg font-semibold text-blue-600">
                                  {resume.fullName}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {resume.email}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {resume.phoneNumber}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4 text-gray-700">
                                  <div>
                                    <p className="font-medium">
                                      Career Objective:
                                    </p>
                                    <p>{resume.careerObjective || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Job ID:</p>
                                    <p>{resume.jobId || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Education:</p>
                                    <p>
                                      {resume.education.length
                                        ? resume.education.join(", ")
                                        : "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Skills:</p>
                                    <p>
                                      {resume.skills.length
                                        ? resume.skills.join(", ")
                                        : "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      Work Experience:
                                    </p>
                                    <p>
                                      {resume.workExperience.length
                                        ? resume.workExperience.join(", ")
                                        : "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Projects:</p>
                                    <p>
                                      {resume.projects.length
                                        ? resume.projects.join(", ")
                                        : "N/A"}
                                    </p>
                                  </div>
                                </div>

                                {/* Accept & Reject Buttons */}
                                <div className="mt-6 flex justify-end space-x-4">
                                  <button
                                    onClick={() => handleAccept(resume)}
                                    className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleReject(resume)}
                                    className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Close Button */}
                          <div className="mt-4 text-center">
                            <button
                              onClick={() => setNotificationsModelOpen(false)}
                              className="text-gray-500 cursor-pointer hover:text-gray-700"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Completion</span>
                        <span>
                          {project.mileStones && project.mileStones.length > 0
                            ? project.mileStones
                                .filter(
                                  (milestone) =>
                                    milestone.status === "completed"
                                )
                                .reduce(
                                  (total, milestone) =>
                                    total + (milestone.workCompletion || 0),
                                  0
                                )
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${
                              project.mileStones &&
                              project.mileStones.length > 0
                                ? project.mileStones
                                    .filter(
                                      (milestone) =>
                                        milestone.status === "completed"
                                    )
                                    .reduce(
                                      (total, milestone) =>
                                        total + (milestone.workCompletion || 0),
                                      0
                                    )
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Link
                        href={`/viewMileStones/${project._id}`}
                        className="text-blue-600 hover:underline hover:text-blue-800 text-sm flex items-center"
                      >
                        View Milestones
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Pending Reviews
                </h2>
                {projects.length > 0 ? (
                  projects.map((project) =>
                    project.mileStones
                      ?.filter((milestone) => milestone.status === "in-review")
                      .map((milestone) => (
                        <div
                          key={milestone._id}
                          className="mb-4 p-4 border rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">
                                {project.companyName}
                              </h3>
                              <p className="text-gray-500">
                                Milestone: {milestone.task}
                              </p>
                              <p className="text-gray-500">
                                Freelancer:{" "}
                                {milestone.freelancer?.fullName || "Unknown"}
                              </p>
                              <p className="text-gray-500 text-sm">
                                Amount: ₹{milestone.amount}
                              </p>
                            </div>
                            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                              Awaiting Review
                            </div>
                          </div>
                          <div className="mt-3">
                            <button
                              onClick={() => {
                                setActiveTab("reviews");
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                              Review Submission
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                          </div>
                        </div>
                      ))
                  )
                ) : (
                  <p className="text-gray-500">
                    No pending reviews at the moment.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Payment Milestones Tab Content */}
          {activeTab === "mileStones" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Payment Milestones
              </h2>

              {projects.map((project) => (
                <div
                  key={project._id}
                  className="mb-8 border-b pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Milestone
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Work Completion
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {project.mileStones.map((milestone) => (
                          <tr key={milestone._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {milestone.task}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{milestone.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {milestone.workCompletion}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  milestone.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : milestone.status === "in-review"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {milestone.status === "completed"
                                  ? "Completed"
                                  : milestone.status === "in-review"
                                    ? "In Review"
                                    : "Pending"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Work Reviews Tab Content */}
          {activeTab === "reviews" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Work Reviews
              </h2>

              {workReviews.length > 0 ? (
                workReviews.map((review) => (
                  <div key={review._id} className="border rounded-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                      <div>
                        <h3 className="font-medium text-lg">
                          Job ID: {review.jobId}
                        </h3>
                        <p className="text-gray-500">
                          Description: {review.description}
                        </p>
                        <p className="text-gray-500">
                          Modifications: {review.modifications}
                        </p>
                        <p className="text-gray-500">
                          GitHub Repo:
                          <a
                            href={review.githubRepoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {review.githubRepoLink}
                          </a>
                        </p>
                        <p className="text-gray-500">
                          Video Demo:
                          <a
                            href={review.videoDemoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {review.videoDemoLink}
                          </a>
                        </p>
                      </div>
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-1 h-min rounded-full text-sm">
                        Awaiting Review
                      </div>
                    </div>

                    {/* Display Uploaded Image */}
                    {review.uploadImageFile &&
                      review.uploadImageFile instanceof Blob && (
                        <div className="mb-6">
                          <h4 className="font-medium mb-2">Uploaded Image:</h4>
                          <img
                            src={URL.createObjectURL(review.uploadImageFile)}
                            alt={review.uploadImageFile.name}
                            className="w-48 h-auto border rounded-lg"
                          />
                        </div>
                      )}

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-4">Provide Feedback:</h4>
                      <textarea
                        className="w-full border rounded-md p-3 text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Enter your feedback or revision requests here..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                      ></textarea>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleApproveWork(review._id)}
                          className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out flex items-center"
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Approve Work
                        </button>

                        <button
                          onClick={() => handleRejectWork(review._id)}
                          className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out flex items-center"
                        >
                          <XCircle className="w-5 h-5 mr-2" />
                          Reject Work
                        </button>

                        <button
                          onClick={() => handleSendFeedback(review._id)}
                          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out flex items-center"
                        >
                          <MessageSquare className="w-5 h-5 mr-2" />
                          Request Revisions
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                    No Pending Reviews
                  </h3>
                  <p className="text-gray-500">
                    You don&apos;t have any work submissions to review at the
                    moment.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Page;

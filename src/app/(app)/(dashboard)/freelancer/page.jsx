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
  MessageSquare,
  DollarSign,
  BarChart,
  ChevronRight,
  Notebook,
  Phone,
  Projector,
} from "lucide-react";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [milestone, setMilestone] = useState({});

  // Sample data for demonstration
  useEffect(() => {
    const fetchMultiples = async () => {
      try {
        // Fetch Projects
        const projectsResponse = await axios.get(
          `/api/fetchProjects?email=${encodeURIComponent(session.user.email)}`
        );

        // Fetch Pending Reviews
        const reviewsResponse = await axios.get(
          `/api/fetchEscrowPendingReviews?email=${encodeURIComponent(session.user.email)}`
        );

        // Merge responses or update separate states
        setProjects(projectsResponse?.data.data);
        setReviews(reviewsResponse?.data.data); // Assuming you need a separate state for reviews
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    };

    fetchMultiples();
  }, [session?.user?.email]);

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

  const [formData, setFormData] = useState({
    description: "",
    githubRepoLink: "",
    modifications: "",
    uploadImage: null, // Should be null instead of an empty string
    videoDemoLink: "",
    milestone: {},
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image selection (for a single image)
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    setFormData({ ...formData, uploadImage: file });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!milestone || Object.keys(milestone).length === 0) {
      toast.error("Please wait until milestone is being set...");
    }

    const data = new FormData();
    data.append("description", formData.description);
    data.append("githubRepoLink", formData.githubRepoLink);
    data.append("modifications", formData.modifications);
    data.append("videoDemoLink", formData.videoDemoLink);

    if (formData.uploadImage) {
      data.append("uploadImage", formData.uploadImage);
    }
    data.append("milestone", JSON.stringify(milestone));

    try {
      await axios.post("/api/escrow/submitWork", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Work submitted!");
      setIsOpen(false);
      setFormData({
        description: "",
        githubRepoLink: "",
        modifications: "",
        uploadImage: null,
        videoDemoLink: "",
        milestone: {},
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.error);
    }
  };

  return (
    <>
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

      <main className="pt-24 pb-16 px-6 min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Freelancer Dashboard
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
                {
                  id: "feedback",
                  label: "Feedback",
                  icon: <MessageSquare className="w-5 h-5 mr-2" />,
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
              {/* Current Projects Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Current Projects
                </h2>
                {projects.map((project) => (
                  <div key={project._id} className="mb-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{project.title}</h3>
                        <p className="text-gray-500">
                          Freelancer:{" "}
                          {project.mileStones?.[0]?.freelancer?.fullName ||
                            "Not Assigned"}
                        </p>
                      </div>
                      <Link
                        href={`/project/${project._id}`}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {project.status === "in-progress"
                          ? "In Progress"
                          : project.status}
                      </Link>
                    </div>
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

              {/* Pending Reviews Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Pending Reviews
                </h2>
                {reviews.length > 0 ? (
                  reviews.map((review) =>
                    review.mileStones
                      ?.filter((milestone) => milestone.status === "in-review")
                      .map((milestone) => (
                        <div
                          key={milestone._id}
                          className="mb-4 p-4 border rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">
                                {review.companyName}
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
                              onClick={() => setActiveTab("reviews")}
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
                            Submit Proposal
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
                            <td
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                setMilestone(milestone);
                                setIsOpen(true);
                              }}
                            >
                              Click to Add Work Details
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
          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-20 backdrop-blur-sm bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">
                  Freelancer Work Details
                </h2>

                <form onSubmit={(e) => handleSubmit(e)}>
                  <div className="mb-3">
                    <label className="block text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      name="description"
                      className="w-full p-2 border rounded"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium">
                      GitHub Repo Link
                    </label>
                    <input
                      type="url"
                      name="githubRepoLink"
                      className="w-full p-2 border rounded"
                      value={formData.githubRepoLink}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium">
                      Modifications
                    </label>
                    <input
                      type="text"
                      name="modifications"
                      className="w-full p-2 border rounded"
                      value={formData.modifications}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium">
                      Upload Images
                    </label>
                    <input
                      type="file"
                      multiple
                      className="w-full p-2 border rounded"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium">
                      Video Demo Link
                    </label>
                    <input
                      type="url"
                      name="videoDemoLink"
                      className="w-full p-2 border rounded"
                      value={formData.videoDemoLink}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-400 text-white rounded"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Work Reviews Tab Content */}
          {activeTab === "reviews" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Work Reviews
              </h2>

              <div className="bg-white p-6 rounded-lg shadow-md">
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
                              <p className="text-gray-500 text-sm">
                                Work Completion Contribution:{" "}
                                {milestone.workCompletion}%
                              </p>
                            </div>
                            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                              {milestone.status === "in-review"
                                ? "Still in Review"
                                : ""}
                            </div>
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

          {/* Feedback Tab Content */}
          {activeTab === "feedback" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Feedback History
              </h2>

              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  {session?.user?.feedbacks?.length > 0 ? (
                    session.user.feedbacks.map((fb, index) => (
                      <div
                        key={index}
                        className="border p-3 mb-2 rounded-lg shadow-sm bg-white"
                      >
                        <p className="text-gray-700">
                          <strong>Project Title:</strong> {fb.title}
                        </p>
                        <p className="text-gray-700">
                          <strong>Employer:</strong> {fb.sender}
                        </p>
                        <p className="text-gray-700">
                          <strong>Feedback:</strong> {fb.feedback}
                        </p>

                        <p className="text-gray-700">
                          <strong>Time:</strong>{" "}
                          {new Date(fb.time).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No feedback available.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Page;

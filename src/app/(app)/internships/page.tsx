"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Upload, Plus, Trash2, Calendar } from "lucide-react";
import { useSession } from "next-auth/react";

// Modified Page component with form integration
const Page = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { data: session } = useSession();

  // Resume form state
  const [resumeData, setResumeData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    careerObjective: "",
    education: [""],
    workExperience: [""],
    extraCurricularActivities: [""],
    trainings: [""],
    projects: [""],
    skills: [""],
    workSamples: [""],
    additionalDetails: [""],
  });

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/fetchAllProjects");
        setJobs(response.data.data);
      } catch (err) {
        setError("Failed to fetch job listings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProjects();
  }, [session?.user._id]);

  const handleApplyClick = (jobId) => {
    setCurrentJobId(jobId);
    setShowResumeForm(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeResumeForm = () => {
    setShowResumeForm(false);
    setSubmitSuccess(false);
    setSubmitError(null);
    // Re-enable scrolling
    document.body.style.overflow = "auto";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      [name]: value,
    });
  };

  const handleArrayFieldChange = (fieldName, index, value) => {
    const updatedArray = [...resumeData[fieldName]];
    updatedArray[index] = value;
    setResumeData({
      ...resumeData,
      [fieldName]: updatedArray,
    });
  };

  const addArrayField = (fieldName) => {
    setResumeData({
      ...resumeData,
      [fieldName]: [...resumeData[fieldName], ""],
    });
  };

  const removeArrayField = (fieldName, index) => {
    if (resumeData[fieldName].length > 1) {
      const updatedArray = resumeData[fieldName].filter((_, i) => i !== index);
      setResumeData({
        ...resumeData,
        [fieldName]: updatedArray,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);

    try {
      // Add job ID to the data being sent
      const dataToSubmit = {
        ...resumeData,
        jobId: currentJobId,
      };

      // Replace with your API endpoint to submit the resume
      const response = await axios.post("/api/submitResume", {
        data: dataToSubmit,
        userId: session.user._id,
      });
      console.log(true);

      setSubmitSuccess(true);
      // Reset form after successful submission
      setResumeData({
        fullName: "",
        email: "",
        phoneNumber: "",
        careerObjective: "",
        education: [""],
        workExperience: [""],
        extraCurricularActivities: [""],
        trainings: [""],
        projects: [""],
        skills: [""],
        workSamples: [""],
        additionalDetails: [""],
      });

      // Close form after 3 seconds
      setTimeout(() => {
        closeResumeForm();
      }, 3000);
    } catch (err) {
      setSubmitError("Failed to submit application. Please try again.");
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 text-red-500 rounded-lg mt-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Available Opportunities
      </h1>

      {jobs.map((job) => (
        <div
          key={job._id}
          className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="p-8">
            {/* Header Section with curved background */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-600 opacity-10 rounded-lg"></div>
              <div className="relative z-10 flex justify-between items-start p-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {job.title || "Untitled Position"}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {job.companyName || "Company Name Not Provided"}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {job.isRemote ? (
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Remote
                    </span>
                  ) : (
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      On-site
                    </span>
                  )}

                  <span
                    className={`text-sm font-medium px-4 py-1.5 rounded-full shadow-sm flex items-center ${
                      job.status === "Open"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        job.status === "Open" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    ></span>
                    {job.status || "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </span>
                  <h3 className="font-medium text-gray-700">Location</h3>
                </div>
                <p className="text-gray-600 ml-10">
                  {job.location || "Not specified"}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <h3 className="font-medium text-gray-700">Employment Type</h3>
                </div>
                <p className="text-gray-600 ml-10">
                  {job.employmentType || "Not specified"}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <span className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-full mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <h3 className="font-medium text-gray-700">Salary Range</h3>
                </div>
                <p className="text-gray-600 ml-10">
                  {job.salaryRange?.min || job.salaryRange?.max
                    ? `${job.salaryRange.min || "Not specified"} - ${job.salaryRange.max || "Not specified"}`
                    : "Not specified"}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div>
                {job.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-200 pb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                )}

                {job.responsibilities && job.responsibilities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-200 pb-2">
                      Responsibilities
                    </h3>
                    <ul className="space-y-2">
                      {job.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-1">•</span>
                          <span className="text-gray-600">
                            {responsibility}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div>
                {job.requirements && job.requirements.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-200 pb-2">
                      Requirements
                    </h3>
                    <ul className="space-y-2">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-1">•</span>
                          <span className="text-gray-600">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                  {job.techStack && job.techStack.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-200 pb-2">
                        Tech Stack
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {job.techStack.map((tech, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm shadow-sm border border-gray-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {job.perksAndBenefits && job.perksAndBenefits.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-200 pb-2">
                        Perks & Benefits
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {job.perksAndBenefits.map((perk, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg text-sm shadow-sm border border-purple-200 flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            {perk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Milestones Section with Timeline */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center border-b border-gray-200 pb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Milestones
              </h3>
              {job.mileStones && job.mileStones.length > 0 ? (
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>

                  <ul className="space-y-6">
                    {job.mileStones.map((mileStone, index) => (
                      <li key={index} className="relative pl-12">
                        {/* Circle marker */}
                        <div className="absolute left-0 top-0 w-8 h-8 bg-white rounded-full border-2 border-blue-400 flex items-center justify-center z-10">
                          <span className="text-blue-500 text-sm font-bold">
                            {index + 1}
                          </span>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <h4 className="font-medium text-lg text-gray-800">
                            {mileStone.task || `Milestone ${index + 1}`}
                          </h4>
                          <div className="mt-3 grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-gray-700 text-sm font-medium">
                                Payment Amount
                              </p>
                              <p className="text-blue-600 font-bold">
                                ${mileStone.amount || "Not specified"}
                              </p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                              <p className="text-gray-700 text-sm font-medium">
                                Completion
                              </p>
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                  <div
                                    className="bg-green-600 h-2.5 rounded-full"
                                    style={{
                                      width: `${mileStone.workCompletion || 0}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-green-600 font-bold">
                                  {mileStone.workCompletion || 0}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p className="text-gray-500">
                    No milestones have been listed for this position
                  </p>
                </div>
              )}
            </div>

            {/* Footer with Apply Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => handleApplyClick(job._id)}
                disabled={job.status !== "Open" || !session?.user}
                className={`px-8 py-3 rounded-lg font-medium text-white shadow-lg transition-all duration-300 ${
                  job.status !== "Open" || !session?.user
                    ? "bg-gray-400 opacity-60 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transform hover:-translate-y-1 cursor-pointer"
                }`}
              >
                {job.status !== "Open" ? "Position Closed" : "Apply Now"}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Resume Application Form Modal */}
      {showResumeForm && (
        <div className="fixed inset-0 bg-blue-300 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-xl shadow-lg flex justify-between items-center z-10 backdrop-blur-md border border-white/20">
              <p className="text-4xl font-extrabold text-white tracking-wide drop-shadow-lg">
                Ski↑↑<span className="text-yellow-300">Pay</span>
              </p>
              <h2 className="text-2xl font-semibold text-white drop-shadow-md">
                Submit Your Application
              </h2>
              <button
                onClick={closeResumeForm}
                className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 ease-in-out"
              >
                <X className="h-6 w-6 text-white drop-shadow-md" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-6 text-center">
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <svg
                    className="h-12 w-12 text-green-500 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-green-800">
                    Application Submitted Successfully!
                  </h3>
                  <p className="text-green-600 mt-2">
                    Your application has been sent to the employer. They will
                    contact you if they&apos;re interested.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {submitError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={resumeData.fullName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={resumeData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={resumeData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Career Objective */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Career Objective
                  </label>
                  <textarea
                    name="careerObjective"
                    value={resumeData.careerObjective}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Education */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-gray-700 text-sm font-medium">
                      Education
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayField("education")}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add more
                    </button>
                  </div>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={edu}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "education",
                            index,
                            e.target.value
                          )
                        }
                        placeholder="Degree, Institution, Year"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {resumeData.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField("education", index)}
                          className="ml-2 p-3 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Work Experience */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-gray-700 text-sm font-medium">
                      Work Experience
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayField("workExperience")}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add more
                    </button>
                  </div>
                  {resumeData.workExperience.map((exp, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={exp}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "workExperience",
                            index,
                            e.target.value
                          )
                        }
                        placeholder="Position, Company, Duration"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {resumeData.workExperience.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayField("workExperience", index)
                          }
                          className="ml-2 p-3 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-gray-700 text-sm font-medium">
                      Skills
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayField("skills")}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add more
                    </button>
                  </div>
                  {resumeData.skills.map((skill, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "skills",
                            index,
                            e.target.value
                          )
                        }
                        placeholder="e.g., JavaScript, Project Management, etc."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {resumeData.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField("skills", index)}
                          className="ml-2 p-3 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Projects */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-gray-700 text-sm font-medium">
                      Projects
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayField("projects")}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add more
                    </button>
                  </div>
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={project}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "projects",
                            index,
                            e.target.value
                          )
                        }
                        placeholder="Project name and description"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {resumeData.projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField("projects", index)}
                          className="ml-2 p-3 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Work Samples */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-gray-700 text-sm font-medium">
                      Work Samples/Portfolio Links
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayField("workSamples")}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add more
                    </button>
                  </div>
                  {resumeData.workSamples.map((sample, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={sample}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "workSamples",
                            index,
                            e.target.value
                          )
                        }
                        placeholder="URL or description of work"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {resumeData.workSamples.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField("workSamples", index)}
                          className="ml-2 p-3 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Extra Curricular Activities */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-gray-700 text-sm font-medium">
                      Extra Curricular Activities
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayField("extraCurricularActivities")}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add more
                    </button>
                  </div>
                  {resumeData.extraCurricularActivities.map(
                    (activity, index) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          value={activity}
                          onChange={(e) =>
                            handleArrayFieldChange(
                              "extraCurricularActivities",
                              index,
                              e.target.value
                            )
                          }
                          placeholder="Activity description"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {resumeData.extraCurricularActivities.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeArrayField(
                                "extraCurricularActivities",
                                index
                              )
                            }
                            className="ml-2 p-3 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>

                {/* Trainings */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-gray-700 text-sm font-medium">
                      Trainings & Certifications
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayField("trainings")}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add more
                    </button>
                  </div>
                  {resumeData.trainings.map((training, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={training}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "trainings",
                            index,
                            e.target.value
                          )
                        }
                        placeholder="Training or certification name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {resumeData.trainings.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField("trainings", index)}
                          className="ml-2 p-3 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Additional Details */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-gray-700 text-sm font-medium">
                      Additional Details
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayField("additionalDetails")}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add more
                    </button>
                  </div>
                  {resumeData.additionalDetails.map((detail, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={detail}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "additionalDetails",
                            index,
                            e.target.value
                          )
                        }
                        placeholder="Any additional information"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {resumeData.additionalDetails.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayField("additionalDetails", index)
                          }
                          className="ml-2 p-3 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeResumeForm}
                    className="px-6 py-3 bg-gray-100 cursor-pointer text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-6 py-3 bg-blue-600 cursor-pointer text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center"
                  >
                    {submitLoading ? (
                      <>
                        <div
                          className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                          aria-hidden="true"
                        ></div>
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Page;

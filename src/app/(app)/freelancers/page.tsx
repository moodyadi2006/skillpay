"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  X,
  Briefcase,
  Award,
  ChevronRight,
  User,
  Mail,
  Phone,
  BookOpen,
  Code,
  FileText,
  Star,
  PenToolIcon,
} from "lucide-react";

const Page = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const findFreelancers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/freelancers");
        setFreelancers(response.data);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    findFreelancers();
  }, []);

  // Filter freelancers based on search term
  const filteredFreelancers = freelancers.filter(
    (freelancer) =>
      freelancer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer?.resume?.skills?.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const resumeTabs = [
    { id: "overview", label: "Overview", icon: <User size={16} /> },
    { id: "experience", label: "Experience", icon: <Briefcase size={16} /> },
    { id: "education", label: "Education", icon: <BookOpen size={16} /> },
    { id: "skills", label: "Skills", icon: <PenToolIcon size={16} /> },
    { id: "projects", label: "Projects", icon: <Code size={16} /> },
  ];

  // Function to render skill badges
  const renderSkills = (skills) => {
    if (!skills || !skills.length) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {skills.slice(0, 3).map((skill, idx) => (
          <span
            key={idx}
            className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full"
          >
            {skill}
          </span>
        ))}
        {skills.length > 3 && (
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
            +{skills.length - 3} more
          </span>
        )}
      </div>
    );
  };

  // Get resume content based on active tab
  const getResumeContent = () => {
    if (!selectedResume) return null;

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Career Objective
              </h3>
              <p className="text-gray-600">
                {selectedResume?.careerObjective ||
                  "No career objective provided"}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-600">{selectedResume?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-600">
                    {selectedResume?.phoneNumber}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-800">
                  Top Skills
                </h3>
                <button
                  onClick={() => setActiveTab("skills")}
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  See all <ChevronRight size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedResume?.skills?.slice(0, 8).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Work Experience
              </h3>
              {selectedResume?.workExperience?.length > 0 ? (
                <div className="space-y-4">
                  {selectedResume?.workExperience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="border-l-2 border-indigo-300 pl-4 py-1"
                    >
                      <p className="text-gray-800 font-medium">{exp}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No work experience listed
                </p>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Trainings
              </h3>
              {selectedResume?.trainings?.length > 0 ? (
                <div className="space-y-2">
                  {selectedResume?.trainings.map((training, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <Award size={16} className="text-indigo-500 mt-1" />
                      <p className="text-gray-700">{training}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No trainings listed</p>
              )}
            </div>
          </div>
        );

      case "education":
        return (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Education
            </h3>
            {selectedResume?.education?.length > 0 ? (
              <div className="space-y-4">
                {selectedResume?.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="border-l-2 border-indigo-300 pl-4 py-1"
                  >
                    <p className="text-gray-800">{edu}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No education listed</p>
            )}
          </div>
        );

      case "skills":
        return (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selectedResume?.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Extra-curricular Activities
              </h3>
              {selectedResume?.extraCurricularActivities?.length > 0 ? (
                <div className="space-y-2">
                  {selectedResume?.extraCurricularActivities.map(
                    (activity, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <Star size={16} className="text-indigo-500 mt-1" />
                        <p className="text-gray-700">{activity}</p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No extra-curricular activities listed
                </p>
              )}
            </div>
          </div>
        );

      case "projects":
        return (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Projects
              </h3>
              {selectedResume?.projects?.length > 0 ? (
                <div className="space-y-4">
                  {selectedResume?.projects.map((project, idx) => (
                    <div
                      key={idx}
                      className="border-l-2 border-indigo-300 pl-4 py-1"
                    >
                      <p className="text-gray-800">{project}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No projects listed</p>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Work Samples
              </h3>
              {selectedResume?.workSamples?.length > 0 ? (
                <div className="space-y-2">
                  {selectedResume?.workSamples.map((sample, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <FileText size={16} className="text-indigo-500 mt-1" />
                      <p className="text-gray-700">{sample}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No work samples listed</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">
            Talent <span className="text-indigo-300">Explorer</span>
          </h1>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by name or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border-none focus:ring-2 focus:ring-indigo-400 bg-white/10 backdrop-blur-sm text-white placeholder-indigo-200"
            />
            <Search
              size={18}
              className="absolute top-2.5 left-3 text-indigo-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Freelancers list */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl overflow-hidden">
              <div className="p-4 bg-indigo-600/40 border-b border-indigo-500/30">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Briefcase size={20} />
                  Available Talent ({filteredFreelancers.length})
                </h2>
              </div>

              {isLoading ? (
                <div className="p-8 flex justify-center items-center">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-16 bg-indigo-200/20 rounded"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : filteredFreelancers.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-indigo-200 mb-2">
                    No freelancers found matching your search
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-indigo-300 underline hover:text-white"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <ul className="space-y-2 p-3 max-h-[70vh] overflow-y-auto">
                  {filteredFreelancers.map((freelancer, index) => (
                    <li key={index} className="group">
                      <button
                        onClick={() => setSelectedResume(freelancer.resume)}
                        className={`w-full text-left p-4 rounded-lg transition duration-200 flex flex-col ${
                          selectedResume &&
                          selectedResume.fullName === freelancer.resume.fullName
                            ? "bg-indigo-700 text-white shadow-lg"
                            : "bg-white/5 hover:bg-white/10 text-white"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-medium text-lg block">
                              {freelancer?.fullName}
                            </span>
                            <span className="text-indigo-200 text-sm">
                              {freelancer?.resume?.education?.[0]?.split(
                                ","
                              )[0] || "Education info unavailable"}
                            </span>
                          </div>

                          <ChevronRight
                            size={20}
                            className={`opacity-0 group-hover:opacity-100 transition duration-200 ${
                              selectedResume &&
                              selectedResume.fullName ===
                                freelancer.resume.fullName
                                ? "text-indigo-200"
                                : "text-indigo-300"
                            }`}
                          />
                        </div>

                        {renderSkills(freelancer.resume?.skills)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Resume details */}
          <div className="lg:col-span-7">
            {selectedResume ? (
              <div className="bg-gray-100/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden">
                <div className="bg-white p-6 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {selectedResume.fullName}
                      </h2>
                      <p className="text-indigo-600">
                        {selectedResume?.education?.[0]?.split(",")[0] || ""}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedResume(null)}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Resume tabs */}
                  <div className="flex overflow-x-auto mt-4 pb-1 gap-1">
                    {resumeTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition ${
                          activeTab === tab.id
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 overflow-auto max-h-[65vh]">
                  {getResumeContent()}

                  {selectedResume?.additionalDetails?.length > 0 && (
                    <div className="mt-4 bg-white p-4 rounded-lg shadow">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Additional Information
                      </h3>
                      <div className="space-y-2">
                        {selectedResume?.additionalDetails.map(
                          (detail, idx) => (
                            <p key={idx} className="text-gray-600">
                              {detail}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-10 text-center">
                <div className="bg-indigo-600/20 p-6 rounded-full mb-4">
                  <User size={60} className="text-indigo-200" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Select a Freelancer
                </h3>
                <p className="text-indigo-200 max-w-md">
                  Choose a freelancer from the list to view their detailed
                  resume and professional information
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

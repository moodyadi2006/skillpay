"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Circle,
  AlertCircle,
  MapPin,
  Calendar,
  Briefcase,
  Clock,
  DollarSign,
  Award,
  User,
  FileText,
  Tag,
  PenTool,
} from "lucide-react";

const Page = () => {
  const params = useParams();
  const { id } = params;
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/fetchMileStones?id=${encodeURIComponent(id)}`
        );
        setProject(response.data.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching mileStones:", error);
        setError("Failed to load Project details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
      switch (status) {
        case "Open":
          return "bg-green-100 text-green-800";
        case "Closed":
          return "bg-red-100 text-red-800";
        default:
          return "bg-blue-100 text-blue-800";
      }
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {project.title || "Job Position"}
              </h1>
              <div className="flex items-center text-blue-100">
                <Briefcase className="h-4 w-4 mr-2" />
                <span>{project.employmentType || "N/A"}</span>
                {project.isRemote !== undefined && (
                  <span className="ml-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {project.isRemote ? "Remote" : "On-site"}
                  </span>
                )}
                {project.location && (
                  <span className="ml-4">{project.location}</span>
                )}
              </div>
            </div>
            <StatusBadge status={project.status || "Status Unknown"} />
          </div>
        </div>

        {/* Company Section */}
        <div className="p-6 border-b">
          <div className="flex items-center mb-4">
            {project.companyLogo ? (
              <img
                src={project.companyLogo}
                alt={`${project.companyName} logo`}
                className="h-12 w-12 rounded-md mr-4 object-contain"
              />
            ) : (
              <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-gray-500" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">
                {project.companyName || "Company"}
              </h2>
              <p className="text-gray-600">
                {project.description || "No description available"}
              </p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            {/* Requirements */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                Requirements
              </h3>
              {project.requirements && project.requirements.length > 0 ? (
                <ul className="space-y-2">
                  {project.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No specific requirements listed</p>
              )}
            </div>

            {/* Responsibilities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <PenTool className="h-5 w-5 mr-2 text-blue-500" />
                Responsibilities
              </h3>
              {project.responsibilities &&
              project.responsibilities.length > 0 ? (
                <ul className="space-y-2">
                  {project.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start">
                      <Circle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  No specific responsibilities listed
                </p>
              )}
            </div>

            {/* Experience */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-500" />
                Experience Required
              </h3>
              <p className="text-gray-800">
                {project.reqExperience !== undefined
                  ? `${project.reqExperience} years`
                  : "Not specified"}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Tech Stack */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-blue-500" />
                Tech Stack
              </h3>
              {project.techStack && project.techStack.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tech stack listed</p>
              )}
            </div>

            {/* Salary Range */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
                Salary Range
              </h3>
              {project.salaryRange ? (
                <p className="text-gray-800">
                  {project.salaryRange.min !== undefined &&
                  project.salaryRange.min !== -1
                    ? `${project.salaryRange.min} - ${project.salaryRange.max || "Negotiable"}`
                    : "Negotiable"}
                </p>
              ) : (
                <p className="text-gray-500">Not disclosed</p>
              )}
            </div>

            {/* Perks and Benefits */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-500" />
                Perks and Benefits
              </h3>
              {project.perksAndBenefits &&
              project.perksAndBenefits.length > 0 ? (
                <ul className="space-y-2">
                  {project.perksAndBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No perks or benefits listed</p>
              )}
            </div>

            {/* Milestones */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Milestones
              </h3>
              {project.mileStones && project.mileStones.length > 0 ? (
                <ul className="space-y-4">
                  {project.mileStones.map((mileStone, index) => (
                    <li
                      key={index}
                      className="border-l-2 border-blue-500 pl-4 pb-4"
                    >
                      <h4 className="font-medium">
                        task: {mileStone.task || `Milestone ${index + 1}`}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Amount to be paid: ${mileStone.amount || "No Amount specified"}
                      </p>

                      <p className="text-gray-600 text-sm">
                        Work Completion: {mileStone.workCompletion || "Amount of work completed"}
                        %
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No milestones listed</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer with application info */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <p className="text-gray-600 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Posted: {formatDate(project.postedAt)}
              </p>
              {project.applicationDeadline && (
                <p className="text-gray-600">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Application Deadline:{" "}
                  {formatDate(project.applicationDeadline)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

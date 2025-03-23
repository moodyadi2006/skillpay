"use client";
import React, { useState, useRef, useEffect } from "react";
import { XCircle } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

const Page = () => {
  const [preview, setPreview] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const [tempInput, setTempInput] = useState({
    techStack: "",
    responsibilities: "",
    requirements: "",
    perksAndBenefits: "",
    mileStones: [{ task: "", amount: 0, workCompletion: 100 }],
  });

  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: [],
    reqExperience: 0,
    employmentType: "Freelance",
    salaryMin: "",
    salaryMax: "",
    location: "",
    isRemote: false,
    companyName: "",
    companyLogo: "",
    applicationDeadline: "",
    responsibilities: [],
    requirements: [],
    perksAndBenefits: [],
    mileStones: [{ task: "", amount: 0, workCompletion: 100 }],
    applicationLink: "",
    status: "Open",
    postedBy: null,
    postedAt: new Date(Date.now()),
  });

  // Update `postedBy` once `session` is available
  useEffect(() => {
    if (session?.user?._id) {
      setFormData((prevData) => ({
        ...prevData,
        postedBy: session.user._id,
      }));
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };
  const handleTempInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "task" || name === "amount" || name === "workCompletion") {
      setTempInput((prevState) => {
        const updatedMilestones = [...prevState.mileStones];

        // Ensure milestone exists at the given index
        if (!updatedMilestones[index]) {
          updatedMilestones[index] = {
            task: "",
            amount: 0,
            workCompletion: 100,
          };
        }

        // Update the correct field
        updatedMilestones[index][name] =
          name === "amount" || name === "workCompletion"
            ? Number(value)
            : value;

        return {
          ...prevState,
          mileStones: updatedMilestones,
        };
      });
    } else {
      setTempInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleArrayInput = (field) => {
    if (field === "mileStones") {
      const lastMilestone =
        tempInput.mileStones[tempInput.mileStones.length - 1];

      if (
        lastMilestone.task.trim() !== "" &&
        lastMilestone.amount > 0 &&
        lastMilestone.workCompletion >= 0 &&
        lastMilestone.workCompletion <= 100
      ) {
        setFormData((prevState) => ({
          ...prevState,
          [field]: [...prevState[field], lastMilestone],
        }));

        // Reset input fields after adding a milestone
        setTempInput((prevState) => ({
          ...prevState,
          mileStones: [
            ...prevState.mileStones,
            { task: "", amount: 0, workCompletion: 100 },
          ],
        }));
      }
    } else {
      if (tempInput[field] && tempInput[field].trim() !== "") {
        setFormData((prevState) => ({
          ...prevState,
          [field]: [...prevState[field], tempInput[field].trim()],
        }));

        setTempInput((prevState) => ({
          ...prevState,
          [field]: "",
        }));
      }
    }
  };

  const handleRemoveItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData({
          ...formData,
          companyLogo: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerLogoUpload = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    const requiredFields = ["title", "description", "location", "companyName"];
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Salary validation
    if (
      formData.salaryMin &&
      formData.salaryMax &&
      Number(formData.salaryMin) > Number(formData.salaryMax)
    ) {
      newErrors.salaryMin = "Minimum salary cannot be greater than maximum";
    }

    // Deadline validation
    if (formData.applicationDeadline) {
      const deadline = new Date(formData.applicationDeadline);
      const today = new Date();
      if (deadline < today) {
        newErrors.applicationDeadline = "Deadline cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const response = await axios.post("/api/updateJobPost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (!response.data.success) {
        toast.error(response.data.error);
        return;
      }
      setFormSubmitted(true);
    }
  };

  const togglePreview = () => {
    if (!preview && !validateForm()) {
      return;
    }
    setPreview(!preview);
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const renderFormField = (
    label,
    name,
    type = "text",
    required = false,
    options = null
  ) => {
    return (
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {type === "textarea" ? (
          <textarea
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors[name] ? "border-red-500" : "border-gray-300"
            }`}
            rows="4"
            required={required}
          ></textarea>
        ) : type === "select" ? (
          <select
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors[name] ? "border-red-500" : "border-gray-300"
            }`}
            required={required}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors[name] ? "border-red-500" : "border-gray-300"
            }`}
            required={required}
          />
        )}

        {errors[name] && (
          <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
        )}
      </div>
    );
  };

  const renderArrayFieldMS = (label, field) => {
    // Calculate total tasks to determine work completion percentage
    const totalTasks = formData[field].length;

    return (
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">{label}</label>

        {/* Task, Amount & Work Completion Input Fields */}
        <div className="flex gap-2">
          <input
            type="text"
            name="task"
            value={
              tempInput.mileStones?.[tempInput.mileStones.length - 1]?.task ||
              ""
            }
            onChange={(e) =>
              handleTempInputChange(e, tempInput.mileStones.length - 1)
            }
            className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            placeholder="Enter Task"
          />
          <input
            type="number"
            name="amount"
            value={
              tempInput.mileStones?.[tempInput.mileStones.length - 1]?.amount ||
              0
            }
            onChange={(e) =>
              handleTempInputChange(e, tempInput.mileStones.length - 1)
            }
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            placeholder="Amount ($)"
            min="0"
          />
          <input
            type="number"
            name="workCompletion"
            value={
              tempInput.mileStones?.[tempInput.mileStones.length - 1]
                ?.workCompletion || 100
            }
            onChange={(e) =>
              handleTempInputChange(e, tempInput.mileStones.length - 1)
            }
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            placeholder="Completion (%)"
            min="0"
            max="100"
          />
          <button
            type="button"
            onClick={() => handleArrayInput(field)}
            className="bg-blue-600 cursor-pointer text-white px-4 rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Display Added Milestones - Only show if there are items */}
        {formData[field].length > 0 &&
          formData[field].map((item, index) => {
            const workCompletion =
              totalTasks > 1
                ? ((index / (totalTasks - 1)) * 100).toFixed(2)
                : 100;

            if (index === 0) return null; // Skip index 0 items

            return (
              <div
                key={index}
                className="flex justify-between items-center mt-2 bg-blue-100 p-3 rounded-lg"
              >
                <div>
                  <strong className="text-blue-800">Task:</strong> {item.task},{" "}
                  <strong className="text-blue-800"> Amount:</strong> $
                  {item.amount},{" "}
                  <strong className="text-blue-800"> Completion:</strong>{" "}
                  {item.workCompletion || workCompletion}%
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(field, index)}
                    className="text-red-600 cursor-pointer hover:text-red-800"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  const renderArrayField = (label, field) => {
    return (
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
        <div className="flex">
          <input
            type="text"
            name={field}
            value={tempInput[field]}
            onChange={handleTempInputChange}
            className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            placeholder="Add an item and click Add"
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleArrayInput(field))
            }
          />
          <button
            type="button"
            onClick={() => handleArrayInput(field)}
            className="bg-blue-600 cursor-pointer text-white px-4 rounded-r-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {formData[field].map((item, index) => (
            <div
              key={index}
              className="inline-flex items-center bg-blue-100 rounded-full px-3 py-1"
            >
              <span className="text-blue-800 mr-1">{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(field, index)}
                className="text-blue-800 hover:text-red-600"
              >
                <XCircle size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-500 flex justify-center items-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Job Post Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Your job post for &quot;{formData.title}&quot; has been successfully created.
          </p>
          <button
            onClick={() => {
              setFormData({
                title: "",
                description: "",
                techStack: [],
                reqExperience: 0,
                employmentType: "Freelance",
                salaryMin: "",
                salaryMax: "",
                location: "",
                isRemote: false,
                companyName: "",
                companyLogo: "",
                applicationDeadline: "",
                responsibilities: [],
                requirements: [],
                perksAndBenefits: [],
                applicationLink: "",
                status: "Open",
                mileStones: [{ task: "", amount: 0 }],
              });
              setFormSubmitted(false);
              setLogoPreview("");
            }}
            className="bg-blue-600 cursor-pointer mr-2 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-300"
          >
            Create Another Job Post
          </button>
          <button
            onClick={() => router.replace("/employer")}
            className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-300"
          >
            Go to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 flex justify-center items-center p-4 md:p-6">
      <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 mb-2">
            Ski↑↑<span className="text-blue-600">Pay</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {preview ? "Preview Job Post" : "Create a Job Post"}
          </h2>
          {!preview && (
            <p className="text-gray-600 mt-2">
              Fill out the form below to create a new job posting
            </p>
          )}
        </div>

        {preview ? (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {formData.title || "Job Title"}
                </h2>
                <p className="text-gray-600">
                  {formData.companyName || "Company Name"}
                </p>
              </div>
              {logoPreview && (
                <div className="w-16 h-16 rounded overflow-hidden">
                  <Image
                    src={logoPreview}
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-500">Location</p>
                <p>
                  {formData.location}
                  {formData.isRemote ? " (Remote Available)" : ""}
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-500">Employment Type</p>
                <p>{formData.employmentType}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-500">Experience</p>
                <p>{formData.reqExperience} years</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-500">Salary Range</p>
                <p>
                  {formData.salaryMin && formData.salaryMax
                    ? `${formatSalary(formData.salaryMin)} - ${formatSalary(formData.salaryMax)}`
                    : "Not specified"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="whitespace-pre-line">{formData.description}</p>
            </div>

            {formData.techStack.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {formData.responsibilities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {formData.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {formData.requirements.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {formData.requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {formData.perksAndBenefits.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Perks & Benefits</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {formData.perksAndBenefits.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {formData.applicationDeadline && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <p className="text-blue-800">
                  <strong>Application Deadline:</strong>{" "}
                  {new Date(formData.applicationDeadline).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center mt-8">
              <button
                type="button"
                onClick={togglePreview}
                className="px-6 py-3 cursor-pointer bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300 font-medium"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 font-medium"
              >
                Submit Job Post
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">Job Details</h3>

              {renderFormField("Job Title", "title", "text", true)}
              {renderFormField("Description", "description", "textarea", true)}

              {renderArrayField("Tech Stack", "techStack")}

              {renderFormField(
                "Required Experience (Years)",
                "reqExperience",
                "number",
                false
              )}
              {renderFormField(
                "Employment Type",
                "employmentType",
                "select",
                false,
                [
                  "Full-time",
                  "Part-time",
                  "Contract",
                  "Internship",
                  "Freelance",
                ]
              )}
            </div>

            <div className="bg-purple-50 p-4 rounded-lg mb-6 border border-purple-100">
              <h3 className="font-semibold text-purple-800 mb-2">
                Compensation & Location
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {renderFormField("Minimum Salary ($)", "salaryMin", "number")}
                </div>
                <div>
                  {renderFormField("Maximum Salary ($)", "salaryMax", "number")}
                </div>
              </div>

              {renderFormField("Location", "location", "text", true)}

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="isRemote"
                  name="isRemote"
                  checked={formData.isRemote}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600"
                />
                <label htmlFor="isRemote" className="ml-2 text-gray-700">
                  Remote Work Available
                </label>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-100">
              <h3 className="font-semibold text-green-800 mb-2">
                Company Information
              </h3>

              {renderFormField("Company Name", "companyName", "text", true)}

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Company Logo
                </label>
                <div
                  onClick={triggerLogoUpload}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {logoPreview ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="max-h-32 max-w-full mb-2"
                      />
                      <p className="text-sm text-blue-600">Click to change</p>
                    </div>
                  ) : (
                    <div className="py-4">
                      <p className="text-gray-500">
                        Click to upload company logo
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {renderFormField("Application Link", "applicationLink", "text")}
              {renderFormField(
                "Application Deadline",
                "applicationDeadline",
                "date"
              )}
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-100">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Job Details
              </h3>

              {renderArrayField("Responsibilities", "responsibilities")}
              {renderArrayField("Requirements", "requirements")}
              {renderArrayField("Perks and Benefits", "perksAndBenefits")}
              {renderArrayFieldMS("Mile Stones", "mileStones")}
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <button
                type="button"
                onClick={togglePreview}
                className="px-6 py-3 cursor-pointer bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 font-medium"
              >
                Preview Job Post
              </button>
              <button
                type="submit"
                className="px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 font-medium"
              >
                Submit Job Post
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Page;

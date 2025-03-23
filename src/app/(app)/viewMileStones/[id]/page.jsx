"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CheckCircle, Circle, AlertCircle } from "lucide-react";

const Page = () => {
  const params = useParams();
  const { id } = params;
  const [mileStones, setMileStones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMileStones = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/fetchMileStones?id=${encodeURIComponent(id)}`
        );
        setMileStones(response.data.data.mileStones);
        setError(null);
      } catch (error) {
        console.error("Error fetching mileStones:", error);
        setError("Failed to load mileStones. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMileStones();
  }, [id]);

  // Calculate total completion percentage
  const calculateOverallProgress = () => {
    const completedMilestones = mileStones.filter(
      (milestone) => milestone.status === "completed"
    );

    if (!completedMilestones.length) return 0;

    const totalCompletion = completedMilestones.reduce(
      (total, milestone) => total + (milestone.workCompletion || 0),
      0
    );

    return Math.round(totalCompletion);
  };

  const getStatusIcon = (completion) => {
    if (completion >= 100) return <CheckCircle className="text-green-500" />;
    if (completion > 0) return <Circle className="text-blue-500" />;
    return <Circle className="text-gray-300" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        {/* Animated Loading Spinner */}
        <div className="relative">
          <div className="h-16 w-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>

        {/* Skeleton Text Placeholder */}
        <div className="animate-pulse flex flex-col items-center space-y-2">
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Loading Text */}
        <p className="text-gray-500 text-sm font-medium">
          Loading, please wait...
        </p>
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Project MileStones</h1>

        {mileStones.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">Overall Progress</h2>
              <span className="text-blue-600 font-medium">
                {calculateOverallProgress()}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${calculateOverallProgress()}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {mileStones.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No mileStones found for this project</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mileStones.map((mileStone, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(mileStone.workCompletion)}
                  <h3 className="font-medium text-lg">{mileStone.task}</h3>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-sm text-gray-500 mb-1">Amount</div>
                    <div className="font-semibold">
                    ₹{mileStone.amount?.toLocaleString() || 0}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-sm text-gray-500 mb-1">Completion</div>
                    <div className="flex items-center justify-between">
                      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            mileStone.workCompletion >= 100
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${mileStone.workCompletion || 0}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold whitespace-nowrap">
                        {mileStone.workCompletion || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;

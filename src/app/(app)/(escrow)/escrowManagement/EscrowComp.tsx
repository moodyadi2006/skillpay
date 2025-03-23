import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Clock, 
  DollarSign, 
  Lock, 
  Unlock, 
  CheckCircle, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp,
  RefreshCw
} from 'lucide-react';

const EscrowManagement = ({ jobId }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [jobDetails, setJobDetails] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [escrowTransactions, setEscrowTransactions] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  // Fetch job details and escrow data
  useEffect(() => {
    const fetchData = async () => {
      if (!jobId || !session?.user) return;
      
      try {
        setLoading(true);
        
        // Fetch job details
        const jobResponse = await axios.get(`/api/jobs/${jobId}`);
        setJobDetails(jobResponse.data);
        
        // Fetch milestones
        if (jobResponse.data?.mileStones) {
          setMilestones(jobResponse.data.mileStones);
        }
        
        // Fetch escrow transactions
        const escrowResponse = await axios.get(`/api/escrow/${jobId}`);
        setEscrowTransactions(escrowResponse.data);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load escrow data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [jobId, session]);

  const handleFundEscrow = async (milestoneId, amount) => {
    if (confirmAction !== `fund-${milestoneId}`) {
      setConfirmAction(`fund-${milestoneId}`);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post('/api/escrow/fund', {
        jobId,
        milestoneId,
        amount
      });
      
      if (response.data.success) {
        toast.success("Escrow funded successfully");
        // Refresh escrow data
        const escrowResponse = await axios.get(`/api/escrow/${jobId}`);
        setEscrowTransactions(escrowResponse.data);
      } else {
        toast.error(response.data.message || "Failed to fund escrow");
      }
    } catch (error) {
      console.error("Error funding escrow:", error);
      toast.error("An error occurred while funding the escrow");
    } finally {
      setLoading(false);
      setConfirmAction(null);
    }
  };

  const handleReleaseEscrow = async (transactionId) => {
    if (confirmAction !== `release-${transactionId}`) {
      setConfirmAction(`release-${transactionId}`);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post('/api/escrow/release', {
        transactionId
      });
      
      if (response.data.success) {
        toast.success("Funds released successfully");
        // Refresh escrow data
        const escrowResponse = await axios.get(`/api/escrow/${jobId}`);
        setEscrowTransactions(escrowResponse.data);
      } else {
        toast.error(response.data.message || "Failed to release funds");
      }
    } catch (error) {
      console.error("Error releasing escrow:", error);
      toast.error("An error occurred while releasing the funds");
    } finally {
      setLoading(false);
      setConfirmAction(null);
    }
  };

  const handleVerifyMilestone = async (milestoneId) => {
    if (confirmAction !== `verify-${milestoneId}`) {
      setConfirmAction(`verify-${milestoneId}`);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post('/api/escrow/verify', {
        jobId,
        milestoneId
      });
      
      if (response.data.success) {
        toast.success("Milestone verified successfully");
        // Refresh milestone data
        const jobResponse = await axios.get(`/api/jobs/${jobId}`);
        if (jobResponse.data?.mileStones) {
          setMilestones(jobResponse.data.mileStones);
        }
      } else {
        toast.error(response.data.message || "Failed to verify milestone");
      }
    } catch (error) {
      console.error("Error verifying milestone:", error);
      toast.error("An error occurred while verifying the milestone");
    } finally {
      setLoading(false);
      setConfirmAction(null);
    }
  };

  const handleDispute = async (transactionId) => {
    if (confirmAction !== `dispute-${transactionId}`) {
      setConfirmAction(`dispute-${transactionId}`);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post('/api/escrow/dispute', {
        transactionId
      });
      
      if (response.data.success) {
        toast.success("Dispute filed successfully");
        // Refresh escrow data
        const escrowResponse = await axios.get(`/api/escrow/${jobId}`);
        setEscrowTransactions(escrowResponse.data);
      } else {
        toast.error(response.data.message || "Failed to file dispute");
      }
    } catch (error) {
      console.error("Error filing dispute:", error);
      toast.error("An error occurred while filing the dispute");
    } finally {
      setLoading(false);
      setConfirmAction(null);
    }
  };

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const cancelConfirmation = () => {
    setConfirmAction(null);
  };

  const isEmployer = jobDetails?.postedBy === session?.user?._id;
  const isFreelancer = jobDetails?.assignedTo === session?.user?._id;

  if (loading && !jobDetails) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2 text-gray-700">Loading escrow details...</span>
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <h3 className="font-semibold">Error Loading Job</h3>
        </div>
        <p>Unable to load job details. Please try again later.</p>
      </div>
    );
  }

  // Find transactions for each milestone
  const getMilestoneTransactions = (milestoneId) => {
    return escrowTransactions.filter(t => t.milestoneId === milestoneId);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Escrow Management: {jobDetails.title}
      </h2>
      
      {!isEmployer && !isFreelancer && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-yellow-700">
              You are not authorized to manage escrow for this job.
            </p>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Payment Milestones
        </h3>
        
        <div className="space-y-4">
          {milestones.map((milestone, index) => {
            if (index === 0) return null; // Skip the first empty milestone as per your code
            
            const transactions = getMilestoneTransactions(index.toString());
            const latestTransaction = transactions.length > 0 ? 
              transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] : null;
            
            const isFunded = latestTransaction?.status === 'funded';
            const isReleased = latestTransaction?.status === 'released';
            const isDisputed = latestTransaction?.status === 'disputed';
            const isVerified = milestone.verified;
            
            return (
              <div key={index} className="border rounded-lg overflow-hidden">
                {/* Milestone Header */}
                <div 
                  className={`flex justify-between items-center p-4 cursor-pointer ${
                    activeAccordion === index ? 'bg-blue-50' : 'bg-gray-50'
                  }`}
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="flex items-center">
                    {isReleased ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : isFunded ? (
                      <Lock className="h-5 w-5 text-blue-500 mr-2" />
                    ) : (
                      <Unlock className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    
                    <div>
                      <h4 className="font-medium">{milestone.task}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>${milestone.amount}</span>
                        <span className="mx-2">•</span>
                        <span>Completion: {milestone.workCompletion}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {isVerified && (
                      <span className="px-2 py-1 mr-2 text-xs bg-green-100 text-green-800 rounded-full">
                        Verified
                      </span>
                    )}
                    {isDisputed && (
                      <span className="px-2 py-1 mr-2 text-xs bg-red-100 text-red-800 rounded-full">
                        Disputed
                      </span>
                    )}
                    {isFunded && !isReleased && (
                      <span className="px-2 py-1 mr-2 text-xs bg-blue-100 text-blue-800 rounded-full">
                        In Escrow
                      </span>
                    )}
                    {isReleased && (
                      <span className="px-2 py-1 mr-2 text-xs bg-gray-100 text-gray-800 rounded-full">
                        Completed
                      </span>
                    )}
                    {activeAccordion === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
                
                {/* Milestone Content */}
                {activeAccordion === index && (
                  <div className="p-4 border-t">
                    {/* Transaction History */}
                    {transactions.length > 0 ? (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-700 mb-2">Transaction History</h5>
                        <div className="space-y-2">
                          {transactions.map((transaction, tIndex) => (
                            <div key={tIndex} className="bg-gray-50 p-3 rounded-md text-sm">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-medium">Status: </span>
                                  <span className={`
                                    ${transaction.status === 'funded' ? 'text-blue-600' : ''}
                                    ${transaction.status === 'released' ? 'text-green-600' : ''}
                                    ${transaction.status === 'disputed' ? 'text-red-600' : ''}
                                  `}>
                                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                  </span>
                                </div>
                                <div className="text-gray-500">
                                  <Clock className="inline-block h-4 w-4 mr-1" />
                                  {new Date(transaction.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <div>
                                <span className="font-medium">Amount: </span>
                                ${transaction.amount}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500 italic mb-4">No transactions yet</div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {isEmployer && !isFunded && !isReleased && (
                        <button
                          onClick={() => handleFundEscrow(index.toString(), milestone.amount)}
                          className={`${
                            confirmAction === `fund-${index}` 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          } text-white px-4 py-2 rounded-md transition-colors`}
                          disabled={loading}
                        >
                          {confirmAction === `fund-${index}` ? 'Confirm Funding' : 'Fund Escrow'}
                        </button>
                      )}
                      
                      {isEmployer && isFunded && !isReleased && isVerified && (
                        <button
                          onClick={() => handleReleaseEscrow(latestTransaction._id)}
                          className={`${
                            confirmAction === `release-${latestTransaction._id}` 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          } text-white px-4 py-2 rounded-md transition-colors`}
                          disabled={loading}
                        >
                          {confirmAction === `release-${latestTransaction._id}` ? 'Confirm Release' : 'Release Funds'}
                        </button>
                      )}
                      
                      {isFreelancer && isFunded && !isReleased && !isVerified && (
                        <button
                          onClick={() => handleVerifyMilestone(index.toString())}
                          className={`${
                            confirmAction === `verify-${index}` 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          } text-white px-4 py-2 rounded-md transition-colors`}
                          disabled={loading}
                        >
                          {confirmAction === `verify-${index}` ? 'Confirm Completion' : 'Mark as Complete'}
                        </button>
                      )}
                      
                      {(isEmployer || isFreelancer) && isFunded && !isReleased && !isDisputed && (
                        <button
                          onClick={() => handleDispute(latestTransaction._id)}
                          className={`${
                            confirmAction === `dispute-${latestTransaction._id}` 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-gray-600 hover:bg-gray-700'
                          } text-white px-4 py-2 rounded-md transition-colors`}
                          disabled={loading}
                        >
                          {confirmAction === `dispute-${latestTransaction._id}` ? 'Confirm Dispute' : 'File Dispute'}
                        </button>
                      )}
                      
                      {confirmAction && confirmAction.startsWith(`fund-${index}`) || 
                         confirmAction && confirmAction.startsWith(`release-`) ||
                         confirmAction && confirmAction.startsWith(`verify-`) ||
                         confirmAction && confirmAction.startsWith(`dispute-`) ? (
                        <button
                          onClick={cancelConfirmation}
                          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Help Section */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">How Escrow Works</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>
            <span className="font-medium">Employer funds escrow</span> for a specific milestone
          </li>
          <li>
            <span className="font-medium">Freelancer completes work</span> and marks the milestone as complete
          </li>
          <li>
            <span className="font-medium">Employer verifies and releases funds</span> to the freelancer
          </li>
          <li>
            If any issues arise, either party can <span className="font-medium">file a dispute</span> for resolution
          </li>
        </ol>
      </div>
    </div>
  );
};

export default EscrowManagement;
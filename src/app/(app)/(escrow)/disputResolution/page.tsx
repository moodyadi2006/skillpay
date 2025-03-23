import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Shield, 
  AlertTriangle, 
  MessageSquare, 
  RefreshCw,
  Clock,
  User,
  FileText,
  CheckCircle,
  X
} from 'lucide-react';

const Page = ({ transactionId }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [dispute, setDispute] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [resolution, setResolution] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  
  // Fetch dispute data
  useEffect(() => {
    const fetchData = async () => {
      if (!transactionId || !session?.user) return;
      
      try {
        setLoading(true);
        
        // Fetch dispute details
        const disputeResponse = await axios.get(`/api/escrow/disputes/${transactionId}`);
        setDispute(disputeResponse.data);
        
        // Fetch job details
        if (disputeResponse.data?.jobId) {
          const jobResponse = await axios.get(`/api/jobs/${disputeResponse.data.jobId}`);
          setJobDetails(jobResponse.data);
        }
        
        // Fetch dispute messages
        const messagesResponse = await axios.get(`/api/escrow/disputes/${transactionId}/messages`);
        setMessages(messagesResponse.data);
        
      } catch (error) {
        console.error("Error fetching dispute data:", error);
        toast.error("Failed to load dispute information");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [transactionId, session]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      setLoading(true);
      const response = await axios.post(`/api/escrow/disputes/${transactionId}/messages`, {
        message: newMessage,
        sender: session.user._id
      });
      
      if (response.data.success) {
        // Add new message to the list
        setMessages([...messages, response.data.message]);
        setNewMessage(''); // Clear input
      } else {
        toast.error(response.data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveDispute = async (resolution) => {
    if (confirmAction !== `resolve-${resolution}`) {
      setConfirmAction(`resolve-${resolution}`);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post(`/api/escrow/disputes/${transactionId}/resolve`, {
        resolution,
        resolvedBy: session.user._id,
        notes: "Dispute resolved by admin"
      });
      
      if (response.data.success) {
        toast.success(`Dispute resolved in favor of ${resolution === 'employer' ? 'employer' : 'freelancer'}`);
        
        // Refresh dispute data
        const disputeResponse = await axios.get(`/api/escrow/disputes/${transactionId}`);
        setDispute(disputeResponse.data);
      } else {
        toast.error(response.data.message || "Failed to resolve dispute");
      }
    } catch (error) {
      console.error("Error resolving dispute:", error);
      toast.error("An error occurred while resolving the dispute");
    } finally {
      setLoading(false);
      setConfirmAction(null);
    }
  };

  const cancelConfirmation = () => {
    setConfirmAction(null);
  };

  const isAdmin = session?.user?.role === 'admin';
  
  if (loading && !dispute) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2 text-gray-700">Loading dispute details...</span>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <h3 className="font-semibold">Error Loading Dispute</h3>
        </div>
        <p>Unable to load dispute details. Please try again later.</p>
      </div>
    );
  }

  const isResolved = dispute.status === 'resolved';

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-bold">Dispute Resolution</h2>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">
              Opened: {new Date(dispute.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Status Banner */}
      <div className={`p-3 ${isResolved ? 'bg-green-100' : 'bg-red-100'}`}>
        <div className="flex items-center">
          {isResolved ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800">
                Resolved in favor of {dispute.resolution === 'employer' ? 'the employer' : 'the freelancer'}
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">
                Dispute under review - Awaiting resolution
              </span>
            </>
          )}
        </div>
      </div>
      
      {/* Dispute Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Job Details</h3>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p><span className="font-medium">Job:</span> {jobDetails?.title || 'Loading...'}</p>
            <p><span className="font-medium">Milestone:</span> {dispute.milestoneName || 'N/A'}</p>
            <p><span className="font-medium">Amount:</span> ${dispute.amount}</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Parties Involved</h3>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p>
              <span className="font-medium">Employer:</span> {dispute.employerName || 'Not available'}
            </p>
            <p>
              <span className="font-medium">Freelancer:</span> {dispute.freelancerName || 'Not available'}
            </p>
            {dispute.resolvedBy && (
              <p>
                <span className="font-medium">Resolved by:</span> {dispute.resolverName || 'Admin'}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Dispute Description */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-700 mb-2">Dispute Description</h3>
        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <p className="whitespace-pre-line">{dispute.description || 'No description provided'}</p>
        </div>
      </div>
      
      {/* Message Thread */}
      <div className="p-4">
        <div className="flex items-center mb-3">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
          <h3 className="font-semibold text-gray-700">Communication</h3>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md mb-4 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center italic">No messages yet</p>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg._id} 
                  className={`p-3 rounded-lg ${
                    msg.sender === session?.user?._id 
                      ? 'bg-blue-100 ml-8' 
                      : 'bg-white border border-gray-200 mr-8'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    <User className="h-4 w-4 mr-1 text-gray-600" />
                    <span className="text-sm font-medium">
                      {msg.senderName || (msg.sender === session?.user?._id ? 'You' : 'Other Party')}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-800">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {!isResolved && (
          <div className="flex items-start space-x-2">
            <textarea
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type your message here..."
              rows="3"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={loading}
            ></textarea>
            <button
              className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={handleSendMessage}
              disabled={loading || !newMessage.trim()}
            >
              Send
            </button>
          </div>
        )}
      </div>
      
      {/* Admin Actions */}
      {isAdmin && !isResolved && (
        <div className="p-4 bg-gray-100 border-t border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Admin Actions</h3>
          
          {confirmAction ? (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                  <p className="text-yellow-800">
                    {confirmAction.includes('employer') 
                      ? "Are you sure you want to resolve in favor of the employer?" 
                      : "Are you sure you want to resolve in favor of the freelancer?"}
                  </p>
                </div>
                <button 
                  onClick={cancelConfirmation}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  onClick={cancelConfirmation}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => confirmAction.includes('employer') 
                    ? handleResolveDispute('employer')
                    : handleResolveDispute('freelancer')}
                >
                  Confirm
                </button>
              </div>
            </div>
          ) : (
            <div className="flex space-x-3">
              <button
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                onClick={() => handleResolveDispute('employer')}
                disabled={loading}
              >
                Resolve for Employer
              </button>
              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                onClick={() => handleResolveDispute('freelancer')}
                disabled={loading}
              >
                Resolve for Freelancer
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Resolution Notes */}
      {isResolved && dispute.notes && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center mb-2">
            <FileText className="h-5 w-5 mr-2 text-gray-600" />
            <h3 className="font-semibold text-gray-700">Resolution Notes</h3>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="whitespace-pre-line">{dispute.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
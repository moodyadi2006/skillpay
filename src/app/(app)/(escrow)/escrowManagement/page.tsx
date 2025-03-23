import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import EscrowManagement from '../../components/EscrowManagement';
import Head from 'next/head';
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

const Page = () => {
  const router = useRouter();
  const { jobId } = router.query;
  const { data: session, status } = useSession();
  
  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }
  
  // Show loading while session is loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Escrow Management | Your Platform Name</title>
        <meta name="description" content="Secure escrow management system for freelance projects" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with back button */}
          <div className="mb-6">
            <Link 
              href={session?.user?.role === 'employer' ? '/employer' : '/freelancer'}
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Link>
          </div>
          
          {/* Page title */}
          <div className="mb-8 flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Secure Escrow Management</h1>
          </div>
          
          {/* Description */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Safe Payments for Your Projects</h2>
            <p className="text-gray-600">
              Our escrow system ensures that both employers and freelancers are protected during the project lifecycle.
              Funds are held in a secure escrow account and only released when work is completed and verified.
            </p>
          </div>
          
          {/* Escrow management component */}
          {jobId ? (
            <EscrowManagement jobId={jobId} />
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Job ID is missing. Please navigate to this page from your job details.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
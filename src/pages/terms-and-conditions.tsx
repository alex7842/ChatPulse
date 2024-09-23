import React from 'react';
import Link from 'next/link';
import { ChevronLeftIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const TermsAndConditionsPage = () => {
  return (
    <div className="bg-gradient-to-b from-black to-gray-900 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-fit self-start text-green-500 mb-8 sm:mb-12"
          )}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Back
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-4">Terms & Conditions</h1>
        <p className="text-center text-gray-400 italic mb-8">Last updated on {new Date().toLocaleDateString()}</p>
        <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
          <p className="mb-4 text-gray-300">
            Welcome to ChatPulse. These Terms and Conditions govern your use of our AI-powered document assistant service. By using ChatPulse, you agree to these terms.
          </p>
          <p className="mb-4 font-semibold text-green-500">Use of ChatPulse is subject to the following terms:</p>
          <ol className="list-decimal pl-6 space-y-3 text-gray-300">
            <li>ChatPulse is an AI-powered tool designed to assist with document analysis and processing. It is not a substitute for professional advice.</li>
            <li>You agree to provide accurate and complete information when using ChatPulse.</li>
            <li>The AI models used by ChatPulse are continuously improving, but may occasionally produce inaccurate results. Users should verify important information.</li>
            <li>You are responsible for the content of the documents you upload to ChatPulse. Do not upload sensitive or confidential information.</li>
            <li>ChatPulse respects your privacy. We process documents solely to provide our service and do not share your data with third parties.</li>
            <li>You retain all rights to your documents. By using ChatPulse, you grant us a limited license to process your documents for the purpose of providing our service.</li>
            <li>ChatPulse is provided "as is" without any warranties, express or implied.</li>
            <li>We reserve the right to modify, suspend, or discontinue ChatPulse at any time without notice.</li>
            <li>You agree not to use ChatPulse for any unlawful purposes or in any way that could damage or impair the service.</li>
            <li>We may update these Terms and Conditions from time to time. Continued use of ChatPulse after changes constitutes acceptance of the new terms.</li>
            <li>If you subscribe to a paid plan, you agree to pay the fees associated with that plan. Refunds are subject to our refund policy.</li>
            <li>We may terminate or suspend your access to ChatPulse immediately, without prior notice, for any breach of these Terms and Conditions.</li>
            <li>These Terms and Conditions shall be governed by and construed in accordance with the laws of [Your Jurisdiction].</li>
            <li>For any questions or concerns about these Terms and Conditions, please contact us through the provided channels on our website.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
import Link from "next/link";
import { Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#111] text-white py-8">
      <div className="container mx-auto px-4">
        <div className=" flex justify-between gap-8 mb-8">
          {/* Company Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Company</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* View Website in Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">View Website in</h2>
            <div className="flex items-center space-x-2 text-gray-400">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>English</span>
            </div>
          </div>

          {/* Need Help Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Need Help?</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Visit Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/feedback"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Share Feedback
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Connect with Us</h2>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-6 h-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://twitter.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-6 h-6" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex justify-between">
          <div className="flex flex-col items-start space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 STAR. All Rights Reserved.
            </div>

            <div className="flex space-x-4 text-sm text-gray-400">
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms Of Use
              </Link>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link href="/faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          {/* App Store Buttons */}
          <div className="flex justify-center items-end ">
            <div>
              <Link href="https://play.google.com/store" className="w-48">
                {/* <Image
                src="../favicon.ico"
                alt="Get it on Google Play"
                width={646}
                height={250}
                className="w-full"
              /> */}
                Google Play
              </Link>
            </div>
            <div>
              <Link href="https://apps.apple.com" className="w-48">
                {/* <Image
                src="../favicon.ico"
                alt="Download on the App Store"
                width={646}
                height={250}
                className="w-full"
              /> */}
                Apple Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

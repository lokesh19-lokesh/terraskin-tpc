import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-['Inter']">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 font-['Playfair_Display'] text-center">Privacy Policy</h1>

        <div className="prose prose-lg text-gray-600 space-y-6">
          <p className="text-sm text-gray-500 italic mb-10 text-center">Last Updated: March 27, 2026</p>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">1. Introduction</h2>
            <p>
              Welcome to TerraSkin. We value your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">2. Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
              <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To register you as a new customer.</li>
              <li>To process and deliver your order including managing payments, fees and charges.</li>
              <li>To manage our relationship with you which will include notifying you about changes to our terms or privacy policy.</li>
              <li>To deliver relevant website content and advertisements to you.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">4. Shiprocket & Third-Party Services</h2>
            <p>
              We use third-party services like **Shiprocket** to manage our shipping and delivery. When you place an order, we share your Contact and Identity data (Name, Phone, Address) with Shiprocket to facilitate the delivery of your products. Your payment details are processed securely through **Razorpay**.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">5. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">6. Refund & Cancellation Policy</h2>
            <p>
              We offer refunds for cancelled orders; however, the refund amount will be issued after deducting applicable taxes and platform fees, provided the order is cancelled before it is handed over to our shipping partner (Shiprocket).
              Once an order status is updated to ‘Shipped’ or ‘In Transit,’ it can no longer be cancelled, and no refund will be issued.
              Refunds for eligible cancellations are automatically processed to the original payment method via Razorpay.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">7. Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">8. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <p className="font-bold mt-2 text-[#8d4745]">
              Email: terraskin01@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Plus, Minus } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const faqs = [
    {
      question: "How do I choose the right products for my skin type?",
      answer: "We recommend starting with our skin quiz or booking a virtual consultation with our skincare experts. Each product page also lists suitable skin types to help guide your selection.",
    },
    {
      question: "Are your products cruelty-free?",
      answer: "Yes, all TerraSkin products are 100% cruelty-free. We never test on animals and work only with suppliers who share our ethical values.",
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, you can return it for a full refund within 30 days of delivery.",
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days within the continental US. We also offer expedited shipping options at checkout.",
    },
  ];

  return (
    <div style={{backgroundColor:'#f4ece6'}} className="pt-16">
      {/* Hero Section */}
      <AnimatedSection className="bg-gradient-to-r from-[#8d4745] to-[#a05552] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] mb-6">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            We're here to help you on your skincare journey. Reach out anytime!
          </p>
        </div>
      </AnimatedSection>

      {/* Contact Information + Form */}
      <AnimatedSection animation="slide-up" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-[#8d4745] font-['Playfair_Display'] mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8d4745] focus:border-transparent transition-colors duration-200"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8d4745] focus:border-transparent transition-colors duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8d4745] focus:border-transparent transition-colors duration-200"
                  >
                    <option value="">Select a subject</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="order-support">Order Support</option>
                    <option value="skincare-advice">Skincare Advice</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8d4745] focus:border-transparent transition-colors duration-200"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8d4745] text-white py-3 px-6 rounded-lg hover:bg-[#7a3f3d] transition-colors duration-300 font-semibold"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <AnimatedSection animation="slide-left">
              <div>
                <h2 className="text-3xl font-bold text-[#8d4745] font-['Playfair_Display'] mb-6">
                  Get in Touch
                </h2>
                <p className="text-gray-600 mb-8">
                  Have questions about our products or need personalized skincare advice? 
                  Our team of experts is here to help you achieve your best skin.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#8d4745] text-white p-3 rounded-full">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Visit Our Store</h3>
                      <p className="text-gray-600">
                        Hyderabad, Telangana, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-[#8d4745] text-white p-3 rounded-full">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                      <p className="text-gray-600">
                        +91-9834763423
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-[#8d4745] text-white p-3 rounded-full">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                      <p className="text-gray-600">
                        info@terraskin.com<br />
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-[#8d4745] text-white p-3 rounded-full">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Store Hours</h3>
                      <p className="text-gray-600">
                        Monday - Friday: 9:00 AM - 7:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-600 hover:text-[#8d4745] transition-colors duration-200">
                      <span className="sr-only">Facebook</span>
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#8d4745] hover:text-white transition-colors duration-200">
                        f
                      </div>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-[#8d4745] transition-colors duration-200">
                      <span className="sr-only">Instagram</span>
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#8d4745] hover:text-white transition-colors duration-200">
                        ig
                      </div>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-[#8d4745] transition-colors duration-200">
                      <span className="sr-only">Twitter</span>
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#8d4745] hover:text-white transition-colors duration-200">
                        tw
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </AnimatedSection>

      {/* Map Section */}
      <AnimatedSection animation="fade-in" className="h-96 bg-gray-200">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-gray-600">
            <MapPin className="h-12 w-12 mx-auto mb-4" />
            <p>Interactive map would be integrated here</p>
            <p className="text-sm">Hyderabad, Telangana, India</p>
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ Section with Accordion */}
      <AnimatedSection animation="slide-up" className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#8d4745] font-['Playfair_Display'] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Quick answers to common questions about our products and services
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-6 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default ContactPage;

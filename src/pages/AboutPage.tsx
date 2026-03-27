import React from 'react';
import { useLocation } from 'react-router-dom';
import { Award, Heart, Leaf, Users } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import abt from "../images/about-us.png";
import founderImg from "../images/tanus.jpeg";

const AboutPage: React.FC = () => {
  const location = useLocation();
  const isLoginAbout = location.pathname === '/login-about';

  return (
    <div style={{ backgroundColor: '#f4ece6' }} className="pt-24">
      {/* Hero Section */}
      <AnimatedSection className="bg-gradient-to-r from-[#8d4745] to-[#a05552] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] mb-6">
            About TerraSkin
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Transforming skincare with science-backed formulations and natural ingredients since 2025
          </p>
        </div>
      </AnimatedSection>

      {/* Our Story */}
      <AnimatedSection animation="slide-up" className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#8d4745] font-['Playfair_Display'] mb-6">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Founded by Tanuja, TerraSkin was born from a passion for creating
              effective, gentle skincare solutions that work in harmony with your skin's natural processes.
              After years of research and development, we've crafted a collection of products that combine
              the best of nature and science.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="slide-right">
              <img
                src={abt}
                alt="Skincare laboratory"
                className="rounded-lg shadow-lg"
              />
            </AnimatedSection>
            <AnimatedSection animation="slide-left">
              <div>
                <h3 className="text-2xl font-bold text-[#8d4745] mb-4">Our Mission</h3>
                <p className="text-gray-600 mb-6">
                  We believe that everyone deserves healthy, radiant skin. Our mission is to provide
                  premium skincare products that deliver real results while being gentle on your skin
                  and kind to the environment.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <Heart className="h-5 w-5 text-[#8d4745] mr-3" />
                    Cruelty-free and ethically sourced
                  </li>
                  <li className="flex items-center">
                    <Leaf className="h-5 w-5 text-[#8d4745] mr-3" />
                    Sustainable packaging and practices
                  </li>
                  <li className="flex items-center">
                    <Award className="h-5 w-5 text-[#8d4745] mr-3" />
                    Clinically tested and dermatologist approved
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </AnimatedSection>

      {/* Values */}
      <AnimatedSection className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#8d4745] font-['Playfair_Display'] mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do, from product development to customer service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Award className="h-8 w-8" />,
                title: 'Quality First',
                description: 'We never compromise on the quality of our ingredients or formulations'
              },
              {
                icon: <Heart className="h-8 w-8 " />,
                title: 'Skin Health',
                description: 'Every product is designed to support and improve your skin\'s natural health'
              },
              {
                icon: <Leaf className="h-8 w-8" />,
                title: 'Sustainability',
                description: 'Committed to eco-friendly practices and sustainable packaging solutions'
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: 'Community',
                description: 'Building a supportive community of skincare enthusiasts and experts'
              }
            ].map((value, index) => (
              <AnimatedSection key={index} delay={index * 150} animation="slide-up">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-300">
                  <div className="bg-[#8d4745] text-white p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Founder Section */}
      <AnimatedSection animation="slide-up" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#8d4745]/10 rounded-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500"></div>
              <img
                src={founderImg}
                alt="Tanuja - Founder of TerraSkin"
                className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover object-top z-10"
              />
              <div className="absolute -bottom-6 -right-6 bg-[#8d4745] text-white p-6 rounded-2xl shadow-xl z-20 animate-bounce-subtle">
                <p className="text-2xl font-['Instrument_Serif']">since 2025</p>
                <p className="text-xs uppercase tracking-widest opacity-80">Empowering Beauty</p>
              </div>
            </div>

            {/* Content Side */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-[#8d4745] font-['Playfair_Display']">
                  Meet our founder
                </h2>
                <div className="h-1 w-20 bg-[#8d4745] rounded-full"></div>
              </div>

              <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                <p className="font-semibold text-[#8d4745] text-2xl font-['Instrument_Serif'] italic">
                  "I am Tanuja..."
                </p>
                <p>
                  All my schooling and my B.Tech graduation was in Anantapur. Since then, I have been working as an IT employee.
                  However, I have always dreamed of turning my dream into reality. I am a girl who has always envisioned
                  achieving something meaningful in my life, and my dream is to become an entrepreneur.
                </p>
                <p>
                  I chose the beauty and cosmetics field because I have a strong interest in skincare and beauty.
                  This field allows me to combine creativity with helping people feel confident and happy in their own skin.
                </p>
                <p className="bg-orange-50 p-6 rounded-xl border-l-4 border-[#8d4745] italic text-gray-800">
                  "Beauty isn’t just about looks—it’s about self-expression and building self confidence"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 bg-[#8d4745]/10 rounded-full flex items-center justify-center text-[#8d4745]">
                  <Award size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Tanuja</p>
                  <p className="text-sm text-gray-500">Founder & Visionary</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      {!isLoginAbout && (
        <AnimatedSection className="py-16 bg-[#8d4745] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-6">
              Join the TerraSkin Family
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Experience the difference that premium, science-backed skincare can make
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/shop"
                className="inline-block bg-white text-[#8d4745] px-8 py-3 rounded-full hover:bg-gray-100 transition-colors duration-300 font-semibold"
              >
                Shop Our Collection
              </a>
              <a
                href="/contact"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-[#8d4745] transition-colors duration-300 font-semibold"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
};

export default AboutPage;
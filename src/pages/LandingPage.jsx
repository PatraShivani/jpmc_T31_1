import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { useVolunteers } from '../hooks/useFirebase';
import { 
  GraduationCap, 
  Heart, 
  Users, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail,
  Star,
  Award,
  BookOpen,
  UserCheck
} from 'lucide-react';

const LandingPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addVolunteer } = useVolunteers();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginRole, setLoginRole] = useState('');
  const [volunteerData, setVolunteerData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    availability: '',
    experience: ''
  });

  const handleLoginClick = (role) => {
    setLoginRole(role);
    setLoginData({ email: '', password: '' });
    setIsLoginModalOpen(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(loginData.email, loginData.password);
    if (result.success) {
      setIsLoginModalOpen(false);
      navigate('/dashboard');
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    const newVolunteer = {
      ...volunteerData,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    try {
      await addVolunteer(newVolunteer);
      setVolunteerData({
        name: '',
        email: '',
        phone: '',
        skills: '',
        availability: '',
        experience: ''
      });

      alert('✅ Thank you for volunteering! Your application has been submitted to Firebase successfully.');
    } catch (error) {
      alert(`❌ Error submitting application: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kalams-orange/10 via-white to-kalams-blue/10">
      {/* Header with Login Options */}
      <header className="bg-white/80 backdrop-blur-sm shadow-neumorphic-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-kalams-orange to-kalams-blue rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">KS</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kalam</h1>
                <p className="text-sm text-gray-600">Foundation</p>
              </div>
            </div>

            {/* Login Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={() => handleLoginClick('tutor')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <UserCheck className="h-4 w-4" />
                <span>Login as Tutor</span>
              </Button>
              <Button
                onClick={() => handleLoginClick('admin')}
                variant="kalam"
                className="flex items-center space-x-2"
              >
                <Award className="h-4 w-4" />
                <span>Login as Admin</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Empowering Communities Through
            <span className="bg-gradient-to-r from-kalams-orange to-kalams-blue bg-clip-text text-transparent">
              {" "}Education
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Kalam Foundation is dedicated to transforming lives through quality education,
            skill development, and community empowerment programs for underprivileged families.
          </p>
          
          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
            <div className="neumorphic-card p-6 text-center">
              <Users className="h-12 w-12 text-kalams-blue mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">156+</h3>
              <p className="text-gray-600">Families Supported</p>
            </div>
            <div className="neumorphic-card p-6 text-center">
              <GraduationCap className="h-12 w-12 text-kalams-orange mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">342+</h3>
              <p className="text-gray-600">Students Educated</p>
            </div>
            <div className="neumorphic-card p-6 text-center">
              <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">89+</h3>
              <p className="text-gray-600">Women Empowered</p>
            </div>
            <div className="neumorphic-card p-6 text-center">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">96%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-kalams-blue/5 to-kalams-orange/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Stories of Transformation</h2>
            <p className="text-xl text-gray-600">Real stories from our community members</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Story 1 - Woman Empowerment */}
            <Card className="neumorphic-card hover:shadow-neumorphic-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Priya Sharma</h3>
                    <p className="text-sm text-gray-600">Tailoring Graduate</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "After completing the tailoring course at KALAMS, I started my own boutique.
                  Now I support my family and employ 3 other women from my community.
                  This program changed my life completely."
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Mehdipatnam Center</span>
                </div>
              </CardContent>
            </Card>

            {/* Story 2 - Student Success */}
            <Card className="neumorphic-card hover:shadow-neumorphic-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Arjun Kumar</h3>
                    <p className="text-sm text-gray-600">Class 10 Student</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "I was struggling with mathematics until I joined Kalam. The tutors here
                  made learning fun and easy. I scored 95% in my board exams and now dream
                  of becoming an engineer!"
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Santosh Nagar Center</span>
                </div>
              </CardContent>
            </Card>

            {/* Story 3 - Family Transformation */}
            <Card className="neumorphic-card hover:shadow-neumorphic-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Lakshmi Devi</h3>
                    <p className="text-sm text-gray-600">Mother of 3</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Kalam supported my entire family. My children get quality education,
                  I learned computer skills, and my husband found better work. We moved
                  from a slum to a proper house. Grateful forever!"
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Charminar Center</span>
                </div>
              </CardContent>
            </Card>

            {/* Story 4 - Young Achiever */}
            <Card className="neumorphic-card hover:shadow-neumorphic-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Ananya Reddy</h3>
                    <p className="text-sm text-gray-600">Age 14</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "I love coming to Kalam! The teachers are so kind and patient.
                  I learned English and computers here. Now I help my mother with
                  her small business using what I learned."
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Secunderabad Center</span>
                </div>
              </CardContent>
            </Card>

            {/* Story 5 - Skill Development */}
            <Card className="neumorphic-card hover:shadow-neumorphic-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Meera Begum</h3>
                    <p className="text-sm text-gray-600">Handicrafts Artisan</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "The handicrafts training gave me a new identity. I make beautiful
                  jewelry and decorative items. My products are now sold in local
                  markets and I earn ₹15,000 per month!"
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Kukatpally Center</span>
                </div>
              </CardContent>
            </Card>

            {/* Story 6 - Academic Excellence */}
            <Card className="neumorphic-card hover:shadow-neumorphic-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Rahul Patel</h3>
                    <p className="text-sm text-gray-600">Science Student</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Kalam gave me the foundation I needed. From struggling with basic
                  concepts to winning the district science fair - this journey has been
                  incredible. Thank you for believing in me!"
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Mehdipatnam Center</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
            <p className="text-xl text-gray-600">Comprehensive programs designed to create lasting impact</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="neumorphic-card hover:shadow-neumorphic-lg transition-all duration-300">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-kalams-blue mb-4" />
                <CardTitle>Education Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Quality education programs for children from underprivileged families, 
                  including tutoring, learning materials, and academic support.
                </p>
              </CardContent>
            </Card>

            <Card className="neumorphic-card hover:shadow-neumorphic-lg transition-all duration-300">
              <CardHeader>
                <Heart className="h-12 w-12 text-pink-500 mb-4" />
                <CardTitle>Women Empowerment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Skill development programs for women including tailoring, computer skills, 
                  and entrepreneurship training to achieve financial independence.
                </p>
              </CardContent>
            </Card>

            <Card className="neumorphic-card hover:shadow-neumorphic-lg transition-all duration-300">
              <CardHeader>
                <Users className="h-12 w-12 text-kalams-orange mb-4" />
                <CardTitle>Family Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive family support programs including healthcare assistance, 
                  counseling, and community development initiatives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Events & Volunteer Registration */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600">Join us in making a difference</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Events List */}
            <div className="space-y-6">
              <Card className="neumorphic-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-kalams-orange text-white p-3 rounded-lg">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Annual Education Fair
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>March 15, 2024</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>Mehdipatnam Community Hall, Hyderabad</span>
                      </div>
                      <p className="text-gray-600">
                        Join us for our annual education fair featuring workshops, 
                        student exhibitions, and community celebrations.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="neumorphic-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-kalams-blue text-white p-3 rounded-lg">
                      <Heart className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Women's Skill Development Workshop
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>March 22, 2024</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>Santosh Nagar Training Center, Hyderabad</span>
                      </div>
                      <p className="text-gray-600">
                        Intensive workshop on digital literacy and entrepreneurship 
                        skills for women in our community.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Volunteer Registration Form */}
            <Card className="neumorphic-card">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Volunteer With Us</CardTitle>
                <p className="text-gray-600 text-center">
                  Make a difference in your community by volunteering with Kalam Foundation
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      value={volunteerData.name}
                      onChange={(e) => setVolunteerData({...volunteerData, name: e.target.value})}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={volunteerData.email}
                        onChange={(e) => setVolunteerData({...volunteerData, email: e.target.value})}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <Input
                        type="tel"
                        value={volunteerData.phone}
                        onChange={(e) => setVolunteerData({...volunteerData, phone: e.target.value})}
                        placeholder="Your phone number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills & Expertise
                    </label>
                    <Input
                      type="text"
                      value={volunteerData.skills}
                      onChange={(e) => setVolunteerData({...volunteerData, skills: e.target.value})}
                      placeholder="e.g., Teaching, IT, Healthcare, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <Select
                      value={volunteerData.availability}
                      onChange={(e) => setVolunteerData({...volunteerData, availability: e.target.value})}
                    >
                      <option value="">Select your availability</option>
                      <option value="weekends">Weekends Only</option>
                      <option value="weekdays">Weekdays</option>
                      <option value="flexible">Flexible</option>
                      <option value="events-only">Events Only</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Experience
                    </label>
                    <textarea
                      value={volunteerData.experience}
                      onChange={(e) => setVolunteerData({...volunteerData, experience: e.target.value})}
                      placeholder="Tell us about your volunteering or relevant experience..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kalams-blue focus:border-transparent"
                      rows="3"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="kalam"
                    className="w-full"
                  >
                    Register as Volunteer
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-kalams-orange to-kalams-blue rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">KS</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Kalam Foundation</h3>
                </div>
              </div>
              <p className="text-gray-400">
                Empowering communities through education, skill development, and social impact programs.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@kalams.org</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Hyderabad, India</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <p className="text-gray-400 hover:text-white cursor-pointer">About Us</p>
                <p className="text-gray-400 hover:text-white cursor-pointer">Our Programs</p>
                <p className="text-gray-400 hover:text-white cursor-pointer">Get Involved</p>
                <p className="text-gray-400 hover:text-white cursor-pointer">Contact</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Kalam Foundation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title={`Login as ${loginRole.charAt(0).toUpperCase() + loginRole.slice(1)}`}
      >
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              placeholder={`Enter your ${loginRole} email`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" variant="kalam" className="flex-1">
              Login
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsLoginModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LandingPage;

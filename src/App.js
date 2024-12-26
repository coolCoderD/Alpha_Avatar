import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HeroSection from './components/sections/HeroSection';
import AvatarCreation from './components/sections/AvatarCreation';
import CustomizableAvatar from './components/sections/CustomizableAvatar';
import InnovativeAI from './components/sections/InnovativeAI';
import GlobalGifting from './components/sections/GlobalGifting';
import MembershipPlans from './components/sections/MembershipPlans';
import TeamSection from './components/sections/TeamSection';
import JoinWaitlist from './components/sections/JoinWaitlist';
import './App.css';
import Login from './components/sections/Login';
import SignIn from './components/sections/SignIn';
import OtpVerification from './components/sections/OtpVerification';
import AccountVerification from './components/sections/AccountVerification';
import Description from './components/sections/Description';
import Memberships from './components/sections/Memberships';
import EditAvatar from './components/sections/EditAvatar';
import FeedbackForm from './components/sections/FeedbackForm';
import TestComponent from './components/TestComponet';
import Success from './components/sections/Success';

function App() {
  // Check if user is authenticated
  const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    return !!user; // Returns true if user exists, false otherwise
  };

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HeroSection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/otp" element={<OtpVerification />} />
          <Route path="/account-verification" element={<AccountVerification />} />
          <Route path="/description" element={<Description />} />

          {/* Protected Routes */}
          <Route
            path="/memberships"
            element={isAuthenticated() ? <Memberships /> : <Navigate to="/login" />}
          />
          <Route
            path="/memberships-plan"
            element={isAuthenticated() ? <MembershipPlans /> : <Navigate to="/login" />}
          />
          <Route
            path="/avatar-creation"
            element={isAuthenticated() ? <AvatarCreation /> : <Navigate to="/login" />}
          />
          <Route
            path="/edit-avatar"
            element={isAuthenticated() ? <EditAvatar /> : <Navigate to="/login" />}
          />
          <Route
            path="/team"
            element={isAuthenticated() ? <TeamSection /> : <Navigate to="/login" />}
          />
          <Route
            path="/join-waitlist"
            element={isAuthenticated() ? <JoinWaitlist /> : <Navigate to="/login" />}
          />
          <Route
            path="/feedback"
            element={isAuthenticated() ? <FeedbackForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/test"
            element={isAuthenticated() ? <TestComponent /> : <Navigate to="/login" />}
          />
          <Route
            path="/success"
            element={isAuthenticated() ? <Success /> : <Navigate to="/login" />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

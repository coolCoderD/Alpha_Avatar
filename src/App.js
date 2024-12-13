import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

import ProtectedRoute from './components/layout/ProtectedRoute';
import { PricingSection } from './components/sections/Pricing/PricingSection';
import TestComponent from './components/TestComponet';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/otp" element={<OtpVerification />} />
          <Route path="/account-verification" element={<AccountVerification />} />
          <Route path="/description" element={<Description />} />
          <Route path="/memberships" element={<Memberships />} />
          <Route path="/memberships-plan" element={<MembershipPlans />} />
          <Route path="/avatar-creation" element={<AvatarCreation />} />
          <Route path="/edit-avatar" element={<EditAvatar />} />
          <Route path="/team" element={<TeamSection />} />
          <Route path="/join-waitlist" element={<JoinWaitlist />} />
          <Route path="/feedback" element={<FeedbackForm />} />
         <Route path='/price' element={<PricingSection />} />
         <Route path='/test' element={<TestComponent/>}/>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

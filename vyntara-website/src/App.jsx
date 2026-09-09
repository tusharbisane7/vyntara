import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Home from './pages/Home';

import PrivacyPolicy
  from './pages/PrivacyPolicy/PrivacyPolicy';

import Terms
  from './pages/Terms/Terms';

import Careers from './pages/Careers/Careers';

import AdminLogin
  from './pages/AdminLogin/AdminLogin';

import AdminDashboard
  from './pages/AdminDashboard/AdminDashboard';

import ProjectForm
  from './components/ProjectForm/ProjectForm';

import ScrollToTop
  from './components/ScrollToTop/ScrollToTop';

import './App.css';

function App() {
  return (
    <BrowserRouter>

      {/* Scroll to top whenever route changes */}
      <ScrollToTop />

      <div className="app">

        <Routes>

          {/* =====================================
              HOME
          ===================================== */}

          <Route
            path="/"
            element={<Home />}
          />


          {/* =====================================
              LEGAL PAGES
          ===================================== */}

          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy />}
          />

          <Route
            path="/terms"
            element={<Terms />}
          />


<Route
    path="/careers"
    element={<Careers />}
  />
          {/* =====================================
              ADMIN
          ===================================== */}

          <Route
            path="/admin"
            element={<AdminLogin />}
          />

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

        </Routes>


        {/* =====================================
            PROJECT FORM
        ===================================== */}

        <ProjectForm />

      </div>

    </BrowserRouter>
  );
}

export default App;
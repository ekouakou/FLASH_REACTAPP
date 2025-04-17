import './App.css';
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
// import LoadExternalScripts from './AppComponents/LoadExternalScripts';
import Wizard from './AppPages/Home/Wizard';
import VerticalTicketWizard from './AppPages/Home/wiazard/VerticalTicketWizard';




function App() {
  return (
    <div className="app-content">
      <Router>
        {/* <ScrollToTop /> */}

        <div className="content">
          <Routes>
            {/* <Route path="/" element={<Wizard />} /> */}
            <Route path="/" element={<VerticalTicketWizard />} />
          </Routes>
        </div>
        {/* <Footer /> */}
      </Router>
      {/* <LoadExternalScripts /> */}
    </div>
  );
}

export default App;

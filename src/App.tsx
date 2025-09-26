import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AssessmentWrapper } from "./pages/AssessmentWrapper";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route
            path="/assessment/:candidateUuid"
            element={<AssessmentWrapper />}
          />
         {/* <Route
            path="/"
            element={
              <Navigate
                to="/assessment/a1c33fc9-ec97-4553-9f5a-de6cdc89baa7"
                replace
              />
            }
          />
          */}
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

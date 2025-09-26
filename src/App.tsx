import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AssessmentWrapper } from "./pages/AssessmentWrapper";

const RedirectWithDebug = () => {
  const { candidateUuid } = useParams();
  console.log("Captured candidateUuid from URL:", candidateUuid); // This will show in console if matched
  if (!candidateUuid) {
    console.warn("No candidateUuid captured—check the incoming URL path.");
    return <Navigate to="/assessment" replace />; // Fallback if no param
  }
  return <Navigate to={`/assessment/${candidateUuid}`} replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route
            path="/assessment/:candidateUuid"
            element={<AssessmentWrapper />}
          />

          <Route
            path="/:candidateUuid"
            element={<RedirectWithDebug />}
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

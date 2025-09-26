import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AssessmentWrapper } from "./pages/AssessmentWrapper";

const RootRedirect = () => {
  const [searchParams] = useSearchParams();
  const candidateUuid = searchParams.get("unique_link_id");
  console.log("Captured unique_link_id from query:", candidateUuid); // Optional: for debugging—remove after testing
  if (candidateUuid) {
    return <Navigate to={`/assessment/${candidateUuid}`} replace />;
  }
  return <Navigate to="/assessment" replace />; // Fallback if no UUID (e.g., go to a landing page or error)
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

          <Route path="/" element={<RootRedirect />} />
          
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

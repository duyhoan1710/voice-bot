import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./Home";

function App() {
  const queryClient = new QueryClient();

  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/rooms" element={<Home />} />
          <Route path="/rooms/:roomId" element={<Home />} />

          <Route path="*" element={<Navigate to="/rooms" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

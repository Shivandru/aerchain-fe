// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import Index from "./pages/Index";
import CreateRFP from "./pages/CreateRFP";
import AllRFPs from "./pages/AllRFPs";
import RFPDetail from "./pages/RFPDetail";
import Comparison from "./pages/Comparison";
import Vendors from "./pages/Vendors";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create-rfp" element={<CreateRFP />} />
          <Route path="/rfps" element={<AllRFPs />} />
          <Route path="/rfps/:id" element={<RFPDetail />} />
          <Route path="/rfps/:id/compare" element={<Comparison />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

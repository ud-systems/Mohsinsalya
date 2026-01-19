import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Tracking } from "@/components/Tracking";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { PageTransition } from "@/components/ui/page-transition";
import { InitialLoader } from "@/components/ui/initial-loader";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import CharityWorks from "./pages/CharityWorks";
import Biography from "./pages/Biography";
import Markets from "./pages/Markets";
import MarketDetail from "./pages/MarketDetail";
import Insights from "./pages/Insights";
import InsightDetail from "./pages/InsightDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <PageTransition><Admin /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route path="/charity-works" element={<PageTransition><CharityWorks /></PageTransition>} />
        <Route path="/biography" element={<PageTransition><Biography /></PageTransition>} />
        <Route path="/markets" element={<PageTransition><Markets /></PageTransition>} />
        <Route path="/markets/:id" element={<PageTransition><MarketDetail /></PageTransition>} />
        <Route path="/insights" element={<PageTransition><Insights /></PageTransition>} />
        <Route path="/insights/:id" element={<PageTransition><InsightDetail /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <InitialLoader />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <ReadingProgress />
        <Tracking />
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

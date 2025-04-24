import { HelmetProvider, Helmet } from "react-helmet-async";
import { PublicPage } from "./pages/public";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { MyFiles } from "./pages/files";
import { Admin } from "./pages/admin";
import { LogoutPage } from "./pages/logout";
//import {CheckoutForm} from "./pages/subscription"
import { Downloads } from "./pages/downloads";
import { DataView } from "./pages/dataview";
import { GenePage } from "./pages/gene";
import { HelpPage } from "./pages/help";
import { ZooPage } from "./pages/zoo";
import { LogsPage } from "./pages/logs";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Add GTM script using Helmet */}
        <Helmet>
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-KWK5EC1P91"></script>
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KWK5EC1P91');
            `}
          </script>
        </Helmet>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicPage />} />
            <Route path="/collection/:collectionId" element={<Dashboard />} />
            <Route path="/search" element={<Dashboard />} />
            <Route path="/myfiles" element={<MyFiles />} />
            {/*<Route path="/subscription" element={<CheckoutForm />} /> */}
            <Route path="/admin/:page" element={<Admin />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/download" element={<Downloads />} />
            <Route path="/data" element={<DataView />} />
            <Route path="/gene/:geneName" element={<GenePage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/zoo" element={<ZooPage />} />
            <Route path="/logs" element={<LogsPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
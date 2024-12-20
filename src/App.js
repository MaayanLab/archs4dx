import { HelmetProvider } from "react-helmet-async";
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
import {Downloads} from "./pages/downloads";
import {DataView} from "./pages/dataview";
import {GenePage} from "./pages/gene";
import {HelpPage} from "./pages/help";
import {ZooPage} from "./pages/zoo";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;

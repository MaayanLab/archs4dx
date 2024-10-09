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
            <Route path="/admin/:page" element={<Admin />} />
            <Route path="/logout" element={<LogoutPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;

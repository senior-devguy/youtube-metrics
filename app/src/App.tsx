import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import Overview from "@/pages/Overview";
import YouTubePage from "@/pages/YouTube";
import WebStorePage from "@/pages/WebStore";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Overview />} />
            <Route path="/youtube" element={<YouTubePage />} />
            <Route path="/store" element={<WebStorePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

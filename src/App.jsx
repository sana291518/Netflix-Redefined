// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from "./pages/Home";
import { Watch } from "./pages/Watch";
import AppProvider from "./context";
import "./styles/global.css";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

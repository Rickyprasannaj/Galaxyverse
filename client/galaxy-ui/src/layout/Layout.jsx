import { Outlet, useNavigate, useLocation } from "react-router-dom";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    
    <div className="app-background">
      {/* Page Content */}
      <Outlet />

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div
          className={`tab ${location.pathname === "/home" ? "active" : ""}`}
          onClick={() => navigate("/home")}
        >
          🏠 Home
        </div>

        <div
          className={`tab ${location.pathname === "/gels" ? "active" : ""}`}
          onClick={() => navigate("/gels")}
        >
          🪐 Gels
        </div>
        
        <div
          className={`tab ${location.pathname === "/signals" ? "active" : ""}`}
          onClick={() => navigate("/signals")}
        >
          🔔 Signals
        </div>
      </div>
    </div>
  );
}

export default Layout;
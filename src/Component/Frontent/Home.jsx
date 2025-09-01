import React, { useState, useEffect } from "react";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyrpOL3hzZZ3xM1IsdH_QcdbGBTfcwjIPoiB80hEO2ywjMKlbuVArpbm14pz7f_0-xGuw/exec";

// Loading Component
const LoadingScreen = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        transition: "opacity 0.5s ease-out",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          border: "4px solid rgba(255, 255, 255, 0.2)",
          borderLeft: "4px solid white",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "20px",
        }}
      ></div>
      <div
        style={{
          color: "white",
          fontSize: "1.2rem",
          fontWeight: "600",
          animation: "pulse 2s ease-in-out infinite",
          textAlign: "center",
        }}
      >
        Loading Kobitar House...
      </div>
    </div>
  );
};

// Lazy Spline Component with fallback
const LazySpline = ({ scene, ...props }) => {
  const [SplineComponent, setSplineComponent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSpline = async () => {
      try {
        // Dynamically import Spline
        const splineModule = await import("@splinetool/react-spline");
        setSplineComponent(() => splineModule.default);
        setTimeout(() => setIsLoaded(true), 1000);
      } catch (error) {
        console.error("Failed to load Spline:", error);
        setIsLoaded(true);
      }
    };

    const timer = setTimeout(loadSpline, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "4px solid rgba(255, 255, 255, 0.2)",
              borderLeft: "4px solid white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
        </div>
      )}
      {SplineComponent && (
        <SplineComponent
          scene={scene}
          {...props}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </>
  );
};

// Custom Dropdown Component
const CustomDropdown = ({ title, items, isOpen, toggleOpen }) => {
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={toggleOpen}
        style={{
          background: "none",
          border: "none",
          color: "#2d3748",
          fontWeight: "500",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          transition: "all 0.3s ease",
          fontSize: "0.9rem",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          e.target.style.color = "#667eea";
          e.target.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.target.style.color = "#2d3748";
          e.target.style.transform = "translateY(0)";
        }}
      >
        {title} ▼
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            background: "white",
            minWidth: "200px",
            maxWidth: "250px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
            borderRadius: "10px",
            padding: "10px 0",
            zIndex: 1000,
            border: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "0.9rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f8fafc";
                e.target.style.color = "#667eea";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#2d3748";
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Header Component
const Header = ({ activeLink, handleNavClick, members }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    background: isScrolled
      ? "rgba(255, 255, 255, 0.98)"
      : "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    transition: "all 0.3s ease",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: isScrolled
      ? "0 4px 30px rgba(0, 0, 0, 0.15)"
      : "0 2px 20px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    padding: isMobile ? "0.8rem 0" : "1rem 0",
  };

  const brandStyle = {
    fontWeight: "700",
    fontSize: isMobile ? "1.4rem" : "1.8rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textDecoration: "none",
    marginRight: "2rem",
  };

  const navLinkStyle = {
    fontWeight: "500",
    color: "#2d3748",
    transition: "all 0.3s ease",
    position: "relative",
    padding: "0.5rem 1rem",
    textDecoration: "none",
    margin: isMobile ? "0.5rem 0" : "0 0.25rem",
    display: "block",
    fontSize: isMobile ? "1rem" : "0.95rem",
  };

  const mobileMenuStyle = {
    display: isMobile && isMobileMenuOpen ? "flex" : "none",
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(20px)",
    flexDirection: "column",
    padding: "1rem",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    borderTop: "1px solid rgba(0, 0, 0, 0.1)",
  };

  return (
    <header>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
          }
          
          .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
          }
          
          .nav-link-active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 3px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 2px;
          }

          .mobile-menu-toggle {
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 30px;
            height: 30px;
            cursor: pointer;
          }

          .mobile-menu-toggle span {
            width: 25px;
            height: 3px;
            background: #2d3748;
            margin: 2px 0;
            transition: 0.3s;
          }

          @media (max-width: 768px) {
            .mobile-menu-toggle {
              display: flex;
            }
          }
        `}
      </style>
      <nav style={navStyle}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          <a href="#home" style={brandStyle}>
            ⭐ Kobitar House
          </a>

          {/* Desktop Navigation */}
          <div
            style={{
              display: isMobile ? "none" : "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <a
              href="#home"
              onClick={() => handleNavClick("home")}
              style={{
                ...navLinkStyle,
                color: activeLink === "home" ? "#667eea" : "#2d3748",
              }}
              className={activeLink === "home" ? "nav-link-active" : ""}
              onMouseEnter={(e) => {
                e.target.style.color = "#667eea";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color =
                  activeLink === "home" ? "#667eea" : "#2d3748";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Home
            </a>

            <a
              href="#content"
              onClick={() => handleNavClick("content")}
              style={{
                ...navLinkStyle,
                color: activeLink === "content" ? "#667eea" : "#2d3748",
              }}
              className={activeLink === "content" ? "nav-link-active" : ""}
              onMouseEnter={(e) => {
                e.target.style.color = "#667eea";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color =
                  activeLink === "content" ? "#667eea" : "#2d3748";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Dashboard
            </a>

            <a
              href="#shopping"
              onClick={() => handleNavClick("shopping")}
              style={{
                ...navLinkStyle,
                color: activeLink === "shopping" ? "#667eea" : "#2d3748",
              }}
              className={activeLink === "shopping" ? "nav-link-active" : ""}
              onMouseEnter={(e) => {
                e.target.style.color = "#667eea";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color =
                  activeLink === "shopping" ? "#667eea" : "#2d3748";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Shopping
            </a>

            <CustomDropdown
              title="👥 Members"
              items={members}
              isOpen={isDropdownOpen}
              toggleOpen={() => setIsDropdownOpen(!isDropdownOpen)}
            />
          </div>

          {/* Mobile Menu Toggle */}
          <div
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ display: isMobile ? "flex" : "none" }}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Mobile Navigation */}
          <div style={mobileMenuStyle}>
            <a
              href="#home"
              onClick={() => {
                handleNavClick("home");
                setIsMobileMenuOpen(false);
              }}
              style={{
                ...navLinkStyle,
                color: activeLink === "home" ? "#667eea" : "#2d3748",
                textAlign: "center",
              }}
            >
              Home
            </a>

            <a
              href="#content"
              onClick={() => {
                handleNavClick("content");
                setIsMobileMenuOpen(false);
              }}
              style={{
                ...navLinkStyle,
                color: activeLink === "content" ? "#667eea" : "#2d3748",
                textAlign: "center",
              }}
            >
              Dashboard
            </a>

            <a
              href="#shopping"
              onClick={() => {
                handleNavClick("shopping");
                setIsMobileMenuOpen(false);
              }}
              style={{
                ...navLinkStyle,
                color: activeLink === "shopping" ? "#667eea" : "#2d3748",
                textAlign: "center",
              }}
            >
              Shopping
            </a>

            <div style={{ padding: "1rem 0", textAlign: "center" }}>
              <CustomDropdown
                title="👥 Members"
                items={members}
                isOpen={isDropdownOpen}
                toggleOpen={() => setIsDropdownOpen(!isDropdownOpen)}
              />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

// Main Component
const Home = () => {
  const [data, setData] = useState([]);
  const [activeLink, setActiveLink] = useState("home");
  const [expenses, setExpenses] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const members = [
    "Labib",
    "Ovi",
    "Jashim",
    "Tahmim",
    "Shafi",
    "Ashrafull",
    "Bhadon",
    "Nayeem",
  ];

  const WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbwrIXmABO_gd3xOLre4wjlJmceWBYtlkqYyDxOpTdv19TfPsF-SDIW_TsnCS6FT7uQGOQ/exec";

  const handleNavClick = (link) => setActiveLink(link);

  // Load data functions
  const loadData = async () => {
    try {
      const res = await fetch(SCRIPT_URL);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch(WEB_APP_URL);
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const loadAllData = async () => {
      setIsLoadingData(true);
      await Promise.all([loadData(), fetchExpenses()]);
      setIsLoadingData(false);
    };

    loadAllData();

    // App loading simulation
    const appLoadTimer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2500);

    return () => {
      clearTimeout(appLoadTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Scroll animation effect
  useEffect(() => {
    if (isAppLoading) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(".fade-in");
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isAppLoading]);

  // Calculations
  const totalCollected = data.reduce(
    (sum, row) => sum + Number(row.Amount || 0),
    0
  );
  const totalSpent = expenses.reduce(
    (sum, e) => sum + parseFloat(e.Amount || 0),
    0
  );

  const firstDate = expenses.length
    ? new Date(
        expenses.reduce((min, e) => {
          const d = new Date(e.Date);
          return d < min ? d : min;
        }, new Date(expenses[0].Date))
      )
    : null;

  const today = new Date();
  const daysSinceStart = firstDate
    ? Math.ceil((today - firstDate) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  // Common styles
  const sectionStyle = {
    padding: isMobile ? "60px 0" : "100px 0",
    minHeight: isMobile ? "auto" : "100vh",
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: isMobile ? "0 15px" : "0 20px",
  };

  const cardStyle = {
    background: "white",
    borderRadius: isMobile ? "15px" : "20px",
    padding: isMobile ? "20px" : "30px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(20px)",
    marginBottom: isMobile ? "20px" : "30px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
    fontSize: isMobile ? "0.85rem" : "1rem",
  };

  const thStyle = {
    padding: isMobile ? "8px" : "12px",
    textAlign: "left",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    fontWeight: "600",
    fontSize: isMobile ? "0.8rem" : "1rem",
  };

  const tdStyle = {
    padding: isMobile ? "8px" : "12px",
    textAlign: "left",
    borderBottom: "1px solid #e2e8f0",
    fontSize: isMobile ? "0.85rem" : "1rem",
  };

  return (
    <>
      <LoadingScreen isLoading={isAppLoading} />

      <Header
        activeLink={activeLink}
        handleNavClick={handleNavClick}
        members={members}
      />

      {/* Hero Section */}
      <section
        id="home"
        style={{
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LazySpline
          scene="https://prod.spline.design/zpU4YXAzT49x6eJO/scene.splinecode"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            color: "white",
            padding: isMobile ? "0 15px" : "0 20px",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? "2.5rem" : "4rem",
              fontWeight: "800",
              marginBottom: "1rem",
              textShadow: "2px 2px 20px rgba(0, 0, 0, 0.5)",
              animation: "fadeInUp 1s ease-out 0.5s both",
              lineHeight: isMobile ? "1.2" : "1.1",
            }}
          >
            Welcome to Kobitar House
          </h1>
          <p
            style={{
              fontSize: isMobile ? "1.1rem" : "1.5rem",
              opacity: "0.9",
              marginBottom: "2rem",
              animation: "fadeInUp 1s ease-out 1s both",
              lineHeight: "1.4",
            }}
          >
            Your Premium Financial Management Dashboard
          </p>
        </div>
      </section>

      {/* Shopping Section */}
      <section
        id="content"
        style={{
          ...sectionStyle,
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
      >
        <div style={containerStyle}>
          <div
            className="fade-in"
            style={{
              textAlign: "center",
              marginBottom: isMobile ? "40px" : "60px",
            }}
          >
            <h1
              style={{
                fontSize: isMobile ? "2.2rem" : "3rem",
                fontWeight: "800",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1rem",
                lineHeight: "1.2",
              }}
            >
              💰 Expense Tracker
            </h1>
            <p
              style={{
                fontSize: isMobile ? "1rem" : "1.2rem",
                color: "#64748b",
                fontWeight: "500",
                lineHeight: "1.4",
              }}
            >
              Professional Group Financial Management
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(350px, 1fr))",
              gap: isMobile ? "20px" : "30px",
              marginBottom: isMobile ? "30px" : "40px",
            }}
          >
            {/* Amount Collected Card */}
            <div
              className="fade-in"
              style={cardStyle}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 60px rgba(0, 0, 0, 0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 40px rgba(0, 0, 0, 0.1)";
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                  paddingBottom: "15px",
                  borderBottom: "2px solid #f1f5f9",
                  flexDirection: isMobile ? "column" : "row",
                  textAlign: isMobile ? "center" : "left",
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? "1.8rem" : "2rem",
                    marginRight: isMobile ? "0" : "15px",
                    marginBottom: isMobile ? "10px" : "0",
                  }}
                >
                  💵
                </div>
                <h3
                  style={{
                    fontSize: isMobile ? "1.3rem" : "1.5rem",
                    fontWeight: "700",
                    color: "#1e293b",
                    margin: 0,
                  }}
                >
                  Amount Collected
                </h3>
              </div>
              <div
                style={{
                  fontSize: isMobile ? "2rem" : "2.5rem",
                  fontWeight: "800",
                  color: "#059669",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                ৳{totalCollected.toLocaleString()}
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, idx) => (
                      <tr key={idx} style={{ transition: "all 0.3s ease" }}>
                        <td style={tdStyle}>{row.Name}</td>
                        <td style={tdStyle}>
                          ৳{Number(row.Amount || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Expenses Card */}
            <div
              className="fade-in"
              style={cardStyle}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 60px rgba(0, 0, 0, 0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 40px rgba(0, 0, 0, 0.1)";
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                  paddingBottom: "15px",
                  borderBottom: "2px solid #f1f5f9",
                  flexDirection: isMobile ? "column" : "row",
                  textAlign: isMobile ? "center" : "left",
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? "1.8rem" : "2rem",
                    marginRight: isMobile ? "0" : "15px",
                    marginBottom: isMobile ? "10px" : "0",
                  }}
                >
                  🛒
                </div>
                <h3
                  style={{
                    fontSize: isMobile ? "1.3rem" : "1.5rem",
                    fontWeight: "700",
                    color: "#1e293b",
                    margin: 0,
                  }}
                >
                  Expenses
                </h3>
              </div>
              {isLoadingData ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      border: "3px solid #f3f3f3",
                      borderTop: "3px solid #667eea",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      margin: "0 auto 20px",
                    }}
                  ></div>
                  <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                    Loading expenses data...
                  </p>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      fontSize: isMobile ? "2rem" : "2.5rem",
                      fontWeight: "800",
                      color: "#dc2626",
                      marginBottom: "20px",
                      textAlign: "center",
                    }}
                  >
                    ৳{totalSpent.toLocaleString()}
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={thStyle}>Date</th>
                          <th style={thStyle}>Item</th>
                          <th style={thStyle}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map((expense, idx) => (
                          <tr key={idx} style={{ transition: "all 0.3s ease" }}>
                            <td style={tdStyle}>
                              {new Date(expense.Date).toLocaleDateString()}
                            </td>
                            <td style={tdStyle}>{expense.Item}</td>
                            <td style={tdStyle}>
                              ৳
                              {parseFloat(expense.Amount || 0).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Financial Summary Card */}
          <div
            className="fade-in"
            style={{
              ...cardStyle,
              gridColumn: isMobile ? "auto" : "1 / -1",
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 60px rgba(0, 0, 0, 0.15)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 40px rgba(0, 0, 0, 0.1)";
              }
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
                paddingBottom: "15px",
                borderBottom: "2px solid #f1f5f9",
                flexDirection: isMobile ? "column" : "row",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? "1.8rem" : "2rem",
                  marginRight: isMobile ? "0" : "15px",
                  marginBottom: isMobile ? "10px" : "0",
                }}
              >
                📊
              </div>
              <h3
                style={{
                  fontSize: isMobile ? "1.3rem" : "1.5rem",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                Financial Summary
              </h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fit, minmax(250px, 1fr))",
                gap: isMobile ? "15px" : "20px",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>💰</div>
                <h4 style={{ margin: "0 0 10px 0", color: "#374151" }}>
                  Total Collected
                </h4>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#059669",
                    margin: 0,
                  }}
                >
                  ৳{totalCollected.toLocaleString()}
                </p>
              </div>

              <div
                style={{
                  padding: "20px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>💸</div>
                <h4 style={{ margin: "0 0 10px 0", color: "#374151" }}>
                  Total Spent
                </h4>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#dc2626",
                    margin: 0,
                  }}
                >
                  ৳{totalSpent.toLocaleString()}
                </p>
              </div>

              <div
                style={{
                  padding: "20px",
                  background: "f8fafc",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>⚖️</div>
                <h4 style={{ margin: "0 0 10px 0", color: "#374151" }}>
                  Current Balance
                </h4>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#2563eb",
                    margin: 0,
                  }}
                >
                  ৳{(totalCollected - totalSpent).toLocaleString()}
                </p>
              </div>

              <div
                style={{
                  padding: "20px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>📅</div>
                <h4 style={{ margin: "0 0 10px 0", color: "#374151" }}>
                  Days Tracked
                </h4>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#7c3aed",
                    margin: 0,
                  }}
                >
                  {daysSinceStart}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#1e293b",
          color: "white",
          padding: isMobile ? "40px 0" : "60px 0",
          textAlign: "center",
        }}
      >
        <div style={containerStyle}>
          <div
            style={{
              fontSize: isMobile ? "1.8rem" : "2.5rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "20px",
            }}
          >
            ⭐ Kobitar House
          </div>
          <p style={{ marginBottom: "30px", opacity: "0.8" }}>
            Premium Financial Management for Shared Living
          </p>
          <div style={{ opacity: "0.6", fontSize: "0.9rem" }}>
            © {new Date().getFullYear()} Kobitar House. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;

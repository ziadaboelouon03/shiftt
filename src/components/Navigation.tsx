import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#what-is-shift", label: "About" },
    { href: "#pillars", label: "Services" },
    { href: "#housing", label: "Housing" },
    { href: "#centers", label: "Centers" },
    { href: "#contact", label: "Contact" },
  ];

  const handleGetStarted = () => {
    if (user) {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/auth");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-md shadow-soft border-b border-border/50" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <span className={`text-2xl font-bold transition-colors ${
              isScrolled ? "text-foreground" : "text-primary-foreground"
            }`}>
              SHIFT
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isScrolled ? "text-muted-foreground" : "text-primary-foreground/80 hover:text-primary-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
            {user ? (
              <div className="flex items-center gap-4">
                <span className={`text-sm ${isScrolled ? "text-muted-foreground" : "text-primary-foreground/80"}`}>
                  {user.email?.split("@")[0]}
                </span>
                <Button 
                  variant={isScrolled ? "outline" : "hero"} 
                  size="sm"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant={isScrolled ? "default" : "hero"} 
                size="sm"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-primary-foreground"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-primary-foreground"}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border/50 bg-background/95 backdrop-blur-md">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-foreground font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground py-2">
                    Signed in as {user.email}
                  </span>
                  <Button variant="outline" className="mt-2" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="default" className="mt-4" onClick={() => { navigate("/auth"); setIsMobileMenuOpen(false); }}>
                  Get Started
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

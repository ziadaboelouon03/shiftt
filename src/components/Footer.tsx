import { Heart, MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-3xl font-bold">SHIFT</h3>
            <p className="text-primary-foreground/70 leading-relaxed max-w-md">
              Bringing the heart of the city to your doorstep. 
              Decentralizing essential services across Egypt for a brighter, more connected future.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <MapPin className="w-4 h-4" />
                <span>Cairo, Egypt</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@shift.eg</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Phone className="w-4 h-4" />
                <span>+20 123 456 789</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#what-is-shift" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  About SHIFT
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Find a Center
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Get Involved
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © 2026 SHIFT Initiative. All rights reserved.
          </p>
          <p className="flex items-center gap-2 text-primary-foreground/60 text-sm">
            Made with <Heart className="w-4 h-4 text-accent" /> for Egypt
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

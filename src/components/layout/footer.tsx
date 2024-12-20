import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t py-6 sm:px-2">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        {/* Copyright Text */}
        <p className="text-sm text-center md:text-left text-muted-foreground">
          Copyright © GATI 2024, All rights reserved.
        </p>

        {/* Footer Navigation */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <Link to="/support" className="hover:underline">
            Support
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
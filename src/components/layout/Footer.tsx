import { Link } from 'react-router-dom';
import { Dumbbell, Mail } from 'lucide-react';

const CONTACT_EMAIL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONTACT_EMAIL) || 'abhishekarpulla@gmail.com';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-secondary mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-gradient-violet">
                <Dumbbell className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-text-primary bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                TrainBeyond AI
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Train with Purpose. Powered by AI. Inspired by You. Your gateway to transcending limits — one session,
              one habit, one breakthrough at a time.
            </p>
          </div>

          <div>
            <h4 className="text-text-primary font-bold text-lg mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <a href="/#features" className="text-text-secondary text-base hover:text-accent-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="text-text-secondary text-base hover:text-accent-primary transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/about" className="text-text-secondary text-base hover:text-accent-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary font-bold text-lg mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-text-secondary text-base cursor-pointer hover:text-text-primary transition-colors">Terms of Service</span>
              </li>
              <li>
                <span className="text-text-secondary text-base cursor-pointer hover:text-text-primary transition-colors">Privacy Policy</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary font-bold text-lg mb-4">Contact Us</h4>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 text-base text-text-secondary hover:text-accent-primary transition-colors mb-3"
            >
              <Mail className="w-4 h-4 shrink-0" />
              {CONTACT_EMAIL}
            </a>
            <ul className="space-y-2 text-sm text-text-secondary list-disc list-inside">
              <li>Feedback &amp; suggestions</li>
              <li>Support inquiries</li>
              <li>Partnership opportunities</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">© {year} TrainBeyond AI. All rights reserved.</p>
          <p className="text-text-secondary text-sm">Made with ❤️ by the TrainBeyond Team</p>
        </div>
      </div>
    </footer>
  );
}

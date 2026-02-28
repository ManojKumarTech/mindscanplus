import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-mint-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-mint-400 to-sky-400">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-mint-600 to-sky-600 bg-clip-text text-transparent">
                MindScan+
              </span>
            </div>
            <p className="text-gray-600 text-sm">Your mental wellbeing companion.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Navigation</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-mint-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/screening" className="hover:text-mint-600 transition-colors">
                  Screening
                </Link>
              </li>
              <li>
                <Link
                  to="/emotional-care"
                  className="hover:text-mint-600 transition-colors"
                >
                  Emotional Care
                </Link>
              </li>
              <li>
                <Link to="/self-care" className="hover:text-mint-600 transition-colors">
                  Self-Care
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/community" className="hover:text-mint-600 transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-mint-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-mint-600 transition-colors">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">In Crisis?</h3>
            <p className="text-sm text-gray-600 mb-2">
              If you're in immediate danger, please reach out for help.
            </p>
            <Button variant="ghost" className="text-sm">
              Crisis Resources →
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <p className="text-center text-gray-600 text-sm">
            Remember: You matter. Your feelings matter. And you're not alone in this journey.
          </p>
          <p className="text-center text-gray-500 text-xs mt-4">
            © 2024 MindScan+. This is a UI-only platform. For crisis support, please contact a mental
            health professional.
          </p>
        </div>
      </div>
    </footer>
  );
}

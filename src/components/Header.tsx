import { useEffect, useRef } from 'react';
import { useCountdown } from '../utils/countdown';
import FlowerAnimation from './FlowerAnimation';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Header = ({ activeSection, onSectionChange }: HeaderProps) => {
  const daysUntilWedding = useCountdown();
  
  // Handle navigation click
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    e.preventDefault();
    onSectionChange(section);
  };

  return (
    <header className="text-center mb-12 relative">
      <div className="mb-2">
        <FlowerAnimation scale={0.3} duration={3000} />
      </div>
      <div className="mb-8">        
        <h1 className="text-5xl tracking-wider mb-4">MATT & LAUREN</h1>
        <p className="text-lg tracking-wide mb-2.5">JULY 20, 2025 • DURHAM, NC</p>
        <p className="text-base tracking-wide">
          <span id="countdown">{daysUntilWedding}</span> DAYS TO GO!
        </p>
      </div>

      <nav className="mt-10 border-t border-gray-200 pt-5">
        <ul className="flex justify-center flex-wrap">
          <li className="mx-4">
            <a 
              href="#home" 
              onClick={(e) => handleNavClick(e, 'home')}
              className={`text-sm tracking-wide px-0 py-1.5 relative after:content-[''] after:absolute after:w-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-[#333] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full ${activeSection === 'home' ? 'after:w-full' : ''}`}
            >
              Home
            </a>
          </li>
          <li className="mx-4">
            <a 
              href="#photos" 
              onClick={(e) => handleNavClick(e, 'photos')}
              className={`text-sm tracking-wide px-0 py-1.5 relative after:content-[''] after:absolute after:w-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-[#333] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full ${activeSection === 'photos' ? 'after:w-full' : ''}`}
            >
              Photos
            </a>
          </li>
          <li className="mx-4">
            <a 
              href="#wedding-party" 
              onClick={(e) => handleNavClick(e, 'wedding-party')}
              className={`text-sm tracking-wide px-0 py-1.5 relative after:content-[''] after:absolute after:w-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-[#333] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full ${activeSection === 'wedding-party' ? 'after:w-full' : ''}`}
            >
              Wedding Party
            </a>
          </li>
          <li className="mx-4">
            <a 
              href="#q-and-a" 
              onClick={(e) => handleNavClick(e, 'q-and-a')}
              className={`text-sm tracking-wide px-0 py-1.5 relative after:content-[''] after:absolute after:w-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-[#333] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full ${activeSection === 'q-and-a' ? 'after:w-full' : ''}`}
            >
              Q + A
            </a>
          </li>
          <li className="mx-4">
            <a 
              href="#travel" 
              onClick={(e) => handleNavClick(e, 'travel')}
              className={`text-sm tracking-wide px-0 py-1.5 relative after:content-[''] after:absolute after:w-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-[#333] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full ${activeSection === 'travel' ? 'after:w-full' : ''}`}
            >
              Travel
            </a>
          </li>
          <li className="mx-4">
            <a 
              href="#things-to-do" 
              onClick={(e) => handleNavClick(e, 'things-to-do')}
              className={`text-sm tracking-wide px-0 py-1.5 relative after:content-[''] after:absolute after:w-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-[#333] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full ${activeSection === 'things-to-do' ? 'after:w-full' : ''}`}
            >
              Things to Do
            </a>
          </li>
          <li className="mx-4">
            <a 
              href="#rsvp" 
              onClick={(e) => handleNavClick(e, 'rsvp')}
              className={`text-sm tracking-wide px-0 py-1.5 relative after:content-[''] after:absolute after:w-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-[#333] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full ${activeSection === 'rsvp' ? 'after:w-full' : ''}`}
            >
              RSVP
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

import "./index.css";
import { useState } from 'react';
import Header from './components/Header';
import HomeSection from './components/HomeSection';
import EventSection from './components/EventSection';
import OurStorySection from './components/OurStorySection';
import WeddingPartySection from './components/WeddingPartySection';
import QAndASection from './components/QAndASection';
import AccommodationsSection from "./components/AccommodationsSection";
import ThingsToDoSection from './components/ThingsToDoSection';
import RSVPSection from './components/RSVP/RSVPSection';
import RegistrySection from './components/RegistrySection';
import Footer from './components/Footer';

export function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  
  const isHome = activeSection === 'home';
  
  return (
    <div className="container mx-auto px-4 max-w-screen-xl">
      <Header 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      <HomeSection isActive={isHome} />
      
      <EventSection 
        id="ceremony"
        title="CEREMONY"
        date="JULY 20, 2025"
        venue="The Gathering Church"
        address="916 Lamond Avenue, Durham, NC, 27701, United States"
        isActive={isHome}
      />
      
      <EventSection 
        id="reception"
        title="RECEPTION"
        date="SUNDAY, JULY 20, 2025"
        venue="The Cookery"
        address="1101 W Chapel Hill St, Durham, NC, 27701"
        isActive={isHome}
      />
      
      <OurStorySection isActive={activeSection === 'our-story'} />
      <WeddingPartySection isActive={activeSection === 'wedding-party'} />
      <QAndASection isActive={activeSection === 'q-and-a'} />
      <AccommodationsSection isActive={activeSection === 'accommodations'} />
      <ThingsToDoSection isActive={activeSection === 'things-to-do'} />
      <RSVPSection isActive={activeSection === 'rsvp'} />
      <RegistrySection isActive={activeSection === 'registry'} />
      
      <Footer />
    </div>
  );
}

export default App;

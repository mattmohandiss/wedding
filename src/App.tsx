import "./index.css";
import { useState } from 'react';
import Header from './components/Header';
import HomeSection from './components/HomeSection';
import EventSection from './components/EventSection';
import PhotosSection from './components/PhotosSection';
import WeddingPartySection from './components/WeddingPartySection';
import QAndASection from './components/QAndASection';
import TravelSection from './components/TravelSection';
import ThingsToDoSection from './components/ThingsToDoSection';
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
      
      <PhotosSection isActive={activeSection === 'photos'} />
      <WeddingPartySection isActive={activeSection === 'wedding-party'} />
      <QAndASection isActive={activeSection === 'q-and-a'} />
      <TravelSection isActive={activeSection === 'travel'} />
      <ThingsToDoSection isActive={activeSection === 'things-to-do'} />
      
      <Footer />
    </div>
  );
}

export default App;

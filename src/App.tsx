import { useState } from 'react';
import { Route, Switch } from 'wouter';
import { LanguageContext, type Language } from './lib/language';
import { DocumentsPage } from './pages/DocumentsPage';
import { DronesPage } from './pages/DronesPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfilePage } from './pages/ProfilePage';
import { SpacecraftPage } from './pages/SpacecraftPage';

// Здесь живут только маршруты. Сами экраны складывай в src/pages/.
export default function App() {
  const [language, setLanguage] = useState<Language>('ru');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/drones" component={DronesPage} />
        <Route path="/spacecraft" component={SpacecraftPage} />
        <Route path="/documents" component={DocumentsPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </LanguageContext.Provider>
  );
}

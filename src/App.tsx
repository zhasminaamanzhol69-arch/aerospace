import { Route, Switch } from 'wouter';
import { DocumentsPage } from './pages/DocumentsPage';
import { DronesPage } from './pages/DronesPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Здесь живут только маршруты. Сами экраны складывай в src/pages/.
export default function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/drones" component={DronesPage} />
      <Route path="/documents" component={DocumentsPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

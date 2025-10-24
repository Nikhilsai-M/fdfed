import Accessories from '../pages/Accessories';
import { useLocation } from 'react-router-dom';
import ChargersPage from '../pages/ChargersPage';
import EarbudsPage from '../pages/EarbudsPage';
import SmartWatchesPage from '../pages/SmartWatchesPage';
import MousePage from '../pages/MousePage';
const AccessoryRouter = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');

  // Route to specific category pages based on query parameter
  if (category === 'mouses') {
    return <MousePage />;
  }
  
   if (category === 'chargers') {
     return <ChargersPage />;
   }
  if (category === 'earbuds') {
    return <EarbudsPage />;
   }
   if (category === 'smartwatches') {
     return <SmartWatchesPage />;
   }

  // Default to main accessories page
  return <Accessories />;
};
export default AccessoryRouter;
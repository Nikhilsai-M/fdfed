import Charger from '../models/charger.model.js';
import Earphone from '../models/earphone.model.js';
import Mouse from '../models/mouse.model.js';
import Smartwatch from '../models/smartwatch.model.js';

// Controller function for fetching latest accessories
export const getLatestAccessories = async (req, res) => {
  try {
    const types = ['charger', 'earphone', 'mouse', 'smartwatch'];
    const accessories = [];

    for (const type of types) {
      let collection;
      switch (type) {
        case 'charger':
          collection = Charger;
          break;
        case 'earphone':
          collection = Earphone;
          break;
        case 'mouse':
          collection = Mouse;
          break;
        case 'smartwatch':
          collection = Smartwatch;
          break;
        default:
          continue; // Skip invalid types
      }

      const items = await collection
        .find()
        .sort({ created_at: -1, _id: -1 })
        .limit(2)
        .lean();

      items.forEach(item => {
        accessories.push({
          type,
          id: item.id,
          brand: item.brand,
          title: item.title || item.model || item.series || 'Unknown',
          base_price: item.original_price || item.originalPrice || 0,
          discount: item.discount || 0,
          image: item.image || '/images/placeholder.jpg',
          condition: item.condition || 'N/A',
          specs: {
            wattage: item.wattage, // Charger-specific
            battery_life: item.batteryLife || item.battery_life, // Earphone/Smartwatch (adjusted for schema variations)
            display_size: item.displaySize || item.display_size, // Smartwatch
            connectivity: item.connectivity, // Mouse
            resolution: item.resolution, // Mouse
          },
        });
      });
    }

    if (accessories.length === 0) {
      return res.json([]);
    }

    // Sort by most recent (using created_at or fallback to _id timestamp)
    accessories.sort((a, b) => {
      const dateA = new Date(a.created_at || (a._id ? new Date(a._id.getTimestamp ? a._id.getTimestamp() * 1000 : a._id) : 0));
      const dateB = new Date(b.created_at || (b._id ? new Date(b._id.getTimestamp ? b._id.getTimestamp() * 1000 : b._id) : 0));
      return dateB - dateA;
    });

    res.json(accessories);
  } catch (error) {
    console.error('Error fetching latest accessories:', error);
    res.status(500).json({ error: 'Failed to fetch accessories' });
  }
};
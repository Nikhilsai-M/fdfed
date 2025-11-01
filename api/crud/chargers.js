import Charger from '../models/charger.model.js';

const prefix = '/images/chargers/';  // ✅ Fixed: Absolute path for client/public/ serving

export async function initChargers() {
  try {
    const chargerCount = await Charger.countDocuments();

    if (chargerCount === 0) {
      await Charger.insertMany([
        {
          id: 'chg001',
          title: 'Apple 20W USB-C Power Adapter',
          image: prefix + 'apple_20w.webp',  // ✅ Corrected to /images/chargers/apple_20w.webp
          brand: 'Apple',
          wattage: '20',
          type: 'USB C',
          originalPrice: 1900,
          discount: 10,
          outputCurrent: '3A',
        },
        {
          id: 'chg002',
          title: 'Samsung 25W Fast Charger',
          image: prefix + 'samsung_25.webp',  // ✅ Corrected
          brand: 'Samsung',
          wattage: '25',
          type: 'USB C',
          originalPrice: 1800,
          discount: 5,
          outputCurrent: '2.5A',
        },
        {
          id: 'chg003',
          title:
            'RoarX 33 W SuperVOOC 6 A Wall Charger for Mobile with Detachable Cable  (White, Cable Included)',
          image: prefix + 'roar_33v.webp',  // ✅ Corrected
          brand: 'RoarX',
          wattage: '33',
          type: 'USB C',
          originalPrice: 2999,
          discount: 7,
          outputCurrent: '6A',
        },
        {
          id: 'chg004',
          title:
            'EYNK 44 W Quick Charge 5 A Wall Charger for Mobile with Detachable Cable  (Supported All Flash Charge 2.0 devices, White, Cable Included)',
          image: prefix + 'eynk_44.webp',  // ✅ Corrected
          brand: 'EYNK',
          wattage: '44',
          type: 'USB C',
          originalPrice: 2999,
          discount: 1,
          outputCurrent: '5A',
        },
        {
          id: 'chg005',
          title:
            'Pacificdeals 44 W Supercharge 4 A Wall Charger for Mobile with Detachable Cable  (White, Cable Included)',
          image: prefix + 'PACIFIC.webp',  // ✅ Corrected
          brand: 'Pacificdeals',
          wattage: '44',
          type: 'USB C',
          originalPrice: 1999,
          discount: 3,
          outputCurrent: '4A',
        },
        {
          id: 'chg006',
          title:
            'SB 80 W SuperVOOC 7.3 A Wall Charger for Mobile with Detachable Cable  (White, Cable Included)',
          image: prefix + 'sb80.jpg',  // ✅ Corrected
          brand: 'SB',
          wattage: '80',
          type: 'USB C',
          originalPrice: 2499,
          discount: 6,
          outputCurrent: '7.3A',
        },
        {
          id: 'chg007',
          title:
            'Apple Lightning Cable 2 m MW2R3ZM/A  (Compatible with Mobile, Tablet, White)',
          image: prefix + 'apple_light.webp',  // ✅ Corrected
          brand: 'Apple',
          wattage: '20',
          type: 'lightning',
          originalPrice: 2900,
          discount:0,
          outputCurrent: '3A',
        },
      ]);

    } 
    else {
      console.log('✅ Chargers already exist in database');
      
  } }catch (err) {
    console.error('❌ Error initializing chargers:', err);
  }
}

export async function getAllChargers() {
  try {
    const chargers = await Charger.find().lean();
    
    return chargers.map(charger => ({
      id: charger.id,
      title: charger.title,
      image: charger.image,  // Now correctly prefixed
      brand: charger.brand,
      wattage: charger.wattage,
      type: charger.type,
      originalPrice: charger.originalPrice,
      discount: charger.discount,
      outputCurrent: charger.outputCurrent,
    }));
  } catch (error) {
    console.error('Error getting chargers:', error);
    throw error;
  }
}

export async function getChargerById(id) {
  try {
    const charger = await Charger.findOne({ id }).lean();
    
    if (!charger) {
      return null;
    }
    
    return {
      id: charger.id,
      title: charger.title,
      image: charger.image,
      brand: charger.brand,
      wattage: charger.wattage,
      type: charger.type,
      pricing: {
        originalPrice: Number(charger.originalPrice),
        discount: charger.discount,
      },
      outputCurrent: charger.outputCurrent,
    };
  } catch (error) {
    console.error('Error getting charger by ID:', error);
    throw error;
  }
}

export async function addCharger(chargerData) {
  try {
    const { id, title, image, brand, wattage, type, pricing, outputCurrent } = chargerData;
    
    await Charger.create({
      id,
      title,
      image: image.startsWith('/') ? image : prefix + image,  // ✅ Ensure new adds use prefix
      brand,
      wattage,
      type,
      originalPrice: pricing.originalPrice,
      discount: pricing.discount,
      outputCurrent,
    });
    
    return { success: true, id };
  } catch (error) {
    console.error('Error adding charger:', error);
    return { success: false, message: error.message };
  }
}

export async function updateCharger(id, chargerData) {
  try {
    const { title, image, brand, wattage, type, pricing, outputCurrent } = chargerData;
    
    await Charger.updateOne(
      { id },
      {
        $set: {
          title,
          image: image.startsWith('/') ? image : prefix + image,  // ✅ Ensure updates use prefix
          brand,
          wattage,
          type,
          originalPrice: pricing.originalPrice,
          discount: pricing.discount,
          outputCurrent,
        },
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating charger:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteCharger(id) {
  try {
    const result = await Charger.deleteOne({ id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting charger:', error);
    return { success: false, message: error.message };
  }
}

import Smartwatch from '../models/smartwatch.model.js';

// Corrected prefix to match the chargers/earphones/mouses pattern
const prefix = '/images/smartwatches/';  // ✅ Fixed: Absolute path for client/public/ serving

export async function initSmartwatches() {
  try {
    const smartwatchCount = await Smartwatch.countDocuments();
    if (smartwatchCount === 0) {
      await Smartwatch.insertMany([
        {
          id: 'sw1',
          title:
            'Apple Watch Series 8, 41mm GPS + Cellular ECG app, Temperature sensor, Crash Detection',
          image: prefix + 'Apple Watch Series8.webp',  // ✅ Corrected to /images/smartwatches/Apple Watch Series8.webp
          brand: 'Apple',
          originalPrice: 55900,
          discount: 5,
          displaySize: '41',
          displayType: 'Retina Display',
          batteryRuntime: '18',
        },
        {
          id: 'sw2',
          title:
            'Apple Watch Series 10 GPS 46mm Silver Aluminium with Denim Sport Band',
          image: prefix + 'Apple Watch Series10.webp',  // ✅ Corrected
          brand: 'Apple',
          originalPrice: 49900,
          discount: 5,
          displaySize: '46',
          displayType: 'Retina Display',
          batteryRuntime: '18',
        },
        {
          id: 'sw3',
          title:
            'Apple Watch Series 9 GPS 45mm Aluminium Case with Sport Band - S/M',
          image: prefix + 'Apple Watch Series9.webp',  // ✅ Corrected
          brand: 'Apple',
          originalPrice: 59900,
          discount: 8,
          displaySize: '45',
          displayType: 'Retina Display',
          batteryRuntime: '18',
        },
        {
          id: 'sw8',
          title:
            'Fire-Boltt Ninja Calling Pro Plus 46.5mm (1.83) Display Bluetooth Calling, AI Voice Smartwatch',
          image: prefix + 'Fire-Boltt Ninja.webp',  // ✅ Corrected
          brand: 'Fire-Boltt',
          originalPrice: 1999,
          discount: 0,
          displaySize: '46.5',
          displayType: 'HD Display',
          batteryRuntime: '5',
        },
        {
          id: 'sw9',
          title:
            'Fire-Boltt Hurricane 33.02mm (1.3) Curved Glass Display with BT Calling, 100+ Sports Modes Smartwatch',
          image: prefix + 'Fire-Boltt Hurricane.webp',  // ✅ Corrected
          brand: 'Fire-Boltt',
          originalPrice: 8999,
          discount: 6,
          displaySize: '33.02',
          displayType: 'Retina HD Color Display',
          batteryRuntime: '15',
        },
        {
          id: 'sw12',
          title:
            'Fire-Boltt Blizzard 32.5mm (1.28) Luxury watch with BT Calling, Stainless Steel Body Smartwatch',
          image: prefix + 'Fire-Boltt Blizzard.webp',  // ✅ Corrected
          brand: 'Fire-Boltt',
          originalPrice: 19999,
          discount: 3,
          displaySize: '32.5',
          displayType: 'circular 1.28 inch HD display',
          batteryRuntime: '7',
        },
        {
          id: 'sw13',
          title:
            'Fire-Boltt Gladiator 49.7mm Display, Stainless Steel, Bluetooth Call, 123 sports modes Smartwatch',
          image: prefix + 'Fire-Boltt Gladiator.webp',  // ✅ Corrected
          brand: 'Fire-Boltt',
          originalPrice: 9999,
          discount: 7,
          displaySize: '49.7',
          displayType: 'HD display',
          batteryRuntime: '15',
        },
        {
          id: 'sw14',
          title:
            'Fire-Boltt Clickk 54.1mm (2.12 inch) AMOLED Display, Front Camera, Nano SIM Slot, 1000mAh Smartwatch',
          image: prefix + 'Fire-Boltt Clickk.webp',  // ✅ Corrected
          brand: 'Fire-Boltt',
          originalPrice: 24999,
          discount: 4,
          displaySize: '54.1',
          displayType: 'AMOLED display',
          batteryRuntime: '5',
        },
        {
          id: 'sw16',
          title:
            'boAt Wave Fury with 1.83 HD Display, Bluetooth Calling & Functional Crown Smartwatch',
          image: prefix + 'boAt Wave Fury.webp',  // ✅ Corrected
          brand: 'boAt',
          originalPrice: 6999,
          discount: 4,
          displaySize: '48',
          displayType: 'HD display',
          batteryRuntime: '7',
        },
        {
          id: 'sw17',
          title:
            'boAt Storm Call 3 Plus w/ Turn by Turn Navigation, QR Tray, 4.97cm(1.96) HD Display Smartwatch',
          image: prefix + 'boAt Storm.webp',  // ✅ Corrected
          brand: 'boAt',
          originalPrice: 7499,
          discount: 4,
          displaySize: '49',
          displayType: 'HD display',
          batteryRuntime: '7',
        },
        {
          id: 'sw18',
          title:
            'boAt Lunar Discovery w/ Turn by Turn Navigation, 3.53 cm HD Display & BT Calling Smartwatch',
          image: prefix + 'boAt Lunar Discovery.webp',  // ✅ Corrected
          brand: 'boAt',
          originalPrice: 8499,
          discount: 3,
          displaySize: '35.3',
          displayType: 'HD display',
          batteryRuntime: '7',
        },
        {
          id: 'sw23',
          title:
            "Noise Icon 2 1.8 Display with Bluetooth Calling, Women's Edition, AI Voice Assistant Smartwatch",
          image: prefix + 'Noise Icon2.webp',  // ✅ Corrected
          brand: 'Noise',
          originalPrice: 5999,
          discount: 0,
          displaySize: '48',
          displayType: 'HD display',
          batteryRuntime: '7',
        },
        {
          id: 'sw24',
          title:
            'Noise Colorfit Icon 2 1.8 Display with Bluetooth Calling, AI Voice Assistant Smartwatch',
          image: prefix + 'Noise Colorfit Icon2.webp',  // ✅ Corrected
          brand: 'Noise',
          originalPrice: 5999,
          discount: 1,
          displaySize: '48',
          displayType: 'HD display',
          batteryRuntime: '7',
        },
        {
          id: 'sw25',
          title:
            'Noise Loop 1.85 Display with Advanced Bluetooth Calling, 550 Nits Brightness Smartwatch',
          image: prefix + 'Noise Loop.webp',  // ✅ Corrected
          brand: 'Noise',
          originalPrice: 6999,
          discount: 5,
          displaySize: '49',
          displayType: 'TFT LCD display',
          batteryRuntime: '7',
        },
        {
          id: 'sw31',
          title:
            'SAMSUNG Galaxy Fit3 | AMOLED Display & Aluminium Body | Upto 13Day Battery | 5ATM & IP68',
          image: prefix + 'Samsung Galaxy Fit3.webp',  // ✅ Corrected
          brand: 'Samsung',
          originalPrice: 9999,
          discount: 5,
          displaySize: '40.64',
          displayType: 'AMOLED display',
          batteryRuntime: '13',
        },
        {
          id: 'sw32',
          title:
            'SAMSUNG Galaxy Watch FE, 40mm BT, Sapphire Crystal Display, Sleep Coach, Fall Detection',
          image: prefix + 'Samsung Galaxy WatchFE.webp',  // ✅ Corrected
          brand: 'Samsung',
          originalPrice: 29999,
          discount: 6,
          displaySize: '40',
          displayType: 'Sapphire Crystal display',
          batteryRuntime: '40',
        },
        {
          id: 'sw33',
          title: 'SAMSUNG Watch7 40mm BT',
          image: prefix + 'Samsung Watch7.webp',  // ✅ Corrected
          brand: 'Samsung',
          originalPrice: 32999,
          discount: 0,
          displaySize: '40',
          displayType: 'AMOLED display',
          batteryRuntime: '20',
        },
        {
          id: 'sw34',
          title: 'SAMSUNG Galaxy Watch6 Bluetooth',
          image: prefix + 'Samsung Galaxy Watch6.webp',  // ✅ Corrected
          brand: 'Samsung',
          originalPrice: 36999,
          discount: 6,
          displaySize: '44',
          displayType: 'AMOLED display',
          batteryRuntime: '40',
        },
        {
          id: 'sw35',
          title: 'SAMSUNG Galaxy Watch Ultra LTE',
          image: prefix + 'Samsung Galaxy Ultra.webp',  // ✅ Corrected
          brand: 'Samsung',
          originalPrice: 69999,
          discount: 4,
          displaySize: '47',
          displayType: 'AMOLED display',
          batteryRuntime: '20',
        },
      ]);
      console.log('✅ Test smartwatches added to database with updated image paths');
    } else {
      console.log('✅ Smartwatches already exist in database');
      // ✅ One-time fix: Update existing records' image paths (run once, then comment out)
      // This assumes old paths end with the filename (e.g., replaces everything before filename with new prefix)
      /*
      await Smartwatch.updateMany(
        {},
        [
          {
            $set: {
              image: {
                $concat: [
                  prefix,
                  { $substr: ['$image', { $strLenCP: '../../client/src/assets/images/smartwatches/' }, -1] }  // Extract filename from old path
                ]
              }
            }
          }
        ]
      );
      console.log('✅ Updated existing image paths to new prefix');*/
    }
  } catch (err) {
    console.error('❌ Error initializing smartwatches:', err);
  }
}

export async function getAllSmartwatches() {
  try {
    const smartwatches = await Smartwatch.find().lean();

    return smartwatches.map((smartwatch) => ({
      id: smartwatch.id,
      title: smartwatch.title,
      image: smartwatch.image,  // Now correctly prefixed
      brand: smartwatch.brand,
      originalPrice: smartwatch.originalPrice,
      discount: smartwatch.discount,
      displaySize: smartwatch.displaySize,
      displayType: smartwatch.displayType,
      batteryRuntime: smartwatch.batteryRuntime,
    }));
  } catch (error) {
    console.error('Error getting smartwatches:', error);
    throw error;
  }
}

export async function getSmartwatchById(id) {
  try {
    const smartwatch = await Smartwatch.findOne({ id }).lean();

    if (!smartwatch) {
      return null;
    }

    return {
      id: smartwatch.id,
      title: smartwatch.title,
      image: smartwatch.image,
      brand: smartwatch.brand,
      pricing: {
        originalPrice: Number(smartwatch.originalPrice),
        discount: smartwatch.discount,
      },
      displaySize: smartwatch.displaySize,
      displayType: smartwatch.displayType,
      batteryRuntime: smartwatch.batteryRuntime,
    };
  } catch (error) {
    console.error('Error getting smartwatch by ID:', error);
    throw error;
  }
}

export async function addSmartwatch(smartwatchData) {
  try {
    const {
      id,
      title,
      image,
      brand,
      pricing,
      displaySize,
      displayType,
      batteryRuntime,
    } = smartwatchData;

    await Smartwatch.create({
      id,
      title,
      image: image.startsWith('/') ? image : prefix + image,  // ✅ Ensure new adds use prefix
      brand,
      originalPrice: pricing.originalPrice,
      discount: pricing.discount,
      displaySize,
      displayType,
      batteryRuntime,
    });

    return { success: true, id };
  } catch (error) {
    console.error('Error adding smartwatch:', error);
    return { success: false, message: error.message };
  }
}

export async function updateSmartwatch(id, smartwatchData) {
  try {
    const {
      title,
      image,
      brand,
      pricing,
      displaySize,
      displayType,
      batteryRuntime,
    } = smartwatchData;

    await Smartwatch.updateOne(
      { id },
      {
        $set: {
          title,
          image: image.startsWith('/') ? image : prefix + image,  // ✅ Ensure updates use prefix
          brand,
          originalPrice: pricing.originalPrice,
          discount: pricing.discount,
          displaySize,
          displayType,
          batteryRuntime,
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating smartwatch:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteSmartwatch(id) {
  try {
    const result = await Smartwatch.deleteOne({ id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting smartwatch:', error);
    return { success: false, message: error.message };
  }
}
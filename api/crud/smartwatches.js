import Smartwatch from "../models/smartwatch.model";
const smartwatchCount = await Smartwatch.countDocuments();
    if (smartwatchCount === 0) {
      await Smartwatch.insertMany([
        {
          id: 'sw1',
          title: 'Apple Watch Series 8, 41mm GPS + Cellular ECG app, Temperature sensor, Crash Detection',
          image: 'images/accessories/smartwatches/Apple Watch Series8.webp',
          brand: 'Apple',
          original_price: 55900,
          discount: '5%',
          display_size: '41',
          display_type: 'Retina Display',
          battery_runtime: '18',
        },
        {
          id: 'sw2',
          title: 'Apple Watch Series 10 GPS 46mm Silver Aluminium with Denim Sport Band',
          image: 'images/accessories/smartwatches/Apple Watch Series10.webp',
          brand: 'Apple',
          original_price: 49900,
          discount: '15%',
          display_size: '46',
          display_type: 'Retina Display',
          battery_runtime: '18',
        },
        {
          id: 'sw3',
          title: 'Apple Watch Series 9 GPS 45mm Aluminium Case with Sport Band - S/M',
          image: 'images/accessories/smartwatches/Apple Watch Series9.webp',
          brand: 'Apple',
          original_price: 59900,
          discount: '18%',
          display_size: '45',
          display_type: 'Retina Display',
          battery_runtime: '18',
        },
        {
          id: 'sw8',
          title: 'Fire-Boltt Ninja Calling Pro Plus 46.5mm (1.83) Display Bluetooth Calling, AI Voice Smartwatch',
          image: 'images/accessories/smartwatches/Fire-Boltt Ninja.webp',
          brand: 'Fire-Boltt',
          original_price: 1999,
          discount: '50%',
          display_size: '46.5',
          display_type: 'HD Display',
          battery_runtime: '5',
        },
        {
          id: 'sw9',
          title: 'Fire-Boltt Hurricane 33.02mm (1.3) Curved Glass Display with BT Calling, 100+ Sports Modes Smartwatch',
          image: 'images/accessories/smartwatches/Fire-Boltt Hurricane.webp',
          brand: 'Fire-Boltt',
          original_price: 8999,
          discount: '86%',
          display_size: '33.02',
          display_type: 'Retina HD Color Display',
          battery_runtime: '15',
        },
        {
          id: 'sw12',
          title: 'Fire-Boltt Blizzard 32.5mm (1.28) Luxury watch with BT Calling, Stainless Steel Body Smartwatch',
          image: 'images/accessories/smartwatches/Fire-Boltt Blizzard.webp',
          brand: 'Fire-Boltt',
          original_price: 19999,
          discount: '93%',
          display_size: '32.5',
          display_type: 'circular 1.28 inch HD display',
          battery_runtime: '7',
        },
        {
          id: 'sw13',
          title: 'Fire-Boltt Gladiator 49.7mm Display, Stainless Steel, Bluetooth Call, 123 sports modes Smartwatch',
          image: 'images/accessories/smartwatches/Fire-Boltt Gladiator.webp',
          brand: 'Fire-Boltt',
          original_price: 9999,
          discount: '87%',
          display_size: '49.7',
          display_type: 'HD display',
          battery_runtime: '15',
        },
        {
          id: 'sw14',
          title: 'Fire-Boltt Clickk 54.1mm (2.12 inch) AMOLED Display, Front Camera, Nano SIM Slot, 1000mAh Smartwatch',
          image: 'images/accessories/smartwatches/Fire-Boltt Clickk.webp',
          brand: 'Fire-Boltt',
          original_price: 24999,
          discount: '84%',
          display_size: '54.1',
          display_type: 'AMOLED display',
          battery_runtime: '5',
        },
        {
          id: 'sw16',
          title: 'boAt Wave Fury with 1.83 HD Display, Bluetooth Calling & Functional Crown Smartwatch',
          image: 'images/accessories/smartwatches/boAt Wave Fury.webp',
          brand: 'boAt',
          original_price: 6999,
          discount: '64%',
          display_size: '48',
          display_type: 'HD display',
          battery_runtime: '7',
        },
        {
          id: 'sw17',
          title: 'boAt Storm Call 3 Plus w/ Turn by Turn Navigation, QR Tray, 4.97cm(1.96) HD Display Smartwatch',
          image: 'images/accessories/smartwatches/boAt Storm.webp',
          brand: 'boAt',
          original_price: 7499,
          discount: '84%',
          display_size: '49',
          display_type: 'HD display',
          battery_runtime: '7',
        },
        {
          id: 'sw18',
          title: 'boAt Lunar Discovery w/ Turn by Turn Navigation, 3.53 cm HD Display & BT Calling Smartwatch',
          image: 'images/accessories/smartwatches/boAt Lunar Discovery.webp',
          brand: 'boAt',
          original_price: 8499,
          discount: '83%',
          display_size: '35.3',
          display_type: 'HD display',
          battery_runtime: '7',
        },
        {
          id: 'sw23',
          title: "Noise Icon 2 1.8 Display with Bluetooth Calling, Women's Edition, AI Voice Assistant Smartwatch",
          image: 'images/accessories/smartwatches/Noise Icon2.webp',
          brand: 'Noise',
          original_price: 5999,
          discount: '80%',
          display_size: '48',
          display_type: 'HD display',
          battery_runtime: '7',
        },
        {
          id: 'sw24',
          title: 'Noise Colorfit Icon 2 1.8 Display with Bluetooth Calling, AI Voice Assistant Smartwatch',
          image: 'images/accessories/smartwatches/Noise Colorfit Icon2.webp',
          brand: 'Noise',
          original_price: 5999,
          discount: '81%',
          display_size: '48',
          display_type: 'HD display',
          battery_runtime: '7',
        },
        {
          id: 'sw25',
          title: 'Noise Loop 1.85 Display with Advanced Bluetooth Calling, 550 Nits Brightness Smartwatch',
          image: 'images/accessories/smartwatches/Noise Loop.webp',
          brand: 'Noise',
          original_price: 6999,
          discount: '85%',
          display_size: '49',
          display_type: 'TFT LCD display',
          battery_runtime: '7',
        },
        {
          id: 'sw31',
          title: 'SAMSUNG Galaxy Fit3 | AMOLED Display & Aluminium Body | Upto 13Day Battery | 5ATM & IP68',
          image: 'images/accessories/smartwatches/Samsung Galaxy Fit3.webp',
          brand: 'Samsung',
          original_price: 9999,
          discount: '65%',
          display_size: '40.64',
          display_type: 'AMOLED display',
          battery_runtime: '13',
        },
        {
          id: 'sw32',
          title: 'SAMSUNG Galaxy Watch FE, 40mm BT, Sapphire Crystal Display, Sleep Coach, Fall Detection',
          image: 'images/accessories/smartwatches/Samsung Galaxy WatchFE.webp',
          brand: 'Samsung',
          original_price: 29999,
          discount: '66%',
          display_size: '40',
          display_type: 'Sapphire Crystal display',
          battery_runtime: '40',
        },
        {
          id: 'sw33',
          title: 'SAMSUNG Watch7 40mm BT',
          image: 'images/accessories/smartwatches/Samsung Watch7.webp',
          brand: 'Samsung',
          original_price: 32999,
          discount: '10%',
          display_size: '40',
          display_type: 'AMOLED display',
          battery_runtime: '20',
        },
        {
          id: 'sw34',
          title: 'SAMSUNG Galaxy Watch6 Bluetooth',
          image: 'images/accessories/smartwatches/Samsung Galaxy Watch6.webp',
          brand: 'Samsung',
          original_price: 36999,
          discount: '56%',
          display_size: '44',
          display_type: 'AMOLED display',
          battery_runtime: '40',
        },
        {
          id: 'sw35',
          title: 'SAMSUNG Galaxy Watch Ultra LTE',
          image: 'images/accessories/smartwatches/Samsung Galaxy Ultra.webp',
          brand: 'Samsung',
          original_price: 69999,
          discount: '14%',
          display_size: '47',
          display_type: 'AMOLED display',
          battery_runtime: '20',
        },
      ]);
      console.log('Test smartwatches added to database');
    }

    // Smartwatch Functions
export async function getAllSmartwatches() {
  try {
    const smartwatches = await Smartwatch.find().lean();
    
    return smartwatches.map(smartwatch => ({
      id: smartwatch.id,
      title: smartwatch.title,
      image: smartwatch.image,
      brand: smartwatch.brand,
      originalPrice: smartwatch.original_price,
      discount: smartwatch.discount,
      display_size: smartwatch.display_size,
      display_type: smartwatch.display_type,
      battery_runtime: smartwatch.battery_runtime,
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
        originalPrice: Number(smartwatch.original_price),
        discount: smartwatch.discount,
      },
      display_size: smartwatch.display_size,
      display_type: smartwatch.display_type,
      battery_runtime: smartwatch.battery_runtime,
    };
  } catch (error) {
    console.error('Error getting smartwatch by ID:', error);
    throw error;
  }
}

export async function addSmartwatch(smartwatchData) {
  try {
    const { id, title, image, brand, pricing, display_size, display_type, battery_runtime } = smartwatchData;
    
    await Smartwatch.create({
      id,
      title,
      image,
      brand,
      original_price: pricing.originalPrice,
      discount: pricing.discount,
      display_size,
      display_type,
      battery_runtime,
    });
    
    return { success: true, id };
  } catch (error) {
    console.error('Error adding smartwatch:', error);
    return { success: false, message: error.message };
  }
}

export async function updateSmartwatch(id, smartwatchData) {
  try {
    const { title, image, brand, pricing, display_size, display_type, battery_runtime } = smartwatchData;
    
    await Smartwatch.updateOne(
      { id },
      {
        $set: {
          title,
          image,
          brand,
          original_price: pricing.originalPrice,
          discount: pricing.discount,
          display_size,
          display_type,
          battery_runtime,
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

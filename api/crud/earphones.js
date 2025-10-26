import Earphone from "../models/earphone.model";

const earphoneCount = await Earphone.countDocuments();
    if (earphoneCount === 0) {
      await Earphone.insertMany([
        {
          id: 'boat_airdopes_456',
          title: 'boAt Airdopes 181 Pro w/ 100 HRS Playback, 4 Mics ENx Technology & ASAP Charge Bluetooth  (Frosted Mint, True Wireless)',
          image: 'images/accessories/earphones/boat_airdopes.webp',
          brand: 'Boat',
          original_price: 4990,
          discount: '81%',
          design: 'Earbuds',
          battery_life: '100',
        },
        {
          id: 'boult_y1_789',
          title: 'Boult Y1 with Zen ENC Mic, 50H Battery, Fast Charging, Pro+ Calling, Knurled Design Bluetooth  (Black, True Wireless)',
          image: 'images/accessories/earphones/boult_y1.webp',
          brand: 'Boult',
          original_price: 5499,
          discount: '85%',
          design: 'Earbuds',
          battery_life: '50',
        },
        {
          id: 'oneplus_bullet_404',
          title: 'OnePlus Bullets Wireless Z2 Bluetooth 5.0 in Ear Earphones, Bombastic Bass E310A Bluetooth  (Blue, In the Ear)',
          image: 'images/accessories/earphones/oneplus_bullet.webp',
          brand: 'OnePlus',
          original_price: 2999,
          discount: '10%',
          design: 'behind the neck',
          battery_life: '50',
        },
        {
          id: 'realme_neo_505',
          title: 'realme Buds Air Neo Bluetooth  (White, True Wireless)',
          image: 'images/accessories/earphones/realme_neo.webp',
          brand: 'realme',
          original_price: 3999,
          discount: '25%',
          design: 'Earbuds',
          battery_life: '17',
        },
        {
          id: 'realme_t110_606',
          title: 'realme Buds T110 (RMA2306) with AI ENC for calls, 38 hours of Playback and Deep Bass Bluetooth  (Jazz Blue, True Wireless)',
          image: 'images/accessories/earphones/realme_t110.webp',
          brand: 'realme',
          original_price: 2999,
          discount: '63%',
          design: 'Earbuds',
          battery_life: '38',
        },
        {
          id: 'realme_neckneo_707',
          title: 'realme Buds Wireless 3 Neo with 13.4mm Driver, 32 hrs Playback, Dual Device Connection Bluetooth  (Black, In the Ear)',
          image: 'images/accessories/earphones/realme_neckneo.webp',
          brand: 'realme',
          original_price: 2499,
          discount: '60%',
          design: 'behind the neck',
          battery_life: '32',
        },
        {
          id: 'samsung_sm_808',
          title: 'SAMSUNG SM-R400NZ Bluetooth  (Graphite, True Wireless)',
          image: 'images/accessories/earphones/samsung_sm.webp',
          brand: 'SAMSUNG',
          original_price: 12999,
          discount: '52%',
          design: 'Earbuds',
          battery_life: '43',
        },
        {
          id: 'noise_vs_222',
          title: 'Noise Buds VS102 Plus with 70 Hrs Playtime, Environmental Noise Cancellation, Quad Mic Bluetooth  (Deep Wine, True Wireless)',
          image: 'images/accessories/earphones/noise_vs.webp',
          brand: 'Noise',
          original_price: 3999,
          discount: '75%',
          design: 'Earbuds',
          battery_life: '70',
        },
        {
          id: 'noise_airwave_333',
          title: 'Noise Airwave Pro with ANC, 60 Hrs of Playtime, Low latency(Up to 40ms), 3 EQ Modes Bluetooth  (Metallic Blue, In the Ear)',
          image: 'images/accessories/earphones/noise_airwave.webp',
          brand: 'Noise',
          original_price: 3999,
          discount: '62%',
          design: 'behind the neck',
          battery_life: '60',
        },
        {
          id: 'portronics_s16_444',
          title: 'Portronics Twins S16 in Ear Earbuds Bluetooth  (Green, In the Ear)',
          image: 'images/accessories/earphones/portronics_s16.webp',
          brand: 'Portronics',
          original_price: 1999,
          discount: '62%',
          design: 'Earbuds',
          battery_life: '24',
        },
        {
          id: 'portronics_s5_555',
          title: 'Portronics Harmonics Twins S5 Smart TWS Earbuds,15Hrs Playtime, LED Display, Game Mode,5.2v Bluetooth  (Black, In the Ear)',
          image: 'images/accessories/earphones/portronics_s5.webp',
          brand: 'Portronics',
          original_price: 2999,
          discount: '82%',
          design: 'Earbuds',
          battery_life: '15',
        },
        {
          id: 'jbl_beam_888',
          title: 'JBL Wave Beam TWS, 32Hr Playtime, IP54, Smart Ambient & TalkThru Mode, JBL App Bluetooth  (Beige, In the Ear)',
          image: 'images/accessories/earphones/jbl_beam.webp',
          brand: 'JBL',
          original_price: 4999,
          discount: '50%',
          design: 'Earbuds',
          battery_life: '32',
        },
        {
          id: 'jbl_125bt_999',
          title: 'JBL Tune 125BT Flex Neckband with 16 Hour Playtime, Quick Charge, Multipoint Connect Bluetooth  (Grey, In the Ear)',
          image: 'images/accessories/earphones/jbl_125bt.webp',
          brand: 'JBL',
          original_price: 2999,
          discount: '33%',
          design: 'behind the neck',
          battery_life: '16',
        },
      ]);
      console.log('Test earphones added to database');
    }

  // Earphone Functions
export async function getAllEarphones() {
  try {
    const earphones = await Earphone.find().lean();
    
    return earphones.map(earphone => ({
      id: earphone.id,
      title: earphone.title,
      image: earphone.image,
      brand: earphone.brand,
      originalPrice: earphone.original_price,
      discount: earphone.discount,
      design: earphone.design,
      batteryLife: earphone.battery_life,
    }));
  } catch (error) {
    console.error('Error getting earphones:', error);
    throw error;
  }
}

export async function getEarphonesById(id) {
  try {
    const earphone = await Earphone.findOne({ id }).lean();
    
    if (!earphone) {
      return null;
    }
    
    return {
      id: earphone.id,
      title: earphone.title,
      image: earphone.image,
      brand: earphone.brand,
      pricing: {
        originalPrice: Number(earphone.original_price),
        discount: earphone.discount,
      },
      design: earphone.design,
      batteryLife: earphone.battery_life,
    };
  } catch (error) {
    console.error('Error getting earphones by ID:', error);
    throw error;
  }
}

export async function addEarphones(earphonesData) {
  try {
    const { id, title, image, brand, pricing, design, battery_life } = earphonesData;
    
    await Earphone.create({
      id,
      title,
      image,
      brand,
      original_price: pricing.originalPrice,
      discount: pricing.discount,
      design,
      battery_life: battery_life,
    });
    
    return { success: true, id };
  } catch (error) {
    console.error('Error adding earphones:', error);
    return { success: false, message: error.message };
  }
}

export async function updateEarphones(id, earphonesData) {
  try {
    const { title, image, brand, pricing, design, battery_life } = earphonesData;
    
    await Earphone.updateOne(
      { id },
      {
        $set: {
          title,
          image,
          brand,
          original_price: pricing.originalPrice,
          discount: pricing.discount,
          design,
          battery_life,
        },
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating earphones:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteEarphones(id) {
  try {
    const result = await Earphone.deleteOne({ id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting earphones:', error);
    return { success: false, message: error.message };
  }
}

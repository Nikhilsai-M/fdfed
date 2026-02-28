import Earphone from '../models/earphone.model.js';

const prefix = '/images/earphones/';  // ✅ Fixed: Absolute path for static serving from public/

export async function initEarphones() {
  try {
    const earphoneCount = await Earphone.countDocuments();

    if (earphoneCount === 0) {
      await Earphone.insertMany([
        {
          id: 'boat_airdopes_456',
          title:
            'boAt Airdopes 181 Pro w/ 100 HRS Playback, 4 Mics ENx Technology & ASAP Charge Bluetooth  (Frosted Mint, True Wireless)',
          image: prefix + 'boat_airdopes.webp',  // Now: '/images/earphones/boat_airdopes.webp'
          brand: 'Boat',
          originalPrice: 4990,
          discount: 81,
          design: 'Earbuds',
          batteryLife: '100',
        },
        {
          id: 'boult_y1_789',
          title:
            'Boult Y1 with Zen ENC Mic, 50H Battery, Fast Charging, Pro+ Calling, Knurled Design Bluetooth  (Black, True Wireless)',
          image: prefix + 'boult_y1.webp',
          brand: 'Boult',
          originalPrice: 5499,
          discount: 85,
          design: 'Earbuds',
          batteryLife: '50',
        },
        {
          id: 'oneplus_bullet_404',
          title:
            'OnePlus Bullets Wireless Z2 Bluetooth 5.0 in Ear Earphones, Bombastic Bass E310A Bluetooth  (Blue, In the Ear)',
          image: prefix + 'oneplus_bullet.webp',
          brand: 'OnePlus',
          originalPrice: 2999,
          discount: 10,
          design: 'behind the neck',
          batteryLife: '50',
        },
        {
          id: 'realme_neo_505',
          title: 'realme Buds Air Neo Bluetooth  (White, True Wireless)',
          image: prefix + 'realme_neo.webp',
          brand: 'realme',
          originalPrice: 3999,
          discount: 25,
          design: 'Earbuds',
          batteryLife: '17',
        },
        {
          id: 'realme_t110_606',
          title:
            'realme Buds T110 (RMA2306) with AI ENC for calls, 38 hours of Playback and Deep Bass Bluetooth  (Jazz Blue, True Wireless)',
          image: prefix + 'realme_t110.webp',
          brand: 'realme',
          originalPrice: 2999,
          discount: 63,
          design: 'Earbuds',
          batteryLife: '38',
        },
        {
          id: 'realme_neckneo_707',
          title:
            'realme Buds Wireless 3 Neo with 13.4mm Driver, 32 hrs Playback, Dual Device Connection Bluetooth  (Black, In the Ear)',
          image: prefix + 'realme_neckneo.webp',
          brand: 'realme',
          originalPrice: 2499,
          discount: 60,
          design: 'behind the neck',
          batteryLife: '32',
        },
        {
          id: 'samsung_sm_808',
          title: 'SAMSUNG SM-R400NZ Bluetooth  (Graphite, True Wireless)',
          image: prefix + 'samsung_sm.webp',
          brand: 'SAMSUNG',
          originalPrice: 12999,
          discount: 52,
          design: 'Earbuds',
          batteryLife: '43',
        },
        {
          id: 'noise_vs_222',
          title:
            'Noise Buds VS102 Plus with 70 Hrs Playtime, Environmental Noise Cancellation, Quad Mic Bluetooth  (Deep Wine, True Wireless)',
          image: prefix + 'noise_vs.webp',
          brand: 'Noise',
          originalPrice: 3999,
          discount: 75,
          design: 'Earbuds',
          batteryLife: '70',
        },
        {
          id: 'noise_airwave_333',
          title:
            'Noise Airwave Pro with ANC, 60 Hrs of Playtime, Low latency(Up to 40ms), 3 EQ Modes Bluetooth  (Metallic Blue, In the Ear)',
          image: prefix + 'noise_airwave.webp',
          brand: 'Noise',
          originalPrice: 3999,
          discount: 62,
          design: 'behind the neck',
          batteryLife: '60',
        },
        {
          id: 'portronics_s16_444',
          title: 'Portronics Twins S16 in Ear Earbuds Bluetooth  (Green, In the Ear)',
          image: prefix + 'portronics_s16.webp',
          brand: 'Portronics',
          originalPrice: 1999,
          discount: 62,
          design: 'Earbuds',
          batteryLife: '24',
        },
        {
          id: 'portronics_s5_555',
          title:
            'Portronics Harmonics Twins S5 Smart TWS Earbuds,15Hrs Playtime, LED Display, Game Mode,5.2v Bluetooth  (Black, In the Ear)',
          image: prefix + 'portronics_s5.webp',
          brand: 'Portronics',
          originalPrice: 2999,
          discount: 82,
          design: 'Earbuds',
          batteryLife: '15',
        },
        {
          id: 'jbl_beam_888',
          title:
            'JBL Wave Beam TWS, 32Hr Playtime, IP54, Smart Ambient & TalkThru Mode, JBL App Bluetooth  (Beige, In the Ear)',
          image: prefix + 'jbl_beam.webp',
          brand: 'JBL',
          originalPrice: 4999,
          discount: 50,
          design: 'Earbuds',
          batteryLife: '32',
        },
        {
          id: 'jbl_125bt_999',
          title:
            'JBL Tune 125BT Flex Neckband with 16 Hour Playtime, Quick Charge, Multipoint Connect Bluetooth  (Grey, In the Ear)',
          image: prefix + 'jbl_125bt.webp',
          brand: 'JBL',
          originalPrice: 2999,
          discount: 33,
          design: 'behind the neck',
          batteryLife: '16',
        },
      ]);

      console.log('✅ Test earphones added to database with updated image paths');
    } else {
      console.log('✅ Earphones already exist in database');
      // ✅ Optional: If DB already has old paths, add a one-time update script here:
      // await Earphone.updateMany({}, [{ $set: { image: { $concat: ['/images/earphones/', { $substr: ['$image', 35, -1] }] } }]); // Adjust substring to replace old prefix
    }
  } catch (err) {
    console.error('❌ Error initializing earphones:', err);
  }
}

export async function getAllEarphones() {
  try {
    const earphones = await Earphone.find().lean();

    return earphones.map((earphone) => ({
      id: earphone.id,
      title: earphone.title,
      image: earphone.image,  // Now serves from /images/earphones/
      brand: earphone.brand,
      originalPrice: earphone.originalPrice,
      discount: earphone.discount,
      design: earphone.design,
      batteryLife: earphone.batteryLife,
    }));
  } catch (error) {
    console.error('Error getting earphones:', error);
    throw error;
  }
}

export async function getEarphoneById(id) {
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
      
        originalPrice: Number(earphone.originalPrice),
        discount: earphone.discount,
      
      design: earphone.design,
      batteryLife: earphone.batteryLife,
    };
  } catch (error) {
    console.error('Error getting earphone by ID:', error);
    throw error;
  }
}

export async function addEarphone(earphoneData) {
  try {
    const { id, title, image, brand, pricing, design, batteryLife } =
      earphoneData;

    await Earphone.create({
      id,
      title,
      image: image.startsWith('/') ? image : prefix + image,  // ✅ Ensure new adds use correct prefix
      brand,
      originalPrice: Number(originalPrice),
      discount: Number(discount),
      design,
      batteryLife,
    });

    return { success: true, id };
  } catch (error) {
    console.error('Error adding earphone:', error);
    return { success: false, message: error.message };
  }
}

export async function updateEarphone(id, earphoneData) {
  try {
    const { title, image, brand, pricing, design, batteryLife } = earphoneData;

    await Earphone.updateOne(
      { id },
      {
        $set: {
          title,
          image: image.startsWith('/') ? image : prefix + image,  // ✅ Ensure updates use correct prefix
          brand,
          originalPrice: Number(originalPrice),
          discount: Number(discount),
          design,
          batteryLife,
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating earphone:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteEarphone(id) {
  try {
    const result = await Earphone.deleteOne({ id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting earphone:', error);
    return { success: false, message: error.message };
  }
}
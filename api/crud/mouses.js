import Mouse from '../models/mouse.model.js';

const prefix = '/images/mouses/';  // ✅ Fixed: Absolute path for client/public/ serving

export async function initMouses() {
  try {
    const mouseCount = await Mouse.countDocuments();
    if (mouseCount === 0) {
      await Mouse.insertMany([
        {
          id: 'logitech_m196_202',
          title: 'Logitech M196 Wireless Optical Mouse with Bluetooth',
          image: prefix + 'Logitech M196.webp',  // ✅ Corrected to /images/mouses/Logitech M196.webp
          brand: 'Logitech',
          originalPrice: 1125,
          discount: 20,
          type: 'Wireless',
          connectivity: 'Bluetooth & USB',
          resolution: '4600',
        },
        {
          id: 'logitech_g502_303',
          title:
            'Logitech G502 Hero / Hero 25K Sensor, Adj DPI Upto 25600, RGB, 11 Programmable Buttons Wired Optical Gaming Mouse',
          image: prefix + 'Logotech G502 Hero.webp',  // ✅ Corrected
          brand: 'Logitech',
          originalPrice: 5495,
          discount: 25,
          type: 'Wired',
          connectivity: 'USB',
          resolution: '5600',
        },
        {
          id: 'arctic_fox_breathing_404',
          title:
            'Arctic Fox Breathing Lights and DPI Upto 3600 Wired Optical Gaming Mouse',
          image: prefix + 'Arctic Fox Breathing Lights.webp',  // ✅ Corrected
          brand: 'Arctic Fox',
          originalPrice: 599,
          discount: 35,
          type: 'Wired',
          connectivity: 'USB',
          resolution: '3600',
        },
        {
          id: 'zebronics_jaguar_606',
          title: 'ZEBRONICS Zeb-Jaguar Wireless Optical Mouse',
          image: prefix + 'Zebronics Zeb Jaguar.webp',  // ✅ Corrected
          brand: 'ZEBRONICS',
          originalPrice: 1190,
          discount: 39,
          type: 'Wireless',
          connectivity: 'USB',
          resolution: '1700',
        },
        {
          id: 'zebronics_rise_707',
          title: 'ZEBRONICS ZEB-RISE Wired Optical Mouse',
          image: prefix + 'Zebronics Zeb Rise.webp',  // ✅ Corrected
          brand: 'ZEBRONICS',
          originalPrice: 699,
          discount: 19,
          type: 'Wired',
          connectivity: 'USB',
          resolution: '1200',
        },
        {
          id: 'zebronics_blanc_808',
          title:
            'ZEBRONICS Zeb-Blanc /Dual Mode,Type C rechargeable built-in battery,upto 1600 DPI Wireless Optical Mouse',
          image: prefix + 'Zebronics Zeb Blanc.webp',  // ✅ Corrected
          brand: 'ZEBRONICS',
          originalPrice: 999,
          discount: 15,
          type: 'Wireless',
          connectivity: 'Bluetooth & USB',
          resolution: '1600',
        },
        {
          id: 'dell_ms116_909',
          title: 'DELL MS 116-BK Wired Optical Mouse',
          image: prefix + 'Dell MS 116-BK.webp',  // ✅ Corrected
          brand: 'DELL',
          originalPrice: 650,
          discount: 30,
          type: 'Wired',
          connectivity: 'USB',
          resolution: '1000',
        },
        {
          id: 'hp_m160_1010',
          title: 'HP M160 Wired Optical Gaming Mouse',
          image: prefix + 'HP M160.webp',  // ✅ Corrected
          brand: 'HP',
          originalPrice: 799,
          discount: 40,
          type: 'Wired',
          connectivity: 'USB',
          resolution: '1000',
        },
        {
          id: 'hp_z3700_1111',
          title:
            'HP Z3700 /Slim form with USB receiver,16 month battery life, 1200DPI Wireless Optical Mouse',
          image: prefix + 'HP Z3700.webp',  // ✅ Corrected
          brand: 'HP',
          originalPrice: 1499,
          discount: 30,
          type: 'Wireless',
          connectivity: 'USB',
          resolution: '1200',
        },
        {
          id: 'logitech_b175_101',
          title:
            'Logitech B175 / Optical Tracking, 12-Months Battery Life, Ambidextrous Wireless Optical Mouse',
          image: prefix + 'Logitech B175.webp',  // ✅ Corrected
          brand: 'Logitech',
          originalPrice: 995,
          discount: 49,
          type: 'Wireless',
          connectivity: 'USB',
          resolution: '3000',
        },
      ]);
      console.log('✅ Test mouses added to database with updated image paths');
    } else {
      console.log('✅ Mouses already exist in database');
      // ✅ One-time fix: Update existing records' image paths (run once, then comment out)
      // This assumes old paths end with the filename (e.g., replaces everything before filename with new prefix)
      await Mouse.updateMany(
        {},
        [
          {
            $set: {
              image: {
                $concat: [
                  prefix,
                  { $substr: ['$image', { $strLenCP: '/images/mouses/' }, -1] }  // Extract filename from old path (adjust if needed)
                ]
              }
            }
          }
        ]
      );
      console.log('✅ Updated existing image paths to new prefix');
    }
  } catch (err) {
    console.error('❌ Error initializing mouses:', err);
  }
}

export async function getAllMouses() {
  try {
    const mouses = await Mouse.find().lean();

    return mouses.map((mouse) => ({
      id: mouse.id,
      title: mouse.title,
      image: mouse.image,  // Now correctly prefixed
      brand: mouse.brand,
      originalPrice: mouse.originalPrice,
      discount: mouse.discount,
      type: mouse.type,
      connectivity: mouse.connectivity,
      resolution: mouse.resolution,
    }));
  } catch (error) {
    console.error('Error getting mouses:', error);
    throw error;
  }
}

export async function getMouseById(id) {
  try {
    const mouse = await Mouse.findOne({ id }).lean();

    if (!mouse) {
      return null;
    }

    return {
      id: mouse.id,
      title: mouse.title,
      image: mouse.image,
      brand: mouse.brand,
      pricing: {
        originalPrice: Number(mouse.originalPrice),
        discount: mouse.discount,
      },
      type: mouse.type,
      connectivity: mouse.connectivity,
      resolution: mouse.resolution,
    };
  } catch (error) {
    console.error('Error getting mouse by ID:', error);
    throw error;
  }
}

export async function addMouse(mouseData) {
  try {
    const { id, title, image, brand, pricing, type, connectivity, resolution } =
      mouseData;

    await Mouse.create({
      id,
      title,
      image: image.startsWith('/') ? image : prefix + image,  // ✅ Ensure new adds use prefix
      brand,
      originalPrice: pricing.originalPrice,
      discount: pricing.discount,
      type,
      connectivity,
      resolution,
    });

    return { success: true, id };
  } catch (error) {
    console.error('Error adding mouse:', error);
    return { success: false, message: error.message };
  }
}

export async function updateMouse(id, mouseData) {
  try {
    const { title, image, brand, pricing, type, connectivity, resolution } =
      mouseData;

    await Mouse.updateOne(
      { id },
      {
        $set: {
          title,
          image: image.startsWith('/') ? image : prefix + image,  // ✅ Ensure updates use prefix
          brand,
          originalPrice: pricing.originalPrice,
          discount: pricing.discount,
          type,
          connectivity,
          resolution,
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating mouse:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteMouse(id) {
  try {
    const result = await Mouse.deleteOne({ id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting mouse:', error);
    return { success: false, message: error.message };
  }
}
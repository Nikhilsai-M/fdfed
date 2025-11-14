import Laptop from '../models/laptop.model.js';

export async function initLaptops() {
  try {
    const laptopCount = await Laptop.countDocuments();
    if (laptopCount === 0) {
      await Laptop.insertMany([
        {
          id: 3,
          brand: 'Dell',
          series: 'XPS 13',
          processor_name: 'Intel i7',
          processor_generation: '11th',
          base_price: 85000,
          discount: 10,
          ram: '16GB',
          storage_type: 'SSD',
          storage_capacity: '512GB',
          display_size: 13.4,
          weight: 1.2,
          condition: 'Good',
          os: 'Windows 11',
          image: '../../client/src/assets/images/laptops/dell_xps13.webp',
        },
        {
          id: 4,
          brand: 'Apple',
          series: 'MacBook Air',
          processor_name: 'M1',
          processor_generation: '1st',
          base_price: 92000,
          discount: 8,
          ram: '8GB',
          storage_type: 'SSD',
          storage_capacity: '256GB',
          display_size: 13.3,
          weight: 1.29,
          condition: 'Very Good',
          os: 'macOS',
          image: '../../client/src/assets/images/laptops/macbook_air.webp',
        }
      ]);
      console.log('✅ Test laptops added to database');
    } else {
      console.log('✅ Laptops already exist in database');
    }
  } catch (err) {
    console.error('❌ Error initializing laptops:', err);
  }
}

export async function getAllLaptops() {
  try {
    const laptops = await Laptop.find().lean();
    
    return laptops.map(laptop => ({
      id: laptop.id,
      brand: laptop.brand,
      series: laptop.series,
      processor: {
        name: laptop.processor_name,
        generation: laptop.processor_generation,
      },
      pricing: {
        basePrice: laptop.base_price,
        discount: laptop.discount,
      },
      memory: {
        ram: laptop.ram,
        storage: {
          type: laptop.storage_type,
          capacity: laptop.storage_capacity,
        },
      },
      displaysize: laptop.display_size,
      weight: laptop.weight,
      condition: laptop.condition,
      os: laptop.os,
      image: laptop.image,
    }));
  } catch (error) {
    console.error('Error getting laptops:', error);
    throw error;
  }
}

export async function getLaptopById(id) {
  try {
    const laptop = await Laptop.findOne({ id }).lean();
    
    if (!laptop) {
      return null;
    }
    
    return {
      id: laptop.id,
      brand: laptop.brand,
      series: laptop.series,
      processor: {
        name: laptop.processor_name,
        generation: laptop.processor_generation,
      },
      pricing: {
        basePrice: laptop.base_price,
        discount: laptop.discount,
      },
      memory: {
        ram: laptop.ram,
        storage: {
          type: laptop.storage_type,
          capacity: laptop.storage_capacity,
        },
      },
      displaysize: laptop.display_size,
      weight: laptop.weight,
      condition: laptop.condition,
      os: laptop.os,
      image: laptop.image,
    };
  } catch (error) {
    console.error('Error getting laptop by id:', error);
    throw error;
  }
}

export async function addLaptop(laptopData) {
  try {
    let Base_Price = (laptopData.pricing.originalPrice * 1.2) / (1 - laptopData.pricing.discount / 100);

    await Laptop.create({
      id: laptopData.id,
      brand: laptopData.brand,
      series: laptopData.series,
      processor_name: laptopData.processor.name,
      processor_generation: laptopData.processor.generation,
      base_price: Base_Price.toFixed(0),
      discount: laptopData.pricing.discount,
      ram: laptopData.memory.ram,
      storage_type: laptopData.memory.storage.type,
      storage_capacity: laptopData.memory.storage.capacity,
      display_size: laptopData.display_size,
      weight: laptopData.weight,
      condition: laptopData.condition,
      os: laptopData.os,
      image: laptopData.image,
    });
    
    return { success: true, id: laptopData.id };
  } catch (error) {
    console.error('Error adding laptop:', error);
    return { success: false, message: error.message };
  }
}

export async function updateLaptop(id, laptopData) {
  try {
    await Laptop.updateOne(
      { id },
      {
        $set: {
          brand: laptopData.brand,
          series: laptopData.series,
          processor_name: laptopData.processor.name,
          processor_generation: laptopData.processor.generation,
          base_price: laptopData.pricing.basePrice,
          discount: laptopData.pricing.discount,
          ram: laptopData.memory.ram,
          storage_type: laptopData.memory.storage.type,
          storage_capacity: laptopData.memory.storage.capacity,
          display_size: laptopData.displaysize,
          weight: laptopData.weight,
          condition: laptopData.condition,
          os: laptopData.os,
          image: laptopData.image,
        },
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating laptop:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteLaptop(id) {
  try {
    const result = await Laptop.deleteOne({ id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting laptop:', error);
    return { success: false, message: error.message };
  }
}

export const getLatestLaptops = async (limit = 5) => {
  try {
    const laptops = await Laptop.find()
      .sort({ createdAt: -1 }) // ✅ use createdAt (timestamps enabled)
      .limit(limit)
      .lean()
      .select('id brand series base_price discount image condition');
    return laptops;
  } catch (error) {
    throw new Error('Error fetching latest laptops: ' + error.message);
  }
};
import Phone from '../models/phone.model.js';
import Laptop from '../models/laptop.model.js';
import Earphone from '../models/earphone.model.js';
import Charger from '../models/charger.model.js';
import Mouse from '../models/mouse.model.js';
import Smartwatch from '../models/smartwatch.model.js';

// ==================== PHONE FUNCTIONS ====================
export async function getAllPhones() {
  try {
    const phones = await Phone.find().lean();
    
    return phones.map(phone => ({
      id: phone.id,
      brand: phone.brand,
      model: phone.model,
      color: phone.color,
      image: phone.image,
      specs: {
        processor: phone.processor,
        display: phone.display,
        battery: phone.battery,
        camera: phone.camera,
        os: phone.os,
        network: phone.network,
        weight: phone.weight,
      },
      ram: phone.ram,
      rom: phone.rom,
      pricing: {
        basePrice: phone.base_price,
        discount: phone.discount,
      },
      condition: phone.condition,
    }));
  } catch (error) {
    console.error('Error getting phones:', error);
    throw error;
  }
}

export async function addPhone(phoneData) {
  try {
    let Base_Price = (phoneData.pricing.originalPrice * 1.2) / (1 - phoneData.pricing.discount / 100);
    
    await Phone.create({
      id: phoneData.id,
      brand: phoneData.brand,
      model: phoneData.model,
      color: phoneData.color,
      image: phoneData.image,
      processor: phoneData.processor,
      display: phoneData.display,
      battery: phoneData.battery,
      camera: phoneData.camera,
      os: phoneData.os,
      network: phoneData.network,
      weight: phoneData.weight,
      ram: phoneData.ram,
      rom: phoneData.rom,
      base_price: Base_Price,
      discount: phoneData.pricing.discount,
      condition: phoneData.condition,
    });
    
    return { success: true, id: phoneData.id };
  } catch (error) {
    console.error('Error adding phone:', error);
    return { success: false, message: error.message };
  }
}

export async function updatePhone(id, phoneData) {
  try {
    await Phone.updateOne(
      { id },
      {
        $set: {
          brand: phoneData.brand,
          model: phoneData.model,
          color: phoneData.color,
          image: phoneData.image,
          processor: phoneData.processor,
          display: phoneData.display,
          battery: phoneData.battery,
          camera: phoneData.camera,
          os: phoneData.os,
          network: phoneData.network,
          weight: phoneData.weight,
          ram: phoneData.ram,
          rom: phoneData.rom,
          base_price: phoneData.pricing.basePrice,
          discount: phoneData.pricing.discount,
          condition: phoneData.condition,
        },
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating phone:', error);
    return { success: false, message: error.message };
  }
}

export async function deletePhone(id) {
  try {
    const result = await Phone.deleteOne({ id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting phone:', error);
    return { success: false, message: error.message };
  }
}

// ==================== LAPTOP FUNCTIONS ====================
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

// ==================== EARPHONE FUNCTIONS ====================

export async function getAllEarphones() {
  try {
    const earphones = await Earphone.find({ isActive: true }).lean();

    return earphones.map((earphone) => ({
      id: earphone.id,
      title: earphone.title,
      image: earphone.image,
      brand: earphone.brand,
      originalPrice: earphone.originalPrice,
      discount: earphone.discount,
      design: earphone.design,
      batteryLife: earphone.batteryLife,
      stock: earphone.stock,
    }));

  } catch (error) {
    console.error("Error getting earphones:", error);
    throw error;
  }
}


export async function getSellerEarphones(sellerId) {
  return await Earphone.find({ sellerId, isActive: true }).lean();
}


export async function addEarphone(earphoneData) {
  try {

    const {
      id,
      title,
      image,
      brand,
      pricing,
      design,
      batteryLife,
      sellerId,
      stock
    } = earphoneData;

    await Earphone.create({
      id,
      title,
      image,
      brand,
      originalPrice: pricing.originalPrice,
      discount: pricing.discount,
      design,
      batteryLife,
      sellerId: sellerId || null,
      stock: stock ?? 0,
      isActive: true
    });

    return { success: true, id };

  } catch (error) {
    console.error("Error adding earphone:", error);
    return { success: false, message: error.message };
  }
}


export async function updateEarphone(id, earphoneData) {
  try {

    const {
      title,
      image,
      brand,
      pricing,
      design,
      batteryLife,
      stock
    } = earphoneData;

    await Earphone.updateOne(
      { id },
      {
        $set: {
          title,
          image,
          brand,
          originalPrice: pricing.originalPrice,
          discount: pricing.discount,
          design,
          batteryLife,
          stock
        },
      }
    );

    return { success: true };

  } catch (error) {
    console.error("Error updating earphone:", error);
    return { success: false, message: error.message };
  }
}


export async function deleteEarphone(id) {
  try {

    await Earphone.updateOne(
      { id },
      { $set: { isActive: false } }
    );

    return { success: true };

  } catch (error) {
    console.error("Error deleting earphone:", error);
    return { success: false, message: error.message };
  }
}



// ==================== CHARGER FUNCTIONS ====================

export async function getAllChargers() {
  try {

    const chargers = await Charger.find({ isActive: true }).lean();

    return chargers.map((charger) => ({
      id: charger.id,
      title: charger.title,
      image: charger.image,
      brand: charger.brand,
      wattage: charger.wattage,
      type: charger.type,
      originalPrice: charger.originalPrice,
      discount: charger.discount,
      outputCurrent: charger.outputCurrent,
      stock: charger.stock
    }));

  } catch (error) {
    console.error("Error getting chargers:", error);
    throw error;
  }
}


export async function getSellerChargers(sellerId) {
  return await Charger.find({ sellerId, isActive: true }).lean();
}


export async function addCharger(chargerData) {
  try {

    const {
      id,
      title,
      image,
      brand,
      wattage,
      type,
      pricing,
      outputCurrent,
      sellerId,
      stock
    } = chargerData;

    await Charger.create({
      id,
      title,
      image,
      brand,
      wattage,
      type,
      originalPrice: pricing.originalPrice,
      discount: pricing.discount,
      outputCurrent,
      sellerId: sellerId || null,
      stock: stock ?? 0,
      isActive: true
    });

    return { success: true, id };

  } catch (error) {
    console.error("Error adding charger:", error);
    return { success: false, message: error.message };
  }
}


export async function updateCharger(id, chargerData) {
  try {

    const {
      title,
      image,
      brand,
      wattage,
      type,
      pricing,
      outputCurrent,
      stock
    } = chargerData;

    await Charger.updateOne(
      { id },
      {
        $set: {
          title,
          image,
          brand,
          wattage,
          type,
          originalPrice: pricing.originalPrice,
          discount: pricing.discount,
          outputCurrent,
          stock
        },
      }
    );

    return { success: true };

  } catch (error) {
    console.error("Error updating charger:", error);
    return { success: false, message: error.message };
  }
}


export async function deleteCharger(id) {
  try {

    await Charger.updateOne(
      { id },
      { $set: { isActive: false } }
    );

    return { success: true };

  } catch (error) {
    console.error("Error deleting charger:", error);
    return { success: false, message: error.message };
  }
}



// ==================== MOUSE FUNCTIONS ====================

export async function getAllMouses() {
  try {

    const mouses = await Mouse.find({ isActive: true }).lean();

    return mouses.map((mouse) => ({
      id: mouse.id,
      title: mouse.title,
      image: mouse.image,
      brand: mouse.brand,
      originalPrice: mouse.originalPrice,
      discount: mouse.discount,
      type: mouse.type,
      connectivity: mouse.connectivity,
      resolution: mouse.resolution,
      stock: mouse.stock
    }));

  } catch (error) {
    console.error("Error getting mouses:", error);
    throw error;
  }
}


export async function getSellerMouses(sellerId) {
  return await Mouse.find({ sellerId, isActive: true }).lean();
}


export async function addMouse(mouseData) {
  try {

    const {
      id,
      title,
      image,
      brand,
      pricing,
      type,
      connectivity,
      resolution,
      sellerId,
      stock
    } = mouseData;

    await Mouse.create({
      id,
      title,
      image,
      brand,
      originalPrice: pricing.originalPrice,
      discount: pricing.discount,
      type,
      connectivity,
      resolution,
      sellerId: sellerId || null,
      stock: stock ?? 0,
      isActive: true
    });

    return { success: true, id };

  } catch (error) {
    console.error("Error adding mouse:", error);
    return { success: false, message: error.message };
  }
}


export async function updateMouse(id, mouseData) {
  try {

    const {
      title,
      image,
      brand,
      pricing,
      type,
      connectivity,
      resolution,
      stock
    } = mouseData;

    await Mouse.updateOne(
      { id },
      {
        $set: {
          title,
          image,
          brand,
          originalPrice: pricing.originalPrice,
          discount: pricing.discount,
          type,
          connectivity,
          resolution,
          stock
        },
      }
    );

    return { success: true };

  } catch (error) {
    console.error("Error updating mouse:", error);
    return { success: false, message: error.message };
  }
}


export async function deleteMouse(id) {
  try {

    await Mouse.updateOne(
      { id },
      { $set: { isActive: false } }
    );

    return { success: true };

  } catch (error) {
    console.error("Error deleting mouse:", error);
    return { success: false, message: error.message };
  }
}



// ==================== SMARTWATCH FUNCTIONS ====================

export async function getAllSmartwatches() {
  try {

    const smartwatches = await Smartwatch.find({ isActive: true }).lean();

    return smartwatches.map((smartwatch) => ({
      id: smartwatch.id,
      title: smartwatch.title,
      image: smartwatch.image,
      brand: smartwatch.brand,
      originalPrice: smartwatch.originalPrice,
      discount: smartwatch.discount,
      displaySize: smartwatch.displaySize,
      displayType: smartwatch.displayType,
      batteryRuntime: smartwatch.batteryRuntime,
      stock: smartwatch.stock
    }));

  } catch (error) {
    console.error("Error getting smartwatches:", error);
    throw error;
  }
}


export async function getSellerSmartwatches(sellerId) {
  return await Smartwatch.find({ sellerId, isActive: true }).lean();
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
      sellerId,
      stock
    } = smartwatchData;

    await Smartwatch.create({
      id,
      title,
      image,
      brand,
      originalPrice: pricing.originalPrice,
      discount: pricing.discount,
      displaySize,
      displayType,
      batteryRuntime,
      sellerId: sellerId || null,
      stock: stock ?? 0,
      isActive: true
    });

    return { success: true, id };

  } catch (error) {
    console.error("Error adding smartwatch:", error);
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
      stock
    } = smartwatchData;

    await Smartwatch.updateOne(
      { id },
      {
        $set: {
          title,
          image,
          brand,
          originalPrice: pricing.originalPrice,
          discount: pricing.discount,
          displaySize,
          displayType,
          batteryRuntime,
          stock
        },
      }
    );

    return { success: true };

  } catch (error) {
    console.error("Error updating smartwatch:", error);
    return { success: false, message: error.message };
  }
}


export async function deleteSmartwatch(id) {
  try {

    await Smartwatch.updateOne(
      { id },
      { $set: { isActive: false } }
    );

    return { success: true };

  } catch (error) {
    console.error("Error deleting smartwatch:", error);
    return { success: false, message: error.message };
  }
}
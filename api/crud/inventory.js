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
    let Base_Price = (phoneData.originalPrice * 1.2) / (1 - phoneData.discount / 100);
    
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
      discount: phoneData.discount,
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
          discount: phoneData.discount,
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
    let Base_Price = (laptopData.originalPrice * 1.2) / (1 - laptopData.discount / 100);

    await Laptop.create({
      id: laptopData.id,
      brand: laptopData.brand,
      series: laptopData.series,
      processor_name: laptopData.processor.name,
      processor_generation: laptopData.processor.generation,
      base_price: Base_Price.toFixed(0),
      discount: laptopData.discount,
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
          discount: laptopData.discount,
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

    console.log("🟡 addEarphone received:", earphoneData);

    const {
      id,
      title,
      image,
      brand,
      originalPrice,
      discount,
      design,
      batteryLife,
      sellerId,
      stock
    } = earphoneData;

    console.log("🟢 Extracted values:");
    console.log("originalPrice:", originalPrice);
    console.log("discount:", discount);
    console.log("sellerId:", sellerId);

    await Earphone.create({
      id,
      title,
      image,
      brand,
      originalPrice: Number(originalPrice),
      discount: Number(discount),
      design,
      batteryLife,
      sellerId,
      stock: stock ?? 0,
      isActive: true
    });

    console.log("✅ Earphone created successfully");

    return { success: true, id };

  } catch (error) {
    console.error("❌ Error adding earphone:", error);
    return { success: false, message: error.message };
  }
}

export async function updateEarphone(id, data, sellerId) {
  return await Earphone.updateOne(
    { id, sellerId },
    { $set: data }
  );
}

export async function deleteEarphone(id, sellerId) {
  return await Earphone.updateOne(
    { id, sellerId },
    { $set: { isActive: false } }
  );
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
      originalPrice:Number( originalPrice),
      discount: Number(discount),
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


export async function updateCharger(id, data, sellerId) {
  return await Charger.updateOne(
    { id, sellerId },
    { $set: data }
  );
}

export async function deleteCharger(id, sellerId) {
  return await Charger.updateOne(
    { id, sellerId },
    { $set: { isActive: false } }
  );
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
      originalPrice:Number(originalPrice),
      discount: Number(discount),
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


export async function updateMouse(id, data, sellerId) {
  return await Mouse.updateOne(
    { id, sellerId },
    { $set: data }
  );
}

export async function deleteMouse(id, sellerId) {
  return await Mouse.updateOne(
    { id, sellerId },
    { $set: { isActive: false } }
  );
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
      originalPrice: Number(originalPrice),
      discount:Number(discount),
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

export async function updateSmartwatch(id, data, sellerId) {
  return await Smartwatch.updateOne(
    { id, sellerId },
    { $set: data }
  );
}

export async function deleteSmartwatch(id, sellerId) {
  return await Smartwatch.updateOne(
    { id, sellerId },
    { $set: { isActive: false } }
  );
}
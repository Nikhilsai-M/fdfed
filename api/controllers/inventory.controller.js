import { 
  getAllPhones, addPhone, updatePhone, deletePhone,
  getAllLaptops, addLaptop, updateLaptop, deleteLaptop,
  getAllEarphones, addEarphone, updateEarphone, deleteEarphone,
  getAllChargers, addCharger, updateCharger, deleteCharger,
  getAllMouses, addMouse, updateMouse, deleteMouse,
  getAllSmartwatches, addSmartwatch, updateSmartwatch, deleteSmartwatch
} from '../crud/inventory.js';
import { invalidateCatalogCaches } from "../config/redis.js";


// Get all inventory items
export const getAllInventory = async (req, res, next) => {
  try {
    const dbFunctions = {
      phones: getAllPhones,
      laptops: getAllLaptops,
      earphones: getAllEarphones,
      chargers: getAllChargers,
      mouses: getAllMouses,
      smartwatches: getAllSmartwatches,
    };

    const allItems = [];
    
    for (const [type, fetchFunction] of Object.entries(dbFunctions)) {
      const items = await fetchFunction();
      allItems.push(...items.map(item => ({ ...item, type })));
    }

    res.json({ success: true, items: allItems });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    next(error);
  }
};

// Add new inventory item
export const addInventoryItem = async (req, res, next) => {
  const { type, id, brand, pricing, image, ...specificData } = req.body;

  try {
    let result;
    const typeLower = type.toLowerCase();

    if (typeLower === 'phone') {
      result = await addPhone({
        id: parseInt(id),
        brand,
        pricing,
        image,
        model: specificData.model,
        color: specificData.color,
        processor: specificData.processor,
        display: specificData.display,
        battery: parseInt(specificData.battery),
        camera: specificData.camera,
        os: specificData.os,
        network: specificData.network,
        weight: specificData.weight,
        ram: specificData.ram,
        rom: specificData.rom,
        condition: specificData.condition,
      });
    } else if (typeLower === 'laptop') {
      result = await addLaptop({
        id: parseInt(id),
        brand,
        pricing,
        image,
        series: specificData.series,
        processor: {
          name: specificData.processor_name,
          generation: specificData.processor_generation,
        },
        memory: {
          ram: specificData.ram,
          storage: {
            type: specificData.storage_type,
            capacity: specificData.storage_capacity,
          },
        },
        display_size: parseFloat(specificData.display_size),
        weight: parseFloat(specificData.weight),
        condition: specificData.condition,
        os: specificData.os,
      });
    } else if (typeLower === 'earphones') {
      result = await addEarphone({
        id,
        title: specificData.title,
        brand,
        pricing,
        image,
        design: specificData.design,
        batteryLife: specificData.battery_life,
      });
    } else if (typeLower === 'chargers') {
      result = await addCharger({
        id,
        title: specificData.title,
        brand,
        pricing,
        image,
        wattage: specificData.wattage,
        type: specificData.Pin_type,
        outputCurrent: specificData.output_current,
      });
    } else if (typeLower === 'mouses') {
      result = await addMouse({
        id,
        title: specificData.title,
        brand,
        pricing,
        image,
        type: specificData.type,
        connectivity: specificData.connectivity,
        resolution: specificData.resolution,
      });
    } else if (typeLower === 'smartwatches') {
      result = await addSmartwatch({
        id,
        title: specificData.title,
        brand,
        pricing,
        image,
        displaySize: specificData.display_size,
        displayType: specificData.display_type,
        batteryRuntime: specificData.battery_runtime,
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid item type' });
    }

    if (result.success) {
      await invalidateCatalogCaches();

      res.json({ success: true, id: result.id });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error adding item:', error);
    next(error);
  }
};

// Update inventory item
export const updateInventoryItem = async (req, res, next) => {
  const { type, id } = req.params;
  const { brand, pricing, image, ...specificData } = req.body;

  try {
    let result;

    if (type === 'phones') {
      result = await updatePhone(parseInt(id), {
        brand,
        pricing,
        image,
        model: specificData.model,
        color: specificData.color,
        processor: specificData.processor,
        display: specificData.display,
        battery: parseInt(specificData.battery),
        camera: specificData.camera,
        os: specificData.os,
        network: specificData.network,
        weight: specificData.weight,
        ram: specificData.ram,
        rom: specificData.rom,
        condition: specificData.condition,
      });
    } else if (type === 'laptops') {
      result = await updateLaptop(parseInt(id), {
        brand,
        pricing,
        image,
        series: specificData.series,
        processor: {
          name: specificData.processor_name,
          generation: specificData.processor_generation,
        },
        memory: {
          ram: specificData.ram,
          storage: {
            type: specificData.storage_type,
            capacity: specificData.storage_capacity,
          },
        },
        displaysize: parseFloat(specificData.display_size),
        weight: parseFloat(specificData.weight),
        condition: specificData.condition,
        os: specificData.os,
      });
    } else if (type === 'earphones') {
      result = await updateEarphone(id, {
        brand,
        pricing,
        image,
        title: specificData.title,
        design: specificData.design,
        batteryLife: specificData.battery_life,
      });
    } else if (type === 'chargers') {
      result = await updateCharger(id, {
        brand,
        pricing,
        image,
        title: specificData.title,
        wattage: specificData.wattage,
        type: specificData.Pin_type,
        outputCurrent: specificData.output_current,
      });
    } else if (type === 'mouses') {
      result = await updateMouse(id, {
        brand,
        pricing,
        image,
        title: specificData.title,
        type: specificData.type,
        connectivity: specificData.connectivity,
        resolution: specificData.resolution,
      });
    } else if (type === 'smartwatches') {
      result = await updateSmartwatch(id, {
        brand,
        pricing,
        image,
        title: specificData.title,
        displaySize: specificData.display_size,
        displayType: specificData.display_type,
        batteryRuntime: specificData.battery_runtime,
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid item type' });
    }

    if (result.success) {
      await invalidateCatalogCaches();
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error(`Error updating ${type}:`, error);
    next(error);
  }
};

// Delete inventory item
export const deleteInventoryItem = async (req, res, next) => {
  const { type, id } = req.params;

  try {
    let result;

    if (type === 'phones') {
      result = await deletePhone(parseInt(id));
    } else if (type === 'laptops') {
      result = await deleteLaptop(parseInt(id));
    } else if (type === 'earphones') {
      result = await deleteEarphone(id);
    } else if (type === 'chargers') {
      result = await deleteCharger(id);
    } else if (type === 'mouses') {
      result = await deleteMouse(id);
    } else if (type === 'smartwatches') {
      result = await deleteSmartwatch(id);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid item type' });
    }

    if (result.success) {
      await invalidateCatalogCaches();
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: result.message || 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    next(error);
  }
};


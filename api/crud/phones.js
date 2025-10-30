import Phone from '../models/phone.model.js';

export async function initPhones() {
  try {
    const phoneCount = await Phone.countDocuments();
    if (phoneCount === 0) {
      await Phone.insertMany([
        {
          id: 1,
          brand: 'APPLE',
          model: 'iphone 12',
          color: 'Black',
          image: '../../client/src/assets/images/phones/iphone12.webp',
          processor: 'a 20 bionic',
          display: '4.9',
          battery: 1000,
          camera: '8MP + 8Mp',
          os: 'iOS',
          network: '5G',
          weight: '167',
          ram: '4',
          rom: '128',
          base_price: 45000,
          discount: 8,
          condition: 'Good',
        },
        {
          id: 2,
          brand: 'SAMSUNG',
          model: 'Galax S10 lite',
          color: 'Black',
          image: '../../client/src/assets/images/phones/samsung_s10.webp',
          processor: 'snapdragon 6gen',
          display: '5.9',
          battery: 2000,
          camera: '28MP + 28Mp',
          os: 'Android',
          network: '5G',
          weight: '200',
          ram: '4',
          rom: '128',
          base_price: 22800,
          discount: 10,
          condition: 'Good',
        }
      ]);
      console.log('✅ Test phones added to database');
    } else {
      console.log('✅ Phones already exist in database');
    }
  } catch (err) {
    console.error('❌ Error initializing phones:', err);
  }
}

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

export async function getPhoneById(id) {
  try {
    const phone = await Phone.findOne({ id }).lean();
    
    if (!phone) {
      return null;
    }
    
    return {
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
    };
  } catch (error) {
    console.error('Error getting phone by id:', error);
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
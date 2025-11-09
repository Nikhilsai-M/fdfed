import Phone from '../models/phone.model.js';
import Laptop from '../models/laptop.model.js';
import Earphone from '../models/earphone.model.js';
import Charger from '../models/charger.model.js';
import Mouse from '../models/mouse.model.js';
import Smartwatch from '../models/smartwatch.model.js';

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.json({ success: true, results: [] });
    }

    const searchTerm = q.trim();
    const searchRegex = new RegExp(searchTerm, 'i'); // Case-insensitive search

    // Search across all product types
    const [phones, laptops, earphones, chargers, mouses, smartwatches] = await Promise.all([
      // Search phones
      Phone.find({
        $or: [
          { brand: searchRegex },
          { model: searchRegex },
          { color: searchRegex },
          { processor: searchRegex },
          { os: searchRegex }
        ]
      }).lean(),
      
      // Search laptops
      Laptop.find({
        $or: [
          { brand: searchRegex },
          { series: searchRegex },
          { processor_name: searchRegex },
          { os: searchRegex }
        ]
      }).lean(),
      
      // Search earphones
      Earphone.find({
        $or: [
          { title: searchRegex },
          { brand: searchRegex },
          { design: searchRegex }
        ]
      }).lean(),
      
      // Search chargers
      Charger.find({
        $or: [
          { title: searchRegex },
          { brand: searchRegex },
          { type: searchRegex },
          { wattage: searchRegex }
        ]
      }).lean(),
      
      // Search mouses
      Mouse.find({
        $or: [
          { title: searchRegex },
          { brand: searchRegex },
          { type: searchRegex }
        ]
      }).lean(),
      
      // Search smartwatches
      Smartwatch.find({
        $or: [
          { title: searchRegex },
          { brand: searchRegex },
          { displayType: searchRegex }
        ]
      }).lean()
    ]);

    // Format results with product type
    const results = [
      ...phones.map(phone => ({
        id: phone.id,
        type: 'phone',
        title: `${phone.brand} ${phone.model}`,
        brand: phone.brand,
        model: phone.model,
        image: phone.image,
        price: phone.base_price,
        discount: phone.discount || 0,
        condition: phone.condition,
        finalPrice: phone.base_price * (1 - (phone.discount || 0) / 100)
      })),
      ...laptops.map(laptop => ({
        id: laptop.id,
        type: 'laptop',
        title: `${laptop.brand} ${laptop.series}`,
        brand: laptop.brand,
        series: laptop.series,
        image: laptop.image,
        price: laptop.base_price,
        discount: laptop.discount || 0,
        condition: laptop.condition,
        finalPrice: laptop.base_price * (1 - (laptop.discount || 0) / 100)
      })),
      ...earphones.map(earphone => ({
        id: earphone.id,
        type: 'earphone',
        title: earphone.title,
        brand: earphone.brand,
        image: earphone.image,
        price: earphone.originalPrice,
        discount: earphone.discount || 0,
        finalPrice: earphone.originalPrice * (1 - (earphone.discount || 0) / 100)
      })),
      ...chargers.map(charger => ({
        id: charger.id,
        type: 'charger',
        title: charger.title,
        brand: charger.brand,
        image: charger.image,
        price: charger.originalPrice,
        discount: charger.discount || 0,
        finalPrice: charger.originalPrice * (1 - (charger.discount || 0) / 100)
      })),
      ...mouses.map(mouse => ({
        id: mouse.id,
        type: 'mouse',
        title: mouse.title,
        brand: mouse.brand,
        image: mouse.image,
        price: mouse.originalPrice,
        discount: mouse.discount || 0,
        finalPrice: mouse.originalPrice * (1 - (mouse.discount || 0) / 100)
      })),
      ...smartwatches.map(smartwatch => ({
        id: smartwatch.id,
        type: 'smartwatch',
        title: smartwatch.title,
        brand: smartwatch.brand,
        image: smartwatch.image,
        price: smartwatch.originalPrice,
        discount: smartwatch.discount || 0,
        finalPrice: smartwatch.originalPrice * (1 - (smartwatch.discount || 0) / 100)
      }))
    ];

    // Sort by relevance (you can enhance this later)
    res.json({ 
      success: true, 
      results,
      count: results.length,
      query: searchTerm
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error searching products',
      error: error.message 
    });
  }
};


import { beforeEach, describe, expect, it, vi } from "vitest";

const inventoryCrudMocks = vi.hoisted(() => ({
  getAllPhones: vi.fn(),
  addPhone: vi.fn(),
  updatePhone: vi.fn(),
  deletePhone: vi.fn(),
  getAllLaptops: vi.fn(),
  addLaptop: vi.fn(),
  updateLaptop: vi.fn(),
  deleteLaptop: vi.fn(),
  getAllEarphones: vi.fn(),
  addEarphone: vi.fn(),
  updateEarphone: vi.fn(),
  deleteEarphone: vi.fn(),
  getAllChargers: vi.fn(),
  addCharger: vi.fn(),
  updateCharger: vi.fn(),
  deleteCharger: vi.fn(),
  getAllMouses: vi.fn(),
  addMouse: vi.fn(),
  updateMouse: vi.fn(),
  deleteMouse: vi.fn(),
  getAllSmartwatches: vi.fn(),
  addSmartwatch: vi.fn(),
  updateSmartwatch: vi.fn(),
  deleteSmartwatch: vi.fn(),
}));

const redisMocks = vi.hoisted(() => ({
  getCache: vi.fn(),
  setCache: vi.fn(),
  isRedisReady: vi.fn(),
  invalidateCatalogCaches: vi.fn(),
}));

vi.mock("../crud/inventory.js", () => ({
  getAllPhones: inventoryCrudMocks.getAllPhones,
  addPhone: inventoryCrudMocks.addPhone,
  updatePhone: inventoryCrudMocks.updatePhone,
  deletePhone: inventoryCrudMocks.deletePhone,
  getAllLaptops: inventoryCrudMocks.getAllLaptops,
  addLaptop: inventoryCrudMocks.addLaptop,
  updateLaptop: inventoryCrudMocks.updateLaptop,
  deleteLaptop: inventoryCrudMocks.deleteLaptop,
  getAllEarphones: inventoryCrudMocks.getAllEarphones,
  addEarphone: inventoryCrudMocks.addEarphone,
  updateEarphone: inventoryCrudMocks.updateEarphone,
  deleteEarphone: inventoryCrudMocks.deleteEarphone,
  getAllChargers: inventoryCrudMocks.getAllChargers,
  addCharger: inventoryCrudMocks.addCharger,
  updateCharger: inventoryCrudMocks.updateCharger,
  deleteCharger: inventoryCrudMocks.deleteCharger,
  getAllMouses: inventoryCrudMocks.getAllMouses,
  addMouse: inventoryCrudMocks.addMouse,
  updateMouse: inventoryCrudMocks.updateMouse,
  deleteMouse: inventoryCrudMocks.deleteMouse,
  getAllSmartwatches: inventoryCrudMocks.getAllSmartwatches,
  addSmartwatch: inventoryCrudMocks.addSmartwatch,
  updateSmartwatch: inventoryCrudMocks.updateSmartwatch,
  deleteSmartwatch: inventoryCrudMocks.deleteSmartwatch,
}));

vi.mock("../config/redis.js", () => ({
  getCache: redisMocks.getCache,
  setCache: redisMocks.setCache,
  isRedisReady: redisMocks.isRedisReady,
  invalidateCatalogCaches: redisMocks.invalidateCatalogCaches,
}));

import {
  addInventoryItem,
  getAllInventory,
} from "../controllers/inventory.controller.js";

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return payload;
    },
  };
}

describe("inventory.controller cache flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns cached inventory when Redis already has the response", async () => {
    const res = createResponse();
    const next = vi.fn();
    const cachedPayload = {
      success: true,
      items: [{ id: 1, brand: "Apple", type: "phones" }],
    };

    redisMocks.isRedisReady.mockReturnValue(true);
    redisMocks.getCache.mockResolvedValue(cachedPayload);

    await getAllInventory({}, res, next);

    expect(redisMocks.getCache).toHaveBeenCalledWith("inventory:all");
    expect(res.body).toEqual(cachedPayload);
    expect(inventoryCrudMocks.getAllPhones).not.toHaveBeenCalled();
    expect(redisMocks.setCache).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("aggregates inventory on cache miss and stores it in Redis", async () => {
    const res = createResponse();
    const next = vi.fn();

    redisMocks.isRedisReady.mockReturnValue(true);
    redisMocks.getCache.mockResolvedValue(null);
    redisMocks.setCache.mockResolvedValue(true);

    inventoryCrudMocks.getAllPhones.mockResolvedValue([{ id: 1, brand: "Apple" }]);
    inventoryCrudMocks.getAllLaptops.mockResolvedValue([{ id: 2, brand: "Dell" }]);
    inventoryCrudMocks.getAllEarphones.mockResolvedValue([]);
    inventoryCrudMocks.getAllChargers.mockResolvedValue([{ id: "chg-1", brand: "Anker" }]);
    inventoryCrudMocks.getAllMouses.mockResolvedValue([]);
    inventoryCrudMocks.getAllSmartwatches.mockResolvedValue([]);

    await getAllInventory({}, res, next);

    expect(res.body).toEqual({
      success: true,
      items: [
        { id: 1, brand: "Apple", type: "phones" },
        { id: 2, brand: "Dell", type: "laptops" },
        { id: "chg-1", brand: "Anker", type: "chargers" },
      ],
    });
    expect(redisMocks.setCache).toHaveBeenCalledWith(
      "inventory:all",
      {
        success: true,
        items: [
          { id: 1, brand: "Apple", type: "phones" },
          { id: 2, brand: "Dell", type: "laptops" },
          { id: "chg-1", brand: "Anker", type: "chargers" },
        ],
      },
      120
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects unsupported inventory types without invalidating caches", async () => {
    const res = createResponse();
    const next = vi.fn();

    await addInventoryItem(
      {
        body: {
          type: "tablet",
          id: "44",
          brand: "Test",
        },
      },
      res,
      next
    );

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      success: false,
      message: "Invalid item type",
    });
    expect(redisMocks.invalidateCatalogCaches).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("adds a phone inventory item and invalidates catalog caches", async () => {
    const res = createResponse();
    const next = vi.fn();

    inventoryCrudMocks.addPhone.mockResolvedValue({ success: true, id: 101 });
    redisMocks.invalidateCatalogCaches.mockResolvedValue(5);

    await addInventoryItem(
      {
        body: {
          type: "phone",
          id: "101",
          brand: "Samsung",
          pricing: { originalPrice: 20000, discount: 10 },
          image: "/phone.jpg",
          model: "S23",
          color: "Black",
          processor: "Snapdragon",
          display: "6.1",
          battery: "4000",
          camera: "50MP",
          os: "Android",
          network: "5G",
          weight: "170g",
          ram: "8GB",
          rom: "128GB",
          condition: "Excellent",
        },
      },
      res,
      next
    );

    expect(inventoryCrudMocks.addPhone).toHaveBeenCalledWith({
      id: 101,
      brand: "Samsung",
      pricing: { originalPrice: 20000, discount: 10 },
      image: "/phone.jpg",
      model: "S23",
      color: "Black",
      processor: "Snapdragon",
      display: "6.1",
      battery: 4000,
      camera: "50MP",
      os: "Android",
      network: "5G",
      weight: "170g",
      ram: "8GB",
      rom: "128GB",
      condition: "Excellent",
    });
    expect(redisMocks.invalidateCatalogCaches).toHaveBeenCalled();
    expect(res.body).toEqual({ success: true, id: 101 });
    expect(next).not.toHaveBeenCalled();
  });
});

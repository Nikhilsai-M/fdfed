import { beforeEach, describe, expect, it, vi } from "vitest";

const counterMocks = vi.hoisted(() => ({
  updateOne: vi.fn(),
  findOneAndUpdate: vi.fn(),
}));

const chargerMocks = vi.hoisted(() => ({
  find: vi.fn(),
  exists: vi.fn(),
}));

const earphoneMocks = vi.hoisted(() => ({
  find: vi.fn(),
  exists: vi.fn(),
}));

const mouseMocks = vi.hoisted(() => ({
  find: vi.fn(),
  exists: vi.fn(),
}));

const smartwatchMocks = vi.hoisted(() => ({
  find: vi.fn(),
  exists: vi.fn(),
}));

vi.mock("../models/counter.model.js", () => ({
  default: {
    updateOne: counterMocks.updateOne,
    findOneAndUpdate: counterMocks.findOneAndUpdate,
  },
}));

vi.mock("../models/charger.model.js", () => ({
  default: {
    find: chargerMocks.find,
    exists: chargerMocks.exists,
  },
}));

vi.mock("../models/earphone.model.js", () => ({
  default: {
    find: earphoneMocks.find,
    exists: earphoneMocks.exists,
  },
}));

vi.mock("../models/mouse.model.js", () => ({
  default: {
    find: mouseMocks.find,
    exists: mouseMocks.exists,
  },
}));

vi.mock("../models/smartwatch.model.js", () => ({
  default: {
    find: smartwatchMocks.find,
    exists: smartwatchMocks.exists,
  },
}));

import { generateAccessoryProductId } from "../services/productId.service.js";

describe("productId.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Unsupported categories ───────────────────────────────────────────────

  it("throws for unsupported category 'phone'", async () => {
    await expect(generateAccessoryProductId("phone")).rejects.toThrow(
      "Unsupported product category"
    );
  });

  // ─── Supported categories ─────────────────────────────────────────────────

  it("generates a charger product id with 'ch_' prefix", async () => {
    chargerMocks.find.mockReturnValue({ lean: vi.fn().mockResolvedValue([]) });
    counterMocks.updateOne.mockResolvedValue({});
    counterMocks.findOneAndUpdate.mockResolvedValue({ seq: 1 });
    chargerMocks.exists.mockResolvedValue(null);

    const id = await generateAccessoryProductId("charger");
    expect(id).toBe("ch_001");
  });

  it("generates a mouse product id with 'mo_' prefix", async () => {
    mouseMocks.find.mockReturnValue({ lean: vi.fn().mockResolvedValue([]) });
    counterMocks.updateOne.mockResolvedValue({});
    counterMocks.findOneAndUpdate.mockResolvedValue({ seq: 1 });
    mouseMocks.exists.mockResolvedValue(null);

    const id = await generateAccessoryProductId("mouse");
    expect(id).toBe("mo_001");
  });

  // ─── Collision handling ───────────────────────────────────────────────────

  it("throws after 5 failed attempts when the generated id always exists", async () => {
    chargerMocks.find.mockReturnValue({ lean: vi.fn().mockResolvedValue([]) });
    counterMocks.updateOne.mockResolvedValue({});
    counterMocks.findOneAndUpdate.mockResolvedValue({ seq: 1 });
    chargerMocks.exists.mockResolvedValue(true); // always collides

    await expect(generateAccessoryProductId("charger")).rejects.toThrow(
      "Unable to generate a unique product ID for charger"
    );
  });
});

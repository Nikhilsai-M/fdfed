import { beforeEach, describe, expect, it, vi } from "vitest";

const supervisorMocks = vi.hoisted(() => ({
  find: vi.fn(),
}));

const counterMocks = vi.hoisted(() => ({
  findOneAndUpdate: vi.fn(),
}));

vi.mock("../models/supervisor.model.js", () => ({
  Supervisor: {
    find: supervisorMocks.find,
  },
}));

vi.mock("../models/counter.model.js", () => ({
  default: {
    findOneAndUpdate: counterMocks.findOneAndUpdate,
  },
}));

import {
  getSupervisorIdsByType,
  getNextSupervisorId,
} from "../services/supervisorAssignment.service.js";

/** Helper to mock the Supervisor.find().sort().select().lean() chain */
function mockSupervisorFind(users) {
  supervisorMocks.find.mockReturnValue({
    sort: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue(users),
      }),
    }),
  });
}

describe("supervisorAssignment.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── getSupervisorIdsByType ───────────────────────────────────────────────

  it("returns an array of user_ids for the given supervisor type", async () => {
    mockSupervisorFind([{ user_id: "sup-1" }, { user_id: "sup-2" }]);

    const ids = await getSupervisorIdsByType("phone");
    expect(ids).toEqual(["sup-1", "sup-2"]);
  });

  it("queries supervisors with the correct role and type filters", async () => {
    mockSupervisorFind([]);

    await getSupervisorIdsByType("earphone");

    expect(supervisorMocks.find).toHaveBeenCalledWith({
      role: "supervisor",
      type: "earphone",
    });
  });

  // ─── getNextSupervisorId ──────────────────────────────────────────────────

  it("returns the first supervisor when seq=1 (first round-robin slot)", async () => {
    mockSupervisorFind([{ user_id: "sup-A" }, { user_id: "sup-B" }]);
    counterMocks.findOneAndUpdate.mockResolvedValue({ seq: 1 });

    const id = await getNextSupervisorId("phone");
    expect(id).toBe("sup-A");
  });

  it("uses a counter key namespaced by supervisor type", async () => {
    mockSupervisorFind([{ user_id: "s1" }]);
    counterMocks.findOneAndUpdate.mockResolvedValue({ seq: 1 });

    await getNextSupervisorId("laptop");

    expect(counterMocks.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "supervisor_rr_laptop" },
      { $inc: { seq: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  });
});

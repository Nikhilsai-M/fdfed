import Counter from "../models/counter.model.js";
import { Supervisor } from "../models/supervisor.model.js";

export const getSupervisorIdsByType = async (supervisorType) => {
  const supervisors = await Supervisor.find({
    role: "supervisor",
    type: supervisorType,
  })
    .sort({ user_id: 1 })
    .select({ _id: 0, user_id: 1 })
    .lean();

  return supervisors.map((supervisor) => supervisor.user_id);
};

export const getNextSupervisorId = async (supervisorType) => {
  const supervisorIds = await getSupervisorIdsByType(supervisorType);
  if (supervisorIds.length === 0) return null;

  const counter = await Counter.findOneAndUpdate(
    { _id: `supervisor_rr_${supervisorType}` },
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const index = (counter.seq - 1) % supervisorIds.length;
  return supervisorIds[index];
};

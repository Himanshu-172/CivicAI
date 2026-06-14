import type { IComplaint } from "../../infrastructure/models/complaint.model.js";
import { ComplaintModel } from "../../infrastructure/models/complaint.model.js";

export async function createComplaintDoc(data: Partial<IComplaint>): Promise<IComplaint> {
  const doc = await ComplaintModel.create(data);
  return doc;
}

export async function updateComplaintDoc(id: string, update: Partial<IComplaint>): Promise<IComplaint | null> {
  const doc = await ComplaintModel.findByIdAndUpdate(id, update, { new: true });
  return doc;
}

export async function deleteComplaintDoc(id: string): Promise<void> {
  await ComplaintModel.findByIdAndDelete(id);
}

export async function getComplaintDocById(id: string): Promise<IComplaint | null> {
  return ComplaintModel.findById(id).exec();
}

export async function listComplaintDocs(
  filter: Record<string, unknown>,
  limit = 50,
  skip = 0,
): Promise<IComplaint[]> {
  const docs = await ComplaintModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
  return docs;
}

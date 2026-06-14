import type { Complaint } from "../../domain/complaint.js";
import type { IComplaint } from "../../infrastructure/models/complaint.model.js";
import {
  createComplaintDoc,
  updateComplaintDoc,
  deleteComplaintDoc,
  getComplaintDocById,
  listComplaintDocs,
} from "./complaint-repository.js";

function toDomain(doc: IComplaint): Complaint {
  return {
    id: String(doc.id ?? doc._id),
    title: doc.title,
    description: doc.description,
    category: doc.category,
    severity: doc.severity,
    status: doc.status,
    latitude: doc.latitude,
    longitude: doc.longitude,
    address: doc.address,
    imageUrls: doc.imageUrls ?? [],
    citizenId: doc.citizenId,
    assignedOfficerId: doc.assignedOfficerId,
    assignedWorkerId: doc.assignedWorkerId,
    department: doc.department,
    aiPrediction: doc.aiPrediction,
    duplicateOf: doc.duplicateOf,
    upvotes: doc.upvotes,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function createComplaint(data: Partial<IComplaint>): Promise<Complaint> {
  const doc = await createComplaintDoc(data);
  return toDomain(doc);
}

export async function updateComplaint(id: string, update: Partial<IComplaint>): Promise<Complaint | null> {
  const doc = await updateComplaintDoc(id, update);
  return doc ? toDomain(doc) : null;
}

export async function deleteComplaint(id: string): Promise<void> {
  await deleteComplaintDoc(id);
}

export async function getComplaintById(id: string): Promise<Complaint | null> {
  const doc = await getComplaintDocById(id);
  return doc ? toDomain(doc) : null;
}

export async function listComplaints(filter: Record<string, unknown>, limit = 50, skip = 0): Promise<Complaint[]> {
  const docs = await listComplaintDocs(filter, limit, skip);
  return docs.map(toDomain);
}

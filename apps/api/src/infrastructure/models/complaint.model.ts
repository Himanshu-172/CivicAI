import mongoose, { type Document } from "mongoose";
import { ComplaintCategory, ComplaintSeverity, ComplaintStatus } from "../../domain/complaint.js";

export interface IComplaint extends Document {
  title: string;
  description?: string;
  category: ComplaintCategory;
  severity: ComplaintSeverity;
  status: ComplaintStatus;
  latitude?: number;
  longitude?: number;
  address?: string;
  imageUrls: string[];
  citizenId: string;
  assignedOfficerId?: string;
  assignedWorkerId?: string;
  department?: string;
  aiPrediction?: unknown;
  duplicateOf?: string | null;
  upvotes: number;
  createdAt: Date;
  updatedAt: Date;
}

const complaintSchema = new mongoose.Schema<IComplaint>(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: Object.values(ComplaintCategory), required: true },
    severity: { type: String, enum: Object.values(ComplaintSeverity), required: true },
    status: { type: String, enum: Object.values(ComplaintStatus), default: ComplaintStatus.Open },
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String },
    imageUrls: { type: [String], default: [] },
    citizenId: { type: String, required: true },
    assignedOfficerId: { type: String },
    assignedWorkerId: { type: String },
    department: { type: String },
    aiPrediction: { type: mongoose.Schema.Types.Mixed },
    duplicateOf: { type: String, default: null },
    upvotes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const ComplaintModel = mongoose.model<IComplaint>("Complaint", complaintSchema);

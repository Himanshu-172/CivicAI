export enum ComplaintStatus {
  Open = "OPEN",
  InProgress = "IN_PROGRESS",
  Closed = "CLOSED",
  Rejected = "REJECTED",
}

export enum ComplaintSeverity {
  Low = "LOW",
  Medium = "MEDIUM",
  High = "HIGH",
  Critical = "CRITICAL",
}

export enum ComplaintCategory {
  Sanitation = "SANITATION",
  Road = "ROAD",
  Electricity = "ELECTRICITY",
  Water = "WATER",
  Other = "OTHER",
}

export type Complaint = {
  id: string;
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
  createdAt: string;
  updatedAt: string;
};

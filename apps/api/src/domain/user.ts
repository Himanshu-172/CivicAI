export enum UserRole {
  Citizen = "CITIZEN",
  GovernmentOfficer = "GOVERNMENT_OFFICER",
  FieldWorker = "FIELD_WORKER",
  Admin = "ADMIN",
}

export type UserPayload = {
  id: string;
  email: string;
  role: UserRole;
};

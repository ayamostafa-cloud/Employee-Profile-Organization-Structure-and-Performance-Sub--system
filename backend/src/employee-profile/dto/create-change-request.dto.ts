// src/employee-profile/dto/create-change-request.dto.ts
export class CreateChangeRequestDto {
  employeeProfileId: string;     // which employee

  // WHAT field to change: e.g. "firstName", "nationalId", "primaryPositionId"
  field:
    | 'firstName'
    | 'lastName'
    | 'nationalId'
    | 'primaryPositionId'
    | 'primaryDepartmentId'
    | 'contractType'
    | 'workType';

  // NEW value for that field
  newValue: string;

  // Why employee is requesting this
  reason?: string;
}

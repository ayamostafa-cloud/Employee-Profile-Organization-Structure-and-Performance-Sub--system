import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EmployeeProfile,
  EmployeeProfileDocument,
} from './models/employee-profile.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { SelfUpdateDto } from './dto/self-update.dto';
import { EmployeeProfileChangeRequest } from './models/ep-change-request.schema';
import { CreateChangeRequestDto } from './dto/create-change-request.dto';
import { ProfileChangeStatus } from './enums/employee-profile.enums';
import { randomUUID } from 'crypto';

@Injectable()
export class EmployeeProfileService {
  constructor(
  @InjectModel(EmployeeProfile.name)
  private readonly employeeModel: Model<EmployeeProfileDocument>,

  @InjectModel(EmployeeProfileChangeRequest.name)
  private readonly changeRequestModel: Model<EmployeeProfileChangeRequest>,
) {}

  // -------- CREATE (HR / Admin) --------
  async create(createDto: CreateEmployeeDto) {
    // Mongoose will cast strings to Date/ObjectId as needed
    const created = new this.employeeModel({
      ...createDto,
      dateOfHire: new Date(createDto.dateOfHire),
      contractStartDate: createDto.contractStartDate
        ? new Date(createDto.contractStartDate)
        : undefined,
      contractEndDate: createDto.contractEndDate
        ? new Date(createDto.contractEndDate)
        : undefined,
    });
    return created.save();
  }

  // -------- READ ALL --------
  async findAll() {
    return this.employeeModel
      .find()
      .populate('primaryDepartmentId')
      .populate('primaryPositionId')
      .populate('supervisorPositionId')
      .lean();
  }

  // -------- READ ONE --------
  async findOne(id: string) {
    const employee = await this.employeeModel
      .findById(id)
      .populate('primaryDepartmentId')
      .populate('primaryPositionId')
      .populate('supervisorPositionId')
      .lean();

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  // -------- UPDATE (HR / Admin) --------
  async update(id: string, updateDto: UpdateEmployeeDto) {
    // convert dates if provided
    const payload: any = { ...updateDto };

    if (updateDto.dateOfHire) {
      payload.dateOfHire = new Date(updateDto.dateOfHire);
    }
    if (updateDto.contractStartDate) {
      payload.contractStartDate = new Date(updateDto.contractStartDate);
    }
    if (updateDto.contractEndDate) {
      payload.contractEndDate = new Date(updateDto.contractEndDate);
    }

    const updated = await this.employeeModel
      .findByIdAndUpdate(id, payload, { new: true })
      .lean();

    if (!updated) {
      throw new NotFoundException('Employee not found');
    }

    return updated;
  }

  // -------- DELETE / DEACTIVATE (optional) --------
  async remove(id: string) {
    const deleted = await this.employeeModel.findByIdAndDelete(id).lean();

    if (!deleted) {
      throw new NotFoundException('Employee not found');
    }

    return { message: 'Employee deleted', id };
  }
  async selfUpdate(employeeId: string, dto: SelfUpdateDto) {
  const allowed = ['phone', 'personalEmail', 'workEmail', 'biography', 'address'];

  // Remove any forbidden fields
  const payload: any = {};
  for (const key of allowed) {
    if (dto[key] !== undefined) {
      payload[key] = dto[key];
    }
  }

  const updated = await this.employeeModel.findByIdAndUpdate(
    employeeId,
    payload,
    { new: true }
  ).lean();

  if (!updated) {
    throw new NotFoundException('Employee not found');
  }

  return updated;
}
// ================================
// CREATE CHANGE REQUEST (Employee)
// ================================
// ================================
// CREATE CHANGE REQUEST (Employee)
// ================================
async createChangeRequest(dto: CreateChangeRequestDto) {
  const requestId = randomUUID(); // unique request ID

  // store field + newValue as JSON string in requestDescription
  const descriptionPayload = {
    field: dto.field,
    newValue: dto.newValue,
  };

  const created = new this.changeRequestModel({
    requestId,
    employeeProfileId: dto.employeeProfileId,
    requestDescription: JSON.stringify(descriptionPayload),
    reason: dto.reason,
    status: ProfileChangeStatus.PENDING,
    submittedAt: new Date(),
  });

  return created.save();
}

// ================================
// GET ALL REQUESTS FOR EMPLOYEE
// ================================
async getEmployeeChangeRequests(employeeProfileId: string) {
  return this.changeRequestModel
    .find({ employeeProfileId })
    .sort({ submittedAt: -1 })
    .lean();
}
// ================================
// HR APPROVES REQUEST
// ================================

async approveChangeRequest(id: string) {
  const request = await this.changeRequestModel.findById(id);
  if (!request) throw new NotFoundException('Request not found');

  // ---------------------------------------------
  // SAFE JSON PARSER
  // ---------------------------------------------
  let raw = request.requestDescription;

  raw = raw.replace(/(\r\n|\n|\r)/gm, '').trim();
  raw = raw.replace(/\"\s*,\s*\"/gm, '","');
  raw = raw.replace(/\s*:\s*/gm, ':');

  let parsed: { field: string; newValue: any };
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    console.error('JSON parsing failed. RAW VALUE:', raw);
    throw new Error('Invalid JSON inside requestDescription');
  }

  const { field, newValue } = parsed;
  const update: any = {};

  // Auto-update logic
  if (field === 'firstName' || field === 'lastName') {
    update[field] = String(newValue).trim();
  }

  else if (field === 'nationalId') {
    if (!/^\d{14}$/.test(newValue)) {
      throw new Error('nationalId must be 14 digits');
    }
    update.nationalId = newValue;
  }

  else if (
    field === 'primaryPositionId' ||
    field === 'primaryDepartmentId' ||
    field === 'contractType' ||
    field === 'workType'
  ) {
    update[field] = newValue;
  }

  else {
    throw new Error(`Unsupported field: ${field}`);
  }

  // Apply update to employee
  await this.employeeModel.findByIdAndUpdate(
    request.employeeProfileId,
    update,
    { new: true }
  );

  // Update request status
  request.status = ProfileChangeStatus.APPROVED;
  request.processedAt = new Date();
  await request.save();

  return {
    message: 'Request approved and employee updated',
    fieldUpdated: field,
    newValue: newValue,
  };
}

// ================================
// HR REJECTS REQUEST
// ================================
async rejectChangeRequest(id: string, reason: string) {
  const request = await this.changeRequestModel.findById(id);
  if (!request) throw new NotFoundException('Request not found');

  request.status = ProfileChangeStatus.REJECTED;
  request.processedAt = new Date();
  request.reason = reason;

  return request.save();
}

}
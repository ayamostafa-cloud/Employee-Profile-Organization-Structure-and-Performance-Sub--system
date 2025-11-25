import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { EmployeeProfileService } from './employee-profile.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { SelfUpdateDto } from './dto/self-update.dto';
import { CreateChangeRequestDto } from './dto/create-change-request.dto';
@Controller('employee-profile')
export class EmployeeProfileController {
  constructor(
    private readonly employeeProfileService: EmployeeProfileService,
  ) {}

  // CREATE (HR/Admin)
  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeProfileService.create(dto);
  }

  // GET ALL
  @Get()
  findAll() {
    return this.employeeProfileService.findAll();
  }

  // GET ONE BY ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeProfileService.findOne(id);
  }
  

  // UPDATE (HR/Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeeProfileService.update(id, dto);
  }

  // DELETE / DEACTIVATE (optional)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeProfileService.remove(id);
  }
  // EMPLOYEE SELF-SERVICE UPDATE
@Patch('self-update/:id')
selfUpdate(@Param('id') id: string, @Body() dto: SelfUpdateDto) {
  return this.employeeProfileService.selfUpdate(id, dto);
}
// Employee submits a change request
@Post('change-requests')
createChangeRequest(@Body() dto: CreateChangeRequestDto) {
  return this.employeeProfileService.createChangeRequest(dto);
}

// Employee views all their change requests
@Get('change-requests/:employeeProfileId')
getEmployeeChangeRequests(@Param('employeeProfileId') employeeProfileId: string) {
  return this.employeeProfileService.getEmployeeChangeRequests(employeeProfileId);
}

// HR approves request
@Patch('change-requests/:id/approve')
approveChangeRequest(@Param('id') id: string) {
  return this.employeeProfileService.approveChangeRequest(id);
}

// HR rejects request
@Patch('change-requests/:id/reject')
rejectChangeRequest(
  @Param('id') id: string,
  @Body('reason') reason: string,
) {
  return this.employeeProfileService.rejectChangeRequest(id, reason);
}

}

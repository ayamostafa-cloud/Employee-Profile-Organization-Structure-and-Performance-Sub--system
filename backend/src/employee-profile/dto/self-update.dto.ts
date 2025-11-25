import { IsOptional, IsString, IsObject } from 'class-validator';

export class SelfUpdateDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  personalEmail?: string;

  @IsOptional()
  @IsString()
  workEmail?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsObject()
  address?: {
    street?: string;
    city?: string;
    country?: string;
  };
}

import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const normalizeSlug = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

const normalizeCurrency = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toUpperCase() : value;

export class CreateRestaurantDto {
  @ApiProperty({ example: 'North Fork', maxLength: 150 })
  @Transform(trimString)
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    example: 'north-fork',
    minLength: 3,
    maxLength: 150,
  })
  @Transform(normalizeSlug)
  @IsString()
  @Length(3, 150)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @ApiPropertyOptional({
    example: 'Modern европейская кухня и сезонное меню.',
    maxLength: 5000,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/restaurants/north-fork.jpg',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  image?: string;

  @ApiPropertyOptional({ example: '+74951234567', maxLength: 30 })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({
    example: 'Moscow, Tverskaya 10',
    maxLength: 255,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiProperty({ example: 'Europe/Moscow', maxLength: 100 })
  @Transform(trimString)
  @IsString()
  @MaxLength(100)
  timezone: string;

  @ApiProperty({ example: 'RUB', minLength: 3, maxLength: 10 })
  @Transform(normalizeCurrency)
  @IsString()
  @Length(3, 10)
  currency: string;
}

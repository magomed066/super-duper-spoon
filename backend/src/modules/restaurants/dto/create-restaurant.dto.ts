import { Transform } from 'class-transformer';
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
  @Transform(trimString)
  @IsString()
  @MaxLength(150)
  name: string;

  @Transform(normalizeSlug)
  @IsString()
  @Length(3, 150)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @Transform(trimString)
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  image?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @Transform(trimString)
  @IsString()
  @MaxLength(100)
  timezone: string;

  @Transform(normalizeCurrency)
  @IsString()
  @Length(3, 10)
  currency: string;
}

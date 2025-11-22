import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsArray()
  @IsMongoId({ each: true })
  categories: string[];

  @IsArray()
  @IsMongoId({ each: true })
  subCategories: string[];
}

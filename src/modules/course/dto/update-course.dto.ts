import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    categories: string[];

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    subCategories: string[];
}

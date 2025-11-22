import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSubCategoryDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsMongoId()
    categoryId: string;
}

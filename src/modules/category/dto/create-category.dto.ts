import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name: string
}

import { IsNotEmpty, IsString } from 'class-validator';
import { IsMongoId } from 'class-validator';

export class CreateSubCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  categoryId: string;
}

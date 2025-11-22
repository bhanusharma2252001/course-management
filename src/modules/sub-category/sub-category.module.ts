import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategory, SubCategorySchema } from './entities/sub-category.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: SubCategory.name, schema: SubCategorySchema }])],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule { }

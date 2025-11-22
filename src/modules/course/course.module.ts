import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './entities/course.entity';
import { Category, CategorySchema } from '../category/entities/category.entity';
import { SubCategory, SubCategorySchema } from '../sub-category/entities/sub-category.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Course.name, schema: CourseSchema },
    { name: Category.name, schema: CategorySchema },
    { name: SubCategory.name, schema: SubCategorySchema }])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule { }

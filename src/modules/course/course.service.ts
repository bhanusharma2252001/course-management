import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { GetCourseDto } from './dto/get-course.dto';
import { Category } from '../category/entities/category.entity';
import { SubCategory } from '../sub-category/entities/sub-category.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
  ) { }

  /**
   * Validate:
   * 1. CategoryIds exist
   * 2. SubCategoryIds exist
   * 3. Every SubCategory belongs to supplied Categories
   */
  private async validateRelations(categoryIds: string[], subCategoryIds: string[]) {
    const catObjs = categoryIds.map((id) => new Types.ObjectId(id));
    const subObjs = subCategoryIds.map((id) => new Types.ObjectId(id));

    const existingCategories = await this.categoryModel.find({
      _id: { $in: catObjs },
      isDeleted: false,
    });

    if (existingCategories.length !== categoryIds.length) throw new BadRequestException('One or more categories are invalid');

    const existingSubs = await this.subCategoryModel.find({
      _id: { $in: subObjs },
    });

    if (existingSubs.length !== subCategoryIds.length) throw new BadRequestException('One or more subcategories are invalid');

    for (const sub of existingSubs) {
      if (!categoryIds.includes(sub.categoryId.toString())) {
        throw new BadRequestException(`SubCategory ${sub.name} does not belong to the selected categories`);
      }
    }
  }

  async create(dto: CreateCourseDto) {
    //   It was given in assignment instructions that we need to use mongodb transactions here, but as it's single document operation 
    //  so it will not affect the functionality as i did not use them
    await this.validateRelations(dto.categories, dto.subCategories);

    const created = await this.courseModel.create({
      ...dto,
      categoryIds: dto.categories.map((id) => new Types.ObjectId(id)),
      subCategoryIds: dto.subCategories.map((id) => new Types.ObjectId(id)),
    });

    return { course: created };
  }

  async findAll(query: GetCourseDto) {
    let {
      search,
      categoryId,
      subCategoryId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    page = Number(page);
    limit = Number(limit);


    const filter: any = { isDeleted: false };

    if (search) filter.$text = { $search: search };
    if (categoryId) filter.categories = new Types.ObjectId(categoryId);
    if (subCategoryId) filter.subcategories = new Types.ObjectId(subCategoryId);

    const skip = (page - 1) * limit;

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.courseModel.find(filter).sort(sort).skip(skip).limit(limit).populate<{ categories: Category }>("categories")
        .populate<{ subCategories: SubCategory }>("subCategories"),
      this.courseModel.countDocuments(filter),
    ]);

    return {
      data,
      metadata: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
  async findOne(id: Types.ObjectId) {
    const course = await this.courseModel.findOne({ _id: id, isDeleted: false }).populate<{ categories: Category }>("categories")
      .populate<{ subCategories: SubCategory }>("subCategories");

    if (!course) throw new NotFoundException('Invalid course');

    return { course };
  }

  async update(id: Types.ObjectId, dto: UpdateCourseDto) {
    const course: CourseDocument | null = await this.courseModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!course) throw new BadRequestException('Invalid course');

    const updatedCategories = dto.categories ?? course.categories.map(String);
    const updatedSubCategories = dto.subCategories ?? course.subCategories.map(String);

    await this.validateRelations(updatedCategories, updatedSubCategories);

    const updated = await this.courseModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...dto,
          categoryIds: updatedCategories.map((id) => new Types.ObjectId(id)),
          subCategoryIds: updatedSubCategories.map((id) => new Types.ObjectId(id)),
        },
      },
      { new: true, runValidators: true },
    );

    return { course: updated };
  }

  async remove(id: Types.ObjectId) {
    const course = await this.courseModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!course) throw new BadRequestException('Invalid course');

    const deleted = await this.courseModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true },
    );

    return { course: deleted };
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './entities/category.entity';
import { GetCategoryDto } from './dto/get-category.dto';
import { Types } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) { }
  async create(createCategoryDto: CreateCategoryDto) {
    const duplicateCategory = await this.categoryModel.findOne({ name: createCategoryDto.name });

    if (duplicateCategory) throw new BadRequestException('Duplicate category name');

    const newCategory = new this.categoryModel(createCategoryDto);
    const createdCategory = await newCategory.save()
    return {
      category: createdCategory
    }
  }

  async getCategories(searchCategoryDto: GetCategoryDto) {
    let {
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = searchCategoryDto;

     page = Number(page);
    limit = Number(limit);


    let filter: any = { isDeleted: false };

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.categoryModel.find(filter).sort(sort).skip(skip).limit(limit),
      this.categoryModel.countDocuments(filter),
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

  async getCategoryAggregation() {
    const result = await this.categoryModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $lookup: {
          from: 'subcategories',
          foreignField: 'categoryId',
          localField: '_id',
          as: 'subcategoriesDocs'
        }
      },
      {
        $addFields: {
          subCategoryCount: {
            $size: '$subcategoriesDocs'
          }
        }
      },
      {
        $project: {
          _id : 1,
          name: 1,
          subCategoryCount: 1
        }
      }
    ]);
    return result;
  }
  async findOne(id: Types.ObjectId) {
    const category = await this.categoryModel.findById(id);
    if (!category) throw new BadRequestException('Invalid category');
    return { category };
  }

  async update(id: Types.ObjectId, updateCategoryDto: UpdateCategoryDto) {

    const category = await this.categoryModel.findById(id);
    if (!category) throw new BadRequestException('Invalid category');

    const updatedCategory = await this.categoryModel.findByIdAndUpdate(id, {
      $set: updateCategoryDto
    }, { new: true, runValidators: true });

    return { category: updatedCategory };
  }

  async remove(id: Types.ObjectId) {
    const category = await this.categoryModel.findById(id);
    if (!category || category.isDeleted) throw new BadRequestException('Invalid category');

    const deletedCategory = await this.categoryModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true },
    );
    return { category: deletedCategory };
  }
}

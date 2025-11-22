import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SubCategory } from './entities/sub-category.entity';
import { GetSubCategoryDto } from './dto/get-sub-category.dto';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
  ) { }

  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const { name, categoryId } = createSubCategoryDto;

    // prevent duplicate within same category
    const duplicate = await this.subCategoryModel.findOne({
      name,
      categoryId: new Types.ObjectId(categoryId),
    });

    if (duplicate) throw new BadRequestException('Duplicate subcategory name');

    const newSubCategory = new this.subCategoryModel({
      ...createSubCategoryDto,
      categoryId: new Types.ObjectId(categoryId),
    });

    const created = await newSubCategory.save();

    return { subCategory: created };
  }

  async findAll(query: GetSubCategoryDto) {
    let {
      search,
      categoryId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;
    
    page = Number(page);
    limit = Number(limit);

    const filter: any = { isDeleted: false };

    if (search) filter.name = { $regex: search, $options: 'i' };

    if (categoryId) filter.categoryId = new Types.ObjectId(categoryId);

    const skip = (page - 1) * limit;

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.subCategoryModel.find(filter).sort(sort).skip(skip).limit(limit),
      this.subCategoryModel.countDocuments(filter),
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
    const subCategory = await this.subCategoryModel.findById(id);
    if (!subCategory) throw new BadRequestException('Invalid subcategory');
    return { subCategory };
  }

  async update(id: Types.ObjectId, dto: UpdateSubCategoryDto) {
    const subCategory = await this.subCategoryModel.findById(id);
    if (!subCategory) throw new BadRequestException('Invalid subcategory');

    // Duplicate check on name and category
    if (dto.name || dto.categoryId) {
      const query = {
        _id: { $ne: id },
        name: dto.name ?? subCategory.name,
        categoryId: new Types.ObjectId(
          dto.categoryId ?? subCategory.categoryId,
        ),
      };
      const duplicate = await this.subCategoryModel.findOne(query);
      if (duplicate) throw new BadRequestException('Duplicate subcategory name');
    }

    const updated = await this.subCategoryModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true, runValidators: true },
    );
    return { subCategory: updated };
  }

  async remove(id: Types.ObjectId) {
    const subCategory = await this.subCategoryModel.findById(id);
    if (!subCategory || subCategory.isDeleted) throw new BadRequestException('Invalid subcategory');

    const deleted = await this.subCategoryModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );

    return { subCategory: deleted };
  }
}

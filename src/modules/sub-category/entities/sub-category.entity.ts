import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Category } from 'src/modules/category/entities/category.entity';

export type SubCategoryDocument = HydratedDocument<SubCategory>;

@Schema({ timestamps: true, versionKey: false })
export class SubCategory {

    @Prop({ required: true, index: 'text' })
    name: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Category.name,
        required: true
    })
    categoryId: Types.ObjectId


    @Prop({ type: Boolean, default: false })
    isDeleted: boolean

}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);

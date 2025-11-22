import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { Category } from "src/modules/category/entities/category.entity";
import { SubCategory } from "src/modules/sub-category/entities/sub-category.entity";

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true, versionKey: false })
export class Course {

    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String })
    description: string;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Category.name }])
    categories: Types.ObjectId[];

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: SubCategory.name }])
    subCategories: Types.ObjectId[]

    @Prop({ type: Boolean, default: false })
    isDeleted: boolean
}

export const CourseSchema = SchemaFactory.createForClass(Course);

// ----- TEXT INDEXES -----
CourseSchema.index({
    title: 'text',
    description: 'text',
});

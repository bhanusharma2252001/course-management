import { CategoryModule } from './modules/category/category.module';
import { CourseModule } from './modules/course/course.module';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { winstonLogger } from './logger/winston-logger';
import { SubCategoryModule } from './modules/sub-category/sub-category.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        
        uri: configService.get<string>('MONGODB_URI'),
        onConnectionCreate: () => {
          winstonLogger.log('MongoDB connected successfully!', AppModule.name);
        }
      }),
      inject: [ConfigService],
    }),

    CourseModule,
    CategoryModule,
    SubCategoryModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

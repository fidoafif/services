import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentInvokeService } from '../../services/invokes/content.service';
import { CategoryModule } from '../category/category.module';
import { NestedSubCategoryController } from './nestedSubCategory.controller';
import { SubCategoryController } from './subCategory.controller';
import { SubCategory } from './subCategory.entity';
import { SubCategoryService } from './subCategory.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategory]), CategoryModule],
  providers: [SubCategoryService, ContentInvokeService],
  controllers: [NestedSubCategoryController, SubCategoryController],
  exports: [SubCategoryService, ContentInvokeService],
})
export class SubCategoryModule {}

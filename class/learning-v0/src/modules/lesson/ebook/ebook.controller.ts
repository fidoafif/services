import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest
} from '@nestjsx/crud';
import { EbookDto } from './ebook.dto';
import { Ebook } from './ebook.entity';
import { EbookService } from './ebook.service';

@Crud({
  model: {
    type: Ebook,
  },
  query: {
    join: {
      lesson: { eager: true },
    },
  },
  params: {
    lessonSlug: {
      field: 'lesson.slug',
      type: 'string',
    },
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
})
@ApiUseTags('Ebook')
@Controller('lesson/:lessonSlug/ebook')
@ApiBearerAuth()
export class EbookController {
  constructor(public readonly service: EbookService) {}

  get base(): CrudController<Ebook> {
    return this;
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: EbookDto
  ): Promise<Ebook> {
    const response = await this.base.createOneBase(req, dto as Ebook);

    return response;
  }
}

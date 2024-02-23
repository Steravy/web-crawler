import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './services/scraper.service';
import { PageModule } from '../page/page.module';
import { ScraperProductService } from './services/scraper.product.service';

@Module({
    imports: [PageModule],
    controllers: [ScraperController],
    providers: [ScraperService, ScraperProductService],
})
export class ScraperModule {}

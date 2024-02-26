import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './services/scraper.service';
import { ScraperProductService } from './services/scraper.product.service';

@Module({
    controllers: [ScraperController],
    providers: [ScraperService, ScraperProductService],
})
export class ScraperModule {}

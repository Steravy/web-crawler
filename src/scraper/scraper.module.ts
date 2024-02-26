import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { ScraperFilteredProductService } from './services/scraper.filtered-product.service';
import { ScraperProductService } from './services/scraper.product.service';

@Module({
    controllers: [ScraperController],
    providers: [ScraperFilteredProductService, ScraperProductService],
})
export class ScraperModule {}

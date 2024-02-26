import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { ScraperFilteredProductService } from './services/scraper.filtered-product.service';
import { ScraperProductDetailsService } from './services/scraper.product-details.service';

@Module({
    controllers: [ScraperController],
    providers: [ScraperFilteredProductService, ScraperProductDetailsService],
})
export class ScraperModule {}

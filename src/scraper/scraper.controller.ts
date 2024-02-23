import { Controller, Get, Param, Query } from '@nestjs/common';
import { ScraperService } from './services/scraper.service';
import { ScraperProductService } from './services/scraper.product.service';

@Controller('scraper')
export class ScraperController {
    constructor(
        private readonly scraper: ScraperService,
        private readonly productDetailScraper: ScraperProductService,
    ) {}

    @Get()
    scrape(@Query('nutrition') nutrition: string, @Query('nova') nova: string) {
        console.log(nutrition, nova);
        this.scraper.fetchProductListings(nutrition, nova);
    }

    @Get(':id')
    async product(@Param('id') id: string) {
        console.log(id);
        await this.productDetailScraper.run(id);
    }
}

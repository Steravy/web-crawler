import { Controller, Get, Param, Query } from '@nestjs/common';
import { ScraperService } from './services/scraper.service';

@Controller('scraper')
export class ScraperController {
    constructor(private readonly scraper: ScraperService) {}

    @Get()
    scrape(@Query('nutrition') nutrition: string, @Query('nova') nova: string) {
        console.log(nutrition, nova);
        this.scraper.fetchProductListings(nutrition, nova);
    }
}

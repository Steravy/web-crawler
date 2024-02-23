import { Controller, Get } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
    constructor(private readonly scraper: ScraperService) {}

    @Get()
    scrape() {
        this.scraper.run();
    }
}

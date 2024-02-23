import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './services/scraper.service';
import { PageModule } from '../page/page.module';

@Module({
    imports: [PageModule],
    controllers: [ScraperController],
    providers: [ScraperService],
})
export class ScraperModule {}

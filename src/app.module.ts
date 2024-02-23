import { Module } from '@nestjs/common';
import { ScraperModule } from './scraper/scraper.module';
import { PageModule } from './page/page.module';

@Module({
    imports: [ScraperModule, PageModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperService } from './scraper/services/scraper.service';
import { ScraperModule } from './scraper/scraper.module';
import { PageModule } from './page/page.module';

@Module({
    imports: [ScraperModule, PageModule],
    controllers: [AppController],
    providers: [AppService, ScraperService],
})
export class AppModule {}

import { Module, OnModuleInit } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { ScraperFilteredProductService } from './services/scraper.filtered-product.service';
import { ScraperProductDetailsService } from './services/scraper.product-details.service';
import { LifeMilesService } from './services/life-miles.service';

@Module({
    controllers: [ScraperController],
    providers: [
        ScraperFilteredProductService,
        ScraperProductDetailsService,
        LifeMilesService,
    ],
})
export class ScraperModule implements OnModuleInit {
    constructor(
      private readonly lifeMiles: LifeMilesService
    ) {
    }

   async onModuleInit(): Promise<void> {
       await this.lifeMiles.run();
    }
}

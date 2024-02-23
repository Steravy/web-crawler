import { Controller, Get, Param, Query } from '@nestjs/common';
import { ScraperService } from './services/scraper.service';
import { ScraperProductService } from './services/scraper.product.service';
import {
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { ProductListingResponse } from './dto/product-listing-response.dto';
import { NovaScores, NutritionScores } from '../shared/misc/types';

@ApiTags('Scraper')
@Controller('scraper')
export class ScraperController {
    constructor(
        private readonly scraper: ScraperService,
        private readonly productDetailScraper: ScraperProductService,
    ) {}

    @Get('products')
    @ApiQuery({ name: 'nutrition', enum: NutritionScores })
    @ApiQuery({ name: 'nova', enum: NovaScores })
    @ApiOkResponse({
        description: 'Product data successfully scraped and fetched!',
        type: [ProductListingResponse],
    })
    @ApiInternalServerErrorResponse({
        description: 'An unexpected error just happened!',
    })
    @ApiBadRequestResponse({
        description:
            'Something is wrong with the request you have made. Probably you missed or provided wrong values on the url query segment.',
    })
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

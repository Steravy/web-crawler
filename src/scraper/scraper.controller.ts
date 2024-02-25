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
@Controller('products')
export class ScraperController {
    constructor(
        private readonly scraper: ScraperService,
        private readonly productDetailScraper: ScraperProductService,
    ) {}

    @Get()
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
    products(
        @Query('nutrition') nutrition: NutritionScores,
        @Query('nova') nova: NovaScores,
    ) {
        return this.scraper.fetchProductListings(nutrition, nova);
    }

    @Get(':id')
    async product(@Param('id') id: string) {
        console.log(id);
        await this.productDetailScraper.run(id);
    }
}

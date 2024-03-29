import { Controller, Get, Param, Query } from '@nestjs/common';
import { ScraperFilteredProductService } from './services/scraper.filtered-product.service';
import { ScraperProductDetailsService } from './services/scraper.product-details.service';
import {
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { ProductListingResponse } from './dto/product-listing-response.dto';
import { NovaScores, NutritionScores } from './utils/types';
import { ProductDetailsDTO } from './dto/product-details.dto';

@ApiTags('Scraper')
@Controller('products')
export class ScraperController {
    constructor(
        private readonly scrapeProductsWithFilters: ScraperFilteredProductService,
        private readonly productDetailScraper: ScraperProductDetailsService,
    ) {}

    @Get()
    @ApiQuery({ name: 'nutrition', enum: NutritionScores })
    @ApiQuery({ name: 'nova', enum: NovaScores })
    @ApiOkResponse({
        description: 'Product data successfully scraped and fetched!',
        type: [ProductListingResponse],
    })
    @ApiInternalServerErrorResponse({
        description: 'Some internally process has failed!',
    })
    @ApiBadRequestResponse({
        description:
            'Something is wrong with the request you have made. Probably you missed or provided wrong values on the url query segment.',
    })
    products(
        @Query('nutrition') nutrition: NutritionScores,
        @Query('nova') nova: NovaScores,
    ) {
        return this.scrapeProductsWithFilters.run(nutrition, nova);
    }

    @Get(':id')
    @ApiParam({ name: 'id', example: '3155250349793' })
    @ApiOkResponse({
        description: 'Product data successfully scraped and fetched!',
        type: ProductDetailsDTO,
    })
    @ApiInternalServerErrorResponse({
        description: 'Some internally process has failed!',
    })
    @ApiBadRequestResponse({
        description:
            'Something is wrong with the request you have made. Probably you missed or provided wrong values on the url query segment.',
    })
    async product(@Param('id') id: string) {
        console.log(id);
        return await this.productDetailScraper.run(id);
    }
}

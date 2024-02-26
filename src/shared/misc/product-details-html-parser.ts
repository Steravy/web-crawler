/* 
    Created by Stefan Vitoria on 2/26/24
*/

import { Page } from 'puppeteer';
import {
    extractTitleAndQuantity,
    resolveIfIsVegan,
    resolveIfIsVegetarian,
    resolveIngredientsList,
    resolveNovaScore,
    resolveNutritionDetails,
    resolvePalmOilFree,
    resolveServingSize,
} from './product-details.utils';
import { extractNutritionData } from './nutrition-facts';
import { Logger } from '@nestjs/common';

export abstract class ProductDetailsHtmlParser {
    static LOGGER_LABEL = ProductDetailsHtmlParser.name;
    static async execute(currentPage: Page) {
        Logger.log(
            'PRODUCT DETAILS HTML ELEMENTS PARSING PROCCESS STARTED!',
            this.LOGGER_LABEL,
        );
        const productDetails = {};
        const { title, quantity } = await extractTitleAndQuantity(currentPage);

        productDetails['title'] = title;
        productDetails['quantity'] = quantity;
        productDetails['ingredients'] = await this.ingredients(currentPage);
        productDetails['nutrition'] =
            await resolveNutritionDetails(currentPage);
        productDetails['servingSize'] = await resolveServingSize(currentPage);
        productDetails['data'] = await extractNutritionData(currentPage);
        productDetails['nova'] = await resolveNovaScore(currentPage);

        return productDetails;
    }

    private static async ingredients(currentPage: Page) {
        Logger.log('EXTRACTING INGREDIENTS!', this.LOGGER_LABEL);

        const ingredients = {};
        ingredients['hasPalmOil'] = await resolvePalmOilFree(currentPage);
        ingredients['isVegan'] = await resolveIfIsVegan(currentPage);
        ingredients['isVegetarian'] = await resolveIfIsVegetarian(currentPage);
        ingredients['list'] = await resolveIngredientsList(currentPage);
        return ingredients;
    }
}

/* 
    Created by Stefan Vitoria on 2/23/24
*/

import { Injectable, Logger } from '@nestjs/common';
import { composeUrl } from '../../shared/misc/utils';
import puppeteer from 'puppeteer';
import {
    extractTitleAndQuantity,
    resolveIfIsVegan,
    resolveIfIsVegetarian,
    resolveIngredients,
    resolveNovaScore,
    resolveNutritionScore,
    resolvePalmOilFree,
} from '../../shared/misc/product-details.utils';

@Injectable()
export class ScraperProductService {
    private readonly LOGGER_LABEL = ScraperProductService.name;

    async run(productId: string) {
        Logger.debug(this.LOGGER_LABEL, productId);
        const url = composeUrl({ productId });
        const browser = await puppeteer.launch();
        Logger.debug(this.LOGGER_LABEL, 'AFTER');
        try {
            const currentPage = await browser.newPage();
            currentPage.setDefaultNavigationTimeout(2 * 60 * 1000);
            await currentPage.goto(url);

            Logger.debug(
                'WEBPAGE WHERE PRODUCT DETAILS WILL BE SCRAPED IS ACCESSIBLE',
                this.LOGGER_LABEL,
            );

            const tq = await extractTitleAndQuantity(currentPage);
            const palmOilFree = await resolvePalmOilFree(currentPage);
            console.log(palmOilFree, 'PAIL OIL');
            const isVegan = await resolveIfIsVegan(currentPage);
            console.log(isVegan, 'IS VEGAN');
            const isVegetarian = await resolveIfIsVegetarian(currentPage);
            console.log(isVegetarian, 'IS Vegetarian');
            const ingredients = await resolveIngredients(currentPage);
            console.log(ingredients, 'INGREDIENTS');
            const nova = await resolveNovaScore(currentPage);
            console.log(nova, 'NOVA');
            const nutrition = await resolveNutritionScore(currentPage);
            console.log(nutrition, 'NUTRITION');
        } catch (e) {
            console.log('ERROR WHILE SCRAPPING PRODUCT DETAIL', e);
        } finally {
            if (browser) await browser.close();
        }
    }
}

/* 
    Created by Stefan Vitoria on 2/23/24
*/

import { PageService } from '../../page/page.service';
import { Injectable, Logger } from '@nestjs/common';
import {
    composeUrl,
    extractIngredients,
    extractTitleAndQuantity,
} from '../../shared/misc/utils';

@Injectable()
export class ScraperProductService {
    private readonly LOGGER_LABEL = ScraperProductService.name;

    constructor(private readonly page: PageService) {}

    async run(productId: string) {
        Logger.debug(this.LOGGER_LABEL, productId);
        const url = composeUrl({ productId });
        Logger.debug(this.LOGGER_LABEL, 'AFTER');
        try {
            const currentPage = await this.page.visit(url);

            Logger.debug(
                'WEBPAGE WHERE PRODUCT DETAILS WILL BE SCRAPED IS ACCESSIBLE',
                this.LOGGER_LABEL,
            );

            const selector = '#product';
            await currentPage.waitForSelector(selector, { visible: true });

            const productInfoContainer = await currentPage.$(selector);
            const productIngredientsContainer = await currentPage.$(
                '#panel_ingredients_content',
            );

            // const ingredients = await currentPage.$eval(
            //     '#panel_ingredients_content > div:nth-child(1) > div > div',
            //     (panelText) => {
            //         const textNodes = Array.from(panelText.childNodes)
            //             .filter((node) => node.nodeType === Node.TEXT_NODE)
            //             .map((node) => node.textContent.trim())
            //             .filter((text) => text !== '');
            //
            //         return textNodes.join(' ');
            //     },
            // );
            //
            // console.log(ingredients, 'INGREDIENTS');
            const palmOilEl = await currentPage.$(
                '#panel_ingredients_analysis_en-palm-oil-free > li > a > h4',
            );

            const o = await palmOilEl.evaluate((e) => e.textContent.trim());
            console.log(o, 'lo');

            const veganStateEl = await currentPage.$(
                '#panel_ingredients_analysis_en-vegetarian-status-unknown > li > a > h4',
            );
            const veganState = await veganStateEl.evaluate((e) =>
                e.textContent.trim(),
            );
            console.log(veganState, 'lo');

            const veganEl = await currentPage.$(
                '#panel_ingredients_analysis_en-non-vegan > li > a > h4',
            );
            const vegan = await veganEl.evaluate((e) => e.textContent.trim());
            console.log(vegan, 'lo');

            await extractTitleAndQuantity(productInfoContainer);
            await extractIngredients(productIngredientsContainer);
        } catch (e) {
            console.log('ERROR WHILE SCRAPPING PRODUCT DETAIL', e);
        } finally {
        }
    }
}

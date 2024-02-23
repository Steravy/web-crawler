/* 
    Created by Stefan Vitoria on 2/23/24
*/

import { ProductListingDetails } from './types';
import {
    extractIdFromUrl,
    getNameFormHtmlElement,
    getNutritionAndNovaDetails,
} from './utils';
import { ElementHandle } from 'puppeteer';

export abstract class HtmlParser {
    static async execute(
        htmlElements: ElementHandle<Element>,
    ): Promise<ProductListingDetails[]> {
        const listItemsHtmlElements = await htmlElements.$$('li');
        const products: ProductListingDetails[] = [];

        for (let i = 0; i < listItemsHtmlElements.length; i++) {
            const listItemHtmlElement = listItemsHtmlElements[i];

            const id = await extractIdFromUrl(listItemHtmlElement);
            const name = await getNameFormHtmlElement(listItemHtmlElement);

            const { nova, nutrition } =
                await getNutritionAndNovaDetails(listItemHtmlElement);

            products.push({
                id,
                name,
                nutrition,
                nova,
            });
        }

        console.warn(listItemsHtmlElements.length, 'TOTAL');
        return products;
    }
}

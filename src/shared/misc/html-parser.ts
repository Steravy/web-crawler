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
import { Logger } from '@nestjs/common';

export abstract class HtmlParser {
    static LOGGER_LABEL: string;
    static async execute(
        htmlElements: ElementHandle<Element>,
    ): Promise<ProductListingDetails[]> {
        Logger.debug(
            'HTML PARSING PROCESS INITIALIZED',
            HtmlParser.LOGGER_LABEL,
        );
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
        Logger.debug('HTML PARSING PROCESS FINISHED', HtmlParser.LOGGER_LABEL);

        console.warn(listItemsHtmlElements.length, 'TOTAL');
        return products;
    }
}

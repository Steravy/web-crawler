/* 
    Created by Stefan Vitoria on 2/23/24
*/

import { ElementHandle } from 'puppeteer';
import { Extractor } from './extractor';
import { NutritionAndNovaDetails } from './types';

export const extractIdFromUrl = async (
    listItemHtmlElement: ElementHandle<HTMLElement>,
): Promise<string> => {
    const productLinkElement = await listItemHtmlElement.$('.list_product_a');
    const url = await productLinkElement.evaluate((el) =>
        el.getAttribute('href'),
    );
    return Extractor.productId(url);
};

export const getNameFormHtmlElement = async (
    listItemHtmlElement: ElementHandle<HTMLElement>,
): Promise<string> => {
    const productNameElement =
        await listItemHtmlElement.$('.list_product_name');
    return productNameElement
        ? await productNameElement.evaluate((el) => el.textContent.trim())
        : '';
};

export const getNutritionAndNovaDetails = async (
    listItemHtmlElement: ElementHandle<HTMLElement>,
): Promise<NutritionAndNovaDetails> => {
    const nutriAndNovaScoreElements = await listItemHtmlElement.$$(
        '.list_product_icons',
    );

    const nutriScore = await nutriAndNovaScoreElements[0].evaluate((el) =>
        el.getAttribute('title'),
    );
    console.log(nutriScore, 'NUTRI');

    const novaScore = await nutriAndNovaScoreElements[1].evaluate((el) =>
        el.getAttribute('title'),
    );
    console.log(novaScore, 'NOVA');

    const nutrition = Extractor.nutriScore(nutriScore);

    const nova = Extractor.novaScore(novaScore);

    return { nutrition, nova };
};

export const composeUrl = (nutrition?: string, nova?: string): string => {
    const baseUrl = 'https://br.openfoodfacts.org/products';
    const searchParams = new URLSearchParams({
        ...(nutrition && { nutrition }),
        ...(nova && { nova }),
    });
    if (!searchParams.has('nutrition') || !searchParams.has('nova'))
        return baseUrl;
    const composedUrl = `${baseUrl}?${searchParams}`;
    console.log(composedUrl);
    return composedUrl;
};

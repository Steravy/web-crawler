/* 
    Created by Stefan Vitoria on 2/23/24
*/

import { ElementHandle } from 'puppeteer';
import { Extractor } from './extractor';
import { NutritionAndNovaDetails, UrlComposeParams } from './types';

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
    // console.log(nutriScore, 'NUTRI');

    const novaScore = await nutriAndNovaScoreElements[1].evaluate((el) =>
        el.getAttribute('title'),
    );
    // console.log(novaScore, 'NOVA');

    const nutrition = Extractor.nutriScore(nutriScore);

    const nova = Extractor.novaScore(novaScore);

    return { nutrition, nova };
};

export const extractTitleAndQuantity = async (
    htmlElement: ElementHandle<Element>,
) => {
    const titleElement = await htmlElement.$(
        '#product > div > div > div.card-section > div > div.medium-8.small-12.columns > h2',
    );
    const title = await titleElement.evaluate((el) => el.textContent.trim());
    const quantityElement = await htmlElement.$('#field_quantity_value');
    const quantity = await quantityElement.evaluate((el) =>
        el.textContent.trim(),
    );

    console.log(title, quantity);
};

export const extractIngredients = async (
    htmlElement: ElementHandle<Element>,
) => {
    const ingredientsPanelElement = await htmlElement.$(
        '#panel_ingredients_content > div:nth-child(1) > div > div',
    );
    // const panel = await htmlElement.$('#panel_ingredients_content');
    // const hasPalmOil =

    // const list = await ingredientsPanelElement.evaluate((el) =>
    //     el.innerHTML.trim(),
    // );
    // console.log(list);
};

export const composeUrl = (params: UrlComposeParams): string => {
    const { productId, nutrition, nova } = params;
    const baseUrl = 'https://br.openfoodfacts.org';

    if (productId) {
        const url = `${baseUrl}/produto/${productId}`;
        console.log(url, 'PRODUCT URL');
        return url;
    }

    const searchParams = new URLSearchParams({
        ...(nutrition && { nutrition }),
        ...(nova && { nova }),
    });
    if (!searchParams.has('nutrition') || !searchParams.has('nova'))
        return `${baseUrl}/products`;
    const composedUrl = `${baseUrl}?${searchParams}`;
    console.log(composedUrl);
    return composedUrl;
};

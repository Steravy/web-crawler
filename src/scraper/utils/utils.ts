/* 
    Created by Stefan Vitoria on 2/23/24
*/

import { ElementHandle } from 'puppeteer';
import { Extractor } from './extractor';
import { NovaScores, NutritionAndNovaDetails, UrlComposeParams } from './types';
import { BadRequestException, Logger } from '@nestjs/common';

export const extractIdFromUrl = async (
    listItemHtmlElement: ElementHandle<HTMLElement>,
): Promise<string> => {
    Logger.log('EXTRATING ID FROM HTML ELEMENT');
    const productLinkElement = await listItemHtmlElement.$('.list_product_a');
    const url = await productLinkElement.evaluate((el) =>
        el.getAttribute('href'),
    );
    Logger.log('FINISHING EXTRACTION OF ID FROM HTML ELEMENT');
    return Extractor.productId(url);
};

export const getNameFormHtmlElement = async (
    listItemHtmlElement: ElementHandle<HTMLElement>,
): Promise<string> => {
    Logger.log('EXTRACTING NAME FROM HTML ELEMENT');
    const productNameElement =
        await listItemHtmlElement.$('.list_product_name');
    return productNameElement
        ? await productNameElement.evaluate((el) => el.textContent.trim())
        : '';
};

export const getNutritionAndNovaDetails = async (
    listItemHtmlElement: ElementHandle<HTMLElement>,
): Promise<NutritionAndNovaDetails> => {
    Logger.log('EXTRACTING NUTRITION AND NOVA FROM HTML ELEMENT');

    const nutriAndNovaScoreElements = await listItemHtmlElement.$$(
        '.list_product_icons',
    );

    const nutriScore = await nutriAndNovaScoreElements[0].evaluate((el) =>
        el.getAttribute('title'),
    );

    const novaScore = await nutriAndNovaScoreElements[1].evaluate((el) =>
        el.getAttribute('title'),
    );

    const nutrition = Extractor.nutriScore(nutriScore);

    const nova = Extractor.novaScore(novaScore);

    return { nutrition, nova };
};

const resolveRelativePath = (nova: NovaScores): string => {
    let relativePath: string;

    switch (nova) {
        case NovaScores.ONE:
            relativePath =
                '/nova-group/1-alimentos-nao-processados-ou-minimamente-processados';
            break;
        case NovaScores.TWO:
            relativePath = '/nova-group/2-Ingredientes-culinários-processados';
            break;
        case NovaScores.TREE:
            relativePath = '/nova-group/3-Alimentos-processados';
            break;
        case NovaScores.FOUR:
            relativePath = '/nova-group/4-Alimentos-ultra-processados';
            break;
        default:
            throw new BadRequestException(
            { providedNova: nova, expected: '1, 2, 3 or 4' },
            `The nova value: ${nova} provided is not valid, please verify and try again.`,
        );
    }

    return relativePath;
};

export const composeUrl = (params: UrlComposeParams): string => {
    Logger.log('COMPOSING URL');
    const { productId, nutrition, nova } = params;
    const baseUrl = 'https://br.openfoodfacts.org';
    let url: string;

    if (productId) {
        url = `${baseUrl}/produto/${productId}`;
        console.log(url, 'PRODUCT URL');
        return url;
    }

    const relativePath = resolveRelativePath(nova);
    url = `${baseUrl}${relativePath}?nutriscore_score=${nutrition}`;
    console.log(url, 'FILTERED PRODUCTS URL');
    return url;
};

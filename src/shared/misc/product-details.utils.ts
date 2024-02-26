/* 
    Created by Stefan Vitoria on 2/25/24
*/

import { Page } from 'puppeteer';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import {
    palmOilHtmlElementSelectors,
    palmOilPayload,
    PossiblePalmOilContext,
    veganPayload,
    vegetarianPayload,
} from './constants';
import {
    PalmOilDetails,
    PossibleVeganContext,
    PossibleVegetarianContext,
    TrySelectorsPayload,
} from './types';

export const extractTitleAndQuantity = async (
    currentPage: Page,
): Promise<{ title: string; quantity: number }> => {
    try {
        const title = await currentPage.$eval(
            '#product > div > div > div.card-section > div > div.medium-8.small-12.columns > h2',
            (el) => el.textContent.trim(),
        );
        const quantityAsString = await currentPage.$eval(
            '#field_quantity_value',
            (el) => el.textContent.trim(),
        );

        const quantity = parseInt(quantityAsString);

        return { title, quantity };
    } catch (error) {
        Logger.error(
            'ERROR SCRAPING PRODUCT QUANTITY AND TITLE DETAILS FROM WEBSITE!',
            error,
        );
    }
};

const isPalmOilFree = (context: string): boolean | string => {
    let result: boolean | string;

    switch (context) {
        case PossiblePalmOilContext.UNKNOWN:
            result = 'unknown';
            break;
        case PossiblePalmOilContext.WITHOUT:
            result = false;
            break;
        case PossiblePalmOilContext.MAY_CONTAIN:
            result = true;
            break;
    }

    return result;
};

const trySelectors = async (
    currentPage: Page,
    trySelectorsPayload: TrySelectorsPayload,
): Promise<string> => {
    const { selectors, errorMessage } = trySelectorsPayload;

    for (const selector of selectors) {
        try {
            return await currentPage.$eval(selector, (el) =>
                el.textContent.trim(),
            );
            // return isPalmOilFree(palmOilText);
        } catch (error) {
            Logger.error(`${errorMessage}: '${selector}'`, error);
            // Continue to the next selector if an error occurs
        }
    }

    throw new InternalServerErrorException(
        {
            selectors: palmOilHtmlElementSelectors,
        },
        'FAILED TO SCRAPE PALM OIL DETAILS WITH ALL SELECTORS!',
    );
};

export const resolvePalmOilFree = async (
    currentPage: Page,
): Promise<PalmOilDetails> => {
    try {
        const palmOilText = await trySelectors(currentPage, palmOilPayload);
        return isPalmOilFree(palmOilText);
    } catch (error) {
        Logger.error(
            'ERROR SCRAPING PRODUCT PALM OIL DETAILS FROM WEBSITE!',
            error,
        );
    }
};

// -----------------------------VEGAN------------------------------------------

const isVegan = (context: string) => {
    let result: boolean | string;

    switch (context) {
        case PossibleVeganContext.UNKNOWN:
            result = 'unknown';
            break;
        case PossibleVeganContext.NOT_VEGAN:
            result = false;
            break;
        case PossibleVeganContext.IS_VEGAN:
            result = true;
            break;
    }

    return result;
};

export const resolveIfIsVegan = async (
    currentPage: Page,
): Promise<boolean | string> => {
    try {
        const veganContext = await trySelectors(currentPage, veganPayload);
        return isVegan(veganContext);
    } catch (error) {
        Logger.error('ERROR SCRAPPING VEGAN DETAILS WITH SELECTORS!', error);

        return false;
    }
};

// ---------------------------------VEGETARIAN---------------------------------

const isVegetarian = (context: string) => {
    let result: boolean | string;

    switch (context) {
        case PossibleVegetarianContext.UNKNOWN:
            result = 'unknown';
            break;
        case PossibleVegetarianContext.IS_VEGETARIAN:
            result = true;
            break;
    }

    return result;
};

export const resolveIfIsVegetarian = async (currentPage: Page) => {
    try {
        const vegetarianContext = await trySelectors(
            currentPage,
            vegetarianPayload,
        );
        return isVegetarian(vegetarianContext);
    } catch (error) {
        Logger.error('ERROR SCRAPPING VEGAN DETAILS WITH SELECTORS!', error);

        return false;
    }
};

//----------------------------------INGREDIENTS---------------------------------

export const resolveIngredients = async (page: Page): Promise<string[]> => {
    try {
        const ingredientsHtmlElementsContent = await page.$eval(
            '#panel_ingredients_content > div:nth-child(1) > div > div',
            (element) => element.textContent,
        );

        if (ingredientsHtmlElementsContent !== null) {
            const ingredients: string[] = [];
            ingredients.push(
                ingredientsHtmlElementsContent
                    .replace('\n', '')
                    .trim()
                    .replace(': ', '')
                    .trim(),
            );

            return ingredients;
        }
    } catch (error) {
        Logger.error(
            'ERROR SCRAPPING INGREDIENTS DETAILS WITH SELECTORS!',
            error,
        );
    }
};

//-------------------------NOVA----------------------

export const resolveNovaScore = async (currentPage: Page) => {
    let novaScore = await currentPage.$eval(
        '#attributes_grid > li:nth-child(2) > a > div > div > div.attr_text > h4',
        (el) => el.textContent.trim(),
    );

    const novaTitle = await currentPage.$eval(
        '#attributes_grid > li:nth-child(2) > a > div > div > div.attr_text > span',
        (el) => el.textContent.trim(),
    );

    novaScore = novaScore.charAt(5);

    return { novaScore, novaTitle };
};

export const resolveNutritionScore = async (currentPage: Page) => {
    let nutritionScore = await currentPage.$eval(
        '#attributes_grid > li:nth-child(1) > a > div > div > div.attr_text > h4',
        (el) => el.textContent.trim(),
    );

    const nutritionTitle = await currentPage.$eval(
        '#attributes_grid > li:nth-child(1) > a > div > div > div.attr_text > span',
        (el) => el.textContent.trim(),
    );

    nutritionScore = nutritionScore.charAt(12);

    return { nutritionScore, nutritionTitle };
};

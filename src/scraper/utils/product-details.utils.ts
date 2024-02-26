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
): Promise<{ title: string; quantity: string }> => {
    try {
        const title = await currentPage.$eval(
            '#product > div > div > div.card-section > div > div.medium-8.small-12.columns > h2',
            (el) => el.textContent.trim(),
        );
        const quantity = await currentPage.$eval(
            '#field_quantity_value',
            (el) => el.textContent.trim(),
        );

        Logger.log('EXTRACTED TITLE AND QUANTITY FROM HTML ELEMENTS');

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
        } catch (error) {
            Logger.error(`${errorMessage}: '${selector}'`, error);
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
        Logger.log('EXTRACTED PALM OIL INFORMATION');
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
        Logger.log('EXTRACTED VEGAN RELATED INFORMATION');
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
        Logger.log('EXTRACTED VEGETARIAN RELATED INFORMATION');
        return isVegetarian(vegetarianContext);
    } catch (error) {
        Logger.error('ERROR SCRAPPING VEGAN DETAILS WITH SELECTORS!', error);

        return false;
    }
};

//----------------------------------INGREDIENTS---------------------------------

export const resolveIngredientsList = async (page: Page): Promise<string[]> => {
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

            Logger.log('EXTRACTED INGREDIENT LIST INFORMATION');

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
    const novaScore = await currentPage.$eval(
        '#attributes_grid > li:nth-child(2) > a > div > div > div.attr_text > h4',
        (el) => el.textContent.trim(),
    );

    const title = await currentPage.$eval(
        '#attributes_grid > li:nth-child(2) > a > div > div > div.attr_text > span',
        (el) => el.textContent.trim(),
    );

    const score = novaScore.charAt(5);

    Logger.log('EXTRACTED NOVA SCORE INFORMATION');

    return { score, title };
};

export const resolveNutritionScore = async (currentPage: Page) => {
    const nutritionScore = await currentPage.$eval(
        '#attributes_grid > li:nth-child(1) > a > div > div > div.attr_text > h4',
        (el) => el.textContent.trim(),
    );

    const score = nutritionScore.charAt(12);

    return { score };
};

//---------------------------SERVING SIZE --------------------------------------
export const resolveServingSize = async (currentPage: Page) => {
    try {
        const servingSize = await currentPage.$eval(
            '#panel_serving_size_content > div > div > div',
            (el) => el.textContent.trim(),
        );

        const parsedServingSize = servingSize
            .split(/\s+/)
            .filter((word) => word !== '')
            .join(' ')
            .split(':');

        Logger.log('EXTRACTED SERVING SIZE INFORMATION');

        return parsedServingSize[1].trim();
    } catch (error) {
        Logger.error(
            'ERROR SCRAPPING SERVING SIZE DETAILS. NO SELECTOR FOUND.',
            error,
        );
        return '?';
    }
};

//----------------------------NUTRITION'S DETAILS--------------------------------

const resolveLevel = (context: string) => {
    if (context.includes('baixa')) return 'low';
    else if (context.includes('moderada')) return 'moderate';
    else if (context.includes('elevada')) return 'high';
};

export const resolveNutritionDetails = async (currentPage: Page) => {
    try {
        const nutritionScore = await resolveNutritionScore(currentPage);

        const values = [];

        const fatAndLipids = await currentPage.$eval(
            '#panel_nutrient_level_fat > li > a > h4',
            (el) => el.textContent.trim(),
        );
        const fatAndLipidsAndAcids = await currentPage.$eval(
            '#panel_nutrient_level_saturated-fat > li > a > h4',
            (el) => el.textContent.trim(),
        );
        const sugar = await currentPage.$eval(
            '#panel_nutrient_level_sugars > li > a > h4',
            (el) => el.textContent.trim(),
        );
        const salt = await currentPage.$eval(
            '#panel_nutrient_level_salt > li > a > h4',
            (el) => el.textContent.trim(),
        );

        const nutritionContexts: string[] = [
            fatAndLipids,
            fatAndLipidsAndAcids,
            sugar,
            salt,
        ];

        for (const nutritionContext of nutritionContexts) {
            const level = resolveLevel(nutritionContext);

            values.push([level, nutritionContext]);
        }
        nutritionScore['values'] = values;

        Logger.log('EXTRACTED NUTRITION VALUES INFORMATION');

        return nutritionScore;
    } catch (e) {
        Logger.error('FAILED TO SCRAPE NUTRITION VALUES INFORMATIONS.');
    }
};

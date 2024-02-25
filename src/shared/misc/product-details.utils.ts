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
} from './constants';
import {
    PalmOilDetails,
    PossibleVeganContext,
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
    return context === PossibleVeganContext.IS_VEGAN;
};

export const resolveIfIsVegan = async (currentPage: Page): Promise<boolean> => {
    try {
        const veganContext = await trySelectors(currentPage, veganPayload);
        return isVegan(veganContext);
    } catch (error) {
        Logger.error('ERROR SCRAPPING VEGAN DETAILS WITH SELECTORS!', error);

        return false;
    }
};

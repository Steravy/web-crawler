/* 
    Created by Stefan Vitoria on 2/25/24
*/

import { Page } from 'puppeteer';
import { Logger } from '@nestjs/common';
import {
    palmOilHtmlElementSelectors,
    PossiblePalmOilContext,
} from './constants';
import { PalmOilDetails } from './types';

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

const trySelectors = async (currentPage: Page): Promise<PalmOilDetails> => {
    for (const selector of palmOilHtmlElementSelectors) {
        try {
            const palmOilText = await currentPage.$eval(selector, (el) =>
                el.textContent.trim(),
            );
            return isPalmOilFree(palmOilText);
        } catch (error) {
            Logger.error(
                `ERROR SCRAPPING PALM OIL DETAILS WITH SELECTOR: '${selector}'`,
                error,
            );
            // Continue to the next selector if an error occurs
        }
    }

    throw new Error('Failed to scrape information with all selectors.');
};

export const resolvePalmOilFree = async (
    currentPage: Page,
): Promise<PalmOilDetails> => {
    try {
        return await trySelectors(currentPage);
    } catch (error) {
        Logger.error(
            'ERROR SCRAPING PRODUCT PALM OIL DETAILS FROM WEBSITE!',
            error,
        );
    }
};

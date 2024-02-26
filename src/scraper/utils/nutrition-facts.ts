/* 
    Created by Stefan Vitoria on 2/26/24
*/

import { Page } from 'puppeteer';
import { Logger } from '@nestjs/common';
import { nutriFactsContexts } from './constants';

const isOneOfNutriFacts = (context: string) => {
    if (nutriFactsContexts.includes(context)) return context;

    return false;
};

const hydrateNutriFacts = (nutriFactValues: any) => {
    nutriFactsContexts.forEach((context) => {
        const nutriFactKeys = Object.keys(nutriFactValues);
        if (!nutriFactKeys.includes(context)) {
            nutriFactValues[context] = 'unknown';
        }
    });
};

export const extractNutritionData = async (currentPage: Page) => {
    const nutriFactValues = {};

    try {
        const nutriFactsTableBody = await currentPage.$(
            '#panel_nutrition_facts_table_content > div > table > tbody',
        );
        const nutriFactsTableRows = await nutriFactsTableBody.$$('tr');

        for (let i = 0; i < nutriFactsTableRows.length; i++) {
            const row = nutriFactsTableRows[i];
            const rowValues = await row.$$eval('td', (elments) =>
                elments.map((el) => el.textContent.trim()),
            );

            console.log(rowValues, 'ROW VALUES');

            const nutriFactLabel = isOneOfNutriFacts(rowValues[0]);
            console.log(nutriFactLabel, 'LABEL');
            if (nutriFactLabel) {
                nutriFactValues[nutriFactLabel] = {
                    per100g: rowValues[1],
                    perServing: rowValues[2],
                };
            }
        }

        hydrateNutriFacts(nutriFactValues);

        Logger.log('EXTRACTED NUTRITION FACTS INFORMATION');
        return nutriFactValues;
    } catch (error) {
        Logger.error(
            'ERROR SCRAPING PRODUCT NUTRITION FACTS. VALUES NOT PROVIDED!',
            error,
        );
        return 'unknown';
    }
};

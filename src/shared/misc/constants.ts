/* 
    Created by Stefan Vitoria on 2/25/24
*/

import { TrySelectorsPayload } from './types';

export enum PossiblePalmOilContext {
    UNKNOWN = 'Desconhece-se se contém óleo de palma',
    WITHOUT = 'Sem óleo de palma',
    MAY_CONTAIN = 'Pode conter óleo de palma',
}

export const palmOilHtmlElementSelectors = [
    '#panel_ingredients_analysis_en-palm-oil-free > li > a',
    '#panel_ingredients_analysis_en-palm-oil-content-unknown > li > a > h4',
];
export const veganHtmlElementSelectors = [
    '#panel_ingredients_analysis_en-vegan > li > a > h4',
    '#panel_ingredients_analysis_en-non-vegan > li > a',
];

export const veganPayload = {
    selectors: veganHtmlElementSelectors,
    errorMessage: 'ERROR SCRAPING PRODUCT VEGAN DETAILS WITH SELECTOR',
} as TrySelectorsPayload;

export const palmOilPayload = {
    selectors: palmOilHtmlElementSelectors,
    errorMessage: 'ERROR SCRAPPING PALM OIL DETAILS WITH SELECTOR',
} as TrySelectorsPayload;

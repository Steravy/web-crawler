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
    '#panel_ingredients_analysis_en-vegan-status-unknown > li > a',
];

export const veganPayload = {
    selectors: veganHtmlElementSelectors,
    errorMessage: 'ERROR SCRAPING PRODUCT VEGAN DETAILS WITH SELECTOR',
} as TrySelectorsPayload;

export const palmOilPayload = {
    selectors: palmOilHtmlElementSelectors,
    errorMessage: 'ERROR SCRAPPING PALM OIL DETAILS WITH SELECTOR',
} as TrySelectorsPayload;

export const vegetarianPayload = {
    selectors: [
        '#panel_ingredients_analysis_en-vegetarian > li > a',
        '#panel_ingredients_analysis_en-vegetarian-status-unknown > li > a',
    ],
    errorMessage: 'ERROR SCRAPPING VEGETARIAN DETAILS WITH SELECTOR',
};

export const nutriFactsContexts = [
    'Energia',
    'Gorduras/lípidos',
    'Carboidratos',
    'Fibra alimentar',
    'Proteínas',
    'Sal',
];
export const energyPayload = {
    selectors: [
        '#panel_nutrition_facts_table_content > div > table > tbody > tr:nth-child(1)',
    ],
    errorMessage: 'ERROR SCRAPPING ENERGY DETAILS WITH SELECTOR',
    label: 'Energy',
};

export const fatPayload = {
    selectors: [
        '#panel_nutrition_facts_table_content > div > table > tbody > tr:nth-child(2)',
    ],
    errorMessage: 'ERROR SCRAPING FAT DETAILS WITH SELECTOR',
    label: 'Gorduras/lípidos',
};

export const nutritionInfoExample = {
    score: 'D',
    values: [
        ['moderate', 'Gorduras/lípidos em quantidade moderada (11.9%)'],
        [
            'high',
            'Gorduras/lípidos/ácidos gordos saturados em quantidade elevada (8%)',
        ],
        ['low', 'Açúcares em quantidade baixa (0%)'],
    ],
    servingSize: '80 g',
    data: {
        Energia: {
            per100g: '814 kj(194 kcal)',
            perServing: '651 kj(155 kcal)',
        },
        'Gorduras/lípidos': {
            per100g: '11,9 g',
            perServing: '9,5 g',
        },
        Carboidratos: {
            per100g: '7,88 g',
            perServing: '6,3 g',
        },
        'Fibra alimentar': {
            per100g: '?',
            perServing: '?',
        },
        Proteínas: {
            per100g: '13,8 g',
            perServing: '11 g',
        },
        Sal: {
            per100g: '0,565 g',
            perServing: '0,452 g',
        },
    },
};

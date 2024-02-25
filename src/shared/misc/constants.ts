/* 
    Created by Stefan Vitoria on 2/25/24
*/

export enum PossiblePalmOilContext {
    UNKNOWN = 'Desconhece-se se contém óleo de palma',
    WITHOUT = 'Sem óleo de palma',
    MAY_CONTAIN = 'Pode conter óleo de palma',
}

export const palmOilHtmlElementSelectors = [
    '#panel_ingredients_analysis_en-palm-oil-free > li > a',
    '#panel_ingredients_analysis_en-palm-oil-content-unknown > li > a > h4',
] as const;

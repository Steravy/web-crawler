/* 
    Created by Stefan Vitoria on 2/23/24
*/

export type ProductListingDetails = {
    id: string;
    name: string;
    nutrition: Score;
    nova: Score;
};

type Score = {
    score: string;
    title: string;
};

export type NutritionAndNovaDetails = {
    nutrition: Score;
    nova: Score;
};

export type UrlComposeParams = {
    nutrition?: NutritionScores;
    nova?: NovaScores;
    productId?: string;
};

export enum NutritionScores {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
}

export enum NovaScores {
    ONE = 1,
    TWO,
    TREE,
    FOUR,
}

export type PalmOilDetails = string | boolean;

export interface TrySelectorsPayload {
    selectors: string[];
    errorMessage: string;
}

export enum PossibleVeganContext {
    IS_VEGAN = 'Vegano',
    NOT_VEGAN = 'Não vegano',
}

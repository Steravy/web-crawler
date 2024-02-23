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
    nutrition?: string;
    nova?: string;
    productId?: string;
};

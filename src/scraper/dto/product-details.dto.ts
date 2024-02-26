/* 
    Created by Stefan Vitoria on 2/25/24
*/
import { ApiProperty } from '@nestjs/swagger';
import { nutritionInfoExample } from '../utils/constants';

export class ProductDetailsDTO {
    @ApiProperty({
        description: 'The name/title of the product.',
        example:
            'Feijão Caldo Nobre - Feijão Tradicional - Comércio de Cereais Good Ltda - 1 kg',
    })
    title: string;

    @ApiProperty({
        description: 'Qauntity of product in the package.',
        example: '230 g',
    })
    quantity: string;

    @ApiProperty({
        description: 'The ingredients of the product.',
        example: {
            hasPalmOil: 'unknown',
            isVegan: false,
            isVegetarian: false,
            list: [
                'Água, preparado proteico (proteína texturizada de soja, proteína isolada de soja e proteína de ervilha), gordura de coco, óleo de canola, aroma natural, estabilizante metilcelulose, sal, beterraba em pó e corante carvão vegetal.',
            ],
        },
    })
    ingredients: {
        hasPalmOil: string;
        isVegan: boolean;
        isVegetarian: boolean;
        list: string[];
    };

    @ApiProperty({
        description: 'Nutrition facts of the product.',
        example: nutritionInfoExample,
    })
    nutrition: {
        score: string;
        values: [string, string][];
        servingSize: string;
        data: {
            Energia: {
                per100g: string;
                perServing: string;
            };
            'Gorduras/lípidos': {
                per100g: string;
                perServing: string;
            };
            Carboidratos: {
                per100g: string;
                perServing: string;
            };
            'Fibra alimentar': {
                per100g: string;
                perServing: string;
            };
            Proteínas: {
                per100g: string;
                perServing: string;
            };
            Sal: {
                per100g: string;
                perServing: string;
            };
        };
    };

    @ApiProperty({
        description: 'Nova scores of the product.',
        example: {
            score: 4,
            title: 'Alimentos ultra-processados',
        },
    })
    nova: {
        score: number;
        title: string;
    };
}

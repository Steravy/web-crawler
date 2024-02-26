/* 
    Created by Stefan Vitoria on 2/23/24
*/

import { ApiProperty } from '@nestjs/swagger';
import { NovaScores, NutritionScores } from '../utils/types';

export class NovaScoreDTO {
    @ApiProperty()
        score: NovaScores;

    @ApiProperty()
        title: string;
}

export class NutritionScoreDTO {
    @ApiProperty()
    score: NutritionScores;

    @ApiProperty()
    title: string;
}

export class ProductListingResponse {
    @ApiProperty({
        description: 'The id of the product.',
        example: '7898276600108',
    })
        id: string;

    @ApiProperty({
        description: 'The name of the product.',
        example:
            'Feijão Caldo Nobre - Feijão Tradicional - Comércio de Cereais Good Ltda - 1 kg',
    })
        name: string;

    @ApiProperty({
        description: 'Nutritional quality of the product.',
        example: {
            score: NutritionScores.A,
            title: 'Qualidade nutricional muito boa',
        },
    })
        nutrition: NutritionScoreDTO;

    @ApiProperty({
        description: 'Level of presentment in the product production.',
        example: {
            score: NovaScores.ONE,
            title: 'Alimentos não processados ou minimamente processados',
        },
    })
        nova: NovaScoreDTO;
}

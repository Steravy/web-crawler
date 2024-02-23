import { Injectable, Logger } from '@nestjs/common';
import { PageService } from '../../page/page.service';
import { ProductListingDetails } from '../../shared/misc/types';
import {
    composeUrl,
    extractIdFromUrl,
    getNameFormHtmlElement,
    getNutritionAndNovaDetails,
} from '../../shared/misc/utils';
import { ElementHandle } from 'puppeteer';

@Injectable()
export class ScraperService {
    private readonly LOGGER_LABEL = ScraperService.name;

    constructor(private readonly page: PageService) {}

    async run(nutrition?: string, nova?: string) {
        const url = composeUrl(nutrition, nova);
        try {
            Logger.debug('ACCESSING THE WEB PAGE', this.LOGGER_LABEL);
            const currentPage = await this.page.visit(url);
            Logger.debug(
                'WEBPAGE WHERE PRODUCT DETAILS WILL BE SCRAPED IS ACCESSIBLE',
                this.LOGGER_LABEL,
            );

            const selector = '#products_match_all';
            await currentPage.waitForSelector(selector, { visible: true });

            const elements = await currentPage.$(selector);

            Logger.debug('HTML ELEMENTS FOUND IN THE PAGE', this.LOGGER_LABEL);

            const products =
                await this.parseHtmlElementAndReturnValues(elements);

            console.log(products);
        } catch (error) {
            console.error('Error: ', error);
        } finally {
            // if (browser) await browser.close();
            await this.page.closeInstance();
        }
    }

    private async parseHtmlElementAndReturnValues(
        htmlElements: ElementHandle<Element>,
    ): Promise<ProductListingDetails[]> {
        const listItemsHtmlElements = await htmlElements.$$('li');
        const products: ProductListingDetails[] = [];

        for (let i = 0; i < listItemsHtmlElements.length; i++) {
            const listItemHtmlElement = listItemsHtmlElements[i];

            const id = await extractIdFromUrl(listItemHtmlElement);
            const name = await getNameFormHtmlElement(listItemHtmlElement);

            const { nova, nutrition } =
                await getNutritionAndNovaDetails(listItemHtmlElement);

            products.push({
                id,
                name,
                nutrition,
                nova,
            });
        }

        console.warn(listItemsHtmlElements.length, 'TOTAL');
        return products;
    }
}

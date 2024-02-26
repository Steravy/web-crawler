/* 
    Created by Stefan Vitoria on 2/23/24
*/

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { composeUrl } from '../../shared/misc/utils';
import puppeteer, { Page } from 'puppeteer';
import { ProductDetailsHtmlParser } from '../../shared/misc/product-details-html-parser';

@Injectable()
export class ScraperProductService {
    private readonly LOGGER_LABEL = ScraperProductService.name;

    async run(productId: string) {
        Logger.debug(this.LOGGER_LABEL, productId);
        const url = composeUrl({ productId });
        const browser = await puppeteer.launch();
        Logger.debug(this.LOGGER_LABEL, 'AFTER');
        try {
            const currentPage = await browser.newPage();
            currentPage.setDefaultNavigationTimeout(2 * 60 * 1000);
            await currentPage.goto(url);
            await this.assertProductExistence(currentPage, productId);

            Logger.debug(
                'WEBPAGE WHERE PRODUCT DETAILS WILL BE SCRAPED IS ACCESSIBLE',
                this.LOGGER_LABEL,
            );

            const productDetails =
                await ProductDetailsHtmlParser.execute(currentPage);
            console.log(productDetails, 'PRODUCT DETAILS');
            return productDetails;
        } catch (e) {
            if (e instanceof BadRequestException) throw e; // Rethrow BadRequestException as is
            console.log('ERROR WHILE SCRAPPING PRODUCT DETAIL', e);
        } finally {
            if (browser) await browser.close();
        }
    }

    private async assertProductExistence(currentPage: Page, productId: string) {
        const errorElement = await currentPage.$(
            '#main_column > div > div > h1',
        );
        if (errorElement)
            throw new BadRequestException(
                `Product with ID: ${productId} was not found!`,
            );
    }
}

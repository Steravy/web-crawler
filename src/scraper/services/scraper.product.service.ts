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
        const url = composeUrl({ productId });
        const browser = await puppeteer.launch();
        Logger.log('BROWSER LAUNCHED', this.LOGGER_LABEL);
        try {
            const currentPage = await browser.newPage();
            currentPage.setDefaultNavigationTimeout(2 * 60 * 1000);
            await currentPage.goto(url);
            Logger.log('WEB PAGE ACCESSED', this.LOGGER_LABEL);
            await this.assertProductExistence(currentPage, productId);

            Logger.log(
                'WEBPAGE WHERE PRODUCT DETAILS WILL BE SCRAPED IS ACCESSIBLE',
                this.LOGGER_LABEL,
            );

            const productDetails =
                await ProductDetailsHtmlParser.execute(currentPage);
            console.log(productDetails, 'PRODUCT DETAILS');
            Logger.log(
                'PRODUCT INFORMATION SUCCESSFULY SCRAPED AND PROCESSED',
                this.LOGGER_LABEL,
            );
            return productDetails;
        } catch (e) {
            if (e instanceof BadRequestException) throw e;
            Logger.error(
                'ERROR WHILE SCRAPPING PRODUCT DETAIL',
                this.LOGGER_LABEL,
            );
            console.log(e);
        } finally {
            if (browser) await browser.close();
        }
    }

    private async assertProductExistence(currentPage: Page, productId: string) {
        Logger.log('ASSERTING IF PRODUCT EXISTS', this.LOGGER_LABEL);
        const errorElement = await currentPage.$(
            '#main_column > div > div > h1',
        );
        if (errorElement)
            throw new BadRequestException(
                `Product with ID: ${productId} was not found!`,
            );

        Logger.log('PRODUCT EXISTS RESULT RESOLVED TO TRUE', this.LOGGER_LABEL);
    }
}

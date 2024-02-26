import { Injectable, Logger } from '@nestjs/common';
import { composeUrl } from '../../shared/misc/utils';
import { HtmlParser } from '../../shared/misc/html-parser';
import puppeteer from 'puppeteer';
import { NovaScores, NutritionScores } from '../../shared/misc/types';

@Injectable()
export class ScraperFilteredProductService {
    private readonly LOGGER_LABEL = ScraperFilteredProductService.name;

    async run(nutrition?: NutritionScores, nova?: NovaScores) {
        const url = composeUrl({ nutrition, nova });
        const browser = await puppeteer.launch();
        Logger.log('BROWSER LAUNCHED', this.LOGGER_LABEL);
        try {
            const currentPage = await browser.newPage();
            currentPage.setDefaultNavigationTimeout(2 * 60 * 1000);
            await currentPage.goto(url);
            Logger.log('WEB PAGE ACCESSED', this.LOGGER_LABEL);
            // const currentPage = await this.page.visit(url);
            Logger.log(
                'WEBPAGE WHERE PRODUCT DETAILS WILL BE SCRAPED IS ACCESSIBLE',
                this.LOGGER_LABEL,
            );

            const selector = '#products_match_all';
            await currentPage.waitForSelector(selector, { visible: true });

            const elements = await currentPage.$(selector);
            Logger.log(
                'SCRAPED PRODUCTS INFORMATIONS WITH GIVEN FILTERS',
                this.LOGGER_LABEL,
            );

            const products = await HtmlParser.execute(elements);

            console.log(products);
            return products;
        } catch (error) {
            console.error('Error: ', error);
        } finally {
            if (browser) await browser.close();
            // await this.page.closeInstance();
        }
    }
}

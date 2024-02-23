import { Injectable, Logger } from '@nestjs/common';
import { PageService } from '../../page/page.service';
import { composeUrl } from '../../shared/misc/utils';
import { HtmlParser } from '../../shared/misc/html-parser';

@Injectable()
export class ScraperService {
    private readonly LOGGER_LABEL = ScraperService.name;

    constructor(private readonly page: PageService) {}

    async fetchProductListings(nutrition?: string, nova?: string) {
        const url = composeUrl({ nutrition, nova });
        try {
            const currentPage = await this.page.visit(url);
            Logger.debug(
                'WEBPAGE WHERE PRODUCT DETAILS WILL BE SCRAPED IS ACCESSIBLE',
                this.LOGGER_LABEL,
            );

            const selector = '#products_match_all';
            await currentPage.waitForSelector(selector, { visible: true });

            const elements = await currentPage.$(selector);

            Logger.debug('HTML ELEMENTS FOUND IN THE PAGE', this.LOGGER_LABEL);

            const products = await HtmlParser.execute(elements);

            console.log(products);
        } catch (error) {
            console.error('Error: ', error);
        } finally {
            // if (browser) await browser.close();
            await this.page.closeInstance();
        }
    }
}

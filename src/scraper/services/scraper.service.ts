import { Injectable, Logger } from '@nestjs/common';
import { PageService } from '../../page/page.service';
import { Extractor } from '../../shared/misc/extractor';

@Injectable()
export class ScraperService {
    private readonly LOGGER_LABEL = ScraperService.name;

    constructor(private readonly page: PageService) {}

    async run() {
        try {
            Logger.debug('Trying to srcape.', this.LOGGER_LABEL);
            const currentPage = await this.page.visit(
                'https://br.openfoodfacts.org',
            );

            const selector = '#products_match_all';

            Logger.debug(`The selector is ${selector}`, this.LOGGER_LABEL);
            Logger.debug('Waiting for selector.', this.LOGGER_LABEL);
            await currentPage.waitForSelector(selector);

            Logger.debug('FOUND SELECTOR', this.LOGGER_LABEL);
            const elements = await currentPage.$(selector);

            const liHtmlElements = await elements.$$('li');
            const products = [];

            for (let i = 0; i < liHtmlElements.length; i++) {
                const li = liHtmlElements[i];

                const productNameElement = await li.$('.list_product_name');
                const productLink = await li.$('.list_product_a');
                const url = await productLink.evaluate((el) =>
                    el.getAttribute('href'),
                );
                // const id = this.extractProductIdFromUrl(url);
                const id = Extractor.productId(url);
                const productName = productNameElement
                    ? await productNameElement.evaluate((el) =>
                        el.textContent.trim(),
                      )
                    : '';

                const nutriScoreElements = await li.$$('.list_product_icons');

                const nutriScore = await nutriScoreElements[0].evaluate((el) =>
                    el.getAttribute('title'),
                );
                console.log(nutriScore, 'NUTRI');
                // const nutrition = this.extractNutriScoreInfo(nutriScore);
                const nutrition = Extractor.nutriScore(nutriScore);

                const novaScore = await nutriScoreElements[1].evaluate((el) =>
                    el.getAttribute('title'),
                );
                console.log(novaScore, 'NOVA');
                // const nova = this.extractNOVAScoreInfo(novaScore);
                const nova = Extractor.novaScore(novaScore);

                products.push({
                    id: id,
                    name: productName,
                    nutrition: {
                        score: nutrition.score,
                        title: nutrition.title,
                    },
                    nova: {
                        score: nova.score,
                        title: nova.title,
                    },
                });
            }
            // console.warn(products, 'ALL PRODUCTS');
            console.warn(liHtmlElements.length, 'TOTAL');

            console.log(products);
        } catch (error) {
            console.error('Error: ', error);
        } finally {
            // if (browser) await browser.close();
            await this.page.closeInstance();
        }
    }
}

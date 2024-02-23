import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class ScraperService {
    private readonly LOGGER_LABEL = ScraperService.name;
    async run() {
        const browser = await puppeteer.launch();

        try {
            Logger.debug('Trying to srcape.', this.LOGGER_LABEL);
            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(2 * 60 * 1000);

            await page.goto('https://br.openfoodfacts.org');
            // const html = await page.evaluate(
            //     () => document.documentElement.outerHTML,
            // );
            //
            // console.log(html);

            const selector = '#products_match_all';

            Logger.debug(`The selector is ${selector}`, this.LOGGER_LABEL);
            Logger.debug('Waiting for selector.', this.LOGGER_LABEL);
            await page.waitForSelector(selector);

            Logger.debug('FOUND SELECTOR', this.LOGGER_LABEL);
            const elements = await page.$(selector);

            const liElements = await elements.$$('li');
            const products = [];

            for (let i = 0; i < liElements.length; i++) {
                const li = liElements[i];

                const productNameElement = await li.$('.list_product_name');
                const productLink = await li.$('.list_product_a');
                const url = await productLink.evaluate((el) =>
                    el.getAttribute('href'),
                );
                const id = this.extractProductIdFromUrl(url);
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
                const nutrition = this.extractNutriScoreInfo(nutriScore);
                const novaScore = await nutriScoreElements[1].evaluate((el) =>
                    el.getAttribute('title'),
                );
                console.log(novaScore, 'NOVA');
                const nova = this.extractNOVAScoreInfo(novaScore);

                // for (let i = 0; i < nutriScoreElements.length; i++) {
                //     const nutriScoreElement = nutriScoreElements[i];
                //     const nutriScore = await nutriScoreElement.evaluate((el) =>
                //         el.getAttribute('title'),
                //     );
                // }

                // console.log(productName, 'PRODUCT NAME');

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
            console.warn(liElements.length, 'TOTAL');

            console.log(products);
        } catch (error) {
            console.error('Error: ', error);
        } finally {
            if (browser) await browser.close();
        }
    }

    private extractProductIdFromUrl(productUrl: string): string | null {
        // console.log(productUrl, 'PRODUCT URL');
        try {
            // Parse the URL
            const parsedUrl = new URL(productUrl);
            console.log(parsedUrl, 'PARSED URL');

            // Extract the product ID from the pathname
            const pathnameParts = parsedUrl.pathname.split('/');
            const productId = pathnameParts[2];

            return productId;
        } catch (error) {
            console.error('Error extracting product ID from URL:', error);
            return null;
        }
    }

    private extractNutriScoreInfo(inputString: string): {
        score: string | null;
        title: string | null;
    } {
        // Define a regular expression to match the Nutri-Score and the rest of the sentence
        const regex = /^Nutri-Score (\w) - (.+)$/;

        // Use the regular expression to match the input string
        const match = inputString.match(regex);

        if (match && match.length === 3) {
            const [, score, title] = match;
            return { score, title };
        } else {
            // Return null if no match is found
            return { score: '?', title: '?' };
        }
    }

    extractNOVAScoreInfo(inputString: string): {
        score: string;
        title: string;
    } {
        // Define a regular expression to match the NOVA Score and the rest of the sentence
        const regex = /^NOVA (\d) - (.+)$/;

        // Use the regular expression to match the input string
        const match = inputString.match(regex);

        if (match && match.length === 3) {
            const [, score, title] = match;
            return { score, title };
        } else {
            // Return null if no match is found
            return { score: '?', title: '?' };
        }
    }
}

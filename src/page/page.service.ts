import { Injectable } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';

@Injectable()
export class PageService {
    private readonly LOGGER_LABEL = PageService.name;
    private readonly browser: Promise<Browser>;

    constructor() {
        this.browser = puppeteer.launch();
    }

    async visit(url: string): Promise<Page> {
        const browser = await this.browser;
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2 * 60 * 1000);
        await page.waitForNavigation();
        await page.goto(url);
        return page;
    }

    async closeInstance() {
        const browser = await this.browser;
        await browser.close();
    }
}

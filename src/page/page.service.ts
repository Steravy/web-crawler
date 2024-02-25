import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';

@Injectable()
export class PageService {
    private readonly LOGGER_LABEL = PageService.name;
    private readonly browser: Promise<Browser>;

    constructor() {
        this.browser = puppeteer.launch();
    }

    async visit(url: string): Promise<Page> {
        Logger.debug('INITIALIZING HEADLESS BROWSER', this.LOGGER_LABEL);
        const browser = await this.browser;
        const page = await browser.newPage();
        Logger.debug('BROWSER INSTANCE LAUNCHED', this.LOGGER_LABEL);
        page.setDefaultNavigationTimeout(2 * 60 * 1000);
        // await page.waitForNavigation();
        Logger.debug('ACCESSING THE WEB PAGE', this.LOGGER_LABEL);
        await page.goto(url);
        return page;
    }

    async closeInstance() {
        Logger.debug('CLOSING BROWSER INSTANCE', this.LOGGER_LABEL);
        const browser = await this.browser;
        await browser.close();
        Logger.debug('BROWSER INSTANCE CLOSED', this.LOGGER_LABEL);
    }
}

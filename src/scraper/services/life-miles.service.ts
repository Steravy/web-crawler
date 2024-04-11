/* 
    Created by Stefan Vitoria on 2/23/24
*/

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import puppeteer, { Page } from 'puppeteer';
import { FingerprintInjector, newInjectedPage } from 'fingerprint-injector';
import { FingerprintGenerator } from 'fingerprint-generator';
import { response } from 'express';

@Injectable()
export class LifeMilesService {
    private readonly LOGGER_LABEL = LifeMilesService.name;

    async run() {
        const url =
            'https://oauth.lifemiles.com/login?login_challenge=1c655e2ccf8b4790a3c286abf7dee436';
        Logger.log('BROWSER LAUNCHED', this.LOGGER_LABEL);
        try {
            const browser = await puppeteer.launch({ headless: false });

            const currentPage = await newInjectedPage(
                browser,
                {
                    // constraints for the generated fingerprint
                    fingerprintOptions: {
                        devices: ['mobile'],
                        operatingSystems: ['ios'],
                    },
                },
            );

            currentPage.setDefaultNavigationTimeout(2 * 60 * 1000);

            // await currentPage.setRequestInterception(true);


            // NAVIGATE TO LOGINPAGE
            await this.navigateToLoginPage(currentPage);

            // await currentPage.goto(url);
            Logger.log('SMILES LOGIN WEB PAGE ACCESSED', this.LOGGER_LABEL);

            await currentPage.waitForSelector('#username', { visible: true });
            await currentPage.type('#username', '00024567815', { delay: 100 });
            await currentPage.waitForSelector('#password', { visible: true });
            await currentPage.type('#password', 'PassWord@24', { delay: 100 });

            await Promise.all([
                currentPage.waitForNavigation({ waitUntil: 'load' }) as any,
                currentPage.click('#Login-confirm'),
            ]);


            // currentPage.on('request', (request) => {
            //     if (
            //         request.url() ===
            //         'https://oauth.lifemiles.com/authentication/token/grant'
            //     ) {
            //         console.log(request.url(), 'REQUEST URL');
            //     } else request.continue();
            // });

           await currentPage.on('response', async (data) => {
                if (
                    data.url() ===
                    'https://oauth.lifemiles.com/authentication/token/grant'
                    && data.request().method() === 'POST'
                ) {
                    console.log(data.url(), 'RESPONSE URL');
                    console.log(await data.json());
                }
            });

        } catch (e) {
            if (e instanceof BadRequestException) throw e;
            Logger.error(
                'ERROR WHILE LOGGING',
                this.LOGGER_LABEL,
            );
            console.log(e);
        }
        // finally {
        //     if (browser) await browser.close();
        // }
    }

    private async navigateToLoginPage(currentPage: Page) {
        await currentPage.goto(
            'https://sso.lifemiles.com/auth/realms/lifemiles/protocol/openid-connect/auth?client_id=lifemiles&response_type=code&scope=openid&login_hint=wst&ui_locales=en&redirect_uri=https://www.lifemiles.com/oauth-signin/&state=1712775357890&micrositeParams=%7B%27Access-Level%27%3A%20%270%27%2C%20%27Redirect-Uri%27%3A%20%27%27%7D',
        );

        // await Promise.all([
        //     currentPage.waitForNavigation({ waitUntil: 'load' }),
        //     currentPage.click(
        //         '#FixedMenuHeader > div.menu-ui-Menu_headerRightWrapper > div > div > a',
        //     ),
        // ]);

        await currentPage.waitForSelector('#social-Lifemiles', { visible: true });

        await Promise.all([
            currentPage.waitForNavigation({ waitUntil: 'load' }) as any,
            currentPage.click('#social-Lifemiles'),
        ]);
    }


}

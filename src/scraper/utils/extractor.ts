/* 
    Created by Stefan Vitoria on 2/23/24
*/

export abstract class Extractor {
    static productId(productUrl: string): string | null {
        // console.log(productUrl, 'PRODUCT URL');
        try {
            // Parse the URL
            const parsedUrl = new URL(productUrl);

            // Extract the product ID from the pathname
            const pathnameParts = parsedUrl.pathname.split('/');
            return pathnameParts[2];
        } catch (error) {
            console.error('Error extracting product ID from URL:', error);
            return null;
        }
    }

    static nutriScore(inputString: string): {
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

    static novaScore(inputString: string): {
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

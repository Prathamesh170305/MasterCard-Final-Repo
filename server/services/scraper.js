import puppeteer from "puppeteer";

export const scrapeLinkedIn = async (linkedinId) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(`https://www.linkedin.com/in/${linkedinId}`);
        const profileData = await page.evaluate(() => {
            // Extract profile data (example: name, headline, etc.)
            return {
                name: document.querySelector(".text-heading-xlarge")?.innerText || "",
                headline: document.querySelector(".text-body-medium")?.innerText || "",
            };
        });

        await browser.close();
        return profileData;
    } catch (error) {
        await browser.close();
        throw new Error("Failed to scrape LinkedIn profile");
    }
};

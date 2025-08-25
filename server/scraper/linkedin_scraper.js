import { MongoClient } from "mongodb";
import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

const MONGO_URI = "mongodb://localhost:27017/";
const DB_NAME = "mastercard_db";
const COLLECTION_NAME = "users";

class LinkedInScraper {
    constructor(linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
        this.mongoClient = new MongoClient(MONGO_URI);
        this.db = this.mongoClient.db(DB_NAME);
        this.collection = this.db.collection(COLLECTION_NAME);
        this.driver = new Builder()
            .forBrowser("chrome")
            .setChromeOptions(new chrome.Options().headless())
            .build();
    }

    async scrapeProfile() {
        try {
            await this.driver.get(this.linkedinUrl);
            await this.driver.wait(until.elementLocated(By.tagName("body")), 10000);

            const education = await this._scrapeSection("Education");
            const certifications = await this._scrapeSection("Licenses & Certifications");
            const experience = await this._scrapeSection("Experience");

            return { education, certifications, experience };
        } catch (error) {
            console.error("Error scraping profile:", error);
            return {};
        } finally {
            await this.driver.quit();
        }
    }

    async _scrapeSection(sectionName) {
        try {
            const section = await this.driver.findElement(By.xpath(`//section[.//h2[text()='${sectionName}']]`));
            const items = await section.findElements(By.xpath(".//li"));
            const data = [];

            for (const item of items) {
                data.push(await item.getText());
            }

            return data;
        } catch (error) {
            console.error(`Error scraping section ${sectionName}:`, error);
            return [];
        }
    }

    async saveToMongo(userId, data) {
        try {
            await this.mongoClient.connect();
            await this.collection.updateOne(
                { _id: userId },
                { $set: data },
                { upsert: true }
            );
            console.log("Data saved to MongoDB successfully.");
        } catch (error) {
            console.error("Error saving to MongoDB:", error);
        } finally {
            await this.mongoClient.close();
        }
    }
}

export default LinkedInScraper;

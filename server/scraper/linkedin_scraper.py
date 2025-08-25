from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from pymongo import MongoClient
import time

# MongoDB Configuration
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "mastercard_db"
COLLECTION_NAME = "users"

# LinkedIn Scraper Class
class LinkedInScraper:
    def __init__(self, linkedin_url, mongo_uri=MONGO_URI):
        self.linkedin_url = linkedin_url
        self.mongo_client = MongoClient(mongo_uri)
        self.db = self.mongo_client[DB_NAME]
        self.collection = self.db[COLLECTION_NAME]

        # Selenium WebDriver Setup
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in headless mode
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        self.driver = webdriver.Chrome(service=Service(), options=chrome_options)

    def scrape_profile(self):
        try:
            self.driver.get(self.linkedin_url)
            WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))

            # Scrape Education
            education = self._scrape_section("Education")

            # Scrape Certifications
            certifications = self._scrape_section("Licenses & Certifications")

            # Scrape Experience
            experience = self._scrape_section("Experience")

            return {
                "education": education,
                "certifications": certifications,
                "experience": experience
            }
        except TimeoutException:
            print("Error: Timeout while loading the LinkedIn profile.")
            return {}
        finally:
            self.driver.quit()

    def _scrape_section(self, section_name):
        try:
            section = self.driver.find_element(By.XPATH, f"//section[.//h2[text()='{section_name}']]")
            items = section.find_elements(By.XPATH, ".//li")
            return [item.text for item in items]
        except Exception as e:
            print(f"Error scraping section {section_name}: {e}")
            return []

    def save_to_mongo(self, user_id, data):
        try:
            self.collection.update_one(
                {"_id": user_id},
                {"$set": {
                    "education": data.get("education", []),
                    "certifications": data.get("certifications", []),
                    "experience": data.get("experience", [])
                }},
                upsert=True
            )
            print("Data successfully saved to MongoDB.")
        except Exception as e:
            print(f"Error saving to MongoDB: {e}")

if __name__ == "__main__":
    # Example Usage
    linkedin_url = "https://www.linkedin.com/in/example-profile/"
    user_id = "example_user_id"  # Replace with the actual user ID from MongoDB

    scraper = LinkedInScraper(linkedin_url)
    scraped_data = scraper.scrape_profile()
    scraper.save_to_mongo(user_id, scraped_data)

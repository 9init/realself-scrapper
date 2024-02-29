const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const fsAsync = require('fs')
const path = require('path');
const yaml = require('js-yaml');

// Load configuration from YAML file
const configPath = path.join(__dirname, 'config.yml');
const config = yaml.load(fsAsync.readFileSync(configPath, 'utf8'));

// Extract parameters from config
const baseUrl = config.baseUrl;
const scrapeUrl = config.scrapeUrl;
const section = config.section;
const startPage = config.startPage;
const endPage = config.endPage;
const bypassCache = config.bypassCache;
const userAgent = config.userAgent;

// Set the user agent in the headers
const headers = {
  'User-Agent': userAgent,
};

// Function to create a directory if it doesn't exist
async function ensureDirectoryExistence(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

// Function to download an image
async function downloadImage(content) {
  // Remove the first two slashes
  const contentWithoutFirstTwoSlashes = content.slice(2);

  // Extract file name from content
  const fileName = path.basename(contentWithoutFirstTwoSlashes);

  // Create directory if it doesn't exist
  const directoryPath = path.join(__dirname, 'downloads', section);
  await ensureDirectoryExistence(directoryPath);

  // Download the image
  const imagePath = path.join(directoryPath, fileName);

  const imageStream = fsAsync.createWriteStream(imagePath, { flags: 'w' });

  try {
    const response = await axios.get(`https://${contentWithoutFirstTwoSlashes}`, { responseType: 'stream' });
    response.data.pipe(imageStream);

    // Wait for the stream to finish writing before logging
    await new Promise((resolve) => imageStream.on('finish', resolve));

    console.log(`Image downloaded: ${imagePath}`);
  } catch (error) {
    console.error(`Error downloading image: ${error.message}`);
  }
}

// Function to scrape a specific page and section
async function scrapePage(topicId, pageNumber) {
  const url = `${scrapeUrl}?bypass_cache=${bypassCache}&page=${pageNumber}&topic_id=${topicId}`
  try {
    // Make a GET request to the page
    const response = await axios.get(url, { headers });

    // Load the HTML content into Cheerio
    const $ = cheerio.load(response.data.html);

    // Find all div elements with the class 'fixed-img2'
    const fixedImg2Elements = $('.fixed-img2');

    // Extract and download each image with its own name in a folder
    const promises = fixedImg2Elements.map(async (index, element) => {
      const rsImage = $(element).find('rs-image');
      const content = rsImage.attr('content');
      await downloadImage(content);
    }).get();

    // Wait for all image download promises to resolve
    await Promise.all(promises);
  } catch (error) {
    console.error(`Error during scraping page ${pageNumber}:`, error.message);
  }
}

async function getTopicId(){
  const url = `${baseUrl}${section}`;

  try {
    // Make a GET request to the page
    const response = await axios.get(url, { headers });

    // Load the HTML content into Cheerio
    const $ = cheerio.load(response.data);
    
    // Find the meta tag with property 'rs:topic-id'
    const metaTag = $('meta[property="rs:topic-id"]');

    // Extract topic_id from the content attribute
    const topicId = metaTag.attr('content');

    // Check if the topic_id is found
    if (!topicId) {
      console.error('Topic ID not found');
      process.exit(1);
    }
    return topicId;
  } catch (error) {
    console.error(`Error during scraping:`, error.message);
  }
}

  // Function to iterate through the specified range of pages
  async function scrapePages() {
    console.log('Scraping started');
    const topicId = await getTopicId();
    for (let page = startPage; page <= endPage; page++) {
      await scrapePage(topicId, page);
    }
    console.log('Scraping complete');
  }

  // Start scraping the pages
  scrapePages();

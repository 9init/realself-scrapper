# RealSelf Scrapper

RealSelf Scrapper is a Node.js script for scraping and downloading images from RealSelf, focusing on the "porcelain-veneers" section.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

## Overview

RealSelf Scrapper is a tool designed to automate the process of scraping images from the RealSelf website. It targets the "porcelain-veneers" section and provides options for configuring the scraping behavior, including the ability to override existing files.

## Features

- Scrapes images from the "porcelain-veneers" section on RealSelf.
- Supports configuration via a YAML file.
- Option to override existing files based on a configuration flag.
- Written in Node.js for flexibility and ease of use.

## Getting Started

### Prerequisites

Before using RealSelf Scrapper, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/9init/realself-scrapper.git
```
2. Navigate to the project directory:
```bash
cd realself-scrapper
```
3. Install dependencies:
```
npm install
```

### Configuration
Configure the scraping behavior by editing the config.yml file:

```yaml
baseUrl: 'https://www.realself.com/photos/'
section: 'porcelain-veneers'
startPage: 1
endPage: 3
userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
overrideFiles: true # Set this to false if you don't want to override existing files
```

### Usage
Run the script with the following command:
```bash
npm start
```

This will start the scraping process based on the provided configuration.

You should see `Scraping started` in the console to make sure that is everything is going well.



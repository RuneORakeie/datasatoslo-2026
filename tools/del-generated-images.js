const { glob } = require('glob');
const fs = require('fs');
const path = require('path');
const { Logger, LogLevel } = require('plop-logger');
const { colorEmojiConfig } = require('plop-logger/lib/extra/colorEmojiConfig');

Logger.config = colorEmojiConfig;
const logger = Logger.getLogger('image-cleanup');
logger.level = LogLevel.All;

const patterns = [
    'static/images/info/**/*-mini.{jpg,jpeg,png,webp}',
    'static/images/info/**/*-{540,720,960,1140}.webp',
    'static/images/info/**/*.webp',
    'static/images/news/**/*-mini.{jpg,jpeg,png,webp}',
    'static/images/news/**/*-{540,720,960,1140}.webp',
    'static/images/news/**/*.webp'
];

async function deleteGeneratedFiles() {
    logger.info('Starting cleanup of generated images...');

    try {
        for (const pattern of patterns) {
            logger.info(`Looking for files matching pattern: ${pattern}`);
            const files = await glob(pattern);

            if (files.length === 0) {
                logger.info(`No files matched for pattern: ${pattern}`);
            }

            files.forEach(file => {
                logger.info(`Found: ${file}`);
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                    logger.info(`Deleted: ${file}`);
                }
            });
        }

        logger.info('Cleanup complete. All generated files deleted.');
    } catch (error) {
        logger.error('Error during cleanup:', error);
        process.exit(1);
    }
}

deleteGeneratedFiles();
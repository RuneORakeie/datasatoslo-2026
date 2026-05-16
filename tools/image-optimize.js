const sharp = require('sharp');
const { glob } = require('glob');
const path = require('path');
const fs = require('fs');
const { Logger, LogLevel } = require('plop-logger');
const { colorEmojiConfig } = require('plop-logger/lib/extra/colorEmojiConfig');

Logger.config = colorEmojiConfig;
const logger = Logger.getLogger('image-optimizer');
logger.level = LogLevel.All;

const resolutions = [540, 720, 960, 1140]; // Desired widths

function cleanupGeneratedImages(filepath) {
    const ext = path.extname(filepath);
    const basename = path.basename(filepath, ext);
    const dirname = path.dirname(filepath);

    // List of patterns to clean up
    const patterns = [
        `${basename}-mini${ext}`,
        `${basename}.webp`,
        `${basename}-mini.webp`,
        ...resolutions.map(res => `${basename}-${res}.webp`)
    ];

    patterns.forEach(pattern => {
        const filePath = path.join(dirname, pattern);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            logger.info(`Cleaned up: ${filePath}`);
        }
    });
}

async function processImage(filepath) {
    try {
        const ext = path.extname(filepath);
        const basename = path.basename(filepath, ext);
        const dirname = path.dirname(filepath);

        // Skip processing if the file is already a generated file
        if (basename.includes('-mini') || resolutions.some((res) => basename.endsWith(`-${res}`))) {
            logger.info(`Skipped: ${filepath} (already a generated file)`);
            return;
        }        
        // Paths for generated files
        const miniPath = path.join(dirname, `${basename}-mini${ext}`);
        const webpPath = path.join(dirname, `${basename}.webp`);
        const miniWebpPath = path.join(dirname, `${basename}-mini.webp`);

        // Specific resolution paths
        const resolutionPaths = resolutions.map(
            (width) => path.join(dirname, `${basename}-${width}.webp`)
        );

        // Skip mini version in original format if it exists
        if (!fs.existsSync(miniPath)) {
            await sharp(filepath)
                .resize(800, 600, {
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .toFile(miniPath);
            logger.info(`Created mini version: ${miniPath}`);
        } else {
            logger.info(`Skipped: ${miniPath} (already exists)`);
        }

        // Skip WebP version of original if it exists
        if (!fs.existsSync(webpPath)) {
            await sharp(filepath)
                .webp({ quality: 80 })
                .toFile(webpPath);
            logger.info(`Created WebP version: ${webpPath}`);
        } else {
            logger.info(`Skipped: ${webpPath} (already exists)`);
        }

        // Skip WebP version of mini if it exists
        if (!fs.existsSync(miniWebpPath)) {
            await sharp(filepath)
                .resize(800, 600, {
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .webp({ quality: 80 })
                .toFile(miniWebpPath);
            logger.info(`Created mini WebP version: ${miniWebpPath}`);
        } else {
            logger.info(`Skipped: ${miniWebpPath} (already exists)`);
        }

        // Skip specific resolutions if they exist
        for (const [index, resolutionPath] of resolutionPaths.entries()) {
            const width = resolutions[index];
            if (!fs.existsSync(resolutionPath)) {
                await sharp(filepath)
                    .resize(width, null, {
                        fit: 'inside',
                        withoutEnlargement: true,
                    })
                    .webp({ quality: 80 })
                    .toFile(resolutionPath);
                logger.info(`Created resized WebP (${width}px): ${resolutionPath}`);
            } else {
                logger.info(`Skipped: ${resolutionPath} (already exists)`);
            }
        }
    } catch (error) {
        logger.error(`Error processing ${filepath}:`, error);
    }
}


async function main() {
    const imagePattern = '{static/images/info,static/images/news}/**/*.{jpg,jpeg,png}';
    logger.info('Processing images:', imagePattern);

    try {
        const files = await glob(imagePattern);
        logger.info(`Found ${files.length} images to process`);

        await Promise.all(files.map(processImage));

        logger.info('Image processing complete');
    } catch (error) {
        logger.error('Error during image processing:', error);
        process.exit(1);
    }
}

main();
export default {
    plugins: {
        'postcss-preset-env': {
            stage: 3
        },
        'cssnano': {
            preset: ['default', {
                normalizeCharset: true
            }]
        }
    }
};
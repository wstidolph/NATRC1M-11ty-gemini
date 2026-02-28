module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets");

    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    eleventyConfig.addFilter("dateFilter", function (date) {
        if (!date) return "";
        // Compensate for timezone offset issues by using UTC methods if date is a Date object
        if (date instanceof Date) {
            return date.toLocaleDateString('en-US', {
                timeZone: 'UTC',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    });

    return {
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes"
        }
    };
};

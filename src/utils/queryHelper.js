const Product = require("../models/product.model");

const buildProductFilter = async (query = {}) => {
    const {
        name,
        brand,
        category,
        priceMin,
        priceMax,
        isFeatured,
        stockAmount,
        color,
        size,
    } = query;

    // 👇 This object holds all filter conditions
    const filter = {};

    if (category) filter.category = category.toLowerCase();
    if (color) filter.colors = color.toLowerCase();
    if (size) filter.sizes = size.toUpperCase();
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";
    if (stockAmount) filter.stockAmount = { $gte: Number(stockAmount) };

    if (priceMin || priceMax) {
        filter.price = {};
        if (priceMin) filter.price.$gte = Number(priceMin);
        if (priceMax) filter.price.lte = Number(priceMax);
    }

    // 👉 If name or brand is given → use fuzzy search with aggregation
    if (name || brand) {
        const searchStage = {
            $search: {
                index: "default",
                compound: {
                    should: [
                        name && {
                            text: {
                                path: "name",
                                query: name,
                                fuzzy: { maxEdits: 2, prefixLength: 1 }
                            }
                        },
                        brand && {
                            text: {
                                path: "brand",
                                query: brand,
                                fuzzy: { maxEdits: 2, prefixLength: 1 }
                            }
                        }
                    ].filter(Boolean),
                    minimumShouldMatch: 1
                }
            }
        };

        const pipeline = [
            searchStage,
            { $sort: { score: -1 } },
        ];

        if (Object.keys(filter).length) {
            pipeline.push({ $match: filter });
        }

        return await Product.aggregate(pipeline);
    }

    return await Product.find(filter);
};

module.exports = buildProductFilter;

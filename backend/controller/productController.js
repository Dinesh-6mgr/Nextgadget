import Product from "../models/Product.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const pageSize = Number(req.query.pageSize) || 8;
        const page = Number(req.query.page) || 1;

        const keyword = req.query.keyword
            ? { name: { $regex: req.query.keyword, $options: "i" } }
            : {};

        const categoryParam = req.query.category ? req.query.category.trim() : "";
        const category = categoryParam
            ? { category: { $regex: categoryParam.replace(/s$/i, ''), $options: "i" } }
            : {};

        const featured = req.query.featured === 'true' ? { featured: true } : {};

        // sort
        let sortOption = {};
        switch (req.query.sort) {
            case 'rating':     sortOption = { rating: -1 };    break;
            case 'newest':     sortOption = { createdAt: -1 }; break;
            case 'price_asc':  sortOption = { price: 1 };      break;
            case 'price_desc': sortOption = { price: -1 };     break;
            default:           sortOption = { createdAt: -1 };
        }

        const filter = { ...keyword, ...category, ...featured };
        const count = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort(sortOption)
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const { name, description, category, brand, price, countInStock, images, featured } = req.body;

        // Basic validation
        if (!name || !description || !category || !price || countInStock === undefined) {
            return res.status(400).json({ message: "Please provide all required fields: name, description, category, price, countInStock" });
        }

        if (price < 0 || countInStock < 0) {
            return res.status(400).json({ message: "Price and countInStock cannot be negative" });
        }

        const product = new Product({
            name,
            description,
            category,
            brand,
            price,
            countInStock,
            images: images || [],
            featured: featured || false,
            user: req.user._id,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ message: "Product already reviewed" });
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ message: "Review added" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const { name, description, category, brand, price, countInStock, images, featured } = req.body;

        // Validation for numeric fields
        if (price !== undefined && price < 0) {
            return res.status(400).json({ message: "Price cannot be negative" });
        }
        if (countInStock !== undefined && countInStock < 0) {
            return res.status(400).json({ message: "Count in stock cannot be negative" });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.price = price !== undefined ? price : product.price;
        product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
        product.images = images || product.images;
        product.featured = featured !== undefined ? featured : product.featured;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
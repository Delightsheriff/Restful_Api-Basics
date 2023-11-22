const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDB = require("./db");
const Product = require("./model/productModel");
connectDB();
app.use(express.json());

const PORT = process.env.PORT || 5000;
//APIS
app.get("/api/", (req, res) => {
  res.status(200).json({ message: "Wecome to our Server" });
});

//TO GET ALL PRODUCTS
app.get("/api/products", async (req, res) => {
  try {
    const allProducts = await Product.find();

    return res
      .status(200)
      .json({ message: "sucessful", count: allProducts.length, allProducts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//TO GET ONE PRODUCT
app.get("/api/product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product)
      return res.status(404).json({ msg: "This product does not exist." });

    return res.status(200).json({ message: "sucess", product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

///ADDING A PRODUCT
app.post("/api/product", async (req, res) => {
  try {
    const { title, price, description, category, image } = req.body;
    const newProduct = new Product({
      title,
      price,
      description,
      category,
      image,
    });

    await newProduct.save();
    return res.status(200).json({ message: "Product added", newProduct });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//UPDATING A PRODUCT
app.put("/api/product/:id", async (req, res) => {
  try {
    const { title, price, description, category, image } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        price,
        description,
        category,
        image,
      },
      { new: true }
    );

    if (!product)
      return res.status(404).json({ msg: "This product does not exist." });

    return res.status(200).json(product);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

//DELETING A Product
app.delete("/api/product/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res.status(404).json({ msg: "This product does not exist." });

    return res.status(200).json({ msg: "Delete Success!" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

//server listening
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

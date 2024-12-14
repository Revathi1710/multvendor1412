const express = require("express");
//const mysql = require('mysql2/promise');
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Category = require('./models/Category'); // Adjust the path based on your project structure
const User = require('./models/UserInfo'); // Adjust the path based on your project structure
const Vendor = require('./models/Vendor');
const Enquiry = require('./models/Enquiry');
const Product = require('./models/Product');
const Plan = require('./models/PlanList');
const PlanselectVendor=require('./models/PlanselectVendor');
const BusinessTypeVendor=require('./models/BusinessType');
const Service=require('./models/Service');
const MainCategory=require('./models/MainCategory');
const MainService=require('./models/MainService');
const Slider=require('./models/Slider');
const Banner=require('./models/Banner');
const Business=require('./models/BusinessProfile');
const SubCategory=require('./models/SubCategory');
const fs = require('fs');
const csv = require('csv-parser');
const crypto = require('crypto');
const WebsiteSetup = require('./models/Website');
const LeadForm = require('./models/LeadForm');
const JWT_SECRET = process.env.JWT_SECRET || "fjuyrhuhuehdkjidhjdjhdjh8r4"; // Use environment variables

// Initialize app
const app = express();
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000', // Ensure this matches your client-side URL
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));



//const User = require("./userDetails");

// MongoDB connection
const mongourl = process.env.MONGO_URL || "mongodb+srv://revathid:multivendor@cluster0.vfhbzr2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => { console.log("Connected to database"); })
    .catch(e => console.log(e));
    /*async function connectMySQL() {
      try {
        const mysqlConnection = await mysql.createConnection({
          host: "localhost", // Update if using a different host
          user: "root",      // Your MySQL username
          password: "",      // Your MySQL password
          database: "demo",  // Your database name
        });
        console.log('Connected to MySQL');
        return mysqlConnection;
      } catch (error) {
        console.error("MySQL Connection Error:", error);
        throw error; // Ensure errors bubble up for debugging
      }
    }
    
    // Establish a connection when the application starts
    let mysqlConnection;
    connectMySQL()
      .then((connection) => {
        mysqlConnection = connection; // Assign the connection instance globally
      })
      .catch((error) => {
        console.error("Failed to connect to MySQL:", error);
      });*/
  // Call the async function
 
// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'revathid883@gmail.com',
        pass: process.env.EMAIL_PASS || 'aajh zegi lawi gjgc',
    },
});

let otpStore = {}; // This should be in-memory store or database
const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes expiry

// Ensure 'upload' is properly imported and configured
const multer = require('multer');
//const upload = multer({ dest: 'uploads/' }); // or your specific upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() ;
    cb(null,  uniqueSuffix+file.originalname)
  }
})

const upload = multer({ storage: storage })
app.use('/uploads', express.static('uploads'));
// API routes
app.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + OTP_EXPIRY;

    otpStore[email] = { otp, expiry };

    const mailOptions = {
        from: 'revathid883@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
    };

    try {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending OTP:", error);
                return res.status(500).send({ status: "error", message: "Error sending OTP" });
            }

            // Log the response info for debugging
            console.log("OTP sent successfully. Info:", info);

            res.status(200).send({ status: "ok", message: "OTP sent successfully" });
        });
    } catch (err) {
        console.error("Exception in sending OTP:", err);
        res.status(500).send({ status: "error", message: "Internal server error" });
    }
});

app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;
    console.log("Received request for OTP verification:", { email, otp }); // Log incoming request

    const otpData = otpStore[email];

    if (!otpData) {
        console.log("OTP not requested for email:", email); // Log missing OTP request
        return res.status(400).send({ status: "error", message: "OTP not requested" });
    }

    if (Date.now() > otpData.expiry) {
        console.log("OTP expired for email:", email); // Log OTP expiry
        delete otpStore[email];
        return res.status(400).send({ status: "error", message: "OTP expired" });
    }

    if (otpData.otp === otp) {
        console.log("OTP verified successfully for email:", email); // Log successful verification
        delete otpStore[email];
        res.status(200).send({ status: "ok", message: "OTP verified successfully" });
    } else {
        console.log("Invalid OTP for email:", email); // Log invalid OTP
        res.status(400).send({ status: "error", message: "Invalid OTP" });
    }
});

// API routes
app.post("/register", async (req, res) => {
    const { fname, email, number, password, cpassword } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);

    try {
        // Validate input
        if (!fname || !email || !number || !password || !cpassword) {
            return res.status(400).send({ status: "error", message: "All fields are required" });
        }

        // Check if user already exists
        const oldUser = await User.findOne({ email: email });

        if (oldUser) {
            return res.send({ error: "User exists" });
        }

        // Create new user
        await User.create({ fname, email, number, password: encryptedPassword, cpassword });
        res.send({ status: "ok" });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).send({ status: "error", message: error.message });
    }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
      return res.json({ error: "User not found" });
  }

  if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, JWT_SECRET);
      return res.status(201).json({ status: "ok", data: { token, userId: user._id } });
  }

  res.status(400).json({ status: "error", error: "Invalid password" });
});



app.post("/userData", async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET); // Use JWT_SECRET instead of JWT_TOKEN
        const useremail = user.email;
        const data = await User.findOne({ email: useremail });

        if (!data) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }

        res.send({ status: "ok", data: data });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

app.post("/VendorRegister", async (req, res) => {
    const { fname, email, number, businessName, password, cpassword } = req.body;
    console.log("Received registration data:", req.body); // Log incoming data
  
    const encryptedPassword = await bcrypt.hash(password, 10);
  
    try {
      if (!fname || !email || !number || !businessName || !password || !cpassword) {
        return res.status(400).send({ status: "error", message: "All fields are required" });
      }
  
      if (password !== cpassword) {
        return res.status(400).send({ status: "error", message: "Passwords do not match" });
      }
  
      const oldUser = await Vendor.findOne({ email: email });
      if (oldUser) {
        return res.status(400).send({ status: "error", message: "User already exists" });
      }
  
      const newVendor = await Vendor.create({ fname, email, number, businessName, password: encryptedPassword });
      res.status(201).send({ status: "ok", vendorId: newVendor._id });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "error", message: error.message });
    }
  });
  
  
  
app.post("/Vendorsend-otp", async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + OTP_EXPIRY;

    otpStore[email] = { otp, expiry };

    const mailOptions = {
        from: 'revathid883@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
    };

    try {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending OTP:", error);
                return res.status(500).send({ status: "error", message: "Error sending OTP" });
            }

            // Log the response info for debugging
            console.log("OTP sent successfully. Info:", info);

            res.status(200).send({ status: "ok", message: "OTP sent successfully" });
        });
    } catch (err) {
        console.error("Exception in sending OTP:", err);
        res.status(500).send({ status: "error", message: "Internal server error" });
    }
});
app.post("/Vendorverify-otp", (req, res) => {
    const { email, otp } = req.body;
    console.log("Received request for OTP verification:", { email, otp }); // Log incoming request

    const otpData = otpStore[email];

    if (!otpData) {
        console.log("OTP not requested for email:", email); // Log missing OTP request
        return res.status(400).send({ status: "error", message: "OTP not requested" });
    }

    if (Date.now() > otpData.expiry) {
        console.log("OTP expired for email:", email); // Log OTP expiry
        delete otpStore[email];
        return res.status(400).send({ status: "error", message: "OTP expired" });
    }

    if (otpData.otp === otp) {
        console.log("OTP verified successfully for email:", email); // Log successful verification
        delete otpStore[email];
        res.status(200).send({ status: "ok", message: "OTP verified successfully" });
    } else {
        console.log("Invalid OTP for email:", email); // Log invalid OTP
        res.status(400).send({ status: "error", message: "Invalid OTP" });
    }
});
app.post("/Vendorlogin", async (req, res) => {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
  
    if (!vendor) {
      return res.status(404).json({ error: "User not found" });
    }
  
    const isPasswordValid = await bcrypt.compare(password, vendor.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }
  
    const vendortoken = jwt.sign({ email: vendor.email }, JWT_SECRET);
    return res.status(200).json({
      status: "ok",
      data: {
        vendortoken,
        vendorId: vendor._id,
      },
    });
  });
  


app.post("/vendorData", async (req, res) => {
    const { vendortoken } = req.body;
    try {
        const decoded = jwt.verify(vendortoken, JWT_SECRET);
        const vendor = await Vendor.findOne({ email: decoded.email });

        if (!vendor) {
            return res.status(404).json({ status: "error", message: "vendor not found" });
        }

        res.json({ status: "ok", data: vendor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: error.message });
    }
});
app.post('/addcategoryVendor', upload.single('image'), async (req, res) => {
  const { name, slug, description, active, vendorId, category } = req.body;
  const image = req.file ? req.file.filename : '';

  // Convert active to boolean
  const isActive = active === 'true';

  console.log("Request body:", req.body); // Debugging line to check received data
  console.log("Uploaded file:", req.file); // Debugging line to check received file

  try {
      // Validate input
      if (!name || !slug || !description || !vendorId || !category) {
          return res.status(400).send({ status: "error", message: "All fields are required" });
      }

      // Create new category
      await Category.create({ name, slug, description, active: isActive, vendorId, category, image });
      res.send({ status: "ok" });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send({ status: "error", message: error.message });
  }
});



app.post("/getVendorCategory", async (req, res) => {
  const { vendorId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).send({ status: "error", message: "Invalid vendor ID format" });
    }

    // Fetch categories with main category name populated
    const categories = await Category.find({ vendorId })
      .populate('mainCategoryId', 'name') // Populates only the 'name' field from Maincategory
      .exec();

    if (categories.length === 0) {
      return res.status(404).send({ status: 'error', message: 'No categories found' });
    }

    res.send({ status: 'ok', data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

app.delete("/deleteCategoryVendor", async (req, res) => {
  const { categoryId } = req.body;

  try {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
          return res.status(400).send({ status: "error", message: "Invalid category ID format" });
      }

      const deletedCategory = await Category.findByIdAndDelete(categoryId);
      if (!deletedCategory) {
          return res.status(404).send({ status: 'error', message: 'Category not found' });
      }

      res.send({ status: 'ok', message: 'Category deleted successfully' });
  } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});
app.get('/GetCategoryVendor/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid product ID format' });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send({ status: 'error', message: 'Product not found' });
    }

    res.send({ status: 'ok', data: category });
  } catch (error) {
    console.error('Error fetching Category:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

app.put('/updateCategoryVendor', async (req, res) => {
  const { _id, name, slug, description, active, category, image } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid product ID format' });
    }

    const existingCategory = await Category.findById(_id);
    if (!existingCategory) {
      return res.status(404).send({ status: 'error', message: 'Category not found' });
    }

    existingCategory.name = name;
    existingCategory.slug = slug;
    existingCategory.description = description;
    existingCategory.active = active;
    existingCategory.category = category;

    // Handle image update
    if (image) {
      // Assuming image is uploaded and saved to a specific path
      existingCategory.image = image;
    }

    await existingCategory.save();

    res.send({ status: 'ok', message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

// Express route to get all categories
// Example using Express.js
app.get('/getcategories', async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories) {
      return res.status(404).send({ status: 'error', message: 'No categories found' });
    }
    res.send({ status: 'ok', data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});
app.get('/getMaincategories', async (req, res) => {
  try {
    const categories = await MainCategory.find();
    if (!categories) {
      return res.status(404).send({ status: 'error', message: 'No categories found' });
    }
    res.send({ status: 'ok', data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});


//all user
app.get('/alluser', async (req, res) => {
    try {
        console.log('Fetching all users...');

        const users = await User.find();

        console.log('Users fetched:', users);

        if (users.length === 0) {
            return res.status(404).send({ status: 'error', message: 'No users found' });
        }

        res.send({ status: 'ok', data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
});
//all vendor
app.get('/allVendor', async (req, res) => {
  try {
      console.log('Fetching all Vendors ...');

      const Vendors  = await Vendor.find();

      console.log('Vendors fetched:', Vendors );

      if (Vendors .length === 0) {
          return res.status(404).send({ status: 'error', message: 'No Vendor found' });
      }

      res.send({ status: 'ok', data: Vendors  });
  } catch (error) {
      console.error('Error fetching Vendors :', error);
      res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

app.post("/addProduct", upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'galleryImage1', maxCount: 1 },
  { name: 'galleryImage2', maxCount: 1 },
  { name: 'galleryImage3', maxCount: 1 },
  { name: 'galleryImage4', maxCount: 1 }
]), async (req, res) => {
    let { vendorId, name, slug, smalldescription, description, active, originalPrice, sellingPrice, category, subcategory } = req.body;
  
    // Ensure vendorId is a single value
    if (Array.isArray(vendorId)) {
        vendorId = vendorId[0]; // Take the first element if it's an array
    }

    console.log("Received vendorId:", vendorId); // Log received vendorId
  
    try {
      // Validate vendorId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        return res.status(400).send({ status: "error", message: "Invalid vendor ID format" });
      }

      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        return res.status(400).send({ status: "error", message: "Invalid vendor ID" });
      }
  
      const newProduct = await Product.create({
        vendorId,
        name,
        slug,
        smalldescription,
        description,
        active,
        originalPrice,
        sellingPrice,
        category,
        subcategory,
        image: req.files['image'] ? req.files['image'][0].path : null,
        galleryimage1: req.files['galleryImage1'] ? req.files['galleryImage1'][0].path : null,
        galleryimage2: req.files['galleryImage2'] ? req.files['galleryImage2'][0].path : null,
        galleryimage3: req.files['galleryImage3'] ? req.files['galleryImage3'][0].path : null,
        galleryimage4: req.files['galleryImage4'] ? req.files['galleryImage4'][0].path : null
      });
  
      res.status(201).send({ status: "ok", productId: newProduct._id });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "error", message: error.message });
    }
});

app.post("/getVendorProduct", async (req, res) => {
  const { vendorId } = req.body;


  try {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).send({ status: "error", message: "Invalid vendor ID format" });
    }

    const products = await Product.find({ vendorId: vendorId });
    if (!products) {
      return res.status(404).send({ status: 'error', message: 'No products found' });
    }

    res.send({ status: 'ok', data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});


app.delete('/deleteProductVendor', async (req, res) => {
  const { productId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send({ status: 'error', message: 'Invalid product ID format' });
    }

    const result = await Product.findByIdAndDelete(productId);
    if (!result) {
      return res.status(404).send({ status: 'error', message: 'Product not found' });
    }

    res.send({ status: 'ok', message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});
// Route to get a product by ID
app.get('/GetproductVendor/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid product ID format' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send({ status: 'error', message: 'Product not found' });
    }

    res.send({ status: 'ok', data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});


app.put('/updateProductVendor', upload.single('image'), async (req, res) => {
  const { _id, name, slug, smalldescription, description, originalPrice, sellingPrice, active, category } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid product ID format' });
    }

    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).send({ status: 'error', message: 'Product not found' });
    }

    product.name = name;
    product.slug = slug;
    product.smalldescription = smalldescription;
    product.description = description;
    product.originalPrice = originalPrice;
    product.sellingPrice = sellingPrice;
    product.active = active;
    product.category = category;

    if (req.file) {
      product.image = req.file.path;
    }

    await product.save();

    res.send({ status: 'ok', message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

  //dashboard count



  app.post("/getVendorProductcount", async (req, res) => {
    const { vendorId } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(vendorId)) {
            return res.status(400).send({ status: "error", message: "Invalid vendor ID format" });
        }

        const productCount = await Product.countDocuments({ vendorId });
        
        res.send({ status: 'ok', data: { productCount } });
    } catch (error) {
        console.error('Error fetching product count:', error);
        res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
});

app.post("/getVendorCategorycount", async (req, res) => {
    const { vendorId } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(vendorId)) {
            return res.status(400).send({ status: "error", message: "Invalid vendor ID format" });
        }

        const categoryCount = await Category.countDocuments({ vendorId });

        res.send({ status: 'ok', data: { categoryCount } });
    } catch (error) {
        console.error('Error fetching category count:', error);
        res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
});
  
 /* app.post("/getVendorEnquirycount", async (req, res) => {
    const { vendorId } = req.body;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        return res.status(400).send({ status: "error", message: "Invalid vendor ID format" });
      }
  
      const EnquiryCount = await Enquiry.countDocuments({ vendorId: vendorId });
  
      if (EnquiryCount === 0) {
        return res.status(404).send({ status: 'error', message: 'No Enquiry found' });
      }
  
      res.send({ status: 'ok', data: { EnquiryCount } });
    } catch (error) {
      console.error('Error fetching product count:', error);
      res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
  });*/





  //home page server side 
  app.get('/getCategoryHome', async (req, res) => {
    try {
      const categories = await MainCategory.find();
      if (!categories || categories.length === 0) {
        return res.status(404).send({ status: 'error', message: 'No categories found' });
      }
      res.send({ status: 'ok', data: categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
  });
  
  app.get('/getsubCategoryHome', async (req, res) => {
    try {
      const categories = await Category.find();
      if (!categories || categories.length === 0) {
        return res.status(404).send({ status: 'error', message: 'No categories found' });
      }
      res.send({ status: 'ok', data: categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
  });
  

  app.get('/getProductsHome', async (req, res) => {
    try {
      const Products = await Product.find();
      if (!Products) {
        return res.status(404).send({ status: 'error', message: 'No Products found' });
      }
      res.send({ status: 'ok', data: Products });
    } catch (error) {
      console.error('Error fetching Products:', error);
      res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
  });

  app.post("/sendEnquiry", async (req, res) => {
    const { productname, UserId, Username, UserNumber, product_id, vendorId, productPrice } = req.body;
    console.log("Request Body:", req.body); // Debugging line
  
    try {
      if (!productname || !UserId || !Username || !UserNumber || !product_id || !vendorId || !productPrice) {
        return res.status(400).send({ status: "error", message: "All fields are required" });
      }
  
      // Create the enquiry in the database
      const enquiry = await Enquiry.create({
        productname,
        UserId,
        Username,
        UserNumber,
        product_id,
        vendorId,
        productPrice
      });
  
      // Get the vendor's email using the vendorId
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        return res.status(404).send({ status: "error", message: "Vendor not found" });
      }
  
      const vendorEmail = vendor.email; // Assuming the Vendor model has an 'email' field
  
      // Set up Nodemailer transport (using Gmail as an example)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'revathid883@gmail.com',
          pass: 'aajh zegi lawi gjgc',
        },
      });
  
      // Email options
      const mailOptions = {
        from: 'officearistos@gmail.com',
        to: vendorEmail,
        subject: 'New Enquiry Received',
        text: `Dear Vendor,
  
  You have received a new enquiry for the product: ${productname}.
  
  Details:
  - Customer name: ${Username}
  - Customer Number: ${UserNumber}
  - Product Price: ${productPrice}
  
  Please check your vendor portal for more details.
  
  Thank you,
  Your Aristos`
      };
  
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).send({ status: "error", message: "Failed to send email" });
        }
        console.log('Email sent: ' + info.response);
        res.send({ status: "ok", message: "Enquiry sent successfully and email notification sent to vendor" });
      });
  
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ status: "error", message: error.message });
    }
  });
  

  app.post("/sendEnquiryService", async (req, res) => {
    const { productname, UserId, Username, UserNumber, product_id, vendorId, productPrice } = req.body;
  
    console.log("Request Body:", req.body); // Debugging line
  
    try {
      if (!productname || !UserId || !Username || !UserNumber || !product_id || !vendorId || !productPrice) {
        return res.status(400).send({ status: "error", message: "All fields are required" });
      }
  
      // Check if the vendor exists
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        console.error("Vendor not found for ID:", vendorId);
        return res.status(404).send({ status: "error", message: "Vendor not found" });
      }
  
      const vendorEmail = vendor.email;
  
      // Create the enquiry in the database
      const enquiry = await Enquiry.create({
        productname,
        UserId,
        Username,
        UserNumber,
        product_id,
        vendorId,
        productPrice,
      });
  
      // Set up Nodemailer transport
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'revathid883@gmail.com',
          pass: 'aajh zegi lawi gjgc',
        },
      });
  
      const mailOptions = {
        from: 'officearistos@gmail.com',
        to: vendorEmail,
        subject: 'New Enquiry Received',
        text: `Dear Vendor,
  
        You have received a new enquiry for the Service: ${productname}.
  
        Details:
        - Customer name: ${Username}
        - Customer Number: ${UserNumber}
        - Service Price: ${productPrice}
  
        Please check your vendor portal for more details.
  
        Thank you,
        Your Aristos`,
      };
  
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).send({ status: "error", message: "Failed to send email" });
        }
        console.log('Email sent: ' + info.response);
        res.send({ status: "ok", message: "Enquiry sent successfully and email notification sent to vendor" });
      });
  
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ status: "error", message: error.message });
    }
  });
  

 

  app.post('/getVendorEnquiry', async (req, res) => {
    const { vendorId } = req.body;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        return res.status(400).send({ status: 'error', message: 'Invalid vendor ID format' });
      }
  
      const enquiries = await Enquiry.find({ vendorId })
       .populate('product_id') // Populates product details
      .populate('vendorId')  // Populates vendor details if needed
      .exec();;
      if (!enquiries || enquiries.length === 0) {
        return res.status(404).send({ status: 'error', message: 'No enquiries found for this vendor' });
      }
  
      res.send({ status: 'ok', data: enquiries });
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
  });
  

  app.put("/vendor/vendorId", async (req, res) => {
    const { vendorId } = req.params;
    const { fname, email, number, businessName } = req.body;
  
    try {
      let vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        return res.status(404).send({ status: "error", message: "Vendor not found" });
      }
  
      // Update vendor data
      vendor.fname = fname;
      vendor.email = email;
      vendor.number = number;
      vendor.businessName = businessName;
  
      // Save the updated vendor data
      await vendor.save();
      res.status(200).send({ status: "ok", message: "Vendor updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "error", message: "Internal server error" });
    }
  });
  //add plan


  //add plan
  app.post("/addPlan", async (req, res) => {
    const { planName, planType, planPrice, planList, active } = req.body;
  
    try {
      // Validate input
      if (!planName || !planType || !planPrice || !Array.isArray(planList) || typeof active !== 'boolean') {
        return res.status(400).send({ status: "error", message: "All fields are required and must be valid" });
      }
  
      // Log the request body to see the incoming data
      console.log(req.body);
  
      // Create new plan
      await Plan.create({ planName, planType, planPrice, planList, active });
      res.send({ status: "ok" });
    } catch (error) {
      console.error("Error adding plan:", error.message); // Log error for debugging
      res.status(500).send({ status: "error", message: "Failed to add plan" });
    }
  });
  
  //all plan   
app.get('/getAllPlan', async (req, res) => {

    try {
      const plan = await Plan.find();
      if (!plan) {
        return res.status(404).send({ status: 'error', message: 'No plan found' });
      }
      res.send({ status: 'ok', data: plan });
    } catch (error) {
      console.error('Error fetching plan:', error);
      res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
  });
  app.delete("/deletePlanSuperAdmin", async (req, res) => {
    const { planId } = req.body;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(planId)) {
        return res.status(400).send({ status: "error", message: "Invalid Plan ID format" });
      }
  
      const deletedPlan = await Plan.findByIdAndDelete(planId); // Fixed variable name
      if (!deletedPlan) {
        return res.status(404).send({ status: 'error', message: 'Plan not found' }); // Changed error message
      }
  
      res.send({ status: 'ok', message: 'Plan deleted successfully' }); // Changed success message
    } catch (error) {
      console.error('Error deleting plan:', error); // Changed error log
      res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
  });



  app.get('/GetplanDetails/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ status: 'error', message: 'Invalid product ID format' });
      }
  
      const plan = await Plan.findById(id);
      if (!plan) {
        return res.status(404).send({ status: 'error', message: 'Product not found' });
      }
  
      res.send({ status: 'ok', data: plan });
    } catch (error) {
      console.error('Error fetching plan:', error);
      res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
  });
// Route to update plan
app.put('/updatePlan/:id', async (req, res) => {
  const { id } = req.params;
  const { planName, planType, planPrice, planList, active } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid plan ID format' });
    }

    const updatedPlan = await Plan.findByIdAndUpdate(id, {
      planName,
      planType,
      planPrice,
      planList,
      active
    }, { new: true });

    if (!updatedPlan) {
      return res.status(404).send({ status: 'error', message: 'Plan not found' });
    }

    res.send({ status: 'ok', data: updatedPlan });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});


/*app.post("/selectPlanVendor", async (req, res) => {
  const { planId, planPrice, vendorId } = req.body;

  try {
    if (!planId || !vendorId || !planPrice) {
      return res.status(400).send({ status: "error", message: "All fields are required" });
    }

    await PlanselectVendor.create({ planId, planPrice, vendorId });
    res.send({ status: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
});*/
app.post("/selectPlanVendor", async (req, res) => {
  const { planId, planPrice, vendorId, paymentId } = req.body;

  try {
    if (!planId || !vendorId || !planPrice) {
      return res.status(400).send({ status: "error", message: "All fields are required" });
    }

    // Find and update the vendor's selected plan
    const existingPlan = await PlanselectVendor.findOne({ vendorId });

    if (existingPlan) {
      // Update existing plan
      await PlanselectVendor.updateOne(
        { vendorId },
        { planId, planPrice, paymentId }
      );
    } else {
      // Create new plan selection
      await PlanselectVendor.create({ planId, planPrice, vendorId, paymentId });
    }

    res.send({ status: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
});

// Endpoint to get the currently selected plan for a vendor
app.get('/getSelectedPlan/:vendorId', async (req, res) => {
  const { vendorId } = req.params;

  try {
    const plan = await PlanselectVendor.findOne({ vendorId });

    if (plan) {
      res.send({ status: "ok", data: plan });
    } else {
      res.send({ status: "ok", data: { planId: null } });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
});




/*app.post("/selectPlanVendor", async (req, res) => {
  const { planId, planPrice, vendorId, paymentId, paymentStatus } = req.body;

  try {
    if (!planId || !vendorId) {
      return res.status(400).send({ status: "error", message: "All fields are required" });
    }

    await PlanselectVendor.create({
      planId,
      planPrice,
      vendorId,
      paymentId,
      paymentStatus,
    });

    res.send({ status: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
});*/


app.post("/addBusinessType", async (req, res) => {
  const { type, vendorId } = req.body;
  console.log("Request Body:", req.body); // Debugging line

  try {
    if (!type || !vendorId) {
      return res.status(400).json({ status: 'error', message: 'Type and Vendor ID are required' });
    }

    await BusinessTypeVendor.create({ type, vendorId });
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error during creation:", error); // Improved logging
    res.status(500).send({ status: "error", message: error.message });
  }
});
  
app.post("/checkBusinessType", async (req, res) => {
  const { vendorId } = req.body;

  try {
    // Validate vendorId format
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).send({ status: "error", message: "Invalid vendor ID format" });
    }

    // Find the business type for the given vendorId
    const businessType = await BusinessTypeVendor.findOne({ vendorId: vendorId });

    // If no business type is found, return a 404 error
    if (!businessType) {
      return res.status(404).send({ status: 'error', message: 'No BusinessType found' });
    }

    // Send the found business type
    res.send({ status: 'ok', data: businessType });
  } catch (error) {
    console.error('Error fetching business type:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});


// add service

app.post("/addService", upload.single('image'), async (req, res) => {
  let { vendorId, name, description, active, Pricerange, category } = req.body;

  // Ensure vendorId is a single value
  if (Array.isArray(vendorId)) {
    vendorId = vendorId[0]; // Take the first element if it's an array
  }

  console.log("Received vendorId:", vendorId); // Log received vendorId

  try {
    // Validate vendorId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).send({ status: "error", message: "Invalid vendor ID format" });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(400).send({ status: "error", message: "Invalid vendor ID" });
    }

   

    const newService = await Service.create({
      vendorId,
      name,
      
      image: req.file ? req.file.path : null,
      description,
      active,
      Pricerange,
      category // Save category in service
    });

    res.status(201).send({ status: "ok", serviceId: newService._id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
});


app.post("/getVendorService", async (req, res) => {
  const { vendorId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).send({ status: "error", message: "Invalid vendor ID format" });
    }

    const services = await Service.find({ vendorId: vendorId });
    
    if (services.length === 0) {
      return res.status(404).send({ status: 'error', message: 'No services found' });
    }

    res.send({ status: 'ok', data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});



// add main category 



app.post("/addMainCategory", upload.single('image'), async (req, res) => {
  let { name, slug, description, active } = req.body;

  try {
    const newService = await MainCategory.create({
      name,
      slug,
      image: req.file ? req.file.path : null,
      description,
      active,
    });

    res.status(201).send({ status: "ok", serviceId: newService._id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
});

app.get('/getcategoriesMain', async (req, res) => {
  try {
    const categories = await MainCategory.find();
    if (!categories) {
      return res.status(404).send({ status: 'error', message: 'No categories found' });
    }
    res.send({ status: 'ok', data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});
//add main service


app.post("/addMainService", upload.single('image'), async (req, res) => {
  let { name, slug, description, active } = req.body;

  try {
    const newService = await MainService.create({
      name,
      slug,
      image: req.file ? req.file.path : null,
      description,
      active,
    });

    res.status(201).send({ status: "ok", serviceId: newService._id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
});
app.get('/getServiceMain', async (req, res) => {
  try {
    const categories = await MainService.find();
    if (!categories) {
      return res.status(404).send({ status: 'error', message: 'No categories found' });
    }
    res.send({ status: 'ok', data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});
app.get('/getSubCategory', async (req, res) => {
  try {
    const categories = await SubCategory.find();
    if (!categories) {
      return res.status(404).send({ status: 'error', message: 'No categories found' });
    }
    res.send({ status: 'ok', data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});
app.post("/addSlider", upload.single('image'), async (req, res) => {
  const { name, URL } = req.body;

  try {
    const newSlider = await Slider.create({
      name,
      URL,
      image: req.file ? req.file.path : null,
    });

    res.status(201).send({ status: "ok", sliderId: newSlider._id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
});


app.get('/getSliderImages', async (req, res) => {
  try {
    const sliders = await Slider.find({}, 'image URL -_id'); // Fetch image URLs and other necessary fields
    res.status(200).json(sliders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch slider images' });
  }
});
app.get('/AllSliderAdmin', async (req, res) => {
  try {
    const sliders = await Slider.find({}, 'image name active _id'); // Fetch image URLs and other necessary fields
    res.status(200).json({ status: 'ok', data: sliders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch slider images' });
  }
});
app.get('/GetSliderId/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid slider ID format' });
    }

    // Fetch the slider from the database
    const slider = await Slider.findById(id);
    if (!slider) {
      return res.status(404).send({ status: 'error', message: 'Slider not found' });
    }

    // Send the slider data
    res.send({ status: 'ok', data: slider });
  } catch (error) {
    console.error('Error fetching Slider:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});



app.post("/addBanner", upload.single('image'), async (req, res) => {
  const { name, URL } = req.body;

  try {
    const newSlider = await Banner.create({
      name,
      URL,
      image: req.file ? req.file.path : null,
    });

    res.status(201).send({ status: "ok", sliderId: newSlider._id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
});






app.get('/getBannerImages', async (req, res) => {
  try {
    const Products = await Banner.find();
    if (!Products) {
      return res.status(404).send({ status: 'error', message: 'No Products found' });
    }
    res.send({ status: 'ok', data: Products });
  } catch (error) {
    console.error('Error fetching Products:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});


app.put('/updateSlider', upload.single('image'), async (req, res) => {
  const { _id, name, URL } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid slider ID format' });
    }

    const slider = await Slider.findById(_id);
    if (!slider) {
      return res.status(404).send({ status: 'error', message: 'Slider not found' });
    }

    slider.name = name;
    slider.URL = URL;

    if (req.file) {
      slider.image = req.file.path;
    }

    await slider.save();

    res.send({ status: 'ok', message: 'Slider updated successfully' });
  } catch (error) {
    console.error('Error updating Slider:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});


app.get('/GetBannerId/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid banner ID format' });
    }

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).send({ status: 'error', message: 'Banner not found' });
    }

    res.send({ status: 'ok', data: banner });
  } catch (error) {
    console.error('Error fetching banner:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

app.put('/updateBanner', upload.single('image'), async (req, res) => {
  const { _id, name, URL } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid banner ID format' });
    }

    const banner = await Banner.findById(_id);
    if (!banner) {
      return res.status(404).send({ status: 'error', message: 'Banner not found' });
    }

    banner.name = name;
    banner.URL = URL;

    if (req.file) {
      banner.image = req.file.path;
    }

    await banner.save();

    res.send({ status: 'ok', message: 'Banner updated successfully' });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});
app.post('/getName', async (req, res) => {
  const { userId, vendorId } = req.body;

  try {
    let userData;

    if (userId) {
      userData = await User.findOne({ _id: userId });
    } else if (vendorId) {
      userData = await Vendor.findOne({ _id: vendorId });
    } else {
      return res.status(400).json({ status: 'error', message: 'No userId or vendorId provided' });
    }

    if (!userData) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ status: 'ok', data: userData });
  } catch (error) {
    console.error('Error fetching user data:', error); // Log the error for debugging
    res.status(500).json({ status: 'error', message: 'An error occurred' });
  }
});


// vendor user profile

app.put('/updateUserProfileVendor', async (req, res) => {
  const { _id, fname, lname, email, alterEmail, number, alterNumber, whatsappNumber, jobTitle } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid vendor ID format' });
    }

    const existingVendor = await Vendor.findById(_id);
    if (!existingVendor) {
      return res.status(404).send({ status: 'error', message: 'Vendor not found' });
    }

    existingVendor.fname = fname;
    existingVendor.lname = lname;
    existingVendor.email = email;
    existingVendor.alterEmail = alterEmail;
    existingVendor.number = number;
    existingVendor.alterNumber = alterNumber;
    existingVendor.whatsappNumber = whatsappNumber;
    existingVendor.jobTitle = jobTitle;

    await existingVendor.save();

    res.send({ status: 'ok', message: 'Vendor updated successfully' });
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});






app.put('/BusinessProfile', async (req, res) => {
  const { _id,
    businessName,
    OfficeContact,
    FaxNumber,
    Ownership,
    AnnualTakeover,
    establishment,
    NoEmployee,
    selectType,
    Address,
    City,
    State,
    Country,
    Pincode
   } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid vendor ID format' });
    }

    const existingVendor = await Vendor.findById(_id);
    if (!existingVendor) {
      return res.status(404).send({ status: 'error', message: 'Vendor not found' });
    }

    existingVendor. businessName=  businessName;
    existingVendor. OfficeContact =  OfficeContact;
    existingVendor.FaxNumber = FaxNumber;
    existingVendor.Ownership= Ownership;
    existingVendor.AnnualTakeover = AnnualTakeover;
    existingVendor.establishment=establishment;
    existingVendor.NoEmployee = NoEmployee;
    
    existingVendor.selectType = selectType;
    existingVendor.Address = Address;
    existingVendor.City = City;
    existingVendor.State=State;
    existingVendor.Country = Country;
    existingVendor.Pincode= Pincode;
    await existingVendor.save();

    res.send({ status: 'ok', message: 'Vendor updated successfully' });
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

app.post("/addProductAdmin", upload.single('image'), async (req, res) => {
  let { vendorId, name, slug, smalldescription, description, active, originalPrice, sellingPrice, category,subcategory } = req.body;

  try {
    const newProduct = await Product.create({
      vendorId,
      name,
      slug,
      smalldescription,
      image: req.file ? req.file.path : null,
      description,
      active,
      originalPrice,
      sellingPrice,
      category, 
      subcategory,// Storing the category ID
    });

    res.status(201).send({ status: "ok", productId: newProduct._id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
});



//get vendor details admin
app.post("/vendorDataAdmin", async (req, res) => {
  const { id } = req.body;
  try {
      // Query by _id if you're using MongoDB's default identifier
      const vendor = await Vendor.findOne({ _id: id });

      if (!vendor) {
          return res.status(404).json({ status: "error", message: "User not found" });
      }

      res.json({ status: "ok", data: vendor });
  } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
  }
});

//update vendor detsils 
app.put('/updateUserProfileVendorAdmin', async (req, res) => {
  const { _id, fname, lname, email, alterEmail, number, alterNumber, whatsappNumber, jobTitle } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid vendor ID format' });
    }

    const existingVendor = await Vendor.findById(_id);
    if (!existingVendor) {
      return res.status(404).send({ status: 'error', message: 'Vendor not found' });
    }

    existingVendor.fname = fname;
    existingVendor.lname = lname;
    existingVendor.email = email;
    existingVendor.alterEmail = alterEmail;
    existingVendor.number = number;
    existingVendor.alterNumber = alterNumber;
    existingVendor.whatsappNumber = whatsappNumber;
    existingVendor.jobTitle = jobTitle;

    await existingVendor.save();

    res.send({ status: 'ok', message: 'Vendor updated successfully' });
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});
app.post("/AdminVendorCategory", async (req, res) => {
  const { id } = req.body;

  try {
    // Validate if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid category ID' });
    }

    const categories = await Category.find({ vendorId: id });
    
    if (categories.length === 0) {
      return res.status(404).send({ status: 'error', message: 'No categories found' });
    }

    res.send({ status: 'ok', data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

app.post('/AdminVendorEnquiry', async (req, res) => {
  const { id } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid vendor ID format' });
    }

    const enquiries = await Enquiry.find({ vendorId: id });
    if (!enquiries || enquiries.length === 0) {
      return res.status(404).send({ status: 'error', message: 'No enquiries found for this vendor' });
    }

    res.send({ status: 'ok', data: enquiries });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});



//get category related products

app.get('/getProductsByCategory/:category', async (req, res) => {
  try {
    const categoryName = req.params.category; // Capture the category name from the URL
    console.log(`Received Category: ${categoryName}`);

    if (!categoryName) {
      return res.status(400).json({ status: 'error', message: 'Category name is missing' });
    }

    // Fetch products matching the category name
    const products = await Product.find({ category: categoryName });

    if (products.length > 0) {
      res.json({ status: 'ok', data: products });
    } else {
      res.status(404).json({ status: 'error', message: 'No products found in this category' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});
//GET SERVICE 
app.get('/getServiceByMain/:service', async (req, res) => {
  try {
    let serviceName = req.params.service.trim().toLowerCase(); // Normalize service name
    console.log(`Received service: ${serviceName}`);

    if (!serviceName) {
      return res.status(400).json({ status: 'error', message: 'Service name is missing' });
    }

    // Fetch services matching the service name
    const services = await Service.find({ category: serviceName }).populate('vendorId');

    if (services.length > 0) {
      res.json({ status: 'ok', data: services });
    } else {
      res.status(404).json({ status: 'error', message: 'No services found for this category' });
    }
  } catch (error) {
    console.error('Error fetching services:', error); // Log error to console
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});



app.get('/ProductView/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Populate the vendorId field to get vendor details
    const product = await Product.findById(productId).populate('vendorId');

    if (product) {
      res.json({ status: 'ok', data: product });
    } else {
      res.json({ status: 'error', message: 'Product not found' });
    }
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});
app.post("/addcategory", upload.single('image'), async (req, res) => {
  try {
    const { name, slug, description, active } = req.body;

    // Check if all required fields are present
    if (!name || !slug || active === undefined) {
      return res.status(400).send({ status: "error", message: "Missing required fields" });
    }

    // Creating the new Category document
    const newCategory = await  MainCategory.create({
      name,
      slug,
      description,
      image: req.file ? req.file.path : null,
      active: active === 'true' // Convert string to boolean
    });

    res.status(201).send({ status: "ok", CategoryId: newCategory._id });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send({ status: "error", message: error.message });
  }
});

app.post("/addMainSubCategory", upload.single('image'), async (req, res) => {
  try {
    const { CategoryId, name, slug, active } = req.body;

    // Check if all required fields are present
    if (!CategoryId || !name || !slug || active === undefined) {
      return res.status(400).send({ status: "error", message: "Missing required fields" });
    }

    // Creating the new SubCategory document
    const newSubCategory = await SubCategory.create({
      Category: CategoryId, // Use CategoryId directly
      name,
      slug,
      image: req.file ? req.file.path : null,
      active: active === 'true' // Convert string to boolean
    });

    res.status(201).send({ status: "ok", subCategoryId: newSubCategory._id });
  } catch (error) {
    console.error("Server Error:", error); // Log error details
    res.status(500).send({ status: "error", message: error.message });
  }
});


//delete category
app.delete("/deleteCategory", async (req, res) => {
  const { categoryId } = req.body;

  try {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
          return res.status(400).send({ status: "error", message: "Invalid category ID format" });
      }

      const deletedCategory = await Category.findByIdAndDelete(categoryId);
      if (!deletedCategory) {
          return res.status(404).send({ status: 'error', message: 'Category not found' });
      }

      res.send({ status: 'ok', message: 'Category deleted successfully' });
  } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});
app.get('/getSubCategory/:category', async (req, res) => {
  try {
    const category = req.params.category; // Capture the category name from the URL
    console.log(`Received Category: ${category}`);

    if (!category) {
      return res.status(400).json({ status: 'error', message: 'Category ID is missing' });
    }

    // Fetch subcategories matching the category ID
    const subCategories = await SubCategory.find({ Category : category });

    console.log(`SubCategories Found: ${subCategories.length}`);

    if (subCategories.length > 0) {
      res.json({ status: 'ok', data: subCategories });
    } else {
      res.status(404).json({ status: 'error', message: 'No subcategories found in this category' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


app.get('/getLocationRelatedProduct/:location', async (req, res) => {
  try {
    const location = req.params.location;

    // Fetch vendors that match the provided city (location)
    const vendors = await Vendor.find({ City: location });

    if (vendors.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No vendors found in this location' });
    }

    // Extract vendor IDs from the found vendors
    const vendorIds = vendors.map(vendor => vendor._id);

    // Fetch products associated with these vendor IDs
    const products = await Product.find({ vendorId: { $in: vendorIds } });

    if (products.length > 0) {
      console.log(`Products found for location ${location}:`, products);
      res.json({ status: 'ok', data: products });
    } else {
      console.log(`No products found for vendor IDs:`, vendorIds);
      res.status(404).json({ status: 'error', message: 'No products found for this location' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get product count for super admin
app.post("/getProductcount", async (req, res) => {
  try {
      // Count the number of documents in the Product collection
      const productCount = await Product.countDocuments();
      
      // Send the count as a response
      res.send({ status: 'ok', data: { productCount } });
  } catch (error) {
      // Log the error to the server console
      console.error('Error fetching product count:', error);

      // Send an error response to the client
      res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

// Get vendor count for super admin
app.post("/getVendorcount", async (req, res) => {
  try {
      // Count the number of documents in the Vendor collection
      const vendorCount = await Vendor.countDocuments();
      
      // Send the count as a response
      res.send({ status: 'ok', data: { vendorCount } });
  } catch (error) {
      // Log the error to the server console
      console.error('Error fetching vendor count:', error);

      // Send an error response to the client
      res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});
app.post("/getCategorycount", async (req, res) => {
  try {
      // Count the number of documents in the Vendor collection
      const MainCategoryCount = await MainCategory.countDocuments();
      
      // Send the count as a response
      res.send({ status: 'ok', data: { MainCategoryCount } });
  } catch (error) {
      // Log the error to the server console
      console.error('Error fetching vendor count:', error);

      // Send an error response to the client
      res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});
app.post("/getsubCategorycount", async (req, res) => {
  try {
      // Count the number of documents in the Vendor collection
      const SubCategoryCount = await SubCategory.countDocuments();
      
      // Send the count as a response
      res.send({ status: 'ok', data: { SubCategoryCount } });
  } catch (error) {
      // Log the error to the server console
      console.error('Error fetching vendor count:', error);

      // Send an error response to the client
      res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

// Get enquiry count for super admin
app.post("/getEnquirycount", async (req, res) => {
  try {
      // Count the number of documents in the Enquiry collection
      const enquiryCount = await Enquiry.countDocuments();
      
      // Send the count as a response
      res.send({ status: 'ok', data: { enquiryCount } });
  } catch (error) {
      // Log the error to the server console
      console.error('Error fetching enquiry count:', error);

      // Send an error response to the client
      res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

app.put('/updateStatusCategory/:id', async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid category ID format' });
    }

    const updatedCategory = await MainCategory.findByIdAndUpdate(id, { active }, { new: true });

    if (!updatedCategory) {
      return res.status(404).send({ status: 'error', message: 'Category not found' });
    }

    res.send({ status: 'ok', data: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

app.put('/updateStatusProduct/:id', async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid Product ID format' });
    }

    const updatedCategory = await Product.findByIdAndUpdate(id, { active }, { new: true });

    if (!updatedCategory) {
      return res.status(404).send({ status: 'error', message: 'Product not found' });
    }

    res.send({ status: 'ok', data: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

app.put('/updateFeatureProduct/:id', async (req, res) => {
  const { id } = req.params;
  const { feature } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid Product ID format' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, { feature }, { new: true });

    if (!updatedProduct) {
      return res.status(404).send({ status: 'error', message: 'Product not found' });
    }

    res.send({ status: 'ok', data: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});
//update category 
app.get('/GetCategory/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid product ID format' });
    }

    const category = await MainCategory.findById(id);
    if (!category) {
      return res.status(404).send({ status: 'error', message: 'Product not found' });
    }

    res.send({ status: 'ok', data: category });
  } catch (error) {
    console.error('Error fetching Category:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});
app.put('/updateCategory', upload.single('image'), async (req, res) => {
  const { _id, name, slug, active } = req.body;

  try {
    console.log('Received ID:', _id);

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid category ID format' });
    }

    const existingCategory = await MainCategory.findById(_id);
    if (!existingCategory) {
      return res.status(404).send({ status: 'error', message: 'Category not found' });
    }

    existingCategory.name = name;
    existingCategory.slug = slug;
    existingCategory.active = active;

    // Handle image update
    if (req.file) {
      existingCategory.image = req.file.path; // Save the file path in the database
    }

    await existingCategory.save();
    res.send({ status: 'ok', message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

//delete category
app.delete("/deleteCategorySuperAdmin", async (req, res) => {
  const { categoryId } = req.body;

  try {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
          return res.status(400).send({ status: "error", message: "Invalid category ID format" });
      }

      const deletedCategory = await MainCategory.findByIdAndDelete(categoryId);
      if (!deletedCategory) {
          return res.status(404).send({ status: 'error', message: 'Category not found' });
      }

      res.send({ status: 'ok', message: 'Category deleted successfully' });
  } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

//get Product 

app.get('/getProduct', async (req, res) => {
  try {
    const Products = await Product.find();
    if (!Products) {
      return res.status(404).send({ status: 'error', message: 'No Products found' });
    }
    res.send({ status: 'ok', data: Products });
  } catch (error) {
    console.error('Error fetching Products:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

//update product superadmin 
app.put('/updateProduct', upload.single('image'), async (req, res) => {
  const { _id, name, slug, smalldescription, description, originalPrice, sellingPrice, active, category } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({ status: 'error', message: 'Invalid product ID format' });
    }

    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).send({ status: 'error', message: 'Product not found' });
    }

    product.name = name;
    product.slug = slug;
    product.smalldescription = smalldescription;
    product.description = description;
    product.originalPrice = originalPrice;
    product.sellingPrice = sellingPrice;
    product.active = active;
    product.category = category;

    if (req.file) {
      product.image = req.file.path;
    }

    await product.save();

    res.send({ status: 'ok', message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

app.get("/vendorOrders/:vendorId", async (req, res) => {
  const { vendorId } = req.params;
  try {
    // Ensure vendorId is valid
    if (!vendorId) {
      return res.status(400).json({ status: "error", message: "Vendor ID is required" });
    }

    // Fetch orders
    const orders = await Enquiry.find({ vendorId })
      .populate('product_id') // Populates product details
      .populate('vendorId')  // Populates vendor details if needed
      .exec();

    // Check if orders are found
    if (orders.length === 0) {
      return res.status(404).json({ status: "error", message: "No orders found" });
    }

    // Return orders
    res.json({ status: "ok", orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Assuming you have already imported the necessary models
app.get('/getProductsRelatedPlan', async (req, res) => {
  try {
    // Aggregate products and join with vendor plans and vendor details
    const products = await Product.aggregate([
      {
        $lookup: {
          from: 'planselectvendors', // collection name for plans
          localField: 'vendorId', // field in products
          foreignField: 'vendorId', // field in plans
          as: 'vendorPlan'
        }
      },
      {
        $unwind: '$vendorPlan'
      },
      {
        $lookup: {
          from: 'vendor', // collection name for vendors
          localField: 'vendorId', // field in products
          foreignField: '_id', // field in vendor collection
          as: 'vendorDetails'
        }
      },
      {
        $unwind: '$vendorDetails'
      },
      {
        $sort: {
          'vendorPlan.planPrice': -1 // Sorting by planPrice in descending order
        }
      }
    ]);

    if (products.length === 0) {
      return res.status(404).send({ status: 'error', message: 'No Products found' });
    }

    res.send({ status: 'ok', data: products });
  } catch (error) {
    console.error('Error fetching Products:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});


//status update 
app.post('/updateEnquiryStatus', (req, res) => {
  const { enquiryId, status } = req.body;

  Enquiry.findByIdAndUpdate(enquiryId, { status }, { new: true })
      .then((updatedEnquiry) => {
          if (updatedEnquiry) {
              res.json({ status: 'ok', data: updatedEnquiry });
          } else {
              res.json({ status: 'error', message: 'Enquiry not found' });
          }
      })
      .catch((error) => {
          console.error('Error updating enquiry status:', error);
          res.json({ status: 'error', message: error.message });
      });
});


app.post('/submitFeedback', upload.single('image'), async (req, res) => {
  try {
    const { order_id, starRate, Response, Quality, Delivery, feedbackText } = req.body;
    const image = req.file ? req.file.path : null;

    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      order_id,
      {
        starRate,
        Response,
        Quality,
        Delivery,
        feedbackText,
        image,
      },
      { new: true }
    );

    if (!updatedEnquiry) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }

    res.json({ status: 'ok', message: 'Feedback submitted successfully', enquiry: updatedEnquiry });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ status: 'error', message: 'An error occurred' });
  }
});


app.get('/productReviews/:productId', async (req, res) => {
  try {
    const reviews = await Enquiry.find({ product_id: req.params.productId });
    res.json({ status: 'ok', data: reviews });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});


app.post('/uploads', upload.single('file'), (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Use promises instead of callback
      Vendor.insertMany(results)
        .then((result) => {
          res.send(`${result.length} vendors inserted`);
          fs.unlinkSync(req.file.path); // Remove file after processing
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    });
});
// GET route to fetch homepage details by vendorId
app.get('/homepage/:vendorId', async (req, res) => {
  const { vendorId } = req.params;

  try {
    // Find homepage details by vendorId
    const homepageData = await WebsiteSetup.findOne({ vendorId });
    
    if (!homepageData) {
      return res.status(404).json({ message: "No homepage data found for this vendor" });
    }

    // Send the found data
    res.status(200).json(homepageData);
  } catch (error) {
    console.error("Error fetching homepage data: ", error);
    res.status(500).json({ error: "Error fetching homepage data" });
  }
});


app.post('/api/homepage', upload.single('bannerImage'), async (req, res) => {
  const { vendorId, HomepageKey, HomepageDescription } = req.body;
  const bannerImage = req.file ? req.file.path : null; // Path of the uploaded file

  try {
    // Update or create homepage data for the vendor
    let homepageData = await WebsiteSetup.findOne({ vendorId });
    
    if (homepageData) {
      // Update existing homepage data
      homepageData.HomepageKey = HomepageKey;
      homepageData.HomepageDescription = HomepageDescription;
      if (bannerImage) {
        homepageData.bannerImage = bannerImage;
      }
    } else {
      // Create new homepage data if not found
      homepageData = new WebsiteSetup({
        vendorId,
        HomepageKey,
        HomepageDescription,
        bannerImage,
      });
    }

    await homepageData.save();

    res.status(200).json({ message: "Homepage details updated successfully" });
  } catch (error) {
    console.error("Error updating homepage data: ", error);
    res.status(500).json({ error: "Failed to update homepage data" });
  }
});
app.post('/api/aboutpage', upload.single('AboutImage'), async (req, res) => {
  const { vendorId, AboutTitle, AboutDescription } = req.body;

  try {
    let aboutpageData = await WebsiteSetup.findOne({ vendorId });
    
    if (aboutpageData) {
      // Update existing about page data
      aboutpageData.AboutTitle = AboutTitle;
      aboutpageData.AboutDescription = AboutDescription;
      
      if (req.file) {
        aboutpageData.AboutImage = req.file.filename; // Save the uploaded image filename
      }
    } else {
      // Create new about page data if not found
      aboutpageData = new WebsiteSetup({
        vendorId,
        AboutTitle,
        AboutDescription,
        AboutImage: req.file ? req.file.filename : "" // Save the uploaded image filename or leave it empty
      });
    }

    await aboutpageData.save();

    res.status(200).json({ message: "About page details updated successfully" });
  } catch (error) {
    console.error("Error updating about page data: ", error);
    res.status(500).json({ error: "Failed to update about page data" });
  }
});


//get slug business name
  
app.get('/getBusinessSlug/:slug', async (req, res) => {
  const { slug } = req.params;  // Use slug instead of id

  try {
    // Find the vendor by businessSlug instead of by Id
    const businessSlug = await Vendor.findOne({ businessSlug: slug });
    
    if (!businessSlug) {
      return res.status(404).send({ status: 'error', message: 'Business slug not found' });
    }

    res.send({ status: 'ok', data: businessSlug });
  } catch (error) {
    console.error('Error fetching businessSlug:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});
//get 3 product vendor 
app.post("/getVendorThreeProduct", async (req, res) => {
  const { vendorId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).send({ status: "error", message: "Invalid vendor ID format" });
    }

    const products = await Product.find({ vendorId: vendorId }).limit(3);
    if (products.length === 0) {
      return res.status(404).send({ status: 'error', message: 'No products found' });
    }

    res.send({ status: 'ok', data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});
//website setup 
app.post("/getWebsiteDetailsVendor", async (req, res) => {
  const { vendorId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).send({ status: "error", message: "Invalid vendor ID format" });
    }

    const products = await WebsiteSetup.find({ vendorId: vendorId }).limit(3);
    if (products.length === 0) {
      return res.status(404).send({ status: 'error', message: 'No products found' });
    }

    res.send({ status: 'ok', data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send({ status: 'error', message: 'Internal server error' });
  }
});

// add lead  both database
app.post("/addLeadForm", async (req, res) => {
  const { name, email, company_name, data_source } = req.body;

  if (!name || !email || !company_name) {
    return res.status(400).send({
      status: "error",
      message: "Name, email, and company name are required.",
    });
  }

  try {
    console.log("Received lead form data:", req.body);

    // Save to MongoDB
    const mongoResult = await LeadForm.create({
      name,
      email,
      company_name,
      data_source,
    });
    console.log("MongoDB Result:", mongoResult);

    // Ensure MySQL connection is ready
    if (!mysqlConnection) {
      throw new Error("MySQL connection is not established");
    }

    // Save to MySQL
    const mysqlQuery = `
      INSERT INTO \`lead\` (name, email, company_name, data_source)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await mysqlConnection.execute(mysqlQuery, [
      name,
      email,
      company_name,
      data_source,
    ]);
    console.log("MySQL Result:", result);

    res.status(200).send({ status: "ok", message: "Lead added to both databases" });
  } catch (error) {
    console.error("Error adding lead form:", error);
    res.status(500).send({ status: "error", message: "Failed to add lead form" });
  }
});


// Password reset route
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  // Set up Nodemailer transport using Gmail (ensure Gmail app password is used)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'revathid883@gmail.com', // Your Gmail address
      pass: 'aajh zegi lawi gjgc', // App password or OAuth2 credentials
    },
  });

  try {
    // Find the vendor by email
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).send({ message: 'No user found with this email' });
    }

    // Create a password reset token using crypto
    const resetToken = crypto.randomBytes(32).toString('hex');
    vendor.resetPasswordToken = resetToken;
    vendor.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await vendor.save();

    // Construct the reset link
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // Set up the email content
    const mailOptions = {
      from: 'revathid883@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}`,
    };

    // Send the reset email
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send({ message: 'Error sending password reset link', error: error.message });
      }
      console.log('Password reset email sent:', info.response);
      res.status(200).send({ message: 'Password reset link sent to your email' });
    });

  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).send({ message: 'Error sending password reset link', error: error.message });
  }
});
app.post('/verify-token/:token', async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" });
  }

  try {
    const user = await Vendor.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    res.status(200).json({ success: true, message: "Token is valid" });
  } catch (error) {
    console.error("Error during token verification:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});



//get main category 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
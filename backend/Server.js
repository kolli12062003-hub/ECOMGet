require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MONGODB_URI = process.env.MONGODB_URI;

// Email Configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// TEST CONNECTION ON STARTUP
console.log('🔍 Testing email connection...');
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ EMAIL CONNECTION FAILED!');
    console.error('Error:', error.message);
  } else {
    console.log('✅ Email server connected successfully!');
    console.log('   Email: tulasikolli23@gmail.com');
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB Atlas connection error:', err));

// Base User Schema
const baseUserSchema = {
  fullname: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, default: 'active', enum: ['active', 'blocked', 'pending', 'rejected'] },
  phone: { type: String },
  address: { type: String },
  gender: { type: String },
  dateOfBirth: { type: Date },
  addresses: { type: Array, default: [] },
  lastActive: { type: Date, default: Date.now },
  orders: { type: Number, default: 0 },
  products: { type: Array, default: [] },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
};

// Customer Schema
const customerSchema = new mongoose.Schema({
  ...baseUserSchema,
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'Customer' }
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);

// Seller Schema
const sellerSchema = new mongoose.Schema({
  ...baseUserSchema,
  businessName: { type: String, required: true, unique: true },
  businessType: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'Seller' },
  status: { type: String, default: 'pending', enum: ['pending', 'active', 'approved', 'rejected'] },
  earnerEmail: { type: String }, // Track which earner registered this seller
  earnerCommission: { type: Number, default: 0 }, // Commission percentage for the earner
  address: { type: String }, // Vendor shop address
  lat: { type: Number }, // Latitude for geolocation
  lon: { type: Number } // Longitude for geolocation
}, { timestamps: true });

const Seller = mongoose.model('Seller', sellerSchema);

// Admin Schema
const adminSchema = new mongoose.Schema({
  ...baseUserSchema,
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'Admin' }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

// Earner Schema
const earnerSchema = new mongoose.Schema({
  ...baseUserSchema,
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'Earner' }
}, { timestamps: true });

const Earner = mongoose.model('Earner', earnerSchema);

// ============================================
// CART AND WISHLIST SCHEMAS
// ============================================

// Cart Schema
const cartSchema = new mongoose.Schema({
  email: { type: String, required: true },
  role: { type: String, required: true },
  cart: { type: Array, default: [] }
}, { timestamps: true });

// Create compound index for email + role
cartSchema.index({ email: 1, role: 1 }, { unique: true });

const Cart = mongoose.model('Cart', cartSchema);

// Wishlist Schema
const wishlistSchema = new mongoose.Schema({
  email: { type: String, required: true },
  role: { type: String, required: true },
  wishlist: { type: Array, default: [] }
}, { timestamps: true });

// Create compound index for email + role
wishlistSchema.index({ email: 1, role: 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

// ============================================
// PRODUCT AND CATEGORY SCHEMAS
// ============================================

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  status: { type: String, default: 'active', enum: ['active', 'inactive'] }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  vendor: { type: String, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }, // ⭐ ADD THIS LINE
  category: { type: String, required: true },
  subcategory: { type: String },
  image: { type: String },
  lat: { type: Number },
  lon: { type: Number },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected', 'active', 'inactive'] },
  stock: { type: Number, default: 0 },
  description: { type: String },
  type: { type: String },
  warranty: { type: String },
  expiryDate: { type: Date },
  addedBy: { type: String, enum: ['self', 'earner'], default: 'self' }, // Who added the product
  earnerName: { type: String }, // Name of the earner if added by earner
  earnerEmail: { type: String }, // Email of the earner if added by earner
  addedDate: { type: Date, default: Date.now } // Date when product was added
}, { timestamps: true, strict: false });

const Product = mongoose.model('Product', productSchema);

// Branch Schema
const branchSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  isMain: { type: Boolean, default: false }
}, { timestamps: true });

const Branch = mongoose.model('Branch', branchSchema);

// ============================================
// OFFER SCHEMA
// ============================================

// Offer Schema
const offerSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['product', 'seller', 'category', 'global', 'cart']
  },
  targetId: {
    type: String,
    required: true // productId for product offers, sellerName for seller offers, category name for category offers, 'all' for global, 'cart' for cart offers
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed']
  },
  discountValue: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false // Changed to false - offers need approval
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdBy: {
    type: String,
    required: true // 'admin' or seller email
  },
  description: {
    type: String
  }
}, { timestamps: true });

const Offer = mongoose.model('Offer', offerSchema);

// ============================================
// CART AND WISHLIST ROUTES
// ============================================

// Save Cart
app.post('/api/cart/save', async (req, res) => {
  try {
    const { email, role, cart } = req.body;
    console.log('💾 Saving cart for:', email, role);

    if (!email || !role) {
      return res.status(400).json({ message: 'Email and role are required' });
    }

    // Find and update or create new cart
    const updatedCart = await Cart.findOneAndUpdate(
      { email, role },
      { email, role, cart: cart || [] },
      { upsert: true, new: true }
    );

    console.log('✅ Cart saved successfully');
    res.json({ message: 'Cart saved successfully', cart: updatedCart.cart });
  } catch (error) {
    console.error('❌ Error saving cart:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get Cart
app.get('/api/cart/:email/:role', async (req, res) => {
  try {
    const { email, role } = req.params;
    console.log('📥 Fetching cart for:', email, role);

    const cartDoc = await Cart.findOne({ email, role });

    if (!cartDoc) {
      console.log('ℹ️  No cart found, returning empty cart');
      return res.json({ cart: [] });
    }

    console.log('✅ Cart fetched successfully, items:', cartDoc.cart.length);
    res.json({ cart: cartDoc.cart || [] });
  } catch (error) {
    console.error('❌ Error fetching cart:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Save Wishlist
app.post('/api/wishlist/save', async (req, res) => {
  try {
    const { email, role, wishlist } = req.body;
    console.log('💾 Saving wishlist for:', email, role);

    if (!email || !role) {
      return res.status(400).json({ message: 'Email and role are required' });
    }

    // Find and update or create new wishlist
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { email, role },
      { email, role, wishlist: wishlist || [] },
      { upsert: true, new: true }
    );

    console.log('✅ Wishlist saved successfully');
    res.json({ message: 'Wishlist saved successfully', wishlist: updatedWishlist.wishlist });
  } catch (error) {
    console.error('❌ Error saving wishlist:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get Wishlist
app.get('/api/wishlist/:email/:role', async (req, res) => {
  try {
    const { email, role } = req.params;
    console.log('📥 Fetching wishlist for:', email, role);

    const wishlistDoc = await Wishlist.findOne({ email, role });

    if (!wishlistDoc) {
      console.log('ℹ️  No wishlist found, returning empty wishlist');
      return res.json({ wishlist: [] });
    }

    console.log('✅ Wishlist fetched successfully, items:', wishlistDoc.wishlist.length);
    res.json({ wishlist: wishlistDoc.wishlist || [] });
  } catch (error) {
    console.error('❌ Error fetching wishlist:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// ============================================
// API ROUTES
// ============================================

// ============================================
// TEST ENDPOINT
// ============================================
app.get('/api/test-email', async (req, res) => {
  console.log('\n========================================');
  console.log('🧪 EMAIL TEST STARTED');
  console.log('========================================\n');

  try {
    console.log('📧 Sending test email...');
    console.log('   From: tulasikolli23@gmail.com');
    console.log('   To: tulasikolli23@gmail.com');

    const info = await transporter.sendMail({
      from: '"ShopNest Test" <tulasikolli23@gmail.com>',
      to: 'tulasikolli23@gmail.com',
      subject: '🧪 Test Email from ShopNest - ' + new Date().toLocaleTimeString(),
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #4CAF50;">✅ Email Working!</h1>
            <p>Your email configuration is correct!</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>From:</strong> tulasikolli23@gmail.com</p>
          </div>
        </div>
      `
    });

    console.log('\n✅ EMAIL SENT SUCCESSFULLY!');
    console.log('   Message ID:', info.messageId);
    console.log('\n📬 Check inbox: tulasikolli23@gmail.com');
    console.log('========================================\n');

    res.json({
      success: true,
      message: 'Test email sent! Check tulasikolli23@gmail.com',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('\n❌ EMAIL FAILED!');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    console.error('========================================\n');

    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }
});

// ============================================
// AUTH ROUTES
// ============================================

// Register
// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    let { fullname, email, businessName, businessType, password, role, address, lat, lon } = req.body;
    console.log('📝 Registration attempt:', { email, role });

    if (!email || !password || !fullname || !role) {
      return res.status(400).json({ message: 'Fullname, email, password, and role are required' });
    }

    // Normalize inputs
    email = email.trim().toLowerCase();
    if (businessName) businessName = businessName.trim();

    // 1. Check if email exists across ALL user types first
    const [customerExists, sellerExists, adminExists, earnerExists] = await Promise.all([
      Customer.findOne({ email }),
      Seller.findOne({ email }),
      Admin.findOne({ email }),
      Earner.findOne({ email })
    ]);

    if (customerExists || sellerExists || adminExists || earnerExists) {
      console.log('❌ Email already exists:', email);
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;

    if (role.toLowerCase() === 'seller') {
      if (!businessName || !businessType) {
        return res.status(400).json({ message: 'Business name and type are required for sellers' });
      }
      // 2. Now, check for unique business name (case-insensitive)
      const existingBusiness = await Seller.findOne({ businessName: { $regex: `^${businessName}$`, $options: 'i' } });
      if (existingBusiness) {
        console.log('❌ Business name already exists:', businessName);
        return res.status(400).json({ message: 'Business name already exists' });
      }
      // Set status to 'pending' so all sellers require admin approval
      // ✅ FIXED: Include address, lat, lon in seller creation
      newUser = new Seller({ 
        fullname, 
        businessName, 
        businessType, 
        email, 
        password: hashedPassword, 
        status: 'pending',
        address: address || '',
        lat: lat || null,
        lon: lon || null
      });
    } else if (role.toLowerCase() === 'customer') {
      newUser = new Customer({ fullname, email, password: hashedPassword });
    } else if (role.toLowerCase() === 'admin') {
      newUser = new Admin({ fullname, email, password: hashedPassword });
    } else if (role.toLowerCase() === 'earner') {
      newUser = new Earner({ fullname, email, password: hashedPassword });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    await newUser.save();
    console.log('✅ Registered successfully:', email);
    res.status(201).json({ message: `${role} registered successfully` });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// ============================================
// SELLER-SPECIFIC REGISTRATION ROUTE (UPDATED WITH PENDING STATUS)
// ============================================

// Register Seller (specific endpoint for seller registration from EarnerDashboard)
// Register Seller (specific endpoint for seller registration from EarnerDashboard)
app.post('/api/auth/register/seller', async (req, res) => {
  try {
    // ✅ FIXED: Extract address, lat, lon from request body
    let { name, businessName, businessType, email, password, role, earnerEmail, address, lat, lon } = req.body;
    console.log('📝 Seller Registration attempt:', { email, businessName, businessType, earnerEmail });
    console.log('🔍 EarnerEmail received:', earnerEmail);
    console.log('📍 Location data received:', { address, lat, lon }); // ✅ NEW DEBUG LOG

    // Validate required fields
    if (!email || !password || !name || !businessName || !businessType) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, business name, and business type are required'
      });
    }

    // Normalize inputs
    email = email.trim().toLowerCase();
    businessName = businessName.trim();
    name = name.trim();

    // 1. Check if email exists across ALL user types first
    const [customerExists, sellerExists, adminExists, earnerExists] = await Promise.all([
      Customer.findOne({ email }),
      Seller.findOne({ email }),
      Admin.findOne({ email }),
      Earner.findOne({ email })
    ]);

    if (customerExists || sellerExists || adminExists || earnerExists) {
      console.log('❌ Email already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // 2. Check for unique business name (case-insensitive)
    const existingBusiness = await Seller.findOne({
      businessName: { $regex: `^${businessName}$`, $options: 'i' }
    });

    if (existingBusiness) {
      console.log('❌ Business name already exists:', businessName);
      return res.status(400).json({
        success: false,
        message: 'Business name already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ⭐ CREATE SELLER WITH 'PENDING' STATUS + LOCATION DATA
    const newSeller = new Seller({
      fullname: name,
      businessName,
      businessType,
      email,
      password: hashedPassword,
      role: 'Seller',
      status: 'pending', // ⭐ Requires admin approval
      earnerEmail: earnerEmail, // ⭐ Track which earner registered this seller
      // ✅ FIXED: Include location fields
      address: address || '',
      lat: lat || null,
      lon: lon || null
    });

    await newSeller.save();
    console.log('✅ Seller saved with location:', { address: newSeller.address, lat: newSeller.lat, lon: newSeller.lon }); // ✅ NEW DEBUG LOG

    // Send welcome email to seller (inform them approval is pending)
    try {
      const welcomeEmail = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .info-box { background: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎉 Seller Registration Received!</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${name}</strong>,</p>
              <p>Thank you for registering as a seller on ShopNest!</p>
              <div class="info-box">
                <strong>⏳ Registration Pending Approval</strong><br><br>
                Your registration has been submitted successfully. Our admin team will review your application and notify you once it's approved.<br><br>
                Business Name: ${businessName}<br>
                Business Type: ${businessType}<br>
                Email: ${email}<br>
                Registration Date: ${new Date().toLocaleDateString()}<br>
                Status: <strong>Pending Admin Approval</strong>
              </div>
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our admin team will review your application</li>
                <li>You'll receive an email once your account is approved</li>
                <li>After approval, you can login and start adding products</li>
                <li>This process usually takes 1-2 business days</li>
              </ul>
              <p>We'll notify you as soon as your seller account is activated!</p>
            </div>
            <div class="footer">
              <p>© 2025 ShopNest. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: '"ShopNest Seller Registration" <tulasikolli23@gmail.com>',
        to: email,
        subject: '⏳ Seller Registration Received - Pending Approval',
        html: welcomeEmail
      });

      console.log('📧 Welcome email sent to seller:', email);
    } catch (emailError) {
      console.error('❌ Error sending welcome email:', emailError);
      // Don't fail registration if email fails
    }

    // ⭐ NOTIFY ADMINS ABOUT NEW SELLER REGISTRATION REQUEST
    try {
      const admins = await Admin.find();
      const adminEmails = admins.map(admin => admin.email);

      if (adminEmails.length > 0) {
        await transporter.sendMail({
          from: '"ShopNest New Seller Request" <tulasikolli23@gmail.com>',
          to: adminEmails,
          subject: `⏳ New Seller Registration Pending: ${businessName}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
              <div style="background: white; padding: 30px; border-radius: 10px;">
                <h1 style="color: #ff9800;">⏳ New Seller Registration Pending Approval</h1>
                <p>A new seller has registered and is awaiting your approval!</p>
                <div style="background: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; border-radius: 5px; margin: 20px 0;">
                  <strong>Seller Details:</strong><br>
                  Name: ${name}<br>
                  Business Name: ${businessName}<br>
                  Business Type: ${businessType}<br>
                  Email: ${email}<br>
                  Registration Date: ${new Date().toLocaleString()}<br>
                  <strong>Status: PENDING APPROVAL</strong>
                </div>
                <p style="color: #ff9800; font-weight: bold;">⚠️ Action Required: Please review and approve/reject this seller registration</p>
                <center>
                  <a href="http://localhost:3000/admin-earner-management" style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Review Seller Requests</a>
                </center>
              </div>
            </div>
          `
        });
        console.log('📧 Admins notified about new seller registration request');
      }
    } catch (emailError) {
      console.error('❌ Error sending admin notification:', emailError);
    }

    console.log('✅ Seller registered successfully (pending approval):', email);
    res.status(201).json({
      success: true,
      message: 'Seller registration submitted successfully. Please wait for admin approval.',
      seller: {
        id: newSeller._id,
        name: newSeller.fullname,
        businessName: newSeller.businessName,
        businessType: newSeller.businessType,
        email: newSeller.email,
        role: newSeller.role,
        status: newSeller.status // Will be 'pending'
      }
    });

  } catch (error) {
    console.error('❌ Seller registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

// Login - FIXED: All roles now search by email
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log('\n========================================');
    console.log('🔐 LOGIN ATTEMPT');
    console.log('   Email:', email);
    console.log('   Role:', role);
    console.log('========================================');

    let user;

    // ✅ FIXED: All roles now search by EMAIL
    if (role === 'Seller') {
      user = await Seller.findOne({ email });
      console.log('   Searching Seller by email...');
    } else if (role === 'Customer') {
      user = await Customer.findOne({ email });
      console.log('   Searching Customer by email...');
    } else if (role === 'Admin') {
      user = await Admin.findOne({ email });
      console.log('   Searching Admin by email...');
    } else if (role === 'Earner') {
      user = await Earner.findOne({ email });
      console.log('   Searching Earner by email...');
    }

    if (!user) {
      console.log('❌ User not found');
      console.log('========================================\n');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ User found:', user.fullname);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('❌ Invalid password');
      console.log('========================================\n');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Password valid');

    // Prevent sellers from logging in before admin approval
    if (user.role && user.role.toLowerCase() === 'seller') {
      const allowed = ['active', 'approved'];
      if (!user.status || !allowed.includes(user.status.toLowerCase())) {
        console.log('⏳ Seller account not approved yet:', user.email, 'status=', user.status);
        return res.status(403).json({ message: 'Your seller account is pending admin approval' });
      }
    }

    user.lastActive = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    console.log('✅ LOGIN SUCCESSFUL');
    console.log('   User:', user.fullname);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('========================================\n');
        
    res.json({
  user: {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    businessName: user.businessName,
    businessType: user.businessType,
    role: user.role,
    status: user.status,
    // ✅ FIXED: Include location fields for sellers
    ...(user.role === 'Seller' && {
      address: user.address,
      lat: user.lat,
      lon: user.lon
    })
  },
  token
});
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email, role } = req.body;

    console.log('\n========================================');
    console.log('🔑 FORGOT PASSWORD REQUEST');
    console.log('   Email:', email);
    console.log('   Role:', role);
    console.log('========================================\n');

    let user;
    if (role === 'seller') user = await Seller.findOne({ email });
    else if (role === 'customer') user = await Customer.findOne({ email });
    else if (role === 'admin') user = await Admin.findOne({ email });
    else if (role === 'earner') user = await Earner.findOne({ email });

    if (!user) {
      console.log('❌ User not found\n');
      return res.status(404).json({ message: 'No account found with this email' });
    }

    console.log('✅ User found:', user.fullname);

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    console.log('🔐 Token saved');

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          .url-box { background: #f0f0f0; padding: 15px; border-radius: 5px; word-break: break-all; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🔐 Password Reset</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${user.fullname}</strong>,</p>
            <p>We received a request to reset your password for your ShopNest account.</p>
            <p>Click the button below to reset your password:</p>
            <center>
              <a href="${resetUrl}" class="button">Reset Password</a>
            </center>
            <p>Or copy this link:</p>
            <div class="url-box">${resetUrl}</div>
            <p><strong>⏰ This link expires in 1 hour.</strong></p>
            <p>If you didn't request this, ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2025 ShopNest. All rights reserved.</p>
            <p>Sent: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log('📧 Sending email to:', user.email);

    const info = await transporter.sendMail({
      from: '"ShopNest Password Reset" <tulasikolli23@gmail.com>',
      to: user.email,
      subject: '🔐 Reset Your ShopNest Password',
      html: emailHTML
    });

    console.log('\n✅ PASSWORD RESET EMAIL SENT!');
    console.log('   To:', user.email);
    console.log('   Message ID:', info.messageId);
    console.log('========================================\n');

    res.json({ message: 'Password reset link has been sent to your email' });

  } catch (error) {
    console.error('\n❌ FORGOT PASSWORD ERROR');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    console.error('========================================\n');
    res.status(500).json({ message: 'Failed to send email. Check server logs.' });
  }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    let user = await Customer.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) user = await Seller.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) user = await Admin.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) user = await Earner.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });


    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('✅ Password reset successful:', user.email);
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// PRODUCT AND CATEGORY ROUTES
// ============================================

// Seed Food & Dining Category and Products
app.post('/api/seed/food-dining', async (req, res) => {
  try {
    console.log('\n========================================');
    console.log('🌱 SEEDING FOOD & DINING DATA');
    console.log('========================================\n');

    // Create or update category
    const categoryData = {
      name: 'Food & Dining',
      description: 'Delicious food and dining options',
      image: 'food-dining-hero.jpg',
      status: 'active'
    };

    const category = await Category.findOneAndUpdate(
      { name: 'Food & Dining' },
      categoryData,
      { upsert: true, new: true }
    );

    console.log('✅ Category created/updated:', category.name);

    // Product data
    const productsData = [
      { "name": "Pepperoni Pizza", "price": 349, "vendor": "PizzaPalace", "category": "Food & Dining", "subcategory": "Pizza", "image": "Pepperoni Pizza.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 50, "description": "Classic Italian pizza with pepperoni, cheese, and tomato sauce" },
      { "name": "Veggie Burger", "price": 179, "vendor": "BurgerBonanza", "category": "Food & Dining", "subcategory": "Burger", "image": "Veggie Burger.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 30, "description": "Delicious veggie burger with fresh vegetables and special sauce" },
      { "name": "Spaghetti-Carbonara", "price": 279, "vendor": "PastaPlace", "category": "Food & Dining", "subcategory": "Pasta", "image": "Spaghetti Carbonara.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 25, "description": "Creamy spaghetti carbonara with bacon and parmesan cheese" },
      { "name": "Butter Chicken", "price": 399, "vendor": "CurryCorner", "category": "Food & Dining", "subcategory": "Curry", "image": "Butter Chicken.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 20, "description": "Rich and creamy butter chicken curry with aromatic spices" },
      { "name": "California Roll", "price": 649, "vendor": "SushiSpot", "category": "Food & Dining", "subcategory": "Sushi", "image": "California Roll.webp", "lat": 17.4399, "lon": 78.4421, "stock": 15, "description": "Fresh California roll with avocado, crab, and cucumber" },
      { "name": "Club Sandwich", "price": 159, "vendor": "SnackShack", "category": "Food & Dining", "subcategory": "Sandwich", "image": "Club Sandwich.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 40, "description": "Triple-decker club sandwich with chicken, bacon, and veggies" },
      { "name": "Greek Salad", "price": 199, "vendor": "SaladStop", "category": "Food & Dining", "subcategory": "Salad", "image": "Greek Salad.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 35, "description": "Fresh Greek salad with feta cheese, olives, and vegetables" },
      { "name": "BBQ Ribs", "price": 449, "vendor": "GrillGuru", "category": "Food & Dining", "subcategory": "Grilled", "image": "BBQ Ribs.jpeg", "lat": 17.4520, "lon": 78.3870, "stock": 18, "description": "Slow-cooked BBQ ribs with coleslaw and special sauce" },
      { "name": "Tiramisu", "price": 249, "vendor": "DessertDen", "category": "Food & Dining", "subcategory": "Dessert", "image": "Tiramisu.jpeg", "lat": 17.4400, "lon": 78.3850, "stock": 22, "description": "Classic Italian tiramisu with coffee and mascarpone cream" },
      { "name": "South Indian Thali", "price": 229, "vendor": "TasteOfSouth", "category": "Food & Dining", "subcategory": "Thali", "image": "South Indian Thali.jpeg", "lat": 17.4490, "lon": 78.3950, "stock": 28, "description": "Complete South Indian thali with rice, curries, and sides" },
      { "name": "Mutton Rogan Josh", "price": 429, "vendor": "CurryCorner", "category": "Food & Dining", "subcategory": "Curry", "image": "Mutton Rogan Josh.jpeg", "lat": 17.4550, "lon": 78.3920, "stock": 16, "description": "Spicy Kashmiri mutton rogan josh curry" },
      { "name": "Veg Fried Rice", "price": 169, "vendor": "WokToss", "category": "Food & Dining", "subcategory": "Rice", "image": "Veg Fried Rice.jpeg", "lat": 17.4430, "lon": 78.3860, "stock": 45, "description": "Vegetable fried rice with Asian spices and vegetables" },
      { "name": "Steamed Bao Buns", "price": 149, "vendor": "AsianBites", "category": "Food & Dining", "subcategory": "Asian", "image": "Steamed Bao Buns.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 32, "description": "Soft steamed bao buns with savory fillings" },
      { "name": "Shawarma Wrap", "price": 219, "vendor": "MediterraneanMunch", "category": "Food & Dining", "subcategory": "Wrap", "image": "Shawarma Wrap.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 38, "description": "Middle Eastern shawarma wrap with spiced meat and veggies" },
      { "name": "Chocolate Lava Cake", "price": 199, "vendor": "DessertDen", "category": "Food & Dining", "subcategory": "Dessert", "image": "Chocolate Lava Cake.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 25, "description": "Warm chocolate lava cake with molten center" }
    ];

    // Insert products (skip if already exists based on name)
    const insertedProducts = [];
    for (const productData of productsData) {
      const existingProduct = await Product.findOne({ name: productData.name });
      if (!existingProduct) {
        const product = new Product(productData);
        await product.save();
        insertedProducts.push(product);
        console.log('✅ Product inserted:', product.name);
      } else {
        console.log('⏭️  Product already exists:', productData.name);
      }
    }

    console.log('\n========================================');
    console.log('✅ SEEDING COMPLETED');
    console.log('   Category:', category.name);
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

    res.json({
      success: true,
      message: 'Food & Dining data seeded successfully',
      category,
      newProductsCount: insertedProducts.length,
      totalProducts: productsData.length
    });

  } catch (error) {
    console.error('❌ Seeding error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Seed Medicines Category and Products
app.post('/api/seed/medicines', async (req, res) => {
  try {
    console.log('\n========================================');
    console.log('💊 SEEDING MEDICINES DATA');
    console.log('========================================\n');

    // Create or update category
    const categoryData = {
      name: 'Medicines',
      description: 'Health and wellness products',
      image: 'medicine-hero.jpg',
      status: 'active'
    };

    const category = await Category.findOneAndUpdate(
      { name: 'Medicines' },
      categoryData,
      { upsert: true, new: true }
    );

    console.log('✅ Category created/updated:', category.name);

    // Product data - Frontend products (no approval needed)
    const productsData = [
      { "name": "Vitamin D3 2000IU", "price": 49, "vendor": "MediCare Pharmacy", "category": "Medicines", "image": "Vitamin D3 2000IU1.jpeg", "type": "Tablet", "description": "Vitamin D3 2000IU is essential for bone health, immune function, and calcium absorption. Benefits include stronger bones and reduced risk of deficiency. Precautions: Consult a doctor if pregnant, nursing, or on medication.", "lat": 17.4486, "lon": 78.3908, "stock": 50, "status": "active" },
      { "name": "Pain Relief", "price": 129, "vendor": "HealthPlus", "category": "Medicines", "image": "pain relif.jpg", "type": "Capsule", "description": "Pain Relief capsules provide fast relief from headaches, muscle pain, and inflammation. Benefits: Effective pain management without drowsiness. Precautions: Do not exceed recommended dosage; avoid if allergic to NSAIDs.", "lat": 17.4512, "lon": 78.3855, "stock": 50, "status": "active" },
      { "name": "Vitamin C 1000mg", "price": 299, "vendor": "NutriWell", "category": "Medicines", "image": "Vitamin-C-1000-mg-20-tablets-Orange_o.jpg", "type": "Supplement", "description": "Vitamin C 1000mg supplement boosts immunity, collagen production, and antioxidant protection. Benefits: Enhanced immune response and skin health. Precautions: High doses may cause stomach upset; consult a doctor if on blood thinners.", "lat": 17.4421, "lon": 78.3882, "stock": 50, "status": "active" },
      { "name": "Blood Pressure Monitor", "price": 1499, "vendor": "MediTech", "category": "Medicines", "image": "BPMonitor.jpg", "type": "Medical Device", "description": "Blood Pressure Monitor accurately measures systolic and diastolic pressure at home. Benefits: Helps monitor hypertension and prevent complications. Precautions: Ensure proper cuff size; consult a healthcare provider for interpretation.", "lat": 17.4550, "lon": 78.3920, "stock": 50, "status": "active" },
      { "name": "Atorvastatin 10mg", "price": 189, "vendor": "PharmaCare", "category": "Medicines", "image": "Atorvastatin.jpg", "type": "Tablet", "description": "Atorvastatin 10mg lowers cholesterol levels and reduces the risk of cardiovascular disease. Benefits: Reduces LDL cholesterol and triglyceride levels. Precautions: May cause muscle pain; monitor liver function; avoid grapefruit juice.", "lat": 17.4399, "lon": 78.4421, "stock": 50, "status": "active" },
      { "name": "Omeprazole 20mg", "price": 159, "vendor": "MediExpress", "category": "Medicines", "image": "Omeprazole.jpg", "type": "Capsule", "description": "Omeprazole 20mg reduces stomach acid production for acid reflux and ulcers. Benefits: Relieves heartburn and promotes healing. Precautions: Long-term use may affect vitamin B12 absorption; consult a doctor if symptoms persist.", "lat": 17.4455, "lon": 78.3800, "stock": 50, "status": "active" },
      { "name": "Diabetes Test Strips", "price": 799, "vendor": "DiabeCare", "category": "Medicines", "image": "TestStrips.jpg", "type": "Medical Supply", "description": "Diabetes Test Strips measure blood glucose levels for diabetes management. Benefits: Enables self-monitoring and better control. Precautions: Use with a compatible glucometer; store properly to maintain accuracy.", "lat": 17.4480, "lon": 78.3890, "stock": 50, "status": "active" },
      { "name": "Metformin 500mg", "price": 99, "vendor": "HealthFirst", "category": "Medicines", "image": "Metformin.jpg", "type": "Tablet", "description": "Metformin 500mg helps control blood sugar in type 2 diabetes. Benefits: Improves insulin sensitivity and reduces glucose production. Precautions: May cause digestive side effects; monitor kidney function.", "lat": 17.4520, "lon": 78.3870, "stock": 50, "status": "active" },
      { "name": "First Aid Kit", "price": 499, "vendor": "SafeLife", "category": "Medicines", "image": "FirstAidKit.jpg", "type": "Medical Kit", "description": "First Aid Kit contains essential supplies for minor injuries and emergencies. Benefits: Quick response for cuts, burns, and sprains. Precautions: Check expiration dates; restock used items regularly.", "lat": 17.4400, "lon": 78.3850, "stock": 50, "status": "active" },
      { "name": "Ibuprofen 400mg", "price": 79, "vendor": "QuickMeds", "category": "Medicines", "image": "ibprofen 400mg.jpg", "type": "Tablet", "description": "Ibuprofen 400mg relieves pain, fever, and inflammation. Benefits: Effective for arthritis and menstrual cramps. Precautions: Avoid if allergic to NSAIDs; long-term use may increase heart risks.", "lat": 17.4490, "lon": 78.3950, "stock": 50, "status": "active" },
      { "name": "Vitamin D3 1000IU", "price": 349, "vendor": "WellnessPlus", "category": "Medicines", "image": "VitaminD3.jpg", "type": "Supplement", "description": "Vitamin D3 1000IU supports bone density and immune health. Benefits: Prevents rickets and osteomalacia. Precautions: Overdose can cause hypercalcemia; consult a doctor for dosage.", "lat": 17.4550, "lon": 78.3920, "stock": 50, "status": "active" },
      { "name": "Thermometer Digital", "price": 249, "vendor": "HealthGadgets", "category": "Medicines", "image": "Thermometer.jpg", "type": "Medical Device", "description": "Digital Thermometer provides accurate body temperature readings. Benefits: Fast and hygienic measurement. Precautions: Clean after use; ensure battery is functional.", "lat": 17.4430, "lon": 78.3860, "stock": 50, "status": "active" },
      { "name": "Cetirizine 10mg", "price": 59, "vendor": "AllergyCare", "category": "Medicines", "image": "Cetirizine.jpg", "type": "Tablet", "description": "Cetirizine 10mg reduces allergy symptoms like runny nose and itching. Benefits: Non-drowsy antihistamine for hay fever. Precautions: May cause dry mouth; avoid alcohol.", "lat": 17.4500, "lon": 78.3840, "stock": 50, "status": "active" },
      { "name": "Nebulizer Machine", "price": 1899, "vendor": "BreathEasy", "category": "Medicines", "image": "Nebulizer.jpg", "type": "Medical Equipment", "description": "Nebulizer Machine converts liquid medicine into a mist for respiratory treatment. Benefits: Effective for asthma and COPD. Precautions: Clean regularly; use only prescribed medications.", "lat": 17.4470, "lon": 78.3910, "stock": 50, "status": "active" },
      { "name": "Aspirin 75mg", "price": 69, "vendor": "HeartCare", "category": "Medicines", "image": "Aspirin.jpg", "type": "Tablet", "description": "Aspirin 75mg prevents blood clots and reduces the risk of heart attack. Benefits: Anti-platelet action for cardiovascular disease. Precautions: May cause stomach bleeding; not for everyone; consult a doctor.", "lat": 17.4400, "lon": 78.3850, "stock": 50, "status": "active" }
    ];

    // Insert products (skip if already exists based on name)
    const insertedProducts = [];
    for (const productData of productsData) {
      const existingProduct = await Product.findOne({ name: productData.name });
      if (!existingProduct) {
        const product = new Product(productData);
        await product.save();
        insertedProducts.push(product);
        console.log('✅ Product inserted:', product.name);
      } else {
        console.log('⏭️  Product already exists:', productData.name);
      }
    }

    console.log('\n========================================');
    console.log('✅ MEDICINES SEEDING COMPLETED');
    console.log('   Category:', category.name);
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

    res.json({
      success: true,
      message: 'Medicines data seeded successfully',
      category,
      newProductsCount: insertedProducts.length,
      totalProducts: productsData.length
    });

  } catch (error) {
    console.error('❌ Seeding error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Seed Automotive Category and Products
app.post('/api/seed/automotive', async (req, res) => {
  try {
    console.log('\n========================================');
    console.log('🚗 SEEDING AUTOMOTIVE DATA');
    console.log('========================================\n');

    // Create or update category
    const categoryData = {
      name: 'Automotive',
      description: 'Cars, vehicles, and automotive products',
      image: 'automotive-hero.jpg',
      status: 'active'
    };

    const category = await Category.findOneAndUpdate(
      { name: 'Automotive' },
      categoryData,
      { upsert: true, new: true }
    );

    console.log('✅ Category created/updated:', category.name);

    // Product data
    const productsData = [
      { "name": "Toyota Camry", "price": 2500000, "vendor": "Toyota Dealers", "category": "Automotive", "image": "Toyota Camry.jpg", "lat": 17.4486, "lon": 78.3908, "stock": 5, "description": "Reliable sedan with excellent fuel efficiency and comfort" },
      { "name": "Honda Civic", "price": 1800000, "vendor": "Honda Showroom", "category": "Automotive", "image": "Honda Civic.jpg", "lat": 17.4512, "lon": 78.3855, "stock": 8, "description": "Sporty compact car with advanced safety features" },
      { "name": "Ford Mustang", "price": 4500000, "vendor": "Ford Motors", "category": "Automotive", "image": "Ford Mustang.jpg", "lat": 17.4421, "lon": 78.3882, "stock": 3, "description": "Iconic muscle car with powerful V8 engine" },
      { "name": "BMW X5", "price": 6500000, "vendor": "BMW Premium", "category": "Automotive", "image": "BMW X5.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 2, "description": "Luxury SUV with cutting-edge technology and performance" },
      { "name": "Tesla Model 3", "price": 5500000, "vendor": "Tesla Hyderabad", "category": "Automotive", "image": "Tesla Model 3.jpg", "lat": 17.4399, "lon": 78.4421, "stock": 4, "description": "Electric sedan with autopilot and zero emissions" },
      { "name": "Mahindra Scorpio", "price": 1500000, "vendor": "Mahindra Auto", "category": "Automotive", "image": "Mahindra Scorpio.jpg", "lat": 17.4455, "lon": 78.3800, "stock": 10, "description": "Rugged SUV perfect for Indian roads and off-road adventures" },
      { "name": "Hyundai Creta", "price": 1200000, "vendor": "Hyundai Plaza", "category": "Automotive", "image": "Hyundai Creta.jpg", "lat": 17.4480, "lon": 78.3890, "stock": 12, "description": "Compact SUV with modern design and features" },
      { "name": "Audi A6", "price": 6000000, "vendor": "Audi Center", "category": "Automotive", "image": "Audi A6.jpg", "lat": 17.4520, "lon": 78.3870, "stock": 1, "description": "Premium executive sedan with luxury and performance" },
      { "name": "Maruti Suzuki Swift", "price": 600000, "vendor": "Maruti Suzuki", "category": "Automotive", "image": "Maruti Suzuki Swift.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 15, "description": "Affordable hatchback with great mileage and reliability" },
      { "name": "Mercedes-Benz C-Class", "price": 5500000, "vendor": "Mercedes-Benz Hyderabad", "category": "Automotive", "image": "Mercedes-Benz C-Class.jpg", "lat": 17.4490, "lon": 78.3950, "stock": 2, "description": "Luxury sedan combining elegance and advanced technology" },
      { "name": "Kia Seltos", "price": 1100000, "vendor": "Kia Motors", "category": "Automotive", "image": "Kia Seltos.jpg", "lat": 17.4550, "lon": 78.3920, "stock": 9, "description": "Stylish SUV with bold design and smart features" },
      { "name": "Volkswagen Polo", "price": 700000, "vendor": "Volkswagen India", "category": "Automotive", "image": "Volkswagen Polo.jpg", "lat": 17.4430, "lon": 78.3860, "stock": 11, "description": "Compact hatchback with German engineering and comfort" },
      { "name": "Nissan Magnite", "price": 650000, "vendor": "Nissan Showroom", "category": "Automotive", "image": "Nissan Magnite.jpg", "lat": 17.4500, "lon": 78.3840, "stock": 7, "description": "Urban SUV with rugged looks and modern amenities" },
      { "name": "Jeep Compass", "price": 2000000, "vendor": "Jeep India", "category": "Automotive", "image": "Jeep Compass.jpg", "lat": 17.4470, "lon": 78.3910, "stock": 4, "description": "Adventure-ready SUV with 4x4 capability" },
      { "name": "Tata Nexon", "price": 800000, "vendor": "Tata Motors", "category": "Automotive", "image": "Tata Nexon.jpg", "lat": 17.4400, "lon": 78.3850, "stock": 13, "description": "Compact SUV with strong build and connected features" }
    ];

    // Insert products (skip if already exists based on name)
    const insertedProducts = [];
    for (const productData of productsData) {
      const existingProduct = await Product.findOne({ name: productData.name });
      if (!existingProduct) {
        const product = new Product(productData);
        await product.save();
        insertedProducts.push(product);
        console.log('✅ Product inserted:', product.name);
      } else {
        console.log('⏭️  Product already exists:', productData.name);
      }
    }

    console.log('\n========================================');
    console.log('✅ AUTOMOTIVE SEEDING COMPLETED');
    console.log('   Category:', category.name);
    console.log('   New Products:', insertedProducts.length);
    console.log('========================================\n');

    res.json({
      success: true,
      message: 'Automotive data seeded successfully',
      category,
      newProductsCount: insertedProducts.length,
      totalProducts: productsData.length
    });

  } catch (error) {
    console.error('❌ Seeding error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find({ status: 'active' });
    res.json(categories);
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// ============================================
// ADMIN CATEGORY MANAGEMENT ROUTES
// ============================================

// Create category (Admin)
app.post('/api/admin/categories', async (req, res) => {
  try {
    const { name, description, image, status } = req.body;
    console.log('➕ Admin creating category:', name);
    
    const newCategory = new Category({
      name: name.trim(),
      description: description?.trim() || '',
      image: image?.trim() || '',
      status: status || 'active'
    });
    
    await newCategory.save();
    console.log('✅ Category created successfully');
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('❌ Error creating category:', error);
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
});

// Update category (Admin)
app.put('/api/admin/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, status } = req.body;
    console.log('✏️ Admin updating category:', id);
    
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description?.trim() || '',
        image: image?.trim() || '',
        status: status || 'active'
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    console.log('✅ Category updated successfully');
    res.json(updatedCategory);
  } catch (error) {
    console.error('❌ Error updating category:', error);
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
});

// Delete category (Admin)
app.delete('/api/admin/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Admin deleting category:', id);
    
    const deletedCategory = await Category.findByIdAndDelete(id);
    
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Optionally update products in this category to "Uncategorized"
    await Product.updateMany(
      { category: deletedCategory.name },
      { $set: { category: 'Uncategorized' } }
    );
    
    console.log('✅ Category deleted successfully');
    res.json({ message: 'Category deleted successfully', category: deletedCategory });
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
});

// ============================================
// ADMIN PRODUCT MANAGEMENT ROUTES
// ============================================

// Create product (Admin) - with file upload
app.post('/api/admin/products/upload', upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      price,
      vendor,
      category,
      subcategory,
      lat,
      lon,
      stock,
      description,
      warranty,
      expiryDate,
      status
    } = req.body;

    console.log('➕ Admin creating product:', name);

    // Validate required fields
    if (!name || !price || !vendor || !category || stock === undefined) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, price, vendor, category, stock' 
      });
    }

   // ✅ CHANGED: Build product data object
const productData = {
  name: name.trim(),
  price: Number(price),
  category: category.trim(),
  image: image,
  vendor: vendor.trim(),
  sellerId: seller._id, // ⭐ ADD THIS LINE - CRITICAL!
  stock: Number(stock) || 0,
  description: description.trim(),
  status: 'pending' // Seller products need approval
};

    // Add image if uploaded
    if (req.file) {
      productData.image = req.file.filename;
    }
    
    // Add optional location fields
    if (lat) productData.lat = parseFloat(lat);
    if (lon) productData.lon = parseFloat(lon);
    
    // Add optional warranty and expiry date
    if (warranty) productData.warranty = warranty.trim();
    if (expiryDate) productData.expiryDate = new Date(expiryDate);

    const newProduct = new Product(productData);
    await newProduct.save();

    console.log('✅ Admin product created successfully');
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('❌ Error creating admin product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// Update product (Admin) - with file upload
// Update product (Admin) - with file upload
app.put('/api/admin/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      vendor,
      category,
      subcategory,
      lat,
      lon,
      stock,
      description,
      warranty,
      expiryDate,
      status
    } = req.body;

    console.log('✏️ Admin updating product:', id);
    console.log('📦 Request body:', req.body);
    console.log('📷 File uploaded:', req.file ? 'Yes' : 'No');

    // Find existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Prepare update data
    const updateData = {
      name: name.trim(),
      price: parseFloat(price),
      vendor: vendor.trim(),
      category: category.trim(),
      subcategory: subcategory ? subcategory.trim() : undefined,
      stock: parseInt(stock),
      description: description ? description.trim() : '',
      status: status || 'active'
    };

    // Handle image update
    if (req.file) {
      // NEW FILE UPLOADED - delete old and use new
      console.log('🆕 New image uploaded:', req.file.filename);
      if (existingProduct.image && existingProduct.image !== req.file.filename) {
        const oldImagePath = path.join(__dirname, 'uploads', existingProduct.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('🗑️ Old image deleted:', existingProduct.image);
        }
      }
      updateData.image = req.file.filename;
    } else {
      // NO NEW FILE - keep existing image
      console.log('♻️ Keeping existing image:', existingProduct.image);
      updateData.image = existingProduct.image;
    }

    // Update optional location fields
    // Update optional location fields
if (lat !== undefined) {
  updateData.lat = lat && lat !== '' ? parseFloat(lat) : undefined;
} else {
  updateData.lat = existingProduct.lat;
}

if (lon !== undefined) {
  updateData.lon = lon && lon !== '' ? parseFloat(lon) : undefined;
} else {
  updateData.lon = existingProduct.lon;
}

// Update optional warranty and expiry date
if (warranty !== undefined) {
  updateData.warranty = warranty.trim() || undefined;
} else {
  updateData.warranty = existingProduct.warranty;
}

if (expiryDate !== undefined) {
  updateData.expiryDate = expiryDate && expiryDate.trim() !== '' ? new Date(expiryDate) : undefined;
} else {
  updateData.expiryDate = existingProduct.expiryDate;
}
    console.log('💾 Update data:', updateData);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log('✅ Admin product updated successfully');
    res.json(updatedProduct);
  } catch (error) {
    console.error('❌ Error updating admin product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete product (Admin)
app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Admin deleting product:', id);
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete product image if it exists
    if (product.image) {
      const imagePath = path.join(__dirname, 'uploads', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Product.findByIdAndDelete(id);
    
    console.log('✅ Admin product deleted successfully');
    res.json({ message: 'Product deleted successfully', product });
  } catch (error) {
    console.error('❌ Error deleting admin product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// Get subcategories by category (for admin product management)
app.get('/api/products/subcategories', async (req, res) => {
  try {
    const { category } = req.query;
    console.log('📋 Fetching subcategories for category:', category);
    
    let query = {};
    if (category) {
      query.category = category;
    }
    
    // Get distinct subcategories from products
    const subcategories = await Product.distinct('subcategory', query);
    
    // Filter out null/undefined/empty values
    const validSubcategories = subcategories.filter(sub => sub && sub.trim());
    
    console.log('✅ Found', validSubcategories.length, 'subcategories');
    res.json(validSubcategories);
  } catch (error) {
    console.error('❌ Error fetching subcategories:', error);
    res.status(500).json({ message: 'Error fetching subcategories', error: error.message });
  }
});

// Get products by category
app.get('/api/products/category/:categoryName', async (req, res) => {
    try {
        const { categoryName } = req.params;
        const { customerLat, customerLon, maxDistance } = req.query;
        let query;

        if (categoryName.toLowerCase() === 'jewellery') {
            // ✅ FIXED: Proper MongoDB query syntax
            query = {
              category: { $in: ['Jewellery', 'Mens Jewellery', 'Kids Jewellery'] },
              status: { $in: ['active', 'approved'] }
            };
        } else {
            // Show both seeded products (active) and approved seller products
            query = {
              category: { $regex: new RegExp(`^${categoryName}$`, 'i') },
              status: { $in: ['active', 'approved'] }
            };
        }

        console.log('🔍 Fetching products for category:', categoryName);
        console.log('📋 Query:', JSON.stringify(query));

        let products = await Product.find(query);

        // Filter by distance if customer location is provided
        if (customerLat && customerLon && maxDistance) {
            const customerLatNum = parseFloat(customerLat);
            const customerLonNum = parseFloat(customerLon);
            const maxDistanceNum = parseFloat(maxDistance);

            console.log('📍 Filtering products by distance:', { customerLatNum, customerLonNum, maxDistanceNum });

            products = products.filter(product => {
                if (!product.lat || !product.lon) return false;

                const distance = calculateDistance(
                    customerLatNum, customerLonNum,
                    product.lat, product.lon
                );

                return distance <= maxDistanceNum;
            });

            console.log('✅ Found', products.length, 'products within', maxDistanceNum, 'km for category', categoryName);
        } else {
            console.log('✅ Found', products.length, 'products for category', categoryName);
        }

        // Get all active offers
        const offers = await Offer.find({ isActive: true });

        // Apply discounts to products
        const productsWithDiscounts = products.map(product => {
            const productObj = product.toObject();

            // Find applicable offers
            const applicableOffers = offers.filter(offer => {
                if (offer.type === 'global') return true;
                if (offer.type === 'seller' && offer.targetId === product.vendor) return true;
                if (offer.type === 'category' && offer.targetId === product.category) return true;
                if (offer.type === 'product' && offer.targetId === product._id.toString()) return true;
                return false;
            });

            // Calculate the best discount
            let bestDiscount = 0;
            let bestOffer = null;

            applicableOffers.forEach(offer => {
                let discount = 0;
                if (offer.discountType === 'percentage') {
                    discount = (product.price * offer.discountValue) / 100;
                } else {
                    discount = offer.discountValue;
                }

                if (discount > bestDiscount) {
                    bestDiscount = discount;
                    bestOffer = offer;
                }
            });

            // Apply discount
            if (bestDiscount > 0) {
                productObj.originalPrice = product.price;
                productObj.discountedPrice = Math.max(0, product.price - bestDiscount);
                productObj.discountAmount = bestDiscount;
                productObj.discountPercentage = bestOffer.discountType === 'percentage' ?
                    bestOffer.discountValue :
                    Math.round((bestDiscount / product.price) * 100);
                productObj.offerDescription = bestOffer.description;
            } else {
                productObj.discountedPrice = product.price;
            }

            return productObj;
        });

        res.json(productsWithDiscounts);
    } catch (error) {
        console.error('❌ Error fetching products by category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Product (for sellers)
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    // ✅ CHANGED: Added description, warranty, expiryDate, branchId, addedBy, earnerName, earnerEmail
    const { name, price, category, vendor, sellerId, stock, description, warranty, expiryDate, branchId, addedBy, earnerName, earnerEmail } = req.body;
    const image = req.file ? req.file.filename : req.body.image || 'DefaultProduct.png';

    console.log('📦 Creating product:', { name, price, category, vendor, sellerId, stock, description, warranty, expiryDate, branchId, addedBy, earnerName, earnerEmail, image });

    if (!name || !price || !category || !vendor || !sellerId) {
      return res.status(400).json({ message: 'Name, price, category, vendor, and sellerId are required' });
    }

    // ✅ NEW: Validate description
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    // Verify seller exists
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // ✅ NEW: If branchId is provided, verify it belongs to the seller
    // If no branchId is provided, use the main branch coordinates
    let branchCoordinates = null;
    if (branchId) {
      const branch = await Branch.findOne({ _id: branchId, sellerId: seller._id });
      if (!branch) {
        return res.status(400).json({ message: 'Invalid branch selected' });
      }
      branchCoordinates = { lat: branch.lat, lon: branch.lon };
    } else {
      // Use main branch coordinates if no specific branch selected
      const mainBranch = await Branch.findOne({ sellerId: seller._id, isMain: true });
      if (mainBranch) {
        branchCoordinates = { lat: mainBranch.lat, lon: mainBranch.lon };
      }
    }

    // ✅ CHANGED: Build product data object
const productData = {
  name: name.trim(),
  price: Number(price),
  category: category.trim(),
  image: image,
  vendor: vendor.trim(),
  sellerId: seller._id, // ⭐ ADD THIS LINE!
  stock: Number(stock) || 0,
  description: description.trim(),
  status: 'pending', // Seller products need approval
  addedBy: addedBy || 'self',
  addedDate: new Date()
};

    // ✅ NEW: Add earner details if added by earner
    if (addedBy === 'earner') {
      if (!earnerName || !earnerEmail) {
        return res.status(400).json({ message: 'Earner name and email are required when adding by earner' });
      }
      productData.earnerName = earnerName.trim();
      productData.earnerEmail = earnerEmail.trim();
    }

    // ✅ NEW: Add branchId if provided
    if (branchId) {
      productData.branchId = branchId;
    }

    // ✅ NEW: Add optional fields
    if (warranty) {
      productData.warranty = warranty.trim();
    }
    if (expiryDate) {
      productData.expiryDate = new Date(expiryDate);
    }

    // ✅ CHANGED: Use branch coordinates if available (either specific branch or main branch), otherwise use seller coordinates
    if (branchCoordinates) {
      productData.lat = branchCoordinates.lat;
      productData.lon = branchCoordinates.lon;
    } else if (seller.lat !== undefined && seller.lon !== undefined) {
      productData.lat = seller.lat;
      productData.lon = seller.lon;
    } else {
      // Default coordinates for Hyderabad, India (if seller hasn't set location)
      productData.lat = 17.3850;
      productData.lon = 78.4867;
    }

    const product = await Product.create(productData);

    console.log('✅ Product saved with ID:', product._id);
    console.log('Product object:', product.toObject());

    // Send email notification to admin about new pending product
    try {
      const admins = await Admin.find();
      const adminEmails = admins.map(admin => admin.email);

      if (adminEmails.length > 0) {
        await transporter.sendMail({
          from: '"ShopNest New Product" <tulasikolli23@gmail.com>',
          to: adminEmails,
          subject: `📦 New Product Pending Approval: ${product.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
              <div style="background: white; padding: 30px; border-radius: 10px;">
                <h1 style="color: #FF9800;">New Product Pending Approval</h1>
                <p>A new product has been submitted by <strong>${seller.fullname} (${seller.businessName})</strong> and requires your approval.</p>
                <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <strong>Product Details:</strong><br>
                  Name: ${product.name}<br>
                  Category: ${product.category}<br>
                  Vendor: ${product.vendor}<br>
                  Price: ₹${product.price}<br>
                  Stock: ${product.stock}<br>
                  Submitted: ${new Date().toLocaleString()}
                </div>
                <center>
                  <a href="http://localhost:3000/admin/sellers" style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Review Pending Products</a>
                </center>
              </div>
            </div>
          `
        });
        console.log('📧 Admin notified about new pending product');
      }
    } catch (emailError) {
      console.error('❌ Error sending admin notification:', emailError);
    }

    console.log('✅ Product created successfully:', product.name);
    res.status(201).json(product);
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Update Product (for sellers)
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, subcategory, vendor, sellerId, stock, description, warranty, expiryDate, expireDate, addedBy, earnerName, earnerEmail } = req.body;

    console.log('✏️ Seller updating product:', id);
    console.log('📦 Request body:', req.body);
    console.log('📷 File uploaded:', req.file ? 'Yes' : 'No');

    // Find existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify seller owns this product
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    if (existingProduct.sellerId.toString() !== sellerId) {
      return res.status(403).json({ message: 'You do not have permission to edit this product' });
    }

    // Validate required fields
    if (!name || !price || !category || stock === undefined || !description) {
      return res.status(400).json({ message: 'Name, price, category, stock, and description are required' });
    }

    // Prepare update data
    const updateData = {
      name: name.trim(),
      price: Number(price),
      category: category.trim(),
      subcategory: subcategory ? subcategory.trim() : undefined,
      stock: Number(stock),
      description: description.trim(),
      status: 'pending'
    };

    // Handle image update
    if (req.file) {
      console.log('🆕 New image uploaded:', req.file.filename);
      if (existingProduct.image && existingProduct.image !== req.file.filename) {
        const oldImagePath = path.join(__dirname, 'uploads', existingProduct.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('🗑️ Old image deleted:', existingProduct.image);
        }
      }
      updateData.image = req.file.filename;
    } else {
      console.log('♻️ Keeping existing image:', existingProduct.image);
      updateData.image = existingProduct.image;
    }

    // Handle optional fields
    if (warranty !== undefined) {
      updateData.warranty = warranty.trim() || undefined;
    } else {
      updateData.warranty = existingProduct.warranty;
    }

    // Support both expiryDate and expireDate fields
    const dateValue = expiryDate || expireDate;
    if (dateValue !== undefined) {
      updateData.expiryDate = dateValue && dateValue.trim() !== '' ? new Date(dateValue) : undefined;
    } else {
      updateData.expiryDate = existingProduct.expiryDate;
    }

    // Handle addedBy and earner fields
    updateData.addedBy = addedBy || existingProduct.addedBy || 'self';
    if (addedBy === 'earner') {
      if (!earnerName || !earnerEmail) {
        return res.status(400).json({ message: 'Earner name and email are required when adding by earner' });
      }
      updateData.earnerName = earnerName.trim();
      updateData.earnerEmail = earnerEmail.trim();
    } else {
      updateData.earnerName = undefined;
      updateData.earnerEmail = undefined;
    }

    // Keep location from existing product
    updateData.lat = existingProduct.lat;
    updateData.lon = existingProduct.lon;

    console.log('💾 Update data:', updateData);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Notify admin about product edit
    try {
      const admins = await Admin.find();
      const adminEmails = admins.map(admin => admin.email);

      if (adminEmails.length > 0) {
        await transporter.sendMail({
          from: '"ShopNest Product Update" <tulasikolli23@gmail.com>',
          to: adminEmails,
          subject: `📦 Product Updated - Requires Re-Approval: ${updatedProduct.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
              <div style="background: white; padding: 30px; border-radius: 10px;">
                <h1 style="color: #FF9800;">Product Updated - Requires Re-Approval</h1>
                <p>A product has been updated by <strong>${seller.fullname} (${seller.businessName})</strong> and requires your approval.</p>
                <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <strong>Product Details:</strong><br>
                  Name: ${updatedProduct.name}<br>
                  Category: ${updatedProduct.category}<br>
                  Vendor: ${updatedProduct.vendor}<br>
                  Price: ₹${updatedProduct.price}<br>
                  Stock: ${updatedProduct.stock}<br>
                  Updated: ${new Date().toLocaleString()}
                </div>
                <center>
                  <a href="http://localhost:3000/admin/sellers" style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Review Product</a>
                </center>
              </div>
            </div>
          `
        });
        console.log('📧 Admin notified about product update');
      }
    } catch (emailError) {
      console.error('❌ Error sending admin notification:', emailError);
    }

    console.log('✅ Seller product updated successfully (requires re-approval)');
    res.json(updatedProduct);
  } catch (error) {
    console.error('❌ Error updating seller product:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});
// Delete Product (for sellers)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sellerId } = req.body;

    console.log('🗑️ Seller deleting product:', id);

    if (!sellerId) {
      return res.status(400).json({ message: 'sellerId is required' });
    }

    // Find the product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify seller owns this product
    if (product.sellerId.toString() !== sellerId) {
      return res.status(403).json({ message: 'You do not have permission to delete this product' });
    }

    // Delete product image if it exists
    if (product.image) {
      const imagePath = path.join(__dirname, 'uploads', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('🗑️ Product image deleted:', product.image);
      }
    }

    // Delete the product
    await Product.findByIdAndDelete(id);

    console.log('✅ Product deleted successfully by seller');
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// 🔍 DEBUG ENDPOINT - Check seller data
app.get('/api/debug/seller/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log('🔍 DEBUG: Fetching seller data for:', email);
    
    const seller = await Seller.findOne({ email });
    
    if (!seller) {
      return res.json({ 
        found: false, 
        message: 'Seller not found' 
      });
    }
    
    res.json({
      found: true,
      data: {
        email: seller.email,
        fullname: seller.fullname,
        businessName: seller.businessName,
        businessType: seller.businessType,
        address: seller.address || 'NOT SET',
        lat: seller.lat || 'NOT SET',
        lon: seller.lon || 'NOT SET',
        status: seller.status,
        createdAt: seller.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get all products or products by seller, with optional distance filtering
app.get('/api/products', async (req, res) => {
  try {
    const { sellerId, customerLat, customerLon, maxDistance } = req.query;

    if (sellerId) {
      // Get products by seller ID
      console.log('📦 Fetching products for seller:', sellerId);

      // ⭐ CHANGED: Query by sellerId field instead of vendor name
      const products = await Product.find({
        sellerId: sellerId
      }).sort({ createdAt: -1 });

      console.log('✅ Found', products.length, 'products for seller ID:', sellerId);
      res.json(products);
    } else {
      // Get all products with optional distance filtering
      let query = {};
      let products = await Product.find(query).sort({ createdAt: -1 });

      // If customer location is provided, filter by distance
      if (customerLat && customerLon && maxDistance) {
        const customerLatNum = parseFloat(customerLat);
        const customerLonNum = parseFloat(customerLon);
        const maxDistanceNum = parseFloat(maxDistance); // in kilometers

        console.log('📍 Filtering products by distance:', { customerLatNum, customerLonNum, maxDistanceNum });

        // Filter products based on distance
        products = products.filter(product => {
          if (!product.lat || !product.lon) return false;

          const distance = calculateDistance(
            customerLatNum, customerLonNum,
            product.lat, product.lon
          );

          return distance <= maxDistanceNum;
        });

        console.log('✅ Found', products.length, 'products within', maxDistanceNum, 'km');
      } else {
        console.log('✅ Found', products.length, 'total products');
      }

      res.json(products);
    }
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

// ============================================
// OFFER MANAGEMENT ROUTES
// ============================================

// Create Offer
app.post('/api/offers', authenticateToken, async (req, res) => {
  try {
    const { type, targetId, discountType, discountValue, description } = req.body;

    console.log('🎯 Creating offer:', { type, targetId, discountType, discountValue, description, user: req.user });

    if (!type || !discountType || discountValue === undefined) {
      return res.status(400).json({ message: 'Type, discountType, and discountValue are required' });
    }

    // Validate offer type
    if (!['product', 'seller', 'category', 'global', 'cart'].includes(type)) {
      return res.status(400).json({ message: 'Invalid offer type. Must be product, seller, category, global, or cart' });
    }

    // Validate discount type
    if (!['percentage', 'fixed'].includes(discountType)) {
      return res.status(400).json({ message: 'Invalid discount type. Must be percentage or fixed' });
    }

    // Validate discount value
    if (discountValue <= 0) {
      return res.status(400).json({ message: 'Discount value must be greater than 0' });
    }

    // For percentage discounts, ensure it's not over 100%
    if (discountType === 'percentage' && discountValue > 100) {
      return res.status(400).json({ message: 'Percentage discount cannot exceed 100%' });
    }

    let finalTargetId = targetId;
    let createdBy = req.user.role === 'Admin' ? 'admin' : req.user.email;

    // Additional validation based on type and user role
    if (type === 'product') {
      // Check if product exists
      const product = await Product.findById(targetId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      // Check if user owns the product (for sellers) or is admin
      if (req.user.role === 'Seller' && product.sellerId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'You can only create offers for your own products' });
      }
    } else if (type === 'seller') {
      // For seller offers, only allow the seller to create offers for themselves
      if (req.user.role === 'Seller') {
        const seller = await Seller.findById(req.user.userId);
        if (!seller) {
          return res.status(404).json({ message: 'Seller not found' });
        }
        finalTargetId = seller.businessName;
      } else if (req.user.role === 'Admin') {
        // Admin can create for any seller
        const seller = await Seller.findOne({ businessName: targetId });
        if (!seller) {
          return res.status(404).json({ message: 'Seller not found' });
        }
      } else {
        return res.status(403).json({ message: 'Only sellers and admins can create seller offers' });
      }
    } else if (type === 'category') {
      // Only admin can create category offers
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Only admins can create category offers' });
      }
      // Check if category exists
      const category = await Category.findOne({ name: targetId, status: 'active' });
      if (!category) {
        return res.status(404).json({ message: 'Category not found or inactive' });
      }
    } else if (type === 'global') {
      // Only admin can create global offers
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Only admins can create global offers' });
      }
      // For global offers, targetId should be 'all'
      if (targetId !== 'all') {
        return res.status(400).json({ message: 'For global offers, targetId must be "all"' });
      }
    } else if (type === 'cart') {
      // Only admin can create cart offers
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Only admins can create cart offers' });
      }
      // For cart offers, targetId should be 'cart'
      if (targetId !== 'cart') {
        return res.status(400).json({ message: 'For cart offers, targetId must be "cart"' });
      }
    }

    // Determine initial status based on who created the offer
    const initialStatus = req.user.role === 'Admin' ? 'approved' : 'pending';
    const initialIsActive = req.user.role === 'Admin' ? true : false;

    const offer = new Offer({
      type,
      targetId: finalTargetId,
      discountType,
      discountValue,
      description: description || '',
      createdBy,
      status: initialStatus,
      isActive: initialIsActive
    });

    await offer.save();

    console.log('✅ Offer created successfully:', offer._id);
    res.status(201).json({
      message: 'Offer created successfully',
      offer
    });
  } catch (error) {
    console.error('❌ Error creating offer:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get all offers
app.get('/api/offers', authenticateToken, async (req, res) => {
  try {
    let offers;
    if (req.user.role === 'Admin') {
      offers = await Offer.find().sort({ createdAt: -1 });
    } else {
      offers = await Offer.find({ createdBy: req.user.email }).sort({ createdAt: -1 });
    }
    console.log('✅ Found', offers.length, 'offers');
    res.json(offers);
  } catch (error) {
    console.error('❌ Error fetching offers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update offer status (activate/deactivate)
app.put('/api/offers/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('🔄 Updating offer:', id, updateData);

    // Find the offer
    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    // Check permissions
    if (req.user.role !== 'Admin' && offer.createdBy !== req.user.email) {
      return res.status(403).json({ message: 'You can only edit your own offers' });
    }

    // For non-admin, only allow updating certain fields, and status remains pending
    if (req.user.role !== 'Admin') {
      updateData.status = 'pending';
      updateData.isActive = false;
    }

    const updatedOffer = await Offer.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    console.log('✅ Offer updated successfully');
    res.json({
      message: 'Offer updated successfully',
      offer: updatedOffer
    });
  } catch (error) {
    console.error('❌ Error updating offer:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Delete offer
app.delete('/api/offers/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Deleting offer:', id);

    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    // Check permissions
    if (req.user.role !== 'Admin' && offer.createdBy !== req.user.email) {
      return res.status(403).json({ message: 'You can only delete your own offers' });
    }

    await Offer.findByIdAndDelete(id);

    console.log('✅ Offer deleted successfully');
    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting offer:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Approve/Reject Offer
app.put('/api/offers/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    console.log('🔄 Updating offer status:', id, 'status:', status);

    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only admins can approve or reject offers' });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const updateData = {
      status,
      isActive: status === 'approved'
    };

    const offer = await Offer.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    console.log('✅ Offer status updated successfully');
    res.json({
      message: `Offer ${status} successfully`,
      offer
    });
  } catch (error) {
    console.error('❌ Error updating offer status:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

// Get all products for admin management
app.get('/api/admin/products', async (req, res) => {
  try {
    console.log('📦 Fetching all products for admin');

    // Get all products (including pending ones for admin review)
    const products = await Product.find().sort({ createdAt: -1 });

    console.log('✅ Found', products.length, 'total products');
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get all users for admin management
app.get('/api/admin/users', async (req, res) => {
  try {
    console.log('👥 Fetching all users for admin');

    // Fetch users from all collections
    const [customers, sellers, admins, earners] = await Promise.all([
      Customer.find().sort({ createdAt: -1 }),
      Seller.find().sort({ createdAt: -1 }),
      Admin.find().sort({ createdAt: -1 }),
      Earner.find().sort({ createdAt: -1 })
    ]);

    // Combine all users into a single array with role information
    const allUsers = [
      ...customers.map(user => ({ ...user.toObject(), role: 'Customer' })),
      ...sellers.map(user => ({ ...user.toObject(), role: 'Seller' })),
      ...admins.map(user => ({ ...user.toObject(), role: 'Admin' })),
      ...earners.map(user => ({ ...user.toObject(), role: 'Earner' }))
    ];

    // Sort by creation date (most recent first)
    allUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log('✅ Found', allUsers.length, 'total users');
    res.json(allUsers);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get all sellers for admin management
app.get('/api/admin/sellers', async (req, res) => {
  try {
    console.log('👥 Fetching all sellers for admin');

    const sellers = await Seller.find().sort({ createdAt: -1 });

    console.log('✅ Found', sellers.length, 'sellers');
    res.json(sellers);
  } catch (error) {
    console.error('❌ Error fetching sellers:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get pending sellers for admin management
app.get('/api/admin/pending-sellers', async (req, res) => {
  try {
    console.log('👥 Fetching pending sellers for admin');

    const pendingSellers = await Seller.find({ status: 'pending' }).sort({ createdAt: -1 });

    console.log('✅ Found', pendingSellers.length, 'pending sellers');
    res.json(pendingSellers);
  } catch (error) {
    console.error('❌ Error fetching pending sellers:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get all sellers for admin management (alternative endpoint)
app.get('/api/admin/all-sellers', async (req, res) => {
  try {
    console.log('👥 Fetching all sellers for admin (all-sellers endpoint)');

    const allSellers = await Seller.find().sort({ createdAt: -1 });

    console.log('✅ Found', allSellers.length, 'total sellers');
    res.json(allSellers);
  } catch (error) {
    console.error('❌ Error fetching all sellers:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get pending products for admin approval
app.get('/api/admin/pending-products', async (req, res) => {
  try {
    console.log('📦 Fetching pending products for admin approval');

    const pendingProducts = await Product.find({ status: 'pending' }).sort({ createdAt: -1 });

    console.log('✅ Found', pendingProducts.length, 'pending products');
    res.json(pendingProducts);
  } catch (error) {
    console.error('❌ Error fetching pending products:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Update product status (approve/reject)
app.put('/api/admin/products/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    console.log('🔄 Updating product status:', id, 'to', status);

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        status: status,
        ...(status === 'rejected' && rejectionReason && { rejectionReason })
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If approved, notify the seller
    if (status === 'approved') {
      try {
        const seller = await Seller.findOne({ businessName: product.vendor });
        if (seller) {
          await transporter.sendMail({
            from: '"ShopNest Product Approval" <tulasikolli23@gmail.com>',
            to: seller.email,
            subject: '✅ Your Product Has Been Approved!',
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
                <div style="background: white; padding: 30px; border-radius: 10px;">
                  <h1 style="color: #4CAF50;">🎉 Product Approved!</h1>
                  <p>Great news! Your product has been approved and is now live on ShopNest.</p>
                  <div style="background: #e8f5e8; padding: 15px; border-left: 4px solid #4CAF50; border-radius: 5px; margin: 20px 0;">
                    <strong>Product Details:</strong><br>
                    Name: ${product.name}<br>
                    Category: ${product.category}<br>
                    Price: ₹${product.price}<br>
                    Approved: ${new Date().toLocaleString()}
                  </div>
                  <p>You can now start receiving orders for this product!</p>
                </div>
              </div>
            `
          });
          console.log('📧 Seller notified about product approval');
        }
      } catch (emailError) {
        console.error('❌ Error sending approval notification:', emailError);
      }
    }

    console.log('✅ Product status updated successfully');
    res.json({
      message: `Product ${status} successfully`,
      product
    });
  } catch (error) {
    console.error('❌ Error updating product status:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get products by seller ID for admin
app.get('/api/admin/sellers/:id/products', async (req, res) => {
  try {
    const { id } = req.params;

    console.log('📦 Fetching products for seller:', id);

    // First, find the seller to get their business name
    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Find all products by this seller (including pending ones)
    const products = await Product.find({
      vendor: seller.businessName
    }).sort({ createdAt: -1 });

    console.log('✅ Found', products.length, 'products for seller:', seller.businessName);
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching seller products:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Debug endpoint to check products with earners
app.get('/api/debug/earner-products', async (req, res) => {
  try {
    const products = await Product.find({ addedBy: 'earner' }).limit(10);
    res.json({
      count: products.length,
      products: products.map(p => ({
        id: p._id,
        name: p.name,
        addedBy: p.addedBy,
        earnerEmail: p.earnerEmail,
        earnerName: p.earnerName,
        addedDate: p.addedDate,
        sellerId: p.sellerId
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product earners data for admin
app.get('/api/admin/product-earners', async (req, res) => {
  try {
    console.log('📊 Fetching product earners data');

    // First, check how many products have addedBy: 'earner'
    const totalEarnerProducts = await Product.countDocuments({ addedBy: 'earner' });
    console.log('Total products with addedBy: earner:', totalEarnerProducts);

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log('Date range:', today, 'to', tomorrow);

    // Aggregate products added by earners today
    const earnersData = await Product.aggregate([
      {
        $match: {
          addedBy: 'earner'
          // Temporarily remove date filter for testing
          // addedDate: {
          //   $gte: today,
          //   $lt: tomorrow
          // }
        }
      },
      {
        $lookup: {
          from: 'sellers',
          localField: 'sellerId',
          foreignField: '_id',
          as: 'seller'
        }
      },
      {
        $unwind: {
          path: '$seller',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          'seller': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: {
            sellerId: '$sellerId',
            sellerName: '$seller.businessName',
            earnerEmail: '$earnerEmail',
            date: { $dateToString: { format: "%Y-%m-%d", date: "$addedDate" } }
          },
          productCount: { $sum: 1 },
          productNames: { $push: '$name' }
        }
      },
      {
        $project: {
          _id: 0,
          sellerId: '$_id.sellerId',
          sellerName: '$_id.sellerName',
          earnerEmail: '$_id.earnerEmail',
          date: '$_id.date',
          productCount: 1,
          productNames: 1
        }
      },
      {
        $sort: { date: -1, sellerName: 1, earnerEmail: 1 }
      }
    ]);

    console.log('✅ Found', earnersData.length, 'earner records');
    console.log('Data:', JSON.stringify(earnersData, null, 2));

    // Return both the data and debug info
    res.json({
      earners: earnersData,
      debug: {
        totalEarnerProducts,
        dateRange: { today, tomorrow }
      }
    });
  } catch (error) {
    console.error('❌ Error fetching product earners:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Approve seller
app.put('/api/admin/sellers/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;

    console.log('✅ Approving seller:', id);

    const seller = await Seller.findByIdAndUpdate(
      id,
      { status: 'active' },
      { new: true }
    );

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Notify seller about approval
    try {
      const subject = '🎉 Your Seller Account Has Been Approved!';
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #4CAF50;">Welcome to ShopNest!</h1>
            <p>Congratulations! Your seller account has been approved.</p>
            <div style="background: #e8f5e8; padding: 15px; border-left: 4px solid #4CAF50; border-radius: 5px; margin: 20px 0;">
              <strong>Account Details:</strong><br>
              Business Name: ${seller.businessName}<br>
              Business Type: ${seller.businessType}<br>
              Email: ${seller.email}<br>
              Approved: ${new Date().toLocaleString()}
            </div>
            <p>You can now login and start adding products to your store!</p>
            <center>
              <a href="http://localhost:3000/login" style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Account</a>
            </center>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: '"ShopNest Admin" <tulasikolli23@gmail.com>',
        to: seller.email,
        subject,
        html
      });
      console.log('📧 Seller notified about approval');
    } catch (emailError) {
      console.error('❌ Error sending approval notification:', emailError);
    }

    console.log('✅ Seller approved successfully');
    res.json({
      message: 'Seller approved successfully',
      seller
    });
  } catch (error) {
    console.error('❌ Error approving seller:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Reject seller
app.put('/api/admin/sellers/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    console.log('❌ Rejecting seller:', id);

    const seller = await Seller.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }
    );

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Notify seller about rejection
    try {
      const subject = '❌ Seller Account Application Update';
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #ff9800;">Account Status Update</h1>
            <p>We regret to inform you that your seller account application has been reviewed and is currently not approved.</p>
            ${rejectionReason ? `<div style="background: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; border-radius: 5px; margin: 20px 0;"><strong>Reason:</strong><br>${rejectionReason}</div>` : ''}
            <div style="background: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; border-radius: 5px; margin: 20px 0;">
              <strong>Application Details:</strong><br>
              Business Name: ${seller.businessName}<br>
              Business Type: ${seller.businessType}<br>
              Email: ${seller.email}<br>
              Status: Rejected<br>
              Date: ${new Date().toLocaleString()}
            </div>
            <p>You may reapply in the future or contact our support team for more information.</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: '"ShopNest Admin" <tulasikolli23@gmail.com>',
        to: seller.email,
        subject,
        html
      });
      console.log('📧 Seller notified about rejection');
    } catch (emailError) {
      console.error('❌ Error sending rejection notification:', emailError);
    }

    console.log('✅ Seller rejected successfully');
    res.json({
      message: 'Seller rejected successfully',
      seller
    });
  } catch (error) {
    console.error('❌ Error rejecting seller:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Update seller status (approve/reject seller accounts)
app.put('/api/admin/sellers/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('🔄 Updating seller status:', id, 'to', status);

    if (!['pending', 'active', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const seller = await Seller.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Notify seller about status change
    try {
      let subject, html;
      if (status === 'active' || status === 'approved') {
        subject = '🎉 Your Seller Account Has Been Approved!';
        html = `
          <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
            <div style="background: white; padding: 30px; border-radius: 10px;">
              <h1 style="color: #4CAF50;">Welcome to ShopNest!</h1>
              <p>Congratulations! Your seller account has been approved.</p>
              <div style="background: #e8f5e8; padding: 15px; border-left: 4px solid #4CAF50; border-radius: 5px; margin: 20px 0;">
                <strong>Account Details:</strong><br>
                Business Name: ${seller.businessName}<br>
                Business Type: ${seller.businessType}<br>
                Email: ${seller.email}<br>
                Approved: ${new Date().toLocaleString()}
              </div>
              <p>You can now login and start adding products to your store!</p>
              <center>
                <a href="http://localhost:3000/login" style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Account</a>
              </center>
            </div>
          </div>
        `;
      } else if (status === 'rejected') {
        subject = '❌ Seller Account Application Update';
        html = `
          <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
            <div style="background: white; padding: 30px; border-radius: 10px;">
              <h1 style="color: #ff9800;">Account Status Update</h1>
              <p>We regret to inform you that your seller account application has been reviewed and is currently not approved.</p>
              <div style="background: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; border-radius: 5px; margin: 20px 0;">
                <strong>Application Details:</strong><br>
                Business Name: ${seller.businessName}<br>
                Business Type: ${seller.businessType}<br>
                Email: ${seller.email}<br>
                Status: Rejected<br>
                Date: ${new Date().toLocaleString()}
              </div>
              <p>You may reapply in the future or contact our support team for more information.</p>
            </div>
          </div>
        `;
      }

      if (subject && html) {
        await transporter.sendMail({
          from: '"ShopNest Admin" <tulasikolli23@gmail.com>',
          to: seller.email,
          subject,
          html
        });
        console.log('📧 Seller notified about status change');
      }
    } catch (emailError) {
      console.error('❌ Error sending status notification:', emailError);
    }

    console.log('✅ Seller status updated successfully');
    res.json({
      message: `Seller ${status} successfully`,
      seller
    });
  } catch (error) {
    console.error('❌ Error updating seller status:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Delete seller
app.delete('/api/admin/sellers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Deleting seller:', id);

    // First, find the seller to get their business name for cleanup
    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const businessName = seller.businessName;

    // Delete all products associated with this seller
    const deletedProducts = await Product.deleteMany({ vendor: businessName });
    console.log(`🗑️ Deleted ${deletedProducts.deletedCount} products for seller: ${businessName}`);

    // Delete the seller
    await Seller.findByIdAndDelete(id);

    console.log('✅ Seller deleted successfully');
    res.json({
      message: 'Seller and all associated products deleted successfully',
      deletedProductsCount: deletedProducts.deletedCount
    });
  } catch (error) {
    console.error('❌ Error deleting seller:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Update user (Admin)
app.put('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('✏️ Admin updating user:', id, updateData);

    // Find the user to determine their role
    let user;
    let Model;

    // Try to find in each collection
    user = await Customer.findById(id);
    if (user) {
      Model = Customer;
    } else {
      user = await Seller.findById(id);
      if (user) {
        Model = Seller;
      } else {
        user = await Admin.findById(id);
        if (user) {
          Model = Admin;
        } else {
          user = await Earner.findById(id);
          if (user) {
            Model = Earner;
          }
        }
      }
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare update data
    const finalUpdateData = {};

    // Handle status updates (block/unblock)
    if (updateData.status) {
      finalUpdateData.status = updateData.status;
    }

    // Handle profile updates
    if (updateData.fullname) finalUpdateData.fullname = updateData.fullname;
    if (updateData.email) finalUpdateData.email = updateData.email;
    if (updateData.phone !== undefined) finalUpdateData.phone = updateData.phone;
    if (updateData.address !== undefined) finalUpdateData.address = updateData.address;

    // Handle seller-specific fields
    if (user.role === 'Seller' || Model === Seller) {
      if (updateData.businessName !== undefined) finalUpdateData.businessName = updateData.businessName;
      if (updateData.businessType !== undefined) finalUpdateData.businessType = updateData.businessType;
      // Update coordinates if provided
      if (updateData.lat !== undefined) finalUpdateData.lat = updateData.lat;
      if (updateData.lon !== undefined) finalUpdateData.lon = updateData.lon;
    }

    const updatedUser = await Model.findByIdAndUpdate(id, finalUpdateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If seller and location updated, update product coordinates
    if ((user.role === 'Seller' || Model === Seller) && (updateData.lat !== undefined || updateData.lon !== undefined)) {
      await Product.updateMany(
        { vendor: updatedUser.businessName },
        {
          lat: updateData.lat !== undefined ? updateData.lat : updatedUser.lat,
          lon: updateData.lon !== undefined ? updateData.lon : updatedUser.lon
        }
      );
      console.log(`✅ Updated location coordinates for all products by seller: ${updatedUser.businessName}`);
    }

    console.log('✅ Admin user updated successfully');
    res.json({
      message: 'User updated successfully',
      user: {
        _id: updatedUser._id,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        phone: updatedUser.phone,
        address: updatedUser.address,
        ...(updatedUser.role === 'Seller' && {
          businessName: updatedUser.businessName,
          businessType: updatedUser.businessType,
          lat: updatedUser.lat,
          lon: updatedUser.lon
        })
      }
    });
  } catch (error) {
    console.error('❌ Error updating admin user:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Delete user (Customer, Admin, Earner, Seller)
app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    console.log('🗑️ Deleting user:', id, 'Role:', role);

    if (!role) {
      return res.status(400).json({ message: 'Role is required to delete user' });
    }

    let user;
    let collectionName;

    // Find and delete user based on role
    if (role === 'Customer') {
      user = await Customer.findByIdAndDelete(id);
      collectionName = 'Customer';
    } else if (role === 'Admin') {
      user = await Admin.findByIdAndDelete(id);
      collectionName = 'Admin';
    } else if (role === 'Seller') {
      // Handle seller deletion with product cleanup
      user = await Seller.findById(id);
      if (user) {
        const businessName = user.businessName;
        // Delete all products associated with this seller
        const deletedProducts = await Product.deleteMany({ vendor: businessName });
        console.log(`🗑️ Deleted ${deletedProducts.deletedCount} products for seller: ${businessName}`);
        // Delete the seller
        user = await Seller.findByIdAndDelete(id);
      }
      collectionName = 'Seller';
    } else if (role === 'Earner') {
      user = await Earner.findByIdAndDelete(id);
      collectionName = 'Earner';
    } else {
      return res.status(400).json({ message: 'Invalid role. Must be Customer, Admin, Seller, or Earner' });
    }

    if (!user) {
      return res.status(404).json({ message: `${collectionName} not found` });
    }

    // If deleting a customer, also clean up their cart and wishlist
    if (role === 'Customer') {
      await Cart.deleteMany({ email: user.email });
      await Wishlist.deleteMany({ email: user.email });
      console.log(`🗑️ Deleted cart and wishlist for customer: ${user.email}`);
    }

    console.log(`✅ ${collectionName} deleted successfully:`, user.email);
    res.json({
      message: `${collectionName} deleted successfully`,
      deletedUser: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: role
      }
    });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get seller registration count for earner
app.get('/api/earner/seller-registrations/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log('📊 Fetching seller registration count for earner:', email);

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Count only approved/active sellers registered by this earner
    const count = await Seller.countDocuments({
      earnerEmail: email,
      status: { $in: ['active', 'approved'] }
    });

    console.log('✅ Found', count, 'approved sellers registered by earner:', email);
    res.json({ count });
  } catch (error) {
    console.error('❌ Error fetching seller registration count:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get seller profile
app.get('/api/seller/profile', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.json(seller);
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update seller profile
app.post('/api/seller/profile/update', async (req, res) => {
  try {
    const { email, businessName, businessType, address, lat, lon } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const seller = await Seller.findOneAndUpdate(
      { email },
      { businessName, businessType, address, lat, lon },
      { new: true }
    );

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Update all products by this seller with the new location coordinates
    if (lat !== undefined && lon !== undefined) {
      await Product.updateMany(
        { vendor: seller.businessName },
        { lat: lat, lon: lon }
      );
      console.log(`✅ Updated location coordinates for all products by seller: ${seller.businessName}`);
    }

    res.json({ message: 'Profile updated successfully', seller });
  } catch (error) {
    console.error('Error updating seller profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// BRANCH MANAGEMENT ROUTES
// ============================================

// Get all branches for a seller
app.get('/api/seller/branches', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const branches = await Branch.find({ sellerId: seller._id }).sort({ createdAt: -1 });
    res.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new branch
app.post('/api/seller/branches', async (req, res) => {
  try {
    const { email, name, address, lat, lon, isMain } = req.body;
    if (!email || !name || !address || lat === undefined || lon === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Check if coordinates are already used by another branch of this seller
    const existingBranch = await Branch.findOne({
      sellerId: seller._id,
      lat: parseFloat(lat),
      lon: parseFloat(lon)
    });
    if (existingBranch) {
      return res.status(400).json({ message: 'A branch already exists at these coordinates. Please choose different coordinates.' });
    }

    // If this is the main branch, unset other main branches
    if (isMain) {
      await Branch.updateMany({ sellerId: seller._id }, { isMain: false });
    }

    const branch = new Branch({
      sellerId: seller._id,
      name,
      address,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      isMain
    });

    await branch.save();
    res.json({ message: 'Branch added successfully', branch });
  } catch (error) {
    console.error('Error adding branch:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a branch
app.put('/api/seller/branches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, address, lat, lon, isMain } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const branch = await Branch.findOne({ _id: id, sellerId: seller._id });
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Check if coordinates are already used by another branch of this seller (excluding current branch)
    if (lat !== undefined && lon !== undefined) {
      const existingBranch = await Branch.findOne({
        sellerId: seller._id,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        _id: { $ne: id }
      });
      if (existingBranch) {
        return res.status(400).json({ message: 'A branch already exists at these coordinates. Please choose different coordinates.' });
      }
    }

    // If this is being set as main branch, unset other main branches
    if (isMain) {
      await Branch.updateMany({ sellerId: seller._id, _id: { $ne: id } }, { isMain: false });
    }

    branch.name = name || branch.name;
    branch.address = address || branch.address;
    branch.lat = lat !== undefined ? parseFloat(lat) : branch.lat;
    branch.lon = lon !== undefined ? parseFloat(lon) : branch.lon;
    branch.isMain = isMain !== undefined ? isMain : branch.isMain;

    await branch.save();
    res.json({ message: 'Branch updated successfully', branch });
  } catch (error) {
    console.error('Error updating branch:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a branch
app.delete('/api/seller/branches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const branch = await Branch.findOneAndDelete({ _id: id, sellerId: seller._id });
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Remove branch reference from products
    await Product.updateMany({ branchId: id }, { $unset: { branchId: 1 } });

    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Error deleting branch:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// ADMIN PROFILE MANAGEMENT ROUTES
// ============================================

// Admin endpoint to update any user profile (Customer, Seller, Admin, Earner)
app.post('/api/admin/profile/update', async (req, res) => {
  try {
    const { userId, email, role, profile } = req.body;
    if (!userId || !email || !role || !profile) {
      return res.status(400).json({ message: 'userId, email, role, and profile data are required' });
    }

    let Model;
    if (role === 'Customer') {
      Model = Customer;
    } else if (role === 'Seller') {
      Model = Seller;
    } else if (role === 'Admin') {
      Model = Admin;
    } else if (role === 'Earner') {
      Model = Earner;
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Prepare update data
    const updateData = {
      fullname: profile.name,
      phone: profile.phone,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined
    };

    // Handle addresses based on role
    if (role === 'Earner') {
      updateData.address = profile.address;
    } else {
      updateData.addresses = profile.addresses;
    }

    // Add seller-specific fields if role is Seller
    if (role === 'Seller') {
      updateData.businessName = profile.businessName;
      updateData.businessType = profile.businessType;
      updateData.address = profile.address;
      updateData.lat = profile.lat;
      updateData.lon = profile.lon;
    }

    const user = await Model.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If seller profile updated, also update product coordinates
    if (role === 'Seller' && (profile.lat !== undefined || profile.lon !== undefined)) {
      await Product.updateMany(
        { vendor: user.businessName },
        {
          lat: profile.lat || user.lat,
          lon: profile.lon || user.lon
        }
      );
      console.log(`✅ Updated location coordinates for all products by seller: ${user.businessName}`);
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        fullname: user.fullname,
        email: user.email,
        phone: user.phone || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth || '',
        addresses: user.addresses || [],
        // Include seller-specific fields
        ...(role === 'Seller' && {
          businessName: user.businessName,
          businessType: user.businessType,
          address: user.address,
          lat: user.lat,
          lon: user.lon
        })
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// ============================================
// CUSTOMER PROFILE ROUTES
// ============================================

// Get customer profile
app.get('/api/profile', async (req, res) => {
  try {
    const { email, role } = req.query;
    if (!email || !role) {
      return res.status(400).json({ message: 'Email and role are required' });
    }

    let user;
    if (role === 'Customer') {
      user = await Customer.findOne({ email });
    } else if (role === 'Admin') {
      user = await Admin.findOne({ email });
    } else if (role === 'Seller') {
      user = await Seller.findOne({ email });
    } else if (role === 'Earner') {
      user = await Earner.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        fullname: user.fullname,
        email: user.email,
        phone: user.phone || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth || '',
        addresses: user.addresses || [],
        ...(role === 'Seller' && {
          businessName: user.businessName,
          businessType: user.businessType,
          address: user.address,
          lat: user.lat,
          lon: user.lon
        })
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update customer profile
app.post('/api/profile/update', async (req, res) => {
  try {
    const { email, role, profile } = req.body;
    if (!email || !role || !profile) {
      return res.status(400).json({ message: 'Email, role, and profile data are required' });
    }

    let Model;
    if (role === 'Customer') {
      Model = Customer;
    } else if (role === 'Admin') {
      Model = Admin;
    } else if (role === 'Seller') {
      Model = Seller;
    } else if (role === 'Earner') {
      Model = Earner;
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const updateData = {
      fullname: profile.name,
      phone: profile.phone,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined,
      addresses: profile.addresses
    };

    // For sellers, include business-specific fields
    if (role === 'Seller') {
      updateData.businessName = profile.businessName;
      updateData.businessType = profile.businessType;
      updateData.address = profile.address;
      updateData.lat = profile.lat;
      updateData.lon = profile.lon;
    }

    const user = await Model.findOneAndUpdate(
      { email },
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        fullname: user.fullname,
        email: user.email,
        phone: user.phone || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth || '',
        addresses: user.addresses || [],
        ...(role === 'Seller' && {
          businessName: user.businessName,
          businessType: user.businessType,
          address: user.address,
          lat: user.lat,
          lon: user.lon
        })
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log('========================================\n');
});
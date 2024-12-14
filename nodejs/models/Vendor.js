const mongoose = require('mongoose');
const slugify = require('slugify');

const VendorSchema = new mongoose.Schema({
    fname: String,
    email: { type: String, unique: true },
    number: String,
    businessName: String,
    lname: String,
    alterEmail: String,
    alterNumber: String,
    whatsappNumber: String,
    jobTitle: String,
    password: String,
    resetPasswordToken: String, // For password reset functionality
    resetPasswordExpires: Date, // Token expiration time
    businessSlug: { type: String, unique: true },  // Add slug field
    
    OfficeContact: String,
    FaxNumber: String,
    Ownership: String,
    AnnualTakeover: String,
    establishment: String,
    NoEmployee: String,
    selectType: String,
    Address: String,
    City: String,
    State: String,
    Country: String,
    Pincode: String
}, { collection: 'vendor' });

// Pre-save hook to generate slug
VendorSchema.pre('save', async function(next) {
    if (this.isModified('businessName') || this.isNew) {
        this.businessSlug = slugify(this.businessName, { lower: true, strict: true });

        // Check if the slug is unique, append a number if necessary
        let existingVendor = await mongoose.model('Vendor').findOne({ businessSlug: this.businessSlug });
        let slugModifier = 1;
        
        // If a vendor with the same slug exists, modify the slug
        while (existingVendor) {
            this.businessSlug = slugify(this.businessName, { lower: true, strict: true }) + '-' + slugModifier;
            slugModifier++;
            existingVendor = await mongoose.model('Vendor').findOne({ businessSlug: this.businessSlug });
        }
    }
    next();
});

module.exports = mongoose.model('Vendor', VendorSchema);

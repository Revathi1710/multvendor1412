const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  smalldescription: { type: String, required: true },
  description: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  image: { type: String },
  galleryimage1: { type: String },
  galleryimage2: { type: String },
  galleryimage3: { type: String },
  galleryimage4: { type: String },
  active: { type: Boolean, default: true },
 feature: { type: Boolean, default: false},
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Maincategory', required: true }, 
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true }// Reference to Category schema// Ensure the category field is included and required
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

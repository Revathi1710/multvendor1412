const categorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  active: { type: Boolean, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  mainCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Maincategory', required: true }, // Reference to Maincategory
  image: { type: String, required: false },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

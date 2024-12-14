const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EnquirySchema = new mongoose.Schema({
    productname: { type: String, required: true },
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    UserNumber: { type: String, required: true },
    Username: { type: String, required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    productPrice: { type: String, required: true },
    status:{type:String},
    starRate:{type:String},
    Response:{type:String},
    Quality:{type:String},
    Delivery:{type:String},
    image:{type:String}
  });
  

const Enquiry = mongoose.model('Enquiry', EnquirySchema);

module.exports = Enquiry;

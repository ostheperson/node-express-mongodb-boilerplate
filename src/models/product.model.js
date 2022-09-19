const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { toJSON } = require('./plugins');

const productSchema = new Schema({
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: String,
    images: [String],
    price: {
        type: mongoose.Types.Decimal128, 
        default: 0.00, 
    },
    quantity: Number
}, {
    timestamps: true,
    toJSON: { getters: true },
});

productSchema.plugin(toJSON);

const Product = mongoose.model("Product", productSchema);

module.exports = {
    Product
};

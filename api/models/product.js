const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { 
        type: String,
        minlength: 2,
        required: true
    },
    price: { 
        type: Number,
        min: 0,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);
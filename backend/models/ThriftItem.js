import mongoose from "mongoose";

const thriftItemSchema = new mongoose.Schema(
    {
        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        image_url: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['available', 'sold'],
            default: 'available',
        },
        buyer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const ThriftItem = mongoose.model("ThriftItem", thriftItemSchema);
export default ThriftItem;

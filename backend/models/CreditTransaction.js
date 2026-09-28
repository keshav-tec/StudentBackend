import mongoose from "mongoose";


const creditTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["earned", "spent", "bonus", "refund"],
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const CreditTransaction = mongoose.model(
  "CreditTransaction",
  creditTransactionSchema
);

export default CreditTransaction;
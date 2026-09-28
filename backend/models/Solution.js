import mongoose from "mongoose";

const solutionSchema = new mongoose.Schema(
  {
    doubtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doubt",
      required: true,
    },

    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    solutionText: {
      type: String,
      required: true,
    },

    attachments: [String],

    solutionType: {
      type: String,
      enum: ["text", "video", "document"],
      default: "text",
    },

    studentViewed: {
      type: Boolean,
      default: false,
    },

    viewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Solution = mongoose.model("Solution", solutionSchema);

export default Solution;
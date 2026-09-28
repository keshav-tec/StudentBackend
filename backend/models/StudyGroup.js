import mongoose from "mongoose";

const studyGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      default: "",
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    maxMembers: {
      type: Number,
      default: 20,
      min: 2,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const StudyGroup = mongoose.model("StudyGroup", studyGroupSchema);

export default StudyGroup;
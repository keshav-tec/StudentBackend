import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    inputType: {
      type: String,
      enum: ["text", "voice"],
      default: "text",
    },

    question: {
  type: String,
  required: false,
  default: "",
  trim: true,
},

    audioUrl: {
      type: String,
      default: "",
    },

    speechToText: {
      transcript: {
        type: String,
        default: "",
      },

      languageCode: {
        type: String,
        default: "",
      },

      model: {
        type: String,
        default: "",
      },

      requestId: {
        type: String,
        default: "",
      },

      processedAt: {
        type: Date,
        default: null,
      },
    },

    subject: {
      type: String,
      default: "",
    },

    topic: {
      type: String,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    tags: {
      type: [String],
      default: [],
    },

    aiAnalysis: {
      isValidAcademicQuestion: {
        type: Boolean,
        default: false,
      },

      category: {
        type: String,
        default: "",
      },

      subTopic: {
        type: String,
        default: "",
      },

      confidence: {
        type: Number,
        default: 0,
        min: 0,
        max: 1,
      },

      explanation: {
        type: String,
        default: "",
      },

      processedAt: {
        type: Date,
        default: null,
      },
    },

    status: {
      type: String,
      enum: [
        "pending",
        "transcribing",
        "ai_processing",
        "validated",
        "rejected",
        "matched",
        "booked",
        "resolved",
        "closed",
      ],
      default: "pending",
    },

    selectedTutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Doubt = mongoose.model("Doubt", doubtSchema);

export default Doubt;
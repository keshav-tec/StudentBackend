import mongoose from "mongoose";

const tutorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    subjects: {
      type: [String],
      default: [],
    },

    topics: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    availability: {
      type: [
        {
          day: {
            type: String,
            enum: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
          },
          startTime: {
            type: String,
            default: "",
          },
          endTime: {
            type: String,
            default: "",
          },
        },
      ],
      default: [],
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    sessionsCompleted: {
      type: Number,
      default: 0,
    },

    verifiedSubjects: {
      type: [String],
      default: [],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const TutorProfile = mongoose.model(
  "TutorProfile",
  tutorProfileSchema
);

export default TutorProfile;
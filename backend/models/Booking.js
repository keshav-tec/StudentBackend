import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doubtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doubt",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    meetingLink: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ],
      default: "pending",
    },

    creditsUsed: {
      type: Number,
      default: 0,
    },

    sessionNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
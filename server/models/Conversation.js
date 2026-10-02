const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: String,
    messages: [{ role: String, text: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
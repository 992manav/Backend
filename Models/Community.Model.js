import mongoose, { Schema } from "mongoose";

const DiscussionSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  CommunityName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const CommunityDiscussion = mongoose.model(
  "CommunityDiscussion",
  DiscussionSchema
);

export default CommunityDiscussion;
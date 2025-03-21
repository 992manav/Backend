import CommunityDiscussion from "../Models/Community.Model.js";

// Get discussions by community name
async function getDiscussionsByCommunity(req, res) {
  try {
    const { communityName } = req.params;
    const discussions = await CommunityDiscussion.find({
      CommunityName: communityName,
    }).populate("patient");
    res.status(200).json({ success: true, discussions });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch discussions",
      error: error.message,
    });
  }
}

async function setNewDisussion(req, res) {
  try {
    const patient = req.user._id;
    const { communityName } = req.params;
    const { title, content } = req.body;
    console.log(req.body);
    console.log(communityName);
    const newDiscussion = new CommunityDiscussion({
      patient,
      CommunityName: communityName,
      title,
      content,
    });
    await newDiscussion.save();
    res.status(200).json({ success: true, newDiscussion });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create new discussion",
      error: error.message,
    });
  }
}

export { getDiscussionsByCommunity, setNewDisussion };
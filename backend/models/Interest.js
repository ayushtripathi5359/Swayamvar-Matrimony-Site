const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  receiverProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'accepted', 'declined', 'withdrawn'],
    default: 'sent'
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  responseMessage: {
    type: String,
    maxlength: [500, 'Response message cannot exceed 500 characters']
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: Date,
  expiresAt: {
    type: Date,
    default: function() {
      // Interest expires after 30 days if not responded
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  priority: {
    type: String,
    enum: ['normal', 'high', 'premium'],
    default: 'normal'
  }
}, {
  timestamps: true
});

// Compound indexes
interestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });
interestSchema.index({ receiverId: 1, status: 1 });
interestSchema.index({ senderId: 1, status: 1 });
interestSchema.index({ sentAt: -1 });
interestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save middleware
interestSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status !== 'sent') {
    this.respondedAt = new Date();
  }
  
  if (this.isModified('isRead') && this.isRead) {
    this.readAt = new Date();
  }
  
  next();
});

// Static method to get interest statistics
interestSchema.statics.getStats = async function(userId) {
  const stats = await this.aggregate([
    {
      $facet: {
        sent: [
          { $match: { senderId: mongoose.Types.ObjectId(userId) } },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ],
        received: [
          { $match: { receiverId: mongoose.Types.ObjectId(userId) } },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]
      }
    }
  ]);
  
  return stats[0];
};

// Method to check if interest can be sent
interestSchema.statics.canSendInterest = async function(senderId, receiverId) {
  // Check if interest already exists
  const existingInterest = await this.findOne({
    senderId,
    receiverId,
    status: { $in: ['sent', 'accepted'] }
  });
  
  if (existingInterest) {
    return { canSend: false, reason: 'Interest already sent or accepted' };
  }
  
  // Check if receiver has sent interest to sender
  const reverseInterest = await this.findOne({
    senderId: receiverId,
    receiverId: senderId,
    status: { $in: ['sent', 'accepted'] }
  });
  
  if (reverseInterest) {
    return { canSend: true, mutualInterest: true };
  }
  
  return { canSend: true, mutualInterest: false };
};

module.exports = mongoose.model('Interest', interestSchema);
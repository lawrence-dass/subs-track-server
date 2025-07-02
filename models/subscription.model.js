import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subscription name is required'],
    trim: true,
    minLength: 2,
    maxLength: 100,
  },
  price: {
    type: Number,
    required: [true, 'Subscription price is required'],
    min: [0, 'Price must be 0 or greater']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  category: {
    type: String,
    required: true,
  },
  websiteUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Allow empty string or valid URL
        if (!v) return true;
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Please provide a valid URL'
    }
  },
  startDate: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    trim: true,
  },
  isTrial: {
    type: Boolean,
    default: false
  },
  trialInfo: {
    trialDuration: {
      type: Number,
      default: 30
    },
    trialDurationUnit: {
      type: String,
      enum: ['days', 'weeks', 'months'],
      default: 'days'
    },
    trialEndDate: {
      type: String,
      default: ""
    },
    postTrialPrice: {
      type: Number,
      default: 0
    },
    autoConvertToRegular: {
      type: Boolean,
      default: true
    },
    reminderSent: {
      type: Boolean,
      default: false
    },
    cancellationDate: {
      type: Date,
      default: null
    }
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  }
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
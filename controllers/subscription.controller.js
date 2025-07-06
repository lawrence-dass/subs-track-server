import Subscription from '../models/subscription.model.js';
import { workflowClient } from '../config/upstash.js';
import { SERVER_URL, NODE_ENV } from '../config/env.js';

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    let workflowRunId = null;

    // Only trigger workflow in production (skip in development)
    if (NODE_ENV === 'production') {
      try {
        const workflowResponse = await workflowClient.trigger({
          url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
          body: {
            subscriptionId: subscription.id,
          },
          headers: {
            'content-type': 'application/json',
          },
          retries: 0,
        });
        workflowRunId = workflowResponse.workflowRunId;
      } catch (workflowError) {
        console.error('Workflow trigger failed:', workflowError.message);
        // Don't fail the subscription creation if workflow fails
      }
    } else {
      console.log(
        'Development mode: Skipping workflow trigger for subscription',
        subscription.id
      );
    }

    res
      .status(201)
      .json({ success: true, data: { subscription, workflowRunId } });
  } catch (e) {
    next(e);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    // Check if the user is the same as the one in the token
    if (req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }
    const subscriptions = await Subscription.find({ user: req.params.id });
    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
};

export const editSubscription = async (req, res, next) => {
  try {
    const subscriptionId = req.params.id;

    // Find the subscription and check ownership
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      const error = new Error('Subscription not found');
      error.status = 404;
      throw error;
    }

    // Check if the user owns this subscription
    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error(
        'You are not authorized to edit this subscription'
      );
      error.status = 403;
      throw error;
    }

    // Update the subscription with provided data
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: updatedSubscription,
    });
  } catch (e) {
    next(e);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const subscriptionId = req.params.id;

    // Find the subscription and check ownership
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      const error = new Error('Subscription not found');
      error.status = 404;
      throw error;
    }

    // Check if the user owns this subscription
    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error(
        'You are not authorized to cancel this subscription'
      );
      error.status = 403;
      throw error;
    }

    // Check if subscription is already cancelled
    if (subscription.status === 'cancelled') {
      const error = new Error('Subscription is already cancelled');
      error.status = 400;
      throw error;
    }

    // Update subscription status to cancelled and set cancellation date if it's a trial
    const updateData = { status: 'cancelled' };
    if (subscription.isTrial && subscription.trialInfo) {
      updateData['trialInfo.cancellationDate'] = new Date();
    }

    const cancelledSubscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: cancelledSubscription,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const subscriptionId = req.params.id;

    // Find the subscription and check ownership
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      const error = new Error('Subscription not found');
      error.status = 404;
      throw error;
    }

    // Check if the user owns this subscription
    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error(
        'You are not authorized to delete this subscription'
      );
      error.status = 403;
      throw error;
    }

    // Delete the subscription
    await Subscription.findByIdAndDelete(subscriptionId);

    res.status(200).json({
      success: true,
      message: 'Subscription deleted successfully',
      data: { deletedSubscriptionId: subscriptionId },
    });
  } catch (e) {
    next(e);
  }
};

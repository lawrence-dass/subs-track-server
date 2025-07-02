import Subscription from '../models/subscription.model.js'
import { workflowClient } from '../config/upstash.js'
import { SERVER_URL, NODE_ENV } from '../config/env.js'

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
      console.log('Development mode: Skipping workflow trigger for subscription', subscription.id);
    }

    res.status(201).json({ success: true, data: { subscription, workflowRunId } });
  } catch (e) {
    next(e);
  }
}

export const getUserSubscriptions = async (req, res, next) => {
  console.log('getUserSubscriptions triggered');
  try {
    // Check if the user is the same as the one in the token
    if(req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }
    console.log('req.params.id', req.params.id);
    const subscriptions = await Subscription.find({ user: req.params.id });
    console.log('subscriptions', subscriptions);
    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
}
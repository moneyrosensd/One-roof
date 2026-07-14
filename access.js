// One place that decides "can this person post right now" — used by any
// route that should be gated by the trial/subscription.
export function hasActiveAccess(user) {
  if (!user) return false;
  if (user.subscriptionStatus === "active") return true;
  if (user.subscriptionStatus === "trialing" && user.trialEndsAt && new Date() < new Date(user.trialEndsAt)) {
    return true;
  }
  return false;
}

export function daysLeftInTrial(user) {
  if (!user?.trialEndsAt) return 0;
  const ms = new Date(user.trialEndsAt) - new Date();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

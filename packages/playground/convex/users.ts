import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const store = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .first();

    if (!user) {
      const userId = await ctx.db.insert('users', {
        name: args.name,
        email: args.email,
        clerkId: args.clerkId,
        lastLoginAt: Date.now(),
      });
      return userId;
    }

    return user._id;
  },
});

export const getUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .first();
    return user;
  },
});

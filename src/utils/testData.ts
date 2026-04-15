/**
 * Test data loaded from environment variables.
 * dotenv loads .env from the project root so all process.env values
 * are available both in tests and in utility modules.
 *
 * To set up locally: copy .env.sample to .env and fill in the real values.
 */
import 'dotenv/config';

export type UserType =
  | 'standard_user'
  | 'locked_out_user'
  | 'problem_user'
  | 'performance_glitch_user'
  | 'error_user'
  | 'visual_user';

export interface UserCredentials {
  username: string;
  password: string;
}

const password = process.env.SAUCE_PASSWORD ?? '';

export const users: Record<UserType, UserCredentials> = {
  standard_user:           { username: process.env.SAUCE_USER_STANDARD     ?? 'standard_user',           password },
  locked_out_user:         { username: process.env.SAUCE_USER_LOCKED       ?? 'locked_out_user',         password },
  problem_user:            { username: process.env.SAUCE_USER_PROBLEM      ?? 'problem_user',            password },
  performance_glitch_user: { username: process.env.SAUCE_USER_PERFORMANCE  ?? 'performance_glitch_user', password },
  error_user:              { username: process.env.SAUCE_USER_ERROR        ?? 'error_user',              password },
  visual_user:             { username: process.env.SAUCE_USER_VISUAL       ?? 'visual_user',             password },
};

/** Default user for flows that require a logged-in state */
export const defaultUser: UserCredentials = users.standard_user;

/** Checkout form data used across checkout tests */
export const checkoutInfo = {
  firstName: 'John',
  lastName: 'Doe',
  zipCode: '12345',
};

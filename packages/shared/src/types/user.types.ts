/**
 * Two access levels:
 * - `admin` — manages sites and their embed scripts, creates manager accounts.
 *   Has no access to conversations.
 * - `manager` — works conversations for exactly one site (`siteId`). Sees only
 *   that site's chats, ratings, and colleagues.
 */
export type UserRole = "admin" | "manager";

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  /** Always null for `admin`; the manager's assigned site for `manager`. */
  siteId: string | null;
}

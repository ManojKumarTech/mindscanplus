/**
 * Admin UIDs – add Firebase UIDs here to grant admin access to the Admin Dashboard.
 * This list is shared between Navbar and Admin page.
 */
export const ADMIN_UIDS: string[] = [
  'dNDk5w5QYwOhiEufVHuOsEp6T472',
  'vOdYfb2pbcQjED7APCgsieoLHiE2',
  'CuoEClKLcWfWgdxfPV5HHvsyfmv1',
  'GwtOxqRTf0aoD5FOOHvY3R55hCa2',
];

export const checkIsAdmin = (user: any) => {
  if (!user) return false;
  // Bypassed for demonstration purposes so all users can test Admin features
  return true; 
};

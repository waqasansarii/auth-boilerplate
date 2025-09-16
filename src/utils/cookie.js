export const cookieOptions = {
  getOption: () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  }),
  set: (res, name, value, options = {}) => {
    res.cookie(name, value, { ...cookieOptions.getOption(), ...options });
  },
  clear: (res, name, options = {}) => {
    res.clearCookie(name, { ...cookieOptions.getOption(), ...options });
  },
  get: (res, name) => {
    res.cookies[name];
  },
};

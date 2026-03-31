export const routePaths = {
  home: "/",
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password/:resetPasswordCode",
  invalidPage: "/invalid-page",
  signup: "/signup",
  profile: "/profile",
  settings: "/settings",
  users: {
    list: "/users",
    create: "/users/create",
    edit: "/users/edit/:id",
  },
  countries: {
    list: "/countries",
    create: "/countries/create",
    edit: "/countries/edit/:id",
  },
  states: {
    list: "/states",
    create: "/states/create",
    edit: "/states/edit/:id",
  },
  cities: {
    list: "/cities",
    create: "/cities/create",
    edit: "/cities/edit/:id",
  },
  tasks: {
    list: "/tasks",
    create: "/tasks/create",
    edit: "/tasks/edit/:id",
  },
} as const;

import e from "express";
import { User } from "../models/user.js";
import warpAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import {
  login,
  logout,
  renderLoginForm,
  renderSignupForm,
  signup,
} from "../controllers/users.js";

const router = e.Router();

// Singup render route and signup post route
router
  .route("/signup")
  .get(warpAsync(renderSignupForm))
  .post(warpAsync(signup));

// Login render route and login post route
router
  .route("/login")
  .get(renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    login
  );

router.get("/logout", logout);

export default router;

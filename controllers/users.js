import e from "express";
import { User } from "../models/user.js";
import warpAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";


const renderSignupForm = async (req, res) => {
    res.render("users/signup.ejs");
  };

const signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      // console.log(username, email, password);

      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);

      // console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash(
          "success",
          "Welcome " + req.user.username + " to Urban Stay Hub"
        );
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", "🚫 An account with this username already exists");
      res.redirect("/signup");
    }
  };

const renderLoginForm =  (req, res) => {
    res.render("users/login.ejs");
  };

const login = (req, res) => {
    req.flash("success", "Welcome " + req.user.username + " to Urban Stay Hub");
    res.redirect(res.locals.redirectUrl || "/listings");
  };

const logout = (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You're now logged out. See you next time!");
      res.redirect("/listings");
    });
  };

export { renderSignupForm, signup , renderLoginForm, login ,logout};
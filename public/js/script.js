import { validation } from "./validation.js";
import { date } from "./date.js";
import * as views from "./views.js";
import { top } from "./top.js";

validation.init();
date.year();
views.iframes();
views.version();
top.init();

Handlebars.registerHelper("if_eq", function (a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

Handlebars.registerHelper("increment", function (index) {
  return index + 1;
});
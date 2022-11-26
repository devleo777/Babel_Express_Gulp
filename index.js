import express from "express";
import dotenv from "dotenv";
import http from "http";
import fs from "fs";
import logger from "morgan";
import { Binary } from "mongodb";
import multipart from "connect-multiparty";
import { router } from "./routes/index.js";
import bodyParser from "body-parser";
import stream from "stream";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "express-openid-connect";
import dbConnect from "./lib/dbConnect.js";
import Task from "./models/Task.js";

const { auth, requiresAuth } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var multipartMiddleware = multipart();

dotenv.load();

const app = express();

await dbConnect();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(multipartMiddleware);
app.use(bodyParser.urlencoded({extended: true}));

const config = {
    authRequired: true,
    auth0Logout: true,
    baseURL: "https://tasks.jmfcool.com",
};

const port = process.env.PORT || 3000;

if (
    !process.env.BASE_URL &&
    process.env.PORT &&
    process.env.NODE_ENV === undefined
) {
    config.baseURL = `http://localhost:${port}`;
}

// Auth0 routes
app.use(auth(config));

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
    res.locals.user = req.oidc.user;
    next();
});

app.use("/", router);

app.put("/tasks", requiresAuth(), (req, res) => {
    const _id = req.body.id;
    const userId = req.oidc.user.sub.split("|")[1];
    const file = req.files.uploadFile;

    Task.findOneAndUpdate(
      { userId, _id },
      {
        ...req.body,
        ...(file && {
          file: new Binary(fs.readFileSync(file.path)),
          filename: file.name,
        }),
      }
    )
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Task with id=${_id}. Maybe Task was not found!`,
          });
        } else {
          res.send({
            message: "Task was updated successfully!",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not update Task with id=" + _id,
        });
      });
});

app.get("/download", requiresAuth(), async function (req, res) {
  const _id = req.query.id;
  const userId = req.oidc.user.sub.split("|")[1];
  try {
    const doc = await Task.findOne({
      _id,
      userId,
    });
    const fileName = doc?.filename;
    if (fileName) {
      const fileContents = Buffer.from(doc?.file, "base64");
      const readStream = new stream.PassThrough();
      readStream.end(fileContents);
      res.set("Content-disposition", "attachment; filename=" + fileName);
      res.set("Content-Type", "text/plain");
      readStream.pipe(res);
    } else {
      res.status(404).json({ success: false });
    }
  } catch (error) {
    res.status(400).json({ success: false });
  }
});

app.put("/position", requiresAuth(), (req, res) => {
    const userId = req.oidc.user.sub.split("|")[1];
    const promises = [];
    for (const data of req.body) {
        promises.push(Task.findOneAndUpdate({userId, _id: data['id']}, {$set: data}))
    }
    Promise.all(promises)
        .then((data) => {
            if (!data) {
                res.status(404).send(data);
            } else {
                res.send({
                    message: "Task was updated successfully!",
                });
            }
        })
        .catch((err) => {
            console.log("err", err);
            res.status(500).send(err);
        });

});

app.post("/tasks", requiresAuth(), async (req, res) => {
    const userId = req.oidc.user.sub.split("|")[1];
    try {
        const data = await Task.create({
            ...req.body,
            userId,
        }); /* create a new model in the database */
        res.status(201).json({success: true, data});
    } catch (error) {
        res.status(400).json({success: false});
    }
});

app.delete("/tasks", requiresAuth(), (req, res) => {
    const _id = req.body.id;
    const userId = req.oidc.user.sub.split("|")[1];

    Task.findOneAndUpdate({userId, _id}, {isDeleted: true})
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Task with id=${_id}. Maybe Task was not found!`,
                });
            } else {
                res.send({
                    message: "Task was deleted successfully!",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Task with id=" + _id,
            });
        });
});

app.get("/tasks", requiresAuth(), async function (req, res) {
    const userId = req.oidc.user.sub.split("|")[1];
    try {
        const data = await Task.find({
            userId,
        }); /* find all the data in our database */
        res.status(200).json({success: true, data});
    } catch (error) {
        res.status(400).json({success: false});
    }
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// Error handlers
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: process.env.NODE_ENV !== "production" ? err : {},
    });
});

http.createServer(app).listen(port, () => {
    console.log(`Listening on ${config.baseURL}`);
});

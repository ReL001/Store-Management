import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// app.get("/api/users", (req, res) => {
//   res.send("hello users");
// });

import userRouter from "./routes/user.routes.js";
import orderRouter from "./routes/order.routes.js";

app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

export { app }; //export the app object to make it available to other modules.

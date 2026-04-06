const exp = require("express");
const bodyParser = require("body-parser");
const auth_routes = require("./routes/auth");
const user_routes = require("./routes/users");
const txn_routes = require("./routes/transactions");

const app = exp();
app.use(bodyParser.json());
app.use("/api/auth", auth_routes);
app.use("/api/users", user_routes);
app.use("/api/transactions", txn_routes);
app.get("/", (req, res) => res.json({ message: "Finance Backend API running" }));
app.listen(3000, () => console.log("Server running on port 3000")):

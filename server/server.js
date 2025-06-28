const app = require("./app");

const port = process.env.PORT || 5600;

app.listen(port, () => console.log("server started on port: ", port));

const hyperExpress = require("hyper-express")
const hyper = new hyperExpress.Server()
const db = require("./config/database")
const dotenv = require("dotenv")
const cors = require("cors")

dotenv.config()

const PORT = process.env.PORT || 3838

const auth_middleware = (req, res, next) => {
    console.log("Auth Protection bro...")
    next()
}

hyper.use(cors());

hyper.get('/', {middlewares: [auth_middleware]}, async (req, res) => {
    console.log("Get API Readyyy...")   

    res.json({
        status: "OK",
        API_version: '1.0.0'
    });
});

const features_router = new hyperExpress.Router()

features_router.post("/add", async (req, res) => {
    const { title, level } = await req.json();
    db.query(`INSERT INTO features (username, title, level) VALUES ('admin', '${title}', '${level}')`, (err, result) => {
        if (err) throw new Error("error adding features")
        console.log(result)
        res.send("success")
    })
})

const users_router = new hyperExpress.Router()

users_router.get("/profile", (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) throw new Error("error getting users")
        const profiles = {
            username: result[0].username,
            token: result[0].token
        }
        res.json({profiles})
    })
})

users_router.post("/login", (req, res) => {
    console.log("User logged in")
    res.send("login successful")
})

hyper.use("/users", users_router)
hyper.use("/features", features_router)

hyper.listen(PORT)
        .then(() => console.log(`SERVER listening on port ${PORT}`))
        .catch(() => console.warn(`Failed to listen on port ${PORT}`))
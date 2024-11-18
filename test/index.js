import { BlacklistClient } from "../src/index.js";

const client = new BlacklistClient({ key: "b6dcf879-e514-48d3-90c0-08ae9d898b1d", path: "/obl", pass: "caca" }) 

client.on("ready", (port) => {
    console.log(`OBLCLIENT Is now ready and running on port ${port} !`)
})

client.on("add", (bl) => {
    console.log("Someone was added to the blacklist !")
    console.log(bl)
})

client.on("remove", (bl) => {
    console.log("Someone was removed from the blacklist !")
    console.log(bl)
})

client.checkUser("2980742").then(console.log)
client.checkUser("840749770221682689").then(bl => {
    console.log(bl)
})

client.listen(3000)
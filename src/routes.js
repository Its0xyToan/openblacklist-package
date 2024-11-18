const DEVMODE = false

export default {
    base: !DEVMODE ? "https://openbl.clarty.org/api/" : "http://localhost:3001/api/",
    version: "v1",
    
    user: "/user"
}

// https://openbl.clarty.org/api/v1/user
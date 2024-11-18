import express from "express"
import { makeRequest } from "../rest/fetch.js";
import routes from "../routes.js";
import { parsePostResponse } from "../utils/parseResponse.js";

/**
 * @typedef {object} Configuration
 * @property {string} key - The access key to OpenBlacklist's API, get one on https://openbl.clarty.org/dash
 * @property {string} path - The path where express will listen to the post requests OpenBlacklist sends
 * @property {string?} pass - The pass you set in your URL on https://openbl.clarty.org/dash
 */

/**
 * @typedef {"ready"|"add"|"remove"|"error"} Events
 */

export class BlacklistClient {

    /**
     * @type {Configuration}
     * @private
     */
    config;
    /**
     * @type {import("express").Application}
     * @private
     */
    app;

    /** @private */
    eventsc = []

    /**
     * Creates a new Blacklist Client
     * @param {Configuration} config 
     */
    constructor(config) {
        this.config = config
    }

    /**
     * Listens to new adds and removes
     * @param {number} port - The port express will listen to
     */
    async listen(port) {
        this.app = express()
        this.app.use(express.json())
        
        this.app.listen(port, () => {
            this.emit("ready", port)
        })

        if(!this.config.path.startsWith("/")) {
            throw new Error("The path should start with / for example /api or /obl")
        }

        this.app.post(this.config.path, (req, res) => {
            const parsed = parsePostResponse(req.body)
            if(parsed.metadata.pass !== this.config.pass) return res.sendStatus(403);

            this.emit(parsed.metadata.event, parsed.end)

            res.sendStatus(200)
        })
    }

    // EVENT EMITER ============================

    /** @private */
    emit(event, data) {
        this.eventsc.forEach((v, i) => {
            if(v.event === event) {
                v.callback(data)
            }
        })
    }

    /**
     * Sets the callback for a certain event
     * @param {Events} event - The event, should be "ready", "error", "add" or "remove" 
     * @param {*} callback - The callback function
     */
    on(event, callback) {
        if((event !== "add") && (event !== "remove") && (event !== "ready") && (event !== "error")) throw new Error("Event should be ready, remove or add");
        this.eventsc.push({ event, callback })
    }

    /**
     * Sets the callback for a certain event
     * @param {Events} event - The event, should be "ready", "error", "add" or "remove" 
     */
    off(event) {
        if((event !== "add") && (event !== "remove") && (event !== "ready") && (event !== "error")) throw new Error("Event should be ready, remove or add");
        this.eventsc.forEach((v, i) => {
            if(v.event === event) {
                this.eventsc.splice(i, 1);
                return true
            }
        })

        throw new Error(`No event of the type ${event} has been set !`)
    }

    // ===================

    /**
     * Checks if a member is in the OpenBlacklist database
     * @param {string} userId - A discord user ID
     */
    async checkUser(userId) {
        return await makeRequest(`${routes.user}/${userId}`, this.config);
    }

}
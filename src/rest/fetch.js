import routes from "../routes.js"
import { parseGetResponse } from "../utils/parseResponse.js"

export const makeRequest = async (path, config) => {
    const req = await sFetch(path, config.key)
    const json = await req.json()
    if(json.message) {
        throw new Error(json.message)
    }
    return parseGetResponse(json)
}

export const sFetch = (path, key) => {
    const headers = new Headers()
    headers.set("Authorization", key)
    return fetch(`${routes.base}${routes.version}${path}`, { headers })
}

/**
 * @typedef {object} BlacklistReasons
 * @property {string} fr
 * @property {string?} en
 * @property {string?} es
 */

/**
 * @typedef {object} BlacklistUser
 * @property {string} id
 * @property {string?} username
 * @property {string?} displayname
 */

/**
 * @typedef {object} Blacklist
 * @property {boolean} isBlacklisted
 * @property {BlacklistUser} user
 * @property {BlacklistReasons?} reasons
 */

/**
 * @typedef {object} MetaData
 * @property {string} event
 * @property {string} pass
 */

/**
 * Parses the response
 * @param {any} json 
 * @returns {Blacklist}
 */
export function parseGetResponse(json) {
    /** @type {Blacklist} */
    let end = {
        isBlacklisted: json.isBlacklisted,
        user: {
            id: json.user.id,
            username: json.user.username ? json.user.username : null
        }
    }

    if(json.user.blacklisted_reasons) end.reasons = {
        fr: json.user.blacklisted_reasons.fr_fr,
        en: json.user.blacklisted_reasons.en_gb,
        es: json.user.blacklisted_reasons.es_sp
    };

    return end;
}

/**
 * @typedef {object} PostResponse
 * @property {Blacklist} end
 * @property {MetaData} metadata 
 */

/**
 * 
 * @param {*} json 
 * @returns {PostResponse}
 */

export function parsePostResponse(json) {
    /** @type {Blacklist} */
    let end = {
        user: {
            id: json.user.id,
            username: json.user.username,
            displayname: json.user.displayname
        },
        reasons: json.reasons
    }

    return { end, metadata: json.metadata }
}
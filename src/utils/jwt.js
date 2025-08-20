import CryptoJS from "crypto-js"
import { useJwt } from '@vueuse/integrations/useJwt'

const base64UrlEncode = (str) => {
    var encodedSource = CryptoJS.enc.Base64.stringify(str)
    var reg = new RegExp('/', 'g')
    encodedSource = encodedSource.replace(/=+$/, '').replace(/\+/g, '-').replace(reg, '_')
    return encodedSource
}

const generateToken = (secret, header = { "alg": "HS256", "typ": "JWT" }, payload) => {
    let before_sign = base64UrlEncode(CryptoJS.enc.Utf8.parse(JSON.stringify(header))) + '.' + base64UrlEncode(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)))
    let signature = CryptoJS.HmacSHA256(before_sign, secret)
    signature = base64UrlEncode(signature)
    let final_sign = before_sign + '.' + signature
    return final_sign
}

const parseToken = (token) => {
    const { header, payload } = useJwt(token)
    return {parseHeader: header.value, parsePayload: payload.value}
}

export default {
    generateToken,
    parseToken
}
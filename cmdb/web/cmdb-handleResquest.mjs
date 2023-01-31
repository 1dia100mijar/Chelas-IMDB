import httpErrors from './errors-http.mjs'

export default function(sendError, sendResponse, getToken){
    return function(handler){
        return async function (req, rsp) {
            req.token = getToken(req, rsp)
            try {
                let obj = await handler(req, rsp)
                if(req.user){
                    try{
                        obj.data.user = req.user
                    } catch(e){
                        obj.data = {}
                        obj.data.user = req.user
                    }
                } 
                sendResponse(obj, rsp)
            } catch (e) {
                const response = httpErrors(e)
                rsp.status(response.status)
                sendError(e, rsp, req.user)
            }
        }
    }
}

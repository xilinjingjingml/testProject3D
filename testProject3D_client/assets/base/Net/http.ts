/**
 * Create by Jin on 2021/8/26
 */

import { utils } from "../utils/utils"

 interface IHttpReq {
    url: string | { host: number, url: string }
    query?: { [key: string]: any }
    method?: "GET" | "POST"
    queryType?: "formdata"
    propertys?: any
    callback?: (err: Error | null, res: any) => void
}

interface IHttpOption {
    url: string
    query?: { [key: string]: any }
    method?: "GET" | "POST"
    queryType?: "formdata"
    propertys?: any
    callback?: (err: Error | null, res: any) => void
}


/**
 * 1.参数类型
 * 2.通信建立
 * 3.通信响应
 * 4.请求方式
 */
export namespace http{
    
    export function open(url: string, query?: { [key: string]: any }, callback?: (res: any, err: Error) => void): any
    export function open(url: IHttpOption): any
    export function open(url: string | IHttpOption, query?: { [key: string]: any }, callback?: (res: any, err: Error) => void){
        let params = url as any
        params = params.query == null ? { url: url, query: query, callback: callback } : url
        params.url = params.url.replace("http://", "https://")

        const xhr = new XMLHttpRequest()
        const option: IHttpOption = params
        if (option.propertys) {
            for (const key in option.propertys) {
                xhr[key] = option.propertys[key]
            }
            
        }
        // if (typeof params.url !== "string") {
        //     params.url = _host[params.url.host] + params.url.url
        // }

        //没有属性、超时，设置超时时间
        if (option.propertys == null || option.propertys.timeout == null) {
            xhr.timeout = 20 * 1000
        }

        // 响应处理
        xhr.onabort = () => {
            console.error("[http.onabort]", option.url)
            option.callback && option.callback(new Error("onabort"), null)
        }
        xhr.onerror = () => {
            console.error("[http.onerror]", option.url)
            option.callback && option.callback(new Error("onerror"), null)
        }
        xhr.ontimeout = () => {
            console.warn("[http.ontimeout]", option.url)
            option.callback && option.callback(new Error("ontimeout"), null)
        }
        xhr.onload = () => {
            console.log("[http.onload]", option.url)
            if (xhr.status == 200) {
                let content: any
                if (xhr.responseType == "" || xhr.responseType == "text") {
                    content = xhr.responseText
                    if (typeof xhr.responseText == "string") {
                        try {
                            const data = JSON.parse(xhr.responseText)
                            if (typeof data == "object" && data) {
                                content = data
                            }
                        } catch (error) {

                        }
                    }
                } else {
                    content = xhr.response
                }
                option.callback && option.callback(null, content)
            } else {
                option.callback && option.callback(new Error("wrong status:" + xhr.status), null)
            }
        }
        

        //method: 1.post  2.get
        let body: string | null = null
        if(option.query){

        }
    }


}


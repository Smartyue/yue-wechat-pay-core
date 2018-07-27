/**
 * Created by yuanjianxin on 2018/7/23.
 */
const axios=require("axios");
const xml2js=require("xml2js");

const defaultConfig={
    transformRequest:[
        (data)=>{
            let builder=new xml2js.Builder({
                rootName:"xml",
                cdata:true,

            });
           return builder.buildObject(data);
        }
    ],
    transformResponse:[
        (data)=>{
            return new Promise((resolve,reject)=>{
                let parser=new xml2js.Parser({
                    explicitArray: false,
                    ignoreAttrs: false
                });
                parser.parseString(data,(err,res)=>{
                    err ? reject(err) : resolve(res);
                    return res;
                });
            })
        }
    ]

};

module.exports={

    async sendRequest(method,url,data,headers={"Content-Type":"text/xml"}){
        let config={
            method,
            url,
            headers,
            data
        };

        config=Object.assign({},defaultConfig,config);
        return new Promise((resolve,reject)=>{
            axios(config).then(res=>{
                res=res && res.data || res;
                resolve(res);
            }).catch(err=>{
                err=err.response && err.response.data || err;
                reject(err);
            });
        });
    }
};
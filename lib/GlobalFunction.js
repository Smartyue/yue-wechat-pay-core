/**
 * Created by yuanjianxin on 2018/7/23.
 */
const uuid=require("uuid/v4");
const Crypto=require("crypto");
module.exports={


    /**
     * 生成随机字符串
     */
    generateNonceStr(){
        return uuid().toString().replace(/-/g,"");
    },


    /**
     * 将对象键值对按ascii排序并转为字符串
     */
    asciiObjectToString(obj){
        return Object.keys(obj).sort().map(k=>`${k}=${obj[k]}`).join("&");
    },

    /**
     * 生成签名
     */
    generateSign(stringA,key,method="md5"){
        if(method.toLowerCase()=="md5")
            return Crypto.createHash("md5").update(stringA.toString()+"&key="+key.toString()).digest("hex").toUpperCase();
        if(method.toLowerCase()=="sha256")
            return Crypto.createHmac("sha256",key).update(stringA).digest("hex").toUpperCase();
        return null;
    }

};
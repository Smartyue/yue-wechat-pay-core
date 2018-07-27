/**
 * Created by yuanjianxin on 2018/7/23.
 */
const GlobalFunction=require("./GlobalFunction");
const WxHttpUtil=require("./WxHttpUtil");
/**
 * h5微信支付
 * */

module.exports=class MWebCore{

    static get instance(){
        if(!MWebCore._instance)
            MWebCore._instance=new MWebCore();
        return MWebCore._instance;
    }

    /**
     * 初始化
     * appid  微信公众账号或开放平台APP的唯一标识
     * mch_id 商户收款账号
     * key 密钥
     * notify_url 微信支付结果异步通知url 这里可以统一制定，在具体的接口中也可以具体制定
     */
    constructor(){
        this.appid=null;
        this.mch_id=null;
        this.key=null;
        this.notify_url=null;
    }

    /**
     * 配置信息
     * @param appid
     * @param mch_id
     * @param key
     * @param notify_url
     */
    config({appid,mch_id,key,notify_url}){
        this.appid=appid;
        this.mch_id=mch_id;
        this.key=key;
        this.notify_url=notify_url;
    }


    /**
     * 统一下单
     * @param out_trade_no 商户订单号
     * @param body  商品描述
     * @param total_fee  标价金额
     * @param spbill_create_ip 终端IP
     * @param attach 附加数据
     * @param notify_url 通知地址
     * @param sign_type 签名类型
     * @param trade_type 交易类型
     * @returns {Promise}
     */
    async unifiedOrder(out_trade_no,body,total_fee,spbill_create_ip,attach,notify_url,sign_type="MD5",trade_type="MWEB"){

        // 1.生成随机字符串
        let nonce_str=GlobalFunction.generateNonceStr();
        // 2.组装生成签名所需数据包
        let signObj={
            appid:this.appid,
            mch_id:this.mch_id,
            nonce_str,
            body,
            out_trade_no,
            total_fee,
            spbill_create_ip,
            attach,
            notify_url: notify_url || this.notify_url,
            trade_type,
            sign_type
        };

        let signStr=GlobalFunction.asciiObjectToString(signObj);
        //3.获取签名
        let sign=GlobalFunction.generateSign(signStr,this.key,sign_type);

        //4. 生成要发送的数据包
        let method="POST";
        let url="https://api.mch.weixin.qq.com/pay/unifiedorder";
        let data=Object.assign({},signObj,{sign});
        return await WxHttpUtil.sendRequest(method,url,data);
    }

    /**
     * 查询订单
     * @param out_trade_no 交易流水号
     * @param sign_type   签名类型
     * @returns {Promise.<*|Promise>}
     */
    async orderQuery(out_trade_no,sign_type="MD5"){
        // 1.生成随机字符串
        let nonce_str=GlobalFunction.generateNonceStr();
        // 2.组装生成签名所需数据包
        let signObj={
            appid:this.appid,
            mch_id:this.mch_id,
            nonce_str,
            out_trade_no,
            sign_type
        };
        let signStr=GlobalFunction.asciiObjectToString(signObj);
        //3.获取签名
        let sign=GlobalFunction.generateSign(signStr,this.key,sign_type);
        //4. 生成要发送的数据包
        let method="POST";
        let url="https://api.mch.weixin.qq.com/pay/orderquery";
        let data=Object.assign({},signObj,{sign});
        return await WxHttpUtil.sendRequest(method,url,data);
    }


    /**
     * 关闭订单
     * @param out_trade_no 交易流水号
     * @param sign_type 签名类型
     * @returns {Promise.<*|Promise>}
     */
    async closeOrder(out_trade_no,sign_type="MD5"){
        // 1.生成随机字符串
        let nonce_str=GlobalFunction.generateNonceStr();
        // 2.组装生成签名所需数据包
        let signObj={
            appid:this.appid,
            mch_id:this.mch_id,
            nonce_str,
            out_trade_no,
            sign_type
        };
        let signStr=GlobalFunction.asciiObjectToString(signObj);
        //3.获取签名
        let sign=GlobalFunction.generateSign(signStr,this.key,sign_type);
        //4. 生成要发送的数据包
        let method="POST";
        let url="https://api.mch.weixin.qq.com/pay/closeorder";
        let data=Object.assign({},signObj,{sign});
        return await WxHttpUtil.sendRequest(method,url,data);
    }


    /**
     * 申请退款
     * @param transaction_id 微信订单号
     * @param out_trade_no 商户订单号
     * @param out_refund_no 商户退款单号
     * @param total_fee 订单金额
     * @param refund_fee 退款金额
     * @param refund_desc 退款原因
     * @param sign_type 签名类型
     * @param refund_fee_type 退款货币种类
     * @param notify_url 退款结果通知url
     * @returns {Promise.<*|Promise>}
     */
    async payRefund(transaction_id,out_trade_no,out_refund_no,total_fee,refund_fee,refund_desc='',sign_type="MD5",refund_fee_type='CNY',notify_url=null){
        // 1.生成随机字符串
        let nonce_str=GlobalFunction.generateNonceStr();
        // 2.组装生成签名所需数据包
        let signObj={
            appid:this.appid,
            mch_id:this.mch_id,
            nonce_str,
            sign_type,
            out_refund_no,
            total_fee,
            refund_fee,
            refund_fee_type
        };

        if(transaction_id)
            signObj.transaction_id=transaction_id;

        if(out_trade_no)
            signObj.out_trade_no=out_trade_no;

        if(refund_desc)
            signObj.refund_desc=refund_desc;
        if(notify_url)
            signObj.notify_url=notify_url;
        let signStr=GlobalFunction.asciiObjectToString(signObj);
        //3.获取签名
        let sign=GlobalFunction.generateSign(signStr,this.key,sign_type);
        //4. 生成要发送的数据包
        let method="POST";
        let url="https://api.mch.weixin.qq.com/secapi/pay/refund";
        let data=Object.assign({},signObj,{sign});
        return await WxHttpUtil.sendRequest(method,url,data);
    }


    /**
     * 查询退款
     * @param transaction_id 微信订单号
     * @param out_trade_no 商户订单号
     * @param out_refund_no 商户退款单号
     * @param refund_id  微信退款单号
     * @param sign_type  签名类型
     * @param offset  偏移量
     * @returns {Promise.<*|Promise>}
     */
    async payRefundQuery(transaction_id,out_trade_no,out_refund_no,refund_id,sign_type="MD5",offset=null){
        // 1.生成随机字符串
        let nonce_str=GlobalFunction.generateNonceStr();
        // 2.组装生成签名所需数据包
        let signObj={
            appid:this.appid,
            mch_id:this.mch_id,
            nonce_str,
            sign_type
        };

        if(transaction_id)
            signObj.transaction_id=transaction_id;
        if(out_trade_no)
            signObj.out_trade_no=out_trade_no;
        if(out_refund_no)
            signObj.out_refund_no=out_refund_no;
        if(refund_id)
            signObj.refund_id=refund_id;
        if(offset)
            signObj.offset=offset;

        let signStr=GlobalFunction.asciiObjectToString(signObj);

        //3.获取签名
        let sign=GlobalFunction.generateSign(signStr,this.key,sign_type);
        //4. 生成要发送的数据包
        let method="POST";
        let url="https://api.mch.weixin.qq.com/pay/refundquery";
        let data=Object.assign({},signObj,{sign});
        return await WxHttpUtil.sendRequest(method,url,data);

    }













};
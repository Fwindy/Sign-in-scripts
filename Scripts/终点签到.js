// ==UserScript==
// @name              终点签到
// @version           1.0.0
// @author            fwindy
// @loginURL          https://bbs.zdfx.net/
// @expire            900e3
// @domain            bbs.zdfx.net
// ==/UserScript==

exports.run = async function() {
    let ret = await axios.get('https://bbs.zdfx.net/k_misign-sign.html');
    if (/<span class="btn btnvisted"><\/span>/.test(ret.data)) return '今日已签到';
    let formhash = /&amp;formhash=([\da-zA-Z]+)/.exec(ret.data);
    if (formhash) {
        formhash = formhash[1];
    } else {
        throw 'formhash获取失败';
    }
    await axios.get(`https://bbs.zdfx.net/plugin.php?id=k_misign:sign&operation=qiandao&formhash=${formhash}&format=empty&inajax=1&ajaxtarget=JD_sign`);
    ret = await axios.get('https://bbs.zdfx.net/k_misign-sign.html');
    if (/<span class="btn btnvisted"><\/span>/.test(ret.data)) return '签到成功';
    throw '失败';
};

exports.check = async function() {
    const ret = await axios.get('https://bbs.zdfx.net/home.php?mod=task');
    return !/您需要先登录才能继续本操作/.test(ret.data);
};

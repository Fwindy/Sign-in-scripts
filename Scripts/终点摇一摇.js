// ==UserScript==
// @name              终点摇一摇
// @version           1.0.0
// @author            fwindy
// @loginURL          https://bbs.zdfx.net/
// @expire            900e3
// @domain            bbs.zdfx.net
// ==/UserScript==

exports.run = async function() {
    let ret = await axios.get('https://bbs.zdfx.net/yinxingfei_zzza-yinxingfei_zzza_hall.html');
    if (!/今天您还没摇一摇哦,摇啊摇，赶快摇吧/.test(ret.data)) return '今日已摇一摇';
    let formhash = /&amp;formhash=([\da-zA-Z]+)/.exec(ret.data);
    if (formhash) {
        formhash = formhash[1];
    } else {
        throw 'formhash获取失败';
    }
    const bodyFormData = new FormData();
    bodyFormData.set('formhash', formhash);
    await axios({
        method: 'post',
        url: 'https://bbs.zdfx.net/plugin.php?id=yinxingfei_zzza:yinxingfei_zzza_post',
        data: bodyFormData,
        config: {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
    });
    ret = await axios.get('https://bbs.zdfx.net/plugin.php?id=yinxingfei_zzza:yinxingfei_zzza_hall&yjjs=yes');
    const reward = /恭喜您(获得\d+点币)奖励，明天记得再来摇摇乐哦！/.exec(ret.data);
    if (reward) return reward[1];
    throw '失败';
};

exports.check = async function() {
    const ret = await axios.get('https://bbs.zdfx.net/home.php?mod=task');
    return !/您需要先登录才能继续本操作/.test(ret.data);
};

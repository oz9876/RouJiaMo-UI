export function getRequiredRule(msg, type = 'string') {
    return { required: true, whitespace: true, message: msg, type };
}
// 数字必填
export function getRequiredRuleNum(msg, type = 'number') {
    return { required: true, whitespace: true, message: msg, type };
}
// 长度
export function getRangeRule(min, max, msg) {
    return { min, max, whitespace: true, message: msg };
}
//支持手机号 130~139  143,145,147 15[012356789] 178,176,177,173,170,171 180~189 198 199 166
export function getPhoneRule(msg) {
    return { message: msg, pattern: /^0?(1[3456789])[0-9]{9}$/ };
}
// e-mail
export function getEmailRule(msg) {
    return { message: msg, pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/ };
}
//密码
export function getPasswordRule(msg) {
    return { message: msg, pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,50}$/ };
}
//身份证号码验证
export function idcardCheck(num) {
    let errstr = '';
    num = num.toString();
    num = num.toUpperCase();
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (! (/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        //alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
        errstr = '输入的身份证号长度不对，或者号码不符合规定！';
        return {
            result:false,
            str:errstr
        };
    }
    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    //下面分别分析出生日期和校验位
    let len, re;
    len = num.length;
    if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        const arrSplit = num.match(re);

        if(num == '111111111111111'){
            errstr = '输入的身份证号码不符合规定！';
            return {
                result:false,
                str:errstr
            };
        }

        //检查生日日期是否正确
        const dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        let bGoodDay;
        bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            //alert('输入的身份证号里出生日期不对！');
            errstr = '输入的身份证号里出生日期不对！';
            return {
                result:false,
                str:errstr
            };
        } else {
            //将15位身份证转成18位
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            const arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            const arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            let nTemp = 0,
                i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            return {
                result:true,
                str:errstr
            };
        }
    }
    if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        const arrSplit = num.match(re);

        //检查生日日期是否正确
        const dtmBirth = new Date(arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        let bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            //alert(dtmBirth.getYear());
            //alert(arrSplit[2]);
            //alert('输入的身份证号里出生日期不对！');
            errstr = '输入的身份证号里出生日期不对！';
            return {
                result:false,
                str:errstr
            };
        } else {
            //检验18位身份证的校验码是否正确。
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            let valnum;
            const arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            const arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            let nTemp = 0,
                i;
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)) {
                //alert('18位身份证的校验码不正确！应该为：' + valnum);
            //    errstr="18位身份证的校验码不正确！应该为："+valnum;
                errstr = '身份证格式错误，请重新输入！';
                return {
                    result:false,
                    str:errstr
                };
            }
            return {
                result:true,
                str:errstr
            };
        }
    }
    errstr = '输入的身份证号不对';
    return {
        result:false,
        str:errstr
    };
}
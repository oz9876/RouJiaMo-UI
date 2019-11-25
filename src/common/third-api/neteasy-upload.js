/*global $,console,FileReader,md5*/
/**
 * 文件上传SDK
 *     1、兼容性说明：
 *         仅兼容IE10+、Firefox、Chrome等支持slice和localStorage的浏览器。
 *     2、SDK依赖于jQuery和md5插件，请提前引入。
 *     3、初始化前需要先调用鉴权接口（应用服务器自行实现）：http://vcloud.163.com/docs/api.html（API token校验）。
 *     4、获取鉴权信息后，将鉴权信息作为参数初始化上传对象。
 *     5、调用方法：let uploader = Uploader({
 *         //配置对象，将覆盖默认配置
 *         fileInputId: '',
 *         fileUploadId: '',
 *        'AppKey': '2f2a7935c3a5412a9a31be60924927f6',
 *         'CheckSum': 'e3e847f6a0d7c8d9a78c43a2bbe6d1d91db83acd',
 *         'CurTime': 1512629135,
 *         'Nonce': 1,
 *         onSelectFile: function(file){
 *             ...
 *         }
 *         ...
 *     })
 *     其中，配置对象的AppKey,CheckSum,CurTime,Nonce为必填项，鉴权后将其填入，
 *     其他fileInputId、fileUploadId、onSelectFile，以及所有onXxx等回调函数需要自行修改实现（以配置对象参数方式传入init函数）。
 * @module uploader
 * @class Uploader
 * @static
 * @param {Object} options 配置项对象
 * @return {Object} 接口对象
 * @author zouyongsheng
 * @version 1.0.1
 */
// (function (window, factory) {
//   'use strict';
//   /*eslint "no-undef": 0*/
//   if (typeof define === 'function' && define.amd) define([], factory);
//   else if (typeof exports === 'object') module.exports = factory();
//   // else window.Uploader = factory();
// }(this, () => {
// 'use strict';

  const md5 = require('md5');
  const message = require('antd').message;
  let hide;
  const ENV_API = process.env.ENV_API;

  /**
   * 默认回调函数
   * @type {Object}
   */
  const defaultOpts = {
    onSelect: function(fileObj) {
      log('info', fileObj.file.name + ': ' + fileObj.fileSizeMb + ' MB');
      message.success('已选择' + fileObj.file.name + ',   文件大小: ' + fileObj.fileSizeMb + ' MB');
    },
    onError: function(errObj) {
      log('error', errObj);
    },
    onProgress: function(curFile) {
      log('info', '传输状态：' + curFile.status + '；进度：' + curFile.progress);
      if (curFile.status == 2) {
        setTimeout(hide, 50);
      }
    },
    onFinished: function(curFile, data) {
      log('info', 'File: ' + curFile.fileName + ' is uploaded.');
      console.log(curFile, data);
    }
  };

  const Uploader = function(optsObj) {
    // if(!(this instanceof Uploader))  return new Uploader(optsObj)
    // if(!optsObj || !optsObj.hasOwnProperty('AppKey') || !optsObj.hasOwnProperty('CheckSum')) {
    //   log('warn', '初始化失败：必须参数AppKey和CheckSum，请先前往http://vcloud.163.com/docs/api.html进行API鉴权。')
    //   return false
    // }
    // if((!optsObj.hasOwnProperty('fileInputId') &&
    //   !(document.getElementById('fileInput') instanceof window.HTMLElement)) ||
    //   (!optsObj.hasOwnProperty('fileUploadId') &&
    //   !(document.getElementById('fileUpload') instanceof window.HTMLElement))) {
    //   log('warn', 'HTML 元素不存在：file input或file upload button，需手动传入或使用默认元素Id')
    //   return false
    // }
    // if(!optsObj.hasOwnProperty('CurTime') || !optsObj.hasOwnProperty('Nonce')) {
    //   log('warn', '鉴权失败：请输入调用鉴权接口时设置的CurTime和Nonce值！')
    //   return false
    // }
    const options = {
      AppKey       : optsObj['AppKey'],
      Accid     : optsObj['Accid'],
      Token      : optsObj['Token'],
      //Nonce        : optsObj['Nonce'],
      /**
       * 上传输入框元素ID
       * @type {[String]}
       */
      fileInputId  : optsObj['fileInputId'] || 'fileInput',
      /**
       * 上传按钮ID
       * @type {[String]}
       */
      fileUploadId : optsObj['fileUploadId'] || 'fileUpload',
      /**
       * 分片大小
       * @type {[Number]}
       */
      trunkSize    : 4 * 1024 * 1024,
      /**
       * 获取dns列表的URL
       * @type {String}
       */
      urlDns       : 'http://wanproxy.127.net/lbs',
      // fileExts     : ['JPG', 'PNG', 'WMV', 'ASF', 'AVI', '3GP', 'MKV', 'MP4', 'DVD', 'OGM', 'MOV', 'MPG', 'MPEG', 'MPE', 'FLV', 'F4V', 'SWF', 'M4V', 'QT', 'DAT', 'VOB', 'RMVB', 'RM', 'OGM', 'M2TS', 'MTS', 'TS', 'TP', 'WEBM', 'MP3', 'AAC'],
      // 目前只上传视频; 上面注释是源码; ↑ ↑
      fileExts     : ['WMV', 'ASF', 'AVI', '3GP', 'MKV', 'MP4', 'DVD', 'OGM', 'MOV', 'MPG', 'MPEG', 'MPE', 'FLV', 'F4V', 'SWF', 'M4V', 'QT', 'DAT', 'VOB', 'RMVB', 'RM', 'OGM', 'M2TS', 'MTS', 'TS', 'TP', 'WEBM'],
      fileList     : [],
      successList  : [],
      dnsList      : null
    };
    this._ = {
      options: {}
    };
    // deep clone object
    for (const key in defaultOpts) this._.options[key] = defaultOpts[key];
    this.options(options);
    this.options(optsObj);

    // init
    this.initEvent();
  };

  /**
   * 克隆options参数
   * @param  {Object} option 配置项
   * @param  {Object} value  覆盖配置项的新值
   * @return {Object}
   */
  Uploader.prototype.options = function(option, value) {
    if (option && value) this._.options[option] = value;
    if (!value && typeof option === 'object')
      for (const prop in option)
        if (!this._.options.hasOwnProperty(prop) || (this._.options[prop] != option[prop]))
          this._.options[prop] = option[prop];
    return this;
  };
  /**
   * 判断是否有待上传（已选中且上传未完成）的文件
   * @static
   * @return {Boolean} 有：true，无：false
   * @version 1.0.0
   */
  Uploader.prototype.checkPending = function() {
    let checked = false;
    $.each(this._.options.fileList, (i, v) => {
      if (v.checked && v.status === 0) {
        checked = true;
        return false;
      }
    });
    return checked;
  };
  /**
   * 添加文件
   * @param  {Element}   fileInput 上传输入框元素
   * @param  {Function} cb        [添加成功回调]
   * @return {void}
   */
  Uploader.prototype.addFileToList = function(fileInput, cb) {
    let file    = fileInput.files[0],
      fileKey   = md5(file.name + ':' + file.size),
      fileObj   = null;

    fileObj = {
      fileKey   : fileKey,
      file      : file,
      fileName  : file.name,
      fileSizeMb: (file.size / 1024 / 1024).toFixed(2),
      format    : file.name.split('.').pop(),
      status    : 0,
      checked   : true,
      progress  : localStorage.getItem(fileKey + '_progress') || 0
    };
    // this._.options.fileList.push(fileObj); 多个文件
    this._.options.fileList[0]=fileObj; //单个文件
    localStorage.setItem(fileKey + '_created', + new Date());
    cb(fileInput, fileObj);
  };
  /**
   * 获取初始化信息
   *     发送请求到视频云服务端或应用服务器，参数见代码注释；
   *     其中，typeId和presetId需自行获取(接口文档暂未发布，请联系客服)，headers参数为API token校验返回的结果(必填)
   * @static
   * @param  {Object}   file     文件对象
   *      fileKey: 对文件名和文件大小进行md5后的结果
   *      file: File对象
   *      fileName: 文件名（作为file.name的备份）
   *      fileSizeMb: 文件大小（MB）
   *      format: 文件后缀
   *      status: 上传状态（0：待上传，1：上传中；2：上传完成）
   *      checked: 是否选中（用于列表）
   *      progress: 上传进度
   * @param  {Function} callback 回调函数
   *      回调函数的参数包括：
   *      bucketName: 桶名
   *      objectName: 对象名
   *      nosToken: x-nos-token
   * @return {void}
   */
  Uploader.prototype.getInitInfo = function(file, cb) {
    const self = this;
    const context = localStorage.getItem(file.fileKey + '_context');
    // 转码ID
    let presetId = '',callbackUrl = '';
    switch (ENV_API) {
      case 'localhost':
        presetId = 104330250;
        callbackUrl = 'http://hz.ihaozhuo.com:8020/hmp-openapi/neteaseIM/video/file';
        break;
      //开发
      case 'dev':
        presetId = 104330250;
        callbackUrl = 'http://hz.ihaozhuo.com:8020/hmp-openapi/neteaseIM/video/file';
        break;
      // 测试1
      case 'test':
        presetId = 104328970;
        callbackUrl = 'http://hz.ihaozhuo.com:18020/hmp-openapi/neteaseIM/video/file';
        break;
      // 灰度
      case 'gray':
        presetId = 104335017;
        callbackUrl = 'http://hmpapi-gray.ihaozhuo.com/hmp-openapi/neteaseIM/video/file';
        break;
      // 正式
      case 'pro':
        presetId = 104335017;
        callbackUrl = 'http://hmpapi.ihaozhuo.com/hmp-openapi/neteaseIM/video/file';
        break;
      // 腾讯正式
      case 'protx':
        presetId = 104339015;
        callbackUrl = 'http://hmpapi-tx.ihaozhuo.com/hmp-openapi/neteaseIM/video/file';
        break;
    }
    if(!context) {
      $.ajax({
        type: 'post',
        url: 'http://vcloud.163.com/app/vod/upload/init',
        data: JSON.stringify({
          originFileName   : file.file.name, //上传文件的原始名称(包含后缀名)(必填)(规则同Windows文件名规则)
          userFileName     : file.file.name, //用户命名的上传文件名称(规则同Windows文件名规则)
          typeId           : null, //视频所属的类别ID
          presetId         : presetId, //视频所需转码模板ID
          callbackUrl      : callbackUrl, //转码成功后回调客户端的URL地址
          description      : null //上传视频的描述信息
        }),
        //headers参数为API token校验返回的结果，全部均为必须
        headers: {
          'AppKey'  : self._.options.AppKey, //开发者平台分配的appkey
          'Accid'   : self._.options.Accid, //随机数（随机数，最大长度128个字符）
          'Token' : self._.options.Token //当前UTC时间戳，从1970年1月1日0点0分0秒开始到现在的秒数
         // 'CheckSum': self._.options.CheckSum //服务器认证需要,SHA1(AppSecret+Nonce+CurTime),16进制字符小写
        },
        dataType: 'json',
        contentType: 'application/json',
        success: function(data) {
          /** data格式
           *  "Content-Type": "application/json charset=utf-8" {
           *  "code": 200,
           *  "msg": "",
           *  "ret": {
           *  "xNosToken": "xxsfsgdsgetret",
           *  "bucket": "origv10000",
           *  "object": "qrwr-eete-dsft-vdfg.mp4"
           *  }
           *  }
           */
          if (data.code === 200) {
            localStorage.setItem(file.fileKey + '_bucket', data.ret.bucket);
            localStorage.setItem(file.fileKey + '_object', data.ret.object);
            localStorage.setItem(file.fileKey + '_xNosToken', data.ret.xNosToken);
            cb({'bucketName': data.ret.bucket, 'objectName': data.ret.object, 'nosToken': data.ret.xNosToken});
          } else {
            self._.options.onError({errCode: data.Code, errMsg: data.msg});
          }
        },
        error: function(xhr, s, err) {
          self._.options.onError(err);
        }
      });
    } else {
      cb({
        'bucketName': localStorage.getItem(file.fileKey + '_bucket'),
        'objectName': localStorage.getItem(file.fileKey + '_object'),
        'nosToken'  : localStorage.getItem(file.fileKey + '_xNosToken')
      });
    }
  };
  /**
   * 清除指定file的localstorage
   * @param  {String } fileKey 文件key
   * @return {void}
   */
  Uploader.prototype.clearStorage = function(fileKey) {
    localStorage.removeItem(fileKey + '_progress');
    localStorage.removeItem(fileKey + '_context');
    localStorage.removeItem(fileKey + '_created');
    localStorage.removeItem(fileKey + '_bucket');
    localStorage.removeItem(fileKey + '_object');
    localStorage.removeItem(fileKey + '_xNosToken');
  };
  /**
   * 获取上传DNS地址
   * @param  {Object}   param    AJAX参数
   * @param  {Function} callback 成功回调
   * @return {void}
   */
  Uploader.prototype.getDNS = function(param, cb) {
    const options = this._.options;
    if (options.dnsList) { //已缓存则直接取缓存数据
      cb(options.dnsList);
    } else {
      $.ajax({
        type: 'get',
        url: options.urlDns,
        data: {
          version: '1.0',
          bucketname: param.bucketName
        },
        dataType: 'json',
        /*eslint no-unused-vars: off*/
        success: function(data, s) {
          if (data.code) {
            options.onError({errCode: data.Code, errMsg: data.Message});
          } else {
            options.dnsList = data.upload;
            cb(data.upload);
          }
        },
        error: function(xhr, s, err) {
          options.onError(err);
        }
      });
    }
  },
  /**
   * 获取上传断点位置
   * @param  {Object}   param    AJAX参数
   * @param  {Function} callback 获取成功回调
   * @return {void}
   */
  Uploader.prototype.getOffset = function(param, cb) {
    const context = localStorage.getItem(param.fileKey + '_context');
    const options = this._.options;
    if (!context) return cb(0);
    $.ajax({
      type: 'get',
      url: param.serveIp + '/' + param.bucketName + '/' + param.objectName + '?uploadContext',
      data: {
        version: '1.0',
        context: context
      },
      dataType: 'json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('x-nos-token', param.nosToken);
      },
      success: function(data, s) {
        if (data.errCode) {
          options.onError({errCode: data.errCode, errMsg: data.errMsg});
        } else {
          cb(data.offset);
        }
      },
      error: function(xhr, s, err) {
        options.onError(err);
      }
    });
  };
  /**
   * 根据fileKey获取指定文件对象
   * @param  {String} fileKey 文件名和文件大小md5值
   * @return {Obejct}         文件对象
   */
  Uploader.prototype.getFile = function(fileKey) {
    let curFile  = null,
      fileList   = this._.options.fileList;
    $.each(fileList, (i, v) => {
      if(v.fileKey === fileKey) {
        curFile = v;
        return false;
      }
    });
    return curFile;
  };
  /**
   * 删除文件，终止上传并从列表中移除（进度保持不变）
   * @param  {Object} file 文件对象
   * @return {void}
   */
  Uploader.prototype.removeFile = function(file) {
    const options = this._.options;
    $.each(options.fileList, (i, v) => {
      if (v.fileKey === file.fileKey) {
        if (v.xhr) {
          v.xhr.upload.onprogress = $.noop;
          v.xhr.onreadystatechange = $.noop;
          v.xhr.abort();
          v.xhr = null;
        }
        options.fileList.splice(i, 1);
        // 上传中文件继续上传
        if (v.status === 1) {
          options.upload(i);
        }
        return false;
      }
    });
  },
  /**
   * 上传分片
   * @param  {Object}   param     AJAX参数
   * @param  {Object}   trunkData 分片数据
   * @param  {Function} callback  文件（非分片）上传成功回调函数
   * @return {void}
   */
  Uploader.prototype.uploadTrunk = function(param, trunkData, cb) {
    let xhr      = null,
      xhrParam   = '',
      curFile    = null,
      context    = null,
      self       = this,
      options    = this._.options;


    curFile = this.getFile(trunkData.fileKey);
    context = localStorage.getItem(trunkData.fileKey + '_context');
    if(curFile.xhr) {
      xhr = curFile.xhr;
    } else {
      xhr = new XMLHttpRequest();
      curFile.xhr = xhr;
    }

    xhr.upload.onprogress = function(e) {
      let progress = 0;

      if (e.lengthComputable) {
        progress = (trunkData.offset + e.loaded) / trunkData.file.size;
        curFile.progress = (progress * 100).toFixed(2);

        if (progress > 0 && progress < 1) {
          curFile.status = 1;
        } else if (progress === 1) {
          curFile.status = 2;
        }
        localStorage.setItem(trunkData.fileKey + '_progress', curFile.progress);
        options.onProgress(curFile);
      } else {
        options.onError({errCode: 501, errMsg: '浏览器不支持进度事件'});
      }
    };

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) { return; }
      let result;
      try {
        result = JSON.parse(xhr.responseText);
      } catch (e) {
        result = {
          errCode: 500,
          errMsg: '未知错误'
        };
      }
      if (xhr.status === 200) {
        if (!result.errCode) {
          localStorage.setItem(trunkData.fileKey + '_context', result.context);

          if (result.offset < trunkData.file.size) { //upload next trunk
            self.uploadTrunk(param, $.extend({}, trunkData, {
              offset   : result.offset,
              trunkEnd : result.offset + trunkData.trunkSize,
              context  : context || result.context
            }), cb);
          } else { //all trunks done
            cb(trunkData);
          }
        } else {
          self.clearStorage(trunkData.fileKey);
          options.onError({errCode: result.errCode, errMsg: result.errMsg});
        }
      } else {
        if (xhr.status) { //nos error
          self.clearStorage(trunkData.fileKey);
        }
        //取消、关闭情况
        options.onError(xhr.responseText);
      }
    };
    xhrParam = '?offset=' + trunkData.offset + '&complete=' + (trunkData.trunkEnd >= trunkData.file.size) + '&context=' + (context || trunkData.context) + '&version=1.0';

    xhr.open('post', param.serveIp + '/' + param.bucketName + '/' + param.objectName + xhrParam);
    xhr.setRequestHeader('x-nos-token', param.nosToken);
    xhr.send(trunkData.file.slice(trunkData.offset, trunkData.trunkEnd));
  };
  /**
   * 单文件上传成功回调
   * @param  {Object} curFile 文件对象
   * @return {void}
   */
  Uploader.prototype.onUploaded = function(curFile) {
    const options = this._.options;
    // 将文件信息存入上传成功列表
    options.successList.push(curFile);
    /**
     * 用于获取vid等信息，暂只支持在单个文件上传成功后的回调中进行
     * 在全部上传成功的回调中发起请求会导致在上传失败时无法执行请求（接口的URL、参数格式、响应格式等均相同）
     * */
    $.ajax({
      type       : 'post',
      url        : 'http://vcloud.163.com/app/vod/video/query',
      data       : JSON.stringify({ objectNames: [curFile.objectName] }),
      dataType   : 'json',
      contentType: 'application/json',
      //headers参数为API token校验返回的结果，全部均为必须
      headers    : {
        'AppKey': options.AppKey, //开发者平台分配的appkey
        'Accid': options.Accid, //随机数（随机数，最大长度128个字符）
        'Token': options.Token //当前UTC时间戳，从1970年1月1日0点0分0秒开始到现在的秒数
       // 'CheckSum': options.CheckSum //服务器认证需要,SHA1(AppSecret+Nonce+CurTime),16进制字符小写
      },
      success: function(data, s) {
        if(data.code == 200) {
          // 上传成功后让fileList的文件内容为空, 不保留上传记录;?
          // options.fileList = []
          // 回调钩子 后台需要vid所以返回data;
          options.onFinished(curFile, data);
        } else {
          options.onError({errCode: data.Code, errMsg: data.msg});
        }
      },
      error: function(xhr, s, err) {
        options.onError(err);
      }
    });
  };
  /**
   * 上传文件操作
   * @param  {Number} fileIdx 文件索引
   * @return {void}
   */
  Uploader.prototype.upload = function(fileIdx) {
    const self = this;
    const fileList = this._.options.fileList;
    if(fileIdx < fileList.length) {
      if (fileList[fileIdx].status === 2 || !fileList[fileIdx].checked) { //上传完成或未勾选
        return this.upload(fileIdx + 1);
      }
      // todo
      this.getInitInfo(fileList[fileIdx], (data) => {
        const curFile = fileList[fileIdx];
        curFile.objectName = data.objectName;
        curFile.bucketName = data.bucketName;

        self.getDNS(data, (dnsList) => {
          const curFile = fileList[fileIdx];
          self.getOffset({
            serveIp   : dnsList[0],
            bucketName: data.bucketName,
            objectName: data.objectName,
            nosToken  : data.nosToken,
            fileKey   : fileList[fileIdx].fileKey
          }, (offset) => {
            self.uploadTrunk({
              serveIp   : dnsList[0],
              bucketName: data.bucketName,
              objectName: data.objectName,
              nosToken  : data.nosToken
            }, {
              file      : fileList[fileIdx].file,
              fileKey   : fileList[fileIdx].fileKey,
              fileIdx   : fileIdx,
              offset    : offset || 0,
              trunkSize : self._.options.trunkSize,
              trunkEnd  : (offset || 0) + self._.options.trunkSize,
              context   : ''
            }, (trunkData) => {
              self.clearStorage(trunkData.fileKey);
              self.onUploaded(curFile);
              self.upload(fileIdx + 1);
            });
          });
        });
      });

    } else {
      log('info', '所有文件均已上传完毕！');
      message.success('所有文件上传完毕！');
    }
  };
  /**
   * 事件绑定
   * @return {void}
   */
  Uploader.prototype.initEvent = function() {
    const self = this;
    // file input event handler
    $('#' + this._.options.fileInputId).on('change', function(e) {
      let chooseFileExt = '';
      if(e.target.files && e.target.files.length>0) {
        if(!self.checkExistInFileList(e.target.files[0])) {
          chooseFileExt = e.target.files[0].name.split('.').pop().toUpperCase();
          if ($.inArray(chooseFileExt, self._.options.fileExts) < 0) {
            log('warn', '请选择视频或图片文件：不是有效的视频或图片格式！');
            message.warning('请选择视频文件');
            return;
          }
          // 校验通过的文件添加到List数组里面;
          self.addFileToList(e.target, (fileInput, fileObj) => {
            self._.options.onSelect(fileObj);
            fileInput.value = '';
          });
        } else {
          this.value = '';
          log('warn', '文件已存在列表中');
          message.warning('文件已存在列表中');
        }
      }
    });
    // upload button click handler
    $('#' + this._.options.fileUploadId).on('click', () => {
      if (!self.checkPending()) {
        log('warn', '请选择待上传的文件!');
        message.warning('请选择待上传的视频!');
        return false;
      } else {
        hide = message.loading('正在上传请稍候...', 0);
        // self._.options.fileList = [];
        self.upload(0);
        return false;
      }
    });
  };
  /**
   * 判断文件是否已存在列表中
   * @param  {File} file File对象
   * @return {Boolean}      存在：true，不存在：false
   */
  Uploader.prototype.checkExistInFileList = function(file) {
    let exist  = false,
      curKey   = md5(file.name + ':' + file.size);
    $.each(this._.options.fileList, (i, v) => {
      if (curKey === v.fileKey) {
        exist = true;
        return false;
      }
    });
    return exist;
  };
  /**
   * 外部监听事件转化
   * @param  {String}   eventName 事件名
   * @param  {Function} cb        回调函数
   * @return {Object}             对象实例
   */
  Uploader.prototype.on = function(eventName, cb) {
    if (typeof eventName !== 'string' || typeof cb !== 'function') return this;
    if (!(/^on/).test(eventName)) eventName = 'on' + eventName.substring(0, 1).toUpperCase() + eventName.substring(1);
    if (this._.options.hasOwnProperty(eventName)) this._.options[eventName] = cb;
    return this;
  };
  /**
   * 输出方法
   * @param  {String} type 输出类型
   * @param  {String} msg  输出消息
   * @return {void}
   */
  function log(type, msg) {
    switch(type) {
    case 'warn':
      console.warn(msg);
      break;
    case 'info':
      console.log(msg);
      break;
    case 'error':
      console.error(msg);
      break;
    default:
      break;
    }
  }
  export default Uploader;
  
// }));
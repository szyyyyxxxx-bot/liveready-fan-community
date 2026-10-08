"use client";

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import {
  Bell, BookOpen, Cake, Calendar, Camera, Car, Check, ChevronDown, ChevronLeft, ChevronRight,
  ClipboardList,
  CircleUserRound, Clock3, Compass, FileImage, Headphones, Heart, Home,
  Image, ListChecks, ListMusic, Lock, Map, MapPin, MapPinned, Medal, Mic,
  MessageCircle, MessageSquare, Music2, Navigation, Newspaper, NotebookPen,
  Package, Palette, Pause, Play, Plus, Radio, Repeat2, Route, Search, Share2,
  ShieldCheck, Shirt, ShoppingBag, Sparkles, Star, Store, TicketCheck,
  Trophy, Upload, UserPlus, Users, Video, Vote, WandSparkles, X, Zap,
} from "lucide-react";

type Tab = "home" | "support" | "live" | "create" | "profile";
type FeatureId = string;
type Feature = { id: FeatureId; title: string; desc: string; tab: Tab; icon: typeof Music2; action: string; stat: string; detail: string[] };
type Result = { title: string; meta: string; type: string; tab: Tab; icon: typeof Music2; feature?: FeatureId };
type BuildStatus = "done" | "demo" | "pending";
type MerchItem = {id:number;artist:string;name:string;kind:"官方周边"|"自制周边";price:string;image:string;selling:boolean};
type ArtistIdentity = {nickname:string;avatar:string;level:number;firstListen:string;listenHours:string;recentListen:string};
type CommunityPost = {id:number;artist:string;author:string;avatar:string;level:number;title:string;content:string;likes:number;comments:string[];shares:number;liked:boolean;mine:boolean;time:string};
type LivePlace = {id:number;name:string;address:string;kind:string;source:"社区上传"|"官方收录"|"私人目的地";valid:boolean;image?:string};
type CheckinMediaItem = {name:string;type:"image"|"video"|"audio";url:string};
type VenueSeatPost = {id:number;venue:string;artist:string;layer:string;zone:string;author:string;text:string;media:string;image?:string;obstruction:string;likes:number;liked:boolean;comments:string[];shares:number};
type ServicePost = {id:number;author:string;text:string;likes:number;liked:boolean;comments:string[];shares:number;images?:string[];videos?:string[]};
type SameShowPost = {id:number;author:string;area:string;text:string;images:string[];videos:string[];likes:number;liked:boolean;comments:string[];shares:number;time:string};
type MallChannel = "官方周边"|"自制周边"|"粉丝闲置";
type MallProduct = {id:string;channel:MallChannel;artist:string;name:string;price:number;image:string;badge:string;description:string;seller?:string;status?:string;officialUrl?:string};
type MallOrder = {id:string;status:"待支付"|"待发货"|"待收货"|"已完成"|"已取消";items:MallProduct[];total:number;created:string;action:string};
type CheckinRecord = {id:number;artist:string;country:string;city:string;place:string;kind:string;address:string;mood:string;note:string;media:CheckinMediaItem[];time:string};
type ConcertSession = {parsed:boolean;image:string;name:string;verified:boolean};
type CityEventCategory = "体育场演唱会"|"体育馆演唱会"|"Livehouse"|"音乐节";
type CityEvent = {name:string;venue:string;date:string;category:CityEventCategory;note:string};

const mallProducts:MallProduct[]=[
  {id:"official-countless",channel:"官方周边",artist:"薛之谦",name:"《无数》实体专辑",price:89,image:"/albums/xuezhiqian-meiren.jpg",badge:"现货",description:"官方实体 CD，含歌词本与收藏卡。",status:"预计3天内发货",officialUrl:"https://y.qq.com/"},
  {id:"official-surprise",channel:"官方周边",artist:"薛之谦",name:"《意外》实体专辑",price:83,image:"/albums/xuezhiqian-jinfuzi.jpg",badge:"现货",description:"实体专辑及主题收藏外盒。",status:"预计3天内发货",officialUrl:"https://y.qq.com/"},
  {id:"official-gem",channel:"官方周边",artist:"单依纯",name:"《珠玉》限定唱片",price:129,image:"/artists/shanyichun.jpg",badge:"预售",description:"限定唱片、写真册与编号收藏卡。",status:"预计15天内发货",officialUrl:"https://y.qq.com/"},
  {id:"official-voltage",channel:"官方周边",artist:"汪苏泷",name:"十万伏特巡演纪念册",price:118,image:"/artists/wangsulong.jpg",badge:"限定",description:"巡演写真、纪念票根与歌词折页。",status:"预计7天内发货",officialUrl:"https://y.qq.com/"},
  {id:"custom-pull",channel:"自制周边",artist:"单依纯",name:"沉浸式撕拉片",price:.85,image:"/artists/shanyichun.jpg",badge:"1件起印",description:"可定制正面照片与撕拉底纸，提供两种尺寸。",status:"1–20个 ¥0.85 / 21–50个 ¥0.79"},
  {id:"custom-crystal",channel:"自制周边",artist:"i-dle",name:"双闪水晶小卡",price:1.8,image:"/artists/idle.jpg",badge:"双面定制",description:"单面透闪，PET覆膜更防刮。",status:"54×86mm · 正反面可定制"},
  {id:"custom-postcard",channel:"自制周边",artist:"汪苏泷",name:"镭射明信片",price:1.4,image:"/artists/wangsulong.jpg",badge:"新品",description:"镭射镂空与多种纸张模板可选。",status:"10份起印"},
  {id:"custom-procard",channel:"自制周边",artist:"薛之谦",name:"双闪 PRO 小卡",price:1.03,image:"/artists/xuezhiqian.jpg",badge:"新品",description:"自动生成白墨层和逆向层，适合现场交换。",status:"54×86mm · 10份起印"},
  {id:"resale-polaroid",channel:"粉丝闲置",artist:"i-dle",name:"Minnie 未公开拍立得",price:3500,image:"/artists/idle.jpg",badge:"包邮",description:"未公开造型拍立得，保存状态良好，支持查看细节图。",seller:"被枕头绑架了",status:"48小时内发布"},
  {id:"resale-necklace",channel:"粉丝闲置",artist:"i-dle",name:"INWARD 葵花瓣套装",price:917,image:"/artists/idle.jpg",badge:"3人想要",description:"葵花瓣项链、耳饰与收藏包装，成套出。",seller:"A_小肉丸",status:"48小时内发布"},
  {id:"resale-card",channel:"粉丝闲置",artist:"薛之谦",name:"巡演限定收藏卡",price:168,image:"/artists/xuezhiqian.jpg",badge:"可小刀",description:"深圳站限定收藏卡，九成新，可现场验品。",seller:"星河入场",status:"深圳同城"},
];

const initialMallOrders:MallOrder[]=[
  {id:"LR20260918001",status:"已取消",items:[mallProducts[0]],total:89,created:"2026.09.18",action:"再次购买"},
  {id:"LR20260912002",status:"已完成",items:[mallProducts[3]],total:118,created:"2026.09.12",action:"申请售后"},
  {id:"LR20260902003",status:"已完成",items:[mallProducts[1]],total:83,created:"2026.09.02",action:"再次购买"},
  {id:"LR20260928004",status:"待收货",items:[mallProducts[2]],total:129,created:"2026.09.28",action:"查看物流"},
];

const initialLivePlaces:LivePlace[]=[
  {id:1,name:"星河广场应援大屏",address:"深圳市南山区星河广场东侧",kind:"应援大屏",source:"社区上传",valid:true},
  {id:2,name:"湾区体育中心",address:"深圳市宝安区滨海大道",kind:"演唱会场馆",source:"官方收录",valid:true},
  {id:3,name:"薛之谦同款咖啡店",address:"深圳市南山区海德三道",kind:"同款店",source:"社区上传",valid:true},
  {id:4,name:"湾区体育中心北门应援大屏",address:"深圳市宝安区滨海大道北门广场",kind:"城市大屏",source:"社区上传",valid:true},
  {id:5,name:"A3入口手幅领取点",address:"湾区体育中心内场A3入口外侧",kind:"线下应援点",source:"社区上传",valid:true},
  {id:6,name:"南广场生日花墙",address:"湾区体育中心南广场服务台旁",kind:"线下应援点",source:"社区上传",valid:true},
  {id:7,name:"汪苏泷「睡眠周期」快闪",address:"深圳市福田区中洲湾 C Future City",kind:"快闪打卡地",source:"社区上传",valid:true,image:"/places/wangsulong-zhongzhouwan-popup.jpg"},
];

const initialVenueSeatPosts:VenueSeatPost[]=[
  {id:1,venue:"湾区体育中心",artist:"薛之谦",layer:"内场",zone:"A1",author:"谦友小北",text:"A1靠延伸台，艺人经过时距离很近，主舞台全景也无遮挡。",media:"薛之谦深圳站 · 用户实拍",image:"/venue-views/suzhou-olympic-c2.jpg",obstruction:"无遮挡",likes:286,liked:false,comments:["这个角度太好了！"],shares:18},
  {id:2,venue:"湾区体育中心",artist:"单依纯",layer:"内场",zone:"B2",author:"纯糖汽水",text:"B2中后排视角，灯光和大屏都看得很完整。",media:"单依纯深圳站 · 用户实拍",image:"/venue-views/macau-galaxy-114.jpg",obstruction:"轻微遮挡：前排灯牌",likes:168,liked:false,comments:["同场馆参考很有用"],shares:9},
  {id:3,venue:"湾区体育中心",artist:"单依纯",layer:"看台一层",zone:"103",author:"一颗纯糖",text:"103区第一排无遮挡，适合看完整舞美。",media:"单依纯深圳站 · 2张照片",image:"/venue-views/guangzhou-baoneng-121.jpg",obstruction:"无遮挡",likes:203,liked:false,comments:[],shares:12},
  {id:4,venue:"湾区体育中心",artist:"薛之谦",layer:"看台二层",zone:"204",author:"星河入场",text:"204区正对主舞台，距离远但整体视觉非常完整。",media:"薛之谦深圳站 · 1段视频",image:"/venue-views/beijing-wukesong-130.jpg",obstruction:"无遮挡",likes:124,liked:false,comments:[],shares:6},
  {id:5,venue:"湾区体育中心",artist:"汪苏泷",layer:"看台一层",zone:"108",author:"小泷包",text:"108区靠近侧台，大屏清楚，侧面舞台有少量设备遮挡。",media:"汪苏泷深圳站 · 用户实拍",image:"/venue-views/beijing-birdnest-121.jpg",obstruction:"部分遮挡：侧台音响",likes:156,liked:false,comments:[],shares:8},
  {id:6,venue:"湾区体育中心",artist:"i-dle",layer:"看台三层",zone:"304",author:"Neverland星球",text:"304区可以看到完整灯光海，适合拍全场氛围。",media:"i-dle深圳站 · 用户实拍",image:"/venue-views/suzhou-olympic-c2.jpg",obstruction:"无遮挡",likes:189,liked:false,comments:[],shares:11},
  {id:7,venue:"澳门银河综艺馆",artist:"跨艺人共享",layer:"看台一层",zone:"114",author:"Winnie",text:"114区现场实拍，正面大屏清楚，舞台整体构图完整。",media:"澳门银河综艺馆 · 用户实拍",image:"/venue-views/macau-galaxy-114.jpg",obstruction:"无遮挡",likes:328,liked:false,comments:["这个区的正面视角很有参考价值"],shares:24},
  {id:8,venue:"苏州奥体中心体育场",artist:"跨艺人共享",layer:"内场",zone:"C2",author:"Winnie",text:"C2区现场实拍，主舞台和两侧灯光装置都能完整看到。",media:"苏州奥体中心体育场 · 用户实拍",image:"/venue-views/suzhou-olympic-c2.jpg",obstruction:"无遮挡",likes:416,liked:false,comments:["C2离舞台比想象中近"],shares:31},
  {id:9,venue:"广州宝能体育馆",artist:"跨艺人共享",layer:"看台一层",zone:"121",author:"Winnie",text:"一层看台121区，适合观察整体舞美与中控屏变化。",media:"广州宝能体育馆 · 用户实拍",image:"/venue-views/guangzhou-baoneng-121.jpg",obstruction:"轻微遮挡：前排观众",likes:287,liked:false,comments:["室内馆这个距离很不错"],shares:18},
  {id:10,venue:"北京五棵松体育馆",artist:"跨艺人共享",layer:"看台一层",zone:"130",author:"Winnie",text:"130区现场实拍，主屏和延伸舞台角度清楚，整体视线稳定。",media:"北京五棵松体育馆 · 用户实拍",image:"/venue-views/beijing-wukesong-130.jpg",obstruction:"无遮挡",likes:356,liked:false,comments:["收藏了，下次选座参考"],shares:27},
  {id:11,venue:"国家体育场（鸟巢）",artist:"跨艺人共享",layer:"看台一层",zone:"121",author:"Winnie",text:"一层看台121区现场实拍，正对主舞台，适合看完整舞台结构。",media:"国家体育场（鸟巢） · 用户实拍",image:"/venue-views/beijing-birdnest-121.jpg",obstruction:"无遮挡",likes:508,liked:false,comments:["鸟巢一层看台视野真的很开阔"],shares:46},
];

const initialSameShowPosts:SameShowPost[]=[
  {id:101,author:"星星汽水",area:"A3区 · 12排10座",text:"已经进场啦，延伸台视角比想象中近！入口安检大约十分钟。",images:["/venue-views/suzhou-olympic-c2.jpg"],videos:[],likes:86,liked:false,comments:["同区！马上到场馆"],shares:7,time:"刚刚"},
  {id:102,author:"南风入场",area:"C2区 · 座位号隐藏",text:"手幅领取点排队不长，建议入场前先去南广场领取。",images:["/venue-views/beijing-birdnest-121.jpg"],videos:[],likes:42,liked:false,comments:[],shares:3,time:"5分钟前"},
];

const initialCommunityPosts:CommunityPost[]=[
  {id:1,artist:"薛之谦",author:"谦友小北",avatar:"/artists/xuezhiqian.jpg",level:10,title:"今晚又把《天外来物》完整听了一遍",content:"下一场现场的歌单进度到 82% 了，最期待全场一起唱副歌。",likes:286,comments:["我也在循环！","现场见！"],shares:18,liked:false,mine:false,time:"12分钟前"},
  {id:5,artist:"薛之谦",author:"星河入场",avatar:"/artists/xuezhiqian.jpg",level:12,title:"#演唱会现场# 上海站散场交通实测",content:"演出结束后地铁入口会临时分流，建议从东侧出口步行十分钟再叫车，附上现场路线和人流情况。",likes:516,comments:["太需要这篇了","已收藏路线"],shares:64,liked:false,mine:false,time:"18分钟前"},
  {id:6,artist:"薛之谦",author:"谦友晴天",avatar:"/artists/xuezhiqian.jpg",level:9,title:"#现场Repo# A3区延伸台视角记录",content:"A3区中段可以同时看到主舞台与延伸台，灯光无遮挡。返图和完整座位视角已经同步到场馆页面。",likes:438,comments:["请问大屏会被挡吗？","这个视角太好了"],shares:39,liked:false,mine:false,time:"31分钟前"},
  {id:7,artist:"薛之谦",author:"南风收藏夹",avatar:"/artists/xuezhiqian.jpg",level:8,title:"#应援记录# 深圳生日大屏打卡时间更新",content:"星河广场大屏今天 18:00 开始轮播，最佳拍摄机位在东侧二层连廊，现场可以领取纪念贴纸。",likes:327,comments:["晚上见！"],shares:52,liked:false,mine:false,time:"46分钟前"},
  {id:2,artist:"单依纯",author:"一颗纯糖",avatar:"/artists/shanyichun.jpg",level:7,title:"新歌舞台图和现场感受整理",content:"官方图太好看了，也整理了这周的活动资讯和高清图片。",likes:168,comments:["已收藏"],shares:9,liked:false,mine:false,time:"26分钟前"},
  {id:8,artist:"单依纯",author:"纯糖汽水",avatar:"/artists/shanyichun.jpg",level:8,title:"#现场Repo# 广州宝能121区视角",content:"一层看台121区能看清完整舞美，中间主屏无遮挡，座位实拍已经上传到场馆共享视角。",likes:296,comments:["同区参考很有用"],shares:22,liked:false,mine:false,time:"42分钟前"},
  {id:9,artist:"单依纯",author:"云朵收藏家",avatar:"/artists/shanyichun.jpg",level:6,title:"#新歌回归# QQ音乐专辑打卡到 86%",content:"还剩两首没有完整听完，准备今晚继续完成专辑打卡，也整理了最喜欢的三句歌词。",likes:214,comments:["一起打卡！"],shares:15,liked:false,mine:false,time:"1小时前"},
  {id:3,artist:"汪苏泷",author:"小泷包",avatar:"/artists/wangsulong.jpg",level:9,title:"演唱会歌单进度打卡",content:"目前听完 74%，把容易忘记的几首歌重新加入了 QQ 音乐歌单。",likes:203,comments:["一起准备！"],shares:12,liked:false,mine:false,time:"38分钟前"},
  {id:10,artist:"汪苏泷",author:"睡眠周期",avatar:"/artists/wangsulong.jpg",level:10,title:"#打卡地# 深圳中洲湾快闪实拍",content:"快闪店工作日排队大约二十分钟，入口左侧是最佳拍照位置，限定印章在出口服务台。",likes:462,comments:["周末也想去"],shares:47,liked:false,mine:false,time:"52分钟前"},
  {id:11,artist:"汪苏泷",author:"小泷包出发",avatar:"/artists/wangsulong.jpg",level:7,title:"#演唱会现场# 十万伏特歌单准备清单",content:"把演唱会歌单按开场、抒情和安可分成三个阶段，QQ音乐听歌进度已经到 71%。",likes:238,comments:["求分享歌单"],shares:28,liked:false,mine:false,time:"1小时前"},
  {id:4,artist:"i-dle",author:"Neverland星球",avatar:"/artists/idle.jpg",level:8,title:"今日回归话题集中讨论",content:"把官方资讯、概念图和大家的讨论都整理在这里啦。",likes:321,comments:["期待回归"],shares:27,liked:false,mine:false,time:"1小时前"},
  {id:12,artist:"i-dle",author:"紫色星球",avatar:"/artists/idle.jpg",level:9,title:"#高清返图# 澳门银河114区现场记录",content:"114区正面大屏非常清楚，完整舞台构图和灯光效果都拍到了，已同步场馆座位视角。",likes:389,comments:["视角好正！"],shares:34,liked:false,mine:false,time:"1小时前"},
  {id:13,artist:"i-dle",author:"Neverland W",avatar:"/artists/idle.jpg",level:8,title:"#成员日常# 今日公开行程讨论楼",content:"集中整理今天的官方动态、节目片段和成员更新，请大家理性讨论并标注信息来源。",likes:276,comments:["收到"],shares:19,liked:false,mine:false,time:"2小时前"},
];

const nationalVenueCatalog:Record<string,Record<string,string[]>>={
  "北京市":{"北京市":["国家体育场（鸟巢）","国家体育馆","北京五棵松体育馆","国家速滑馆"]},
  "上海市":{"上海市":["上海体育场","梅赛德斯奔驰文化中心","浦发银行东方体育中心","虹口足球场"]},
  "天津市":{"天津市":["天津奥林匹克中心体育场","天津体育馆"]},
  "重庆市":{"重庆市":["重庆奥体中心体育场","华熙LIVE·鱼洞"]},
  "广东省":{"深圳市":["湾区体育中心","深圳体育中心","深圳大运中心体育场"],"广州市":["广州宝能体育馆","广州大学城体育中心","广州体育馆","广东奥林匹克体育中心"],"佛山市":["佛山国际体育文化演艺中心"],"东莞市":["东莞篮球中心"],"珠海市":["珠海体育中心"]},
  "江苏省":{"苏州市":["苏州奥体中心体育场","苏州奥体中心体育馆"],"南京市":["南京奥体中心体育场","南京青奥体育公园体育馆"],"无锡市":["无锡体育中心体育馆"],"常州市":["常州奥体中心体育场"]},
  "浙江省":{"杭州市":["杭州奥体中心体育场","杭州奥体中心体育馆"],"宁波市":["宁波奥体中心体育馆"],"温州市":["温州奥体中心体育场"]},
  "四川省":{"成都市":["东安湖体育公园主体育场","成都凤凰山体育公园","成都金融城演艺中心"],"绵阳市":["绵阳南河体育中心"]},
  "湖北省":{"武汉市":["武汉体育中心体育场","武汉五环体育中心","光谷国际网球中心"]},
  "湖南省":{"长沙市":["贺龙体育中心体育场","长沙国际会展中心","湖南国际会展中心"]},
  "河南省":{"郑州市":["郑州奥林匹克体育中心体育场","郑州国际会展中心"],"洛阳市":["洛阳新区体育场"]},
  "山东省":{"济南市":["济南奥体中心体育场"],"青岛市":["青岛市民健身中心体育场","青岛国信体育馆"]},
  "福建省":{"厦门市":["厦门奥林匹克体育中心","厦门白鹭体育场"],"福州市":["福州海峡奥林匹克体育中心"]},
  "安徽省":{"合肥市":["合肥体育中心体育场","合肥少荃体育中心体育馆"]},
  "陕西省":{"西安市":["西安奥体中心体育场","西安奥体中心体育馆"]},
  "辽宁省":{"沈阳市":["沈阳奥体中心体育场"],"大连市":["大连体育中心体育场","大连体育中心体育馆"]},
  "吉林省":{"长春市":["长春五环体育馆"]},
  "黑龙江省":{"哈尔滨市":["哈尔滨国际会展体育中心体育场"]},
  "河北省":{"石家庄市":["河北奥林匹克体育中心体育场"],"唐山市":["唐山新体育中心体育馆"]},
  "山西省":{"太原市":["山西体育中心体育场"]},
  "江西省":{"南昌市":["南昌国际体育中心体育场"]},
  "广西壮族自治区":{"南宁市":["广西体育中心体育场"],"桂林市":["桂林体育中心体育场"]},
  "云南省":{"昆明市":["昆明拓东体育中心体育场"]},
  "贵州省":{"贵阳市":["贵阳奥林匹克体育中心体育场"]},
  "海南省":{"海口市":["海口五源河体育场","海口五源河体育馆"]},
  "甘肃省":{"兰州市":["兰州奥体中心体育场"]},
  "青海省":{"西宁市":["青海体育中心体育场"]},
  "宁夏回族自治区":{"银川市":["银川体育馆"]},
  "新疆维吾尔自治区":{"乌鲁木齐市":["新疆体育中心体育场"]},
  "内蒙古自治区":{"呼和浩特市":["呼和浩特体育场"]},
  "西藏自治区":{"拉萨市":["拉萨市群众文化体育中心"]},
  "香港特别行政区":{"香港":["启德体育园主场馆","亚洲国际博览馆","红磡香港体育馆"]},
  "澳门特别行政区":{"澳门":["澳门银河综艺馆","澳门威尼斯人金光综艺馆"]},
  "台湾省":{"台北市":["台北小巨蛋","台北大巨蛋"],"高雄市":["高雄国家体育场","高雄巨蛋"]},
};

const results: Result[] = [
  { title: "薛之谦", meta: "艺人 · 128.6万粉丝", type: "艺人", tab: "home", icon: Star },
  { title: "天外来物", meta: "歌曲 · 薛之谦", type: "歌曲", tab: "support", icon: Music2 },
  { title: "天外来物全专一起听", meta: "今晚 20:00 · 3,842人预约", type: "一起听", tab: "support", icon: Radio },
  { title: "深圳演唱会现场攻略", meta: "入场、交通、应援点位", type: "攻略", tab: "live", icon: Map },
  { title: "星河广场应援大屏", meta: "深圳 · 13:00–22:00", type: "地点", tab: "live", icon: MapPin },
  { title: "湾区体育中心 A3 区视角", meta: "座位实拍 · 评分 9.4", type: "座位", tab: "live", icon: Camera },
  { title: "巡演渐变手幅", meta: "热门物料模板 · 12.8k人使用", type: "模板", tab: "create", icon: Palette },
  { title: "深圳追星一日路线", meta: "4个地点 · 约5小时", type: "路线", tab: "live", icon: Route },
];

const bottomItems = [
  { id: "home", label: "首页", icon: Home },
  { id: "support", label: "应援", icon: Heart },
  { id: "live", label: "现场", icon: Compass },
  { id: "create", label: "商城", icon: ShoppingBag },
  { id: "profile", label: "我的", icon: CircleUserRound },
] as const;

const followedArtists = [
  {name:"薛之谦",tone:"a1",image:"/artists/xuezhiqian.jpg",position:"50% 25%",song:"天外来物",fans:"965.2万",next:"广州站 · 11月15日"},
  {name:"单依纯",tone:"a2",image:"/artists/shanyichun.jpg",position:"50% 34%",song:"珠玉",fans:"428.6万",next:"深圳活动 · 10月26日"},
  {name:"汪苏泷",tone:"a3",image:"/artists/wangsulong.jpg",position:"50% 24%",song:"十万伏特",fans:"836.8万",next:"上海站 · 11月2日"},
  {name:"i-dle",tone:"a4",image:"/artists/idle.jpg",position:"50% 38%",song:"Queencard",fans:"686.3万",next:"首尔见面会 · 11月22日"},
];

const pendingFeatures = new Set(["vote","birthday","ranking","news","shop","merchants","groupbuy","orders","calendar","subscribe","carpool","screens","officialshop","myorders","privacy"]);
const doneFeatures = new Set(["album","checklist","citybook","journal","archive","designer","mypage","levels"]);
const getBuildStatus = (id: string): BuildStatus => pendingFeatures.has(id) ? "pending" : doneFeatures.has(id) ? "done" : "demo";
const statusText: Record<BuildStatus,string> = {done:"已实现",demo:"Demo",pending:"待接入"};

const featureItems: Feature[] = [
  {id:"vote",title:"打榜投票",desc:"聚合歌曲榜、人气榜与官方投票入口",tab:"support",icon:Vote,action:"参与本期官方投票",stat:"本期 28,640 人参与",detail:["薛之谦新歌人气榜 · 第3名","天外来物年度歌曲榜 · 第8名","仅跳转官方渠道，不提供自动刷票"]},
  {id:"birthday",title:"生日应援",desc:"倒计时、应援项目与大屏拼团",tab:"support",icon:Cake,action:"加入生日应援",stat:"距离生日 46 天",detail:["深圳星河广场大屏 · 已达成72%","悉尼Town Hall灯箱 · 征集中","资金进度与支出明细公开展示"]},
  {id:"album",title:"专辑打卡",desc:"查看专辑与演唱会歌单的已听进度",tab:"support",icon:Medal,action:"继续收听",stat:"本周进度 68%",detail:["专辑与歌单收听进度","按完整播放比例计算","Demo 使用模拟 QQ音乐播放记录"]},
  {id:"square",title:"歌曲广场",desc:"歌词弹幕、歌曲讨论与热门评论",tab:"support",icon:MessageSquare,action:"发布歌曲感受",stat:"12.8k 条讨论",detail:["#最喜欢的歌词# · 3,281条","制作人幕后分享 · 热评置顶","当前在线同好 896 人"]},
  {id:"playlist",title:"歌单与电台",desc:"主题歌单、自制电台和歌单接力",tab:"support",icon:ListMusic,action:"创建主题歌单",stat:"2,806 个粉丝歌单",detail:["演唱会前必听20首","薛之谦深夜访谈电台","歌单接力已传到第86位"]},
  {id:"ranking",title:"听歌排行",desc:"个人与社区听歌贡献榜 Demo",tab:"support",icon:Trophy,action:"查看我的完整排名",stat:"本周第 128 名",detail:["本周有效听歌 286 分钟","超过91%的社区成员","正式版需经授权接入 QQ音乐播放数据"]},
  {id:"topics",title:"动态与话题",desc:"官方资讯、高清图片、直拍与粉丝讨论",tab:"support",icon:Newspaper,action:"发布一条动态",stat:"今日 8,621 条新动态",detail:["官方新歌、MV与活动资讯","官方图集、现场图片与粉丝创作","回归、成员和演唱会话题"]},
  {id:"groups",title:"粉丝群组",desc:"艺人、城市、活动与应援小组",tab:"support",icon:Users,action:"加入深圳同场群",stat:"286 位同场粉丝",detail:["艺人及成员长期群组","演唱会与活动临时群","同城组队、拼车、拼单与物料交换"]},
  {id:"collection",title:"收藏图鉴",desc:"展示专辑、小卡、周边和徽章",tab:"profile",icon:Image,action:"添加一件收藏",stat:"已收集 36 / 80",detail:["实体专辑 8 张","限定小卡 19 张","城市徽章 9 枚"]},
  {id:"news",title:"官方资讯",desc:"新歌、MV、综艺与活动动态",tab:"home",icon:Newspaper,action:"订阅薛之谦资讯",stat:"今日更新 6 条",detail:["天外来物现场版上线","深圳站入场须知发布","薛之谦新综艺预告公开"]},
  {id:"weekly",title:"应援周报",desc:"社区活跃度、听歌与应援战报",tab:"support",icon:ClipboardList,action:"生成我的周报",stat:"本周贡献 +18%",detail:["社区听歌 82.6万分钟","完成线下打卡 4,821次","新增优质攻略 286篇"]},
  {id:"themes",title:"会员装扮",desc:"头像框、社区皮肤和专属勋章",tab:"profile",icon:Shirt,action:"应用巡演主题",stat:"已解锁 8 款",detail:["巡演动态头像框","深圳站限定主页皮肤","LV.8 星光领航员徽章"]},
  {id:"shop",title:"物料商城",desc:"设计完成后选择材质和数量下单",tab:"create",icon:ShoppingBag,action:"加入模拟购物车",stat:"参考价 ¥2.80 / 份",detail:["哑粉纸手幅 · 60×21cm","亚克力灯牌 · 三档亮度","透扇与小卡支持少量起印"]},
  {id:"merchants",title:"商家入驻",desc:"粉丝工作室和周边店提供制作服务",tab:"create",icon:Store,action:"提交入驻申请",stat:"已认证 128 家",detail:["身份与经营资质核验","作品案例和交付评分","平台担保与争议处理说明"]},
  {id:"groupbuy",title:"团购拼单",desc:"同场粉丝合并订单降低成本",tab:"create",icon:Users,action:"加入深圳站拼单",stat:"还差 8 人成团",detail:["巡演手幅50份拼单","每人预计节省 ¥12","9月30日 20:00 截止"]},
  {id:"orders",title:"订单管理",desc:"查看制作进度与物流状态",tab:"create",icon:Package,action:"查看订单详情",stat:"1 个制作中",detail:["设计稿已确认","预计9月30日完成制作","演示模式不产生真实支付"]},
  {id:"submitpoi",title:"补充打卡点",desc:"提交新地点或更新失效信息",tab:"live",icon:MapPinned,action:"提交新地点",stat:"社区今日新增 18 个",detail:["填写位置、营业时间与图片","由同城用户交叉核验","失效信息可一键报错"]},
  {id:"guides",title:"攻略库",desc:"一日游、两日游与现场经验",tab:"live",icon:BookOpen,action:"收藏深圳一日攻略",stat:"已收录 1,286 篇",detail:["深圳追星一日路线 · 4.9分","场馆周边两日游 · 4.8分","首次看演唱会避坑指南 · 4.9分"]},
  {id:"checklist",title:"待打卡清单",desc:"收藏地点并记录完成状态",tab:"live",icon:ListChecks,action:"完成下一个地点",stat:"已完成 3 / 7",detail:["星河广场应援大屏 · 已完成","薛之谦同款咖啡店 · 已完成","湾区补给站 · 待打卡"]},
  {id:"citybook",title:"城市图鉴",desc:"点亮地点并解锁城市徽章",tab:"profile",icon:Medal,action:"查看深圳图鉴",stat:"已点亮 8 座城市",detail:["深圳 · 12/16地点","上海 · 9/12地点","悉尼 · 6/10地点"]},
  {id:"calendar",title:"活动日历",desc:"演唱会、见面会、签售和应援活动",tab:"live",icon:Calendar,action:"加入我的日历",stat:"未来30天有 6 场",detail:["10.11 薛之谦深圳演唱会","10.13 深圳线下应援展","10.22 新专线上签售"]},
  {id:"subscribe",title:"城市订阅",desc:"订阅艺人与城市活动提醒",tab:"live",icon:Bell,action:"订阅深圳与薛之谦",stat:"已订阅 3 个城市",detail:["深圳 · 12个近期活动","悉尼 · 5个近期活动","广州 · 8个近期活动"]},
  {id:"repo",title:"现场 Repo",desc:"实况、直拍、座位视角与注意事项",tab:"live",icon:Camera,action:"发布现场 Repo",stat:"深圳站已有 286 篇",detail:["A3区延伸台视角 · 1.2k赞","2号门入场实况 · 896赞","散场地铁客流提醒 · 已置顶"]},
  {id:"team",title:"同城组队",desc:"同城、同路线和同活动安全同行",tab:"live",icon:UserPlus,action:"申请加入同行小组",stat:"32 个小组招募中",detail:["深圳北站出发 · 还差2人","南山打卡路线 · 还差3人","仅公开必要信息，支持举报"]},
  {id:"carpool",title:"拼车与集合",desc:"发布同行、集合和拼车信息",tab:"live",icon:Car,action:"加入南山集合点",stat:"18 条有效信息",detail:["南山地铁站D口 · 15:00","深圳北站拼车 · 13:30","平台不处理车费，建议使用正规平台"]},
  {id:"exchange",title:"物料交换",desc:"预约交换小卡、手幅与周边",tab:"live",icon:Repeat2,action:"预约小卡交换",stat:"场馆周边 46 条",detail:["薛之谦限定小卡交换","巡演手幅免费领取","统一在官方划定区域见面"]},
  {id:"journal",title:"追星日记",desc:"记录照片、视频、文字和消费",tab:"profile",icon:NotebookPen,action:"新建深圳站日记",stat:"已记录 12 次旅程",detail:["自动导入打卡时间线","记录预算与实际花费","一键生成旅程纪念卡"]},
  {id:"archive",title:"行程档案",desc:"路线复盘、公开分享与隐私控制",tab:"profile",icon:Lock,action:"生成本次行程档案",stat:"最近旅程准备度 96%",detail:["计划路线与实际路线对比","公开、仅好友或私密可选","重要提醒沉淀为下一次攻略"]},
  {id:"levels",title:"粉丝等级体系",desc:"按签到、互动与线下足迹解锁艺人专属等级",tab:"profile",icon:Trophy,action:"查看等级成长记录",stat:"薛之谦超话 LV.12",detail:["当前热爱值 7,746","等级显示在社区昵称后方","每位艺人拥有独立身份与等级"]},
  {id:"listentogether",title:"一起听",desc:"同步播放、歌词弹幕与集体应援任务",tab:"support",icon:Radio,action:"预约今晚一起听",stat:"3,842 人已预约",detail:["20:00 天外来物全专房间","同步歌词弹幕和评论","完成后计入社区听歌战报"]},
  {id:"images",title:"图片与内容资源",desc:"官方图集、MV宣传图与粉丝应援图片",tab:"home",icon:Image,action:"收藏本期官方图集",stat:"今日新增 86 张",detail:["天外来物官方概念图","深圳站现场高清图集","支持关联艺人、歌曲与活动"]},
  {id:"artistgroups",title:"艺人与活动群组",desc:"艺人群、同城群、活动群与应援小组",tab:"home",icon:Users,action:"加入当前歌手群组",stat:"当前歌手 18 个活跃群",detail:["薛之谦官方话题讨论组","深圳站临时同行群","生日应援项目协作组"]},
  {id:"screens",title:"城市大屏地图",desc:"查看大屏位置、投放时段与拍摄机位",tab:"live",icon:MapPinned,action:"收藏星河广场大屏",stat:"深圳在投 12 块",detail:["商圈、地铁与楼宇屏聚合","显示应援对象及起止时间","用户可提交并更新投放状态"]},
  {id:"routeplanner",title:"路线规划器",desc:"按距离和交通生成半日、一日或两日路线",tab:"live",icon:Route,action:"保存推荐路线",stat:"已选择 4 个地点",detail:["自动连接多个打卡点","支持调整顺序与停留时间","保存至个人行程后继续编辑"]},
  {id:"onsite",title:"现场攻略",desc:"抢票、入场、交通、住宿与座位参考",tab:"live",icon:TicketCheck,action:"收藏深圳站现场攻略",stat:"286 条真实经验",detail:["入场流程与场馆交通","座位视角和拍摄注意事项","应援点及物料领取分布"]},
  {id:"supportpoint",title:"线下应援点",desc:"花墙、甜品台和易拉宝位置与开放时间",tab:"live",icon:MapPin,action:"导航到最近应援点",stat:"场馆周边 8 个",detail:["主办方与应援对象信息","现场图片和打卡要求","支持收藏、导航与签到"]},
  {id:"templates",title:"物料模板库",desc:"手幅、小卡、灯牌、透扇与宣传图模板",tab:"create",icon:FileImage,action:"套用巡演手幅模板",stat:"1,286 款模板",detail:["按品类、艺人与活动筛选","免费及付费模板分类","一键进入在线编辑器"]},
  {id:"designer",title:"在线设计工具",desc:"换图、改字、配色、尺寸与实时预览",tab:"create",icon:Palette,action:"保存当前设计草稿",stat:"草稿已自动保存",detail:["上传图片并拖拽排版","调整字体、贴纸和背景","导出图片或印刷文件"]},
  {id:"submission",title:"设计投稿",desc:"上传原创模板并设置免费或付费使用",tab:"create",icon:Plus,action:"提交原创设计",stat:"本周 326 件投稿",detail:["手幅、小卡与应援图投稿","支持收藏、点赞、评论和套用","优质作品进入推荐专区"]},
  {id:"officialshop",title:"官方周边商城",desc:"专辑、官方周边与合作应援商品入口",tab:"create",icon:ShoppingBag,action:"收藏官方周边",stat:"当前歌手 28 件商品",detail:["官方专辑与周边入口","按艺人和活动分类展示","与粉丝自制物料明确区分"]},
  {id:"materialexchange",title:"物料交换",desc:"发布想要与可交换的小卡和周边",tab:"create",icon:Repeat2,action:"发布交换需求",stat:"同城 46 条有效信息",detail:["标注交换物品与品相","预约安全的线下时间地点","完成后双方确认与评价"]},
  {id:"works",title:"物料作品社区",desc:"晒设计和成品，关联艺人、活动与模板",tab:"create",icon:Camera,action:"发布物料成品",stat:"今日 1,862 件新作品",detail:["点赞、收藏、评论与分享","优质作品回流首页和话题","为模板与商城带来真实流量"]},
  {id:"mypage",title:"个人主页",desc:"主页、关注、等级、贡献与内容作品",tab:"profile",icon:CircleUserRound,action:"编辑个人主页",stat:"资料完整度 86%",detail:["展示关注艺人与粉丝头衔","汇总动态、攻略、repo和设计","管理徽章、头像框及个人简介"]},
  {id:"mysaves",title:"收藏与订阅",desc:"帖子、攻略、路线、活动、模板与商品",tab:"profile",icon:Heart,action:"查看全部收藏",stat:"共 128 项",detail:["保存的路线和待打卡清单","关注的活动与应援项目","订阅艺人和城市提醒"]},
  {id:"myorders",title:"订单与资产",desc:"物料、周边、拼单、物流与售后",tab:"profile",icon:Package,action:"查看全部订单",stat:"1 个制作中",detail:["物料与官方周边订单","团购拼单和物流信息","售后、确认收货与评价"]},
  {id:"privacy",title:"账号与隐私",desc:"通知、公开范围、黑名单与账号安全",tab:"profile",icon:Lock,action:"检查隐私设置",stat:"安全状态良好",detail:["行程公开或私密设置","黑名单、举报与内容权限","账号安全和消息通知"]},
];

export default function Page() {
  const [storageReady,setStorageReady]=useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [heatByArtist,setHeatByArtist]=useState<Record<string,number>>({"薛之谦":7746,"单依纯":4260,"汪苏泷":5830,"i-dle":5120});
  const [checkedByArtist, setCheckedByArtist] = useState<Record<string,boolean>>({});
  const [taskDoneByArtist, setTaskDoneByArtist] = useState<Record<string,boolean[]>>({});
  const [routeBuiltByArtist, setRouteBuiltByArtist] = useState<Record<string,boolean>>({});
  const [saved, setSaved] = useState<number[]>([1]);
  const [livePlaces,setLivePlaces]=useState<LivePlace[]>(initialLivePlaces);
  const [venueSeatPosts,setVenueSeatPosts]=useState<VenueSeatPost[]>(initialVenueSeatPosts);
  const [sameShowPosts,setSameShowPosts]=useState<SameShowPost[]>(initialSameShowPosts);
  const [notice, setNotice] = useState("");
  const [feature, setFeature] = useState<Feature | null>(null);
  const [featureDone, setFeatureDone] = useState<Record<string, boolean>>({});
  const [artist, setArtist] = useState("薛之谦");
  const [artistPage, setArtistPage] = useState(false);
  const [footprintCity, setFootprintCity] = useState<string | null>(null);
  const [supportArtistPage,setSupportArtistPage]=useState(false);
  const [collectionOpen,setCollectionOpen]=useState(false);
  const [identityOpen,setIdentityOpen]=useState(false);
  const [checkins,setCheckins]=useState<CheckinRecord[]>([]);
  const [concertSessionByArtist,setConcertSessionByArtist]=useState<Record<string,ConcertSession>>({});
  const [merchItems,setMerchItems]=useState<MerchItem[]>([
    {id:1,artist:"薛之谦",name:"天外来物限定CD",kind:"官方周边",price:"96",image:"/artists/xuezhiqian.jpg",selling:false},
    {id:2,artist:"薛之谦",name:"巡演纪念手幅",kind:"自制周边",price:"28",image:"/artists/xuezhiqian.jpg",selling:true},
  ]);
  const [mallOrders,setMallOrders]=useState<MallOrder[]>(initialMallOrders);
  const [identities,setIdentities]=useState<Record<string,ArtistIdentity>>({
    "薛之谦":{nickname:"小雪睡饱饱",avatar:"/artists/xuezhiqian.jpg",level:12,firstListen:"2020.03.14",listenHours:"286 小时",recentListen:"今天 22:16"},
    "单依纯":{nickname:"纯纯的云",avatar:"/artists/shanyichun.jpg",level:7,firstListen:"2021.01.08",listenHours:"168 小时",recentListen:"昨天 23:41"},
    "汪苏泷":{nickname:"小泷包",avatar:"/artists/wangsulong.jpg",level:9,firstListen:"2018.07.22",listenHours:"324 小时",recentListen:"09.26 20:18"},
    "i-dle":{nickname:"Neverland W",avatar:"/artists/idle.jpg",level:8,firstListen:"2023.05.17",listenHours:"196 小时",recentListen:"今天 18:32"},
  });
  const [communityPosts,setCommunityPosts]=useState<CommunityPost[]>(initialCommunityPosts);
  useEffect(()=>{
    try{
      const raw=window.localStorage.getItem("liveready-demo-v1");
      if(raw){
        const savedState=JSON.parse(raw);
        if(savedState.heatByArtist)setHeatByArtist(savedState.heatByArtist);
        if(savedState.checkedByArtist)setCheckedByArtist(savedState.checkedByArtist);
        if(savedState.taskDoneByArtist)setTaskDoneByArtist(savedState.taskDoneByArtist);
        if(savedState.routeBuiltByArtist)setRouteBuiltByArtist(savedState.routeBuiltByArtist);
        if(savedState.saved)setSaved(savedState.saved);
        if(savedState.livePlaces){
          const restored=savedState.livePlaces as LivePlace[];
          setLivePlaces([...initialLivePlaces.map(place=>({...place,...restored.find(item=>item.id===place.id)})),...restored.filter(item=>!initialLivePlaces.some(place=>place.id===item.id))]);
        }
        if(savedState.checkins)setCheckins((savedState.checkins as CheckinRecord[]).map(record=>({...record,media:(record.media??[]).map((item:CheckinMediaItem|string)=>typeof item==="string"?{name:item,type:item.match(/\.(mp4|mov|webm)$/i)?"video":item.match(/\.(mp3|m4a|wav|aac)$/i)?"audio":"image",url:""}:item)})));
        if(savedState.concertSessionByArtist)setConcertSessionByArtist(savedState.concertSessionByArtist);
        if(savedState.communityPosts){
          const restored=savedState.communityPosts as CommunityPost[];
          setCommunityPosts([...initialCommunityPosts.map(post=>({...post,...restored.find(item=>item.id===post.id)})),...restored.filter(item=>!initialCommunityPosts.some(post=>post.id===item.id))]);
        }
        if(savedState.sameShowPosts)setSameShowPosts(savedState.sameShowPosts);
        if(savedState.venueSeatPosts){
          const restored=savedState.venueSeatPosts as VenueSeatPost[];
          setVenueSeatPosts([...initialVenueSeatPosts.map(post=>({...post,...restored.find(item=>item.id===post.id)})),...restored.filter(item=>!initialVenueSeatPosts.some(post=>post.id===item.id))]);
        }
        if(savedState.artist)setArtist(savedState.artist);
      }
    }catch{}
    setStorageReady(true);
  },[]);
  useEffect(()=>{
    if(!storageReady)return;
    try{window.localStorage.setItem("liveready-demo-v1",JSON.stringify({heatByArtist,checkedByArtist,taskDoneByArtist,routeBuiltByArtist,saved,livePlaces,checkins,concertSessionByArtist,communityPosts,sameShowPosts,venueSeatPosts,artist}))}catch{}
  },[storageReady,heatByArtist,checkedByArtist,taskDoneByArtist,routeBuiltByArtist,saved,livePlaces,checkins,concertSessionByArtist,communityPosts,sameShowPosts,venueSeatPosts,artist]);
  const points=heatByArtist[artist] ?? 0;
  const checked=checkedByArtist[artist] ?? false;
  const taskDone=taskDoneByArtist[artist] ?? [false,false,false];
  const routeBuilt=routeBuiltByArtist[artist] ?? false;
  const concertSession=concertSessionByArtist[artist] ?? {parsed:false,image:"",name:"",verified:false};
  const setPoints=(update:number|((value:number)=>number))=>setHeatByArtist(current=>({...current,[artist]:typeof update==="function"?update(current[artist]??0):update}));

  const filtered = useMemo(() => {
    const key = query.trim().toLowerCase();
    const allResults: Result[] = [
      ...results,
      ...featureItems.filter(item=>item.id!=="square").map(item => ({title:item.title,meta:item.desc,type:"功能",tab:item.tab,icon:item.icon,feature:item.id}))
    ];
    if (!key) return allResults;
    return allResults.filter(item => `${item.title}${item.meta}${item.type}`.toLowerCase().includes(key));
  }, [query]);

  const toast = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2200);
  };
  const go = (next: Tab) => {
    if (next === "home") setArtistPage(false);
    setTab(next);
    setSearching(false);
    setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const checkIn = () => {
    if (checked) return;
    setCheckedByArtist(current=>({...current,[artist]:true}));
    setPoints(value => value + 8);
    toast("签到成功，热爱值 +8");
  };
  const finishTask = (index: number) => {
    if (taskDone[index]) return;
    setTaskDoneByArtist(current=>({...current,[artist]:taskDone.map((item,i)=>item||i===index)}));
    setPoints(value => value + 10);
    toast("任务完成，热爱值 +10");
  };

  return <div className="desktop-stage">
    <main className="phone-app">
      <div className="page-content">
        {tab === "home" && <HomeView points={points} checked={checked} checkIn={checkIn} go={go} open={setFeature} search={()=>setSearching(true)} artist={artist} artistPage={artistPage} openArtist={(name)=>{setArtist(name);setTab("support");setSupportArtistPage(true);window.scrollTo({top:0,behavior:"smooth"})}} openMoreArtists={()=>{setTab("support");setSupportArtistPage(false);window.scrollTo({top:0,behavior:"smooth"})}} backHome={()=>setArtistPage(false)} openFootprint={(city)=>setFootprintCity(city)} journalDone={Boolean(featureDone.journal)||checkins.length>0} openSupport={()=>{setTab("support");setSupportArtistPage(true);window.scrollTo({top:0,behavior:"smooth"})}} openCollection={()=>setCollectionOpen(true)} openIdentity={()=>setIdentityOpen(true)} identity={identities[artist]} merchCount={merchItems.filter(item=>item.artist===artist).length} checkins={checkins}/>}
        {tab === "support" && <SupportView artist={artist} points={points} checked={checked} checkIn={checkIn} awardHeat={(amount,message)=>{setPoints(value=>value+amount);toast(message)}} open={setFeature} entered={supportArtistPage} enter={(name)=>{setArtist(name);setSupportArtistPage(true);window.scrollTo({top:0,behavior:"smooth"})}} back={()=>setSupportArtistPage(false)} identity={identities[artist]} openIdentity={()=>setIdentityOpen(true)} posts={communityPosts.filter(post=>post.artist===artist)} places={livePlaces} addOfficialPlace={(place)=>{const existing=livePlaces.find(item=>item.name===place.name);if(existing){setSaved(current=>current.includes(existing.id)?current:[...current,existing.id]);toast(`${place.name} 已收藏并同步到现场地图`);return}const id=Date.now();setLivePlaces(current=>[...current,{...place,id}]);setSaved(current=>[...current,id]);toast(`${place.name} 已添加、收藏并同步到现场地图`)}} sameShowPosts={sameShowPosts} setSameShowPosts={setSameShowPosts} addPost={(title,content)=>setCommunityPosts(current=>[{id:Date.now(),artist,author:identities[artist].nickname,avatar:identities[artist].avatar,level:identities[artist].level,title,content,likes:0,comments:[],shares:0,liked:false,mine:true,time:"刚刚"},...current])} toggleLike={(id)=>setCommunityPosts(current=>current.map(post=>post.id===id?{...post,liked:!post.liked,likes:post.likes+(post.liked?-1:1)}:post))} addComment={(id,comment)=>setCommunityPosts(current=>current.map(post=>post.id===id?{...post,comments:[...post.comments,comment]}:post))} sharePost={(id)=>{setCommunityPosts(current=>current.map(post=>post.id===id?{...post,shares:post.shares+1}:post));toast("已生成帖子分享卡")}}/>}
        {tab === "live" && <LiveView artist={artist} built={routeBuilt} setBuilt={(value)=>setRouteBuiltByArtist(current=>({...current,[artist]:value}))} saved={saved} setSaved={setSaved} places={livePlaces} venueSeatPosts={venueSeatPosts} setVenueSeatPosts={setVenueSeatPosts} sameShowPosts={sameShowPosts} setSameShowPosts={setSameShowPosts} addPlace={(place)=>setLivePlaces(current=>[...current,{...place,id:Date.now()}])} markInvalid={(id)=>setLivePlaces(current=>current.map(place=>place.id===id?{...place,valid:!place.valid}:place))} toast={toast} open={setFeature} concertSession={concertSession} setConcertSession={(value)=>setConcertSessionByArtist(current=>({...current,[artist]:value}))} onCheckin={(record)=>{setCheckins(current=>[record,...current]);setPoints(value=>value+30);toast(`已打卡 ${record.place} · 热爱值 +30`)}}/>}
        {tab === "create" && <CreateView artist={artist} toast={toast} open={setFeature} merchItems={merchItems} openCollection={()=>setCollectionOpen(true)} orders={mallOrders} setOrders={setMallOrders}/>}
        {tab === "profile" && <ProfileView orders={mallOrders} resetDemo={()=>{window.localStorage.removeItem("liveready-demo-v1");Object.keys(window.localStorage).filter(key=>key.startsWith("liveready-support-")).forEach(key=>window.localStorage.removeItem(key));window.location.reload()}}/>}
      </div>

      <MiniPlayer playing={playing} toggle={() => setPlaying(value => !value)}/>
      <nav className="bottom-nav">
        {bottomItems.map(item => { const Icon = item.icon; const active = tab === item.id; return <button key={item.id} className={active ? "active" : ""} onClick={() => {if(item.id==="support")setSupportArtistPage(false);go(item.id as Tab)}}><Icon size={22} fill={active && (item.id === "home" || item.id === "support") ? "currentColor" : "none"}/><span>{item.label}</span></button>; })}
      </nav>

      {searching && <SearchPanel query={query} setQuery={setQuery} results={filtered} close={() => {setSearching(false);setQuery("");}} select={(item) => {
        if(item.feature){ const target=featureItems.find(x=>x.id===item.feature); if(target)setFeature(target); }
        else go(item.tab);
        setSearching(false); setQuery(""); toast(`已打开：${item.title}`);
      }}/>}
      {feature && <FeatureSheet artist={artist} feature={feature} posts={communityPosts.filter(post=>post.artist===artist)} places={livePlaces} addPlace={(place)=>setLivePlaces(current=>[...current,{...place,id:Date.now()}])} markInvalid={(id)=>setLivePlaces(current=>current.map(place=>place.id===id?{...place,valid:!place.valid}:place))} addPost={(title,content)=>setCommunityPosts(current=>[{id:Date.now(),artist,author:identities[artist].nickname,avatar:identities[artist].avatar,level:identities[artist].level,title,content,likes:0,comments:[],shares:0,liked:false,mine:true,time:"刚刚"},...current])} done={Boolean(featureDone[feature.id])} close={()=>setFeature(null)} complete={()=>{
        setFeatureDone(current=>({...current,[feature.id]:true}));
        setPoints(value=>value+(feature.id==="journal"?40:20));
        toast(`${feature.action}成功 · 热爱值 +${feature.id==="journal"?40:20}`);
      }}/>}
      {footprintCity && <FootprintSheet key={footprintCity} initialCity={footprintCity} checkins={checkins} close={()=>setFootprintCity(null)}/>}
      {collectionOpen&&<CollectionSheet artist={artist} items={merchItems.filter(item=>item.artist===artist)} close={()=>setCollectionOpen(false)} add={(item)=>setMerchItems(current=>[...current,{...item,id:Date.now(),artist}])} toggleSell={(id)=>setMerchItems(current=>current.map(item=>item.id===id?{...item,selling:!item.selling}:item))}/>}
      {identityOpen&&<ArtistIdentitySheet artist={artist} value={identities[artist]} points={points} checked={checked} done={taskDone} posts={communityPosts.filter(post=>post.artist===artist)} checkIn={checkIn} finish={finishTask} close={()=>setIdentityOpen(false)} save={(value)=>{setIdentities(current=>({...current,[artist]:value}));setIdentityOpen(false);toast("艺人社区身份已保存")}}/>}
      {notice && <div className="toast"><Check size={17}/>{notice}</div>}
    </main>
  </div>;
}

function HomeView({points,checked,checkIn,go,open,search,artist,artistPage,openArtist,openMoreArtists,backHome,openFootprint,journalDone,openSupport,openCollection,openIdentity,identity,merchCount,checkins}:{points:number;checked:boolean;checkIn:()=>void;go:(tab:Tab)=>void;open:(f:Feature)=>void;search:()=>void;artist:string;artistPage:boolean;openArtist:(name:string)=>void;openMoreArtists:()=>void;backHome:()=>void;openFootprint:(city:string)=>void;journalDone:boolean;openSupport:()=>void;openCollection:()=>void;openIdentity:()=>void;identity:ArtistIdentity;merchCount:number;checkins:CheckinRecord[]}) {
  const [timelineOpen,setTimelineOpen]=useState(false);
  if(artistPage) return <ArtistHome artist={artist} go={go} open={open} back={backHome} openFootprint={openFootprint} openSupport={openSupport} openCollection={openCollection} openIdentity={openIdentity} identity={identity} merchCount={merchCount} checkins={checkins}/>;
  const journal=featureItems.find(item=>item.id==="journal")!;
  return <div className="stack">
    <section className="home-topline"><div className="user-avatar">W</div><div><strong>Winnie</strong><span><MapPin size={13}/>悉尼</span></div><button onClick={search} aria-label="搜索"><Search/></button><button onClick={() => go("profile")} aria-label="我的"><CircleUserRound/></button></section>
    <section className="my-journey-card"><div className="journey-intro"><span><NotebookPen/></span><div><small>MY STAR JOURNEY</small><h1>我的追星日记</h1><p>从第一次现场，到走过的每一座城。</p></div><button onClick={()=>open(journal)}>全部 <ChevronRight/></button></div>{journalDone&&<div className="journal-earned-badge"><Medal/><div><b>城市打卡者</b><small>{checkins[0]?`${checkins[0].place} 已同步 · 热爱值 +30`:"完成打卡 · 热爱值已增加"}</small></div><span>已获得</span></div>}<div className="journey-numbers"><div><b>8</b><span>打卡城市</span></div><div><b>12</b><span>演唱会</span></div><div><b>{36+checkins.length}</b><span>打卡地点</span></div><div><b>{24+checkins.length}</b><span>日记记录</span></div></div><div className="city-chips"><button onClick={()=>openFootprint("深圳")}>深圳</button><button onClick={()=>openFootprint("上海")}>上海</button><button onClick={()=>openFootprint("广州")}>广州</button><button onClick={()=>openFootprint("悉尼")}>悉尼</button><button className="map-link" onClick={()=>openFootprint(checkins[0]?.city||"深圳")}>查看足迹地图</button></div></section>

    <SectionHead title="选择关注歌手" action="进入艺人应援"/>
    <section className="artist-entry-grid">{followedArtists.map(item=>{const visibleHeat=artist===item.name?points:({"薛之谦":7746,"单依纯":4260,"汪苏泷":5830,"i-dle":5120} as Record<string,number>)[item.name]??0;return <button key={item.name} className={artist===item.name?"selected":""} onClick={()=>openArtist(item.name)}><i className={`${item.tone} artist-photo-slot`}><img src={item.image} alt={`${item.name}头像`} style={{objectPosition:item.position}}/></i><b>{item.name}</b><small className="artist-heat-value"><Heart fill="currentColor"/>{visibleHeat.toLocaleString()} 热爱值</small></button>})}<button className="more-artists" onClick={openMoreArtists}><i><Plus/></i><b>更多…</b><small>全部艺人</small></button></section>

    <SectionHead title="最近的追星日记" action="时间线" onAction={()=>setTimelineOpen(true)}/>
    <section className="home-journals">{checkins[0]&&<button className="fresh-journal-entry" onClick={()=>openFootprint(checkins[0].city)}><span className="journal-date fresh"><b>{new Date(checkins[0].id).getDate().toString().padStart(2,"0")}</b><small>NEW</small></span><div><b>{checkins[0].city} · {checkins[0].place}</b><p>{checkins[0].time} · {checkins[0].media.length}个媒体 · 心情 {checkins[0].mood||"已记录"}</p><em><Sparkles/>本次打卡 +30 热爱值</em></div><ChevronRight/></button>}<button onClick={()=>openFootprint("上海")}><span className="journal-date"><b>16</b><small>AUG</small></span><div><b>上海 · 天外来物演唱会</b><p>2026.08.16 19:30 · 18张照片 · 心情 🤩</p></div><ChevronRight/></button><button onClick={()=>openFootprint("广州")}><span className="journal-date purple"><b>02</b><small>MAY</small></span><div><b>广州 · 生日应援一日游</b><p>2026.05.02 14:10 · 7个地点 · 心情 🥰</p></div><ChevronRight/></button></section>

    <SectionHead title="同好正在分享" action="查看更多"/>
    <section className="feed-grid">
      <article onClick={() => go("live")}><div className="feed-art real"><img src="/venue-views/beijing-birdnest-121.jpg" alt="国家体育场一层看台121区真实视角"/><span><Camera size={14}/>座位实拍</span></div><h3>鸟巢一层看台121区，用户真实现场视角</h3><p><span className="tiny-avatar">W</span>Winnie · <Heart size={13}/> 905</p></article>
      <article onClick={() => go("live")}><div className="feed-art real"><img src="/places/wangsulong-zhongzhouwan-popup.jpg" alt="深圳中洲湾汪苏泷快闪打卡"/><span><MapPin size={14}/>快闪打卡</span></div><h3>深圳中洲湾·汪苏泷「睡眠周期」快闪</h3><p><span className="tiny-avatar">W</span>Winnie · <Heart size={13}/> 688</p></article>
    </section>
    {timelineOpen&&<JournalTimelineSheet checkins={checkins} close={()=>setTimelineOpen(false)} openFootprint={openFootprint}/>} 
  </div>;
}

function ArtistHome({artist,go,open,back,openFootprint,openSupport,openCollection,openIdentity,identity,merchCount,checkins}:{artist:string;go:(tab:Tab)=>void;open:(f:Feature)=>void;back:()=>void;openFootprint:(city:string)=>void;openSupport:()=>void;openCollection:()=>void;openIdentity:()=>void;identity:ArtistIdentity;merchCount:number;checkins:CheckinRecord[]}) {
  const data=followedArtists.find(item=>item.name===artist) ?? followedArtists[0];
  return <div className="stack artist-home">
    <button className="back-dashboard" onClick={back}><ChevronLeft/>我的追星首页</button>
    <section className={`artist-home-hero ${data.tone}`}><div className="artist-home-avatar"><img src={data.image} alt={`${data.name}头像`} style={{objectPosition:data.position}}/></div><div><small>QQ音乐关注歌手</small><h1>{data.name}</h1><p>{data.fans} 粉丝 · 已关注 1286 天</p></div><button className="artist-identity-button" onClick={openIdentity}><img src={identity.avatar} alt="我的艺人社区头像"/><span>{identity.nickname}</span></button></section>
    <section className="artist-identity-card" onClick={openIdentity}><img src={identity.avatar} alt="艺人社区头像"/><div><small>我在{artist}社区</small><b>{identity.nickname} <em>{artist}超话 LV.{identity.level}</em></b><div className="qq-listen-mini"><span><small>首次收听</small><strong>{identity.firstListen}</strong></span><span><small>累计听歌</small><strong>{identity.listenHours}</strong></span><span><small>最近收听</small><strong>{identity.recentListen}</strong></span></div></div><ChevronRight/></section>
    <section className="artist-home-stats"><div><b>286h</b><span>累计听歌</span></div><div><b>6</b><span>看过现场</span></div><button onClick={openCollection}><b>{merchCount}</b><span>收藏周边</span></button><div><b>LV.{identity.level}</b><span>粉丝等级</span></div></section>
    <section className="artist-next-card"><div><small>NEXT STOP · {data.name}</small><h2>{data.next}</h2><p>行程准备度 72% · 已收藏4个打卡点</p></div><button onClick={()=>go("live")}>继续准备 <ChevronRight/></button></section>
    <section className="action-grid"><button onClick={openSupport}><span className="action-icon green"><Headphones/></span><b>艺人社区</b><small>签到与热爱值</small></button><button onClick={()=>go("live")}><span className="action-icon blue"><Map/></span><b>城市攻略</b><small>16个点</small></button><button onClick={()=>go("live")}><span className="action-icon pink"><Camera/></span><b>现场内容</b><small>攻略与repo</small></button><button onClick={()=>go("create")}><span className="action-icon orange"><ShoppingBag/></span><b>周边商城</b><small>收藏与转卖</small></button></section>
    <SectionHead title={`我的${artist}追星日记`} action="仅看该艺人"/>
    <section className="artist-journal-list">{checkins.filter(item=>item.artist===artist).slice(0,1).map(item=><button key={item.id} onClick={()=>openFootprint(item.city)}><span className="journal-date fresh"><b>{new Date(item.id).getDate().toString().padStart(2,"0")}</b><small>NEW</small></span><div><b>{artist} · {item.place}</b><p>{item.time} · {item.media.length}个媒体 · 心情 {item.mood||"已记录"}</p><em><Medal/>刚刚获得打卡徽章 · +30 热爱值</em></div><ChevronRight/></button>)}<button onClick={()=>openFootprint("上海")}><span className="journal-date"><b>16</b><small>AUG</small></span><div><b>{artist} · 上海演唱会打卡</b><p>2026.08.16 19:30 · 18张照片 · 心情 🤩</p><em><Medal/>城市打卡者</em></div><ChevronRight/></button><button onClick={()=>openFootprint("广州")}><span className="journal-date purple"><b>02</b><small>MAY</small></span><div><b>{artist} · 广州应援大屏</b><p>2026.05.02 14:10 · 2个Mark · 心情 🥰</p></div><ChevronRight/></button></section>
    <StatusLegend/>
    <SectionHead title={`${data.name}最新动态`} action="全部"/>
    <section className="artist-news"><article><span><Music2/></span><div><b>{data.song} · 演唱会必听歌单已更新</b><small>{identity.nickname} <em className="fan-level-suffix">{artist}超话 LV.{identity.level}</em> · 10分钟前</small></div></article><article><span className="pink"><Calendar/></span><div><b>{data.next}活动攻略开放共建</b><small>已有286位粉丝补充信息</small></div></article></section>
    <SectionHead title="歌手专属内容" action="5项"/>
    <FeatureHub items={featureItems.filter(item=>["news","square","album","topics","images"].includes(item.id))} open={open}/>
  </div>;
}

function SupportView({artist,points,checked,checkIn,awardHeat,open,entered,enter,back,identity,openIdentity,posts,places,addOfficialPlace,sameShowPosts,setSameShowPosts,addPost,toggleLike,addComment,sharePost}:{artist:string;points:number;checked:boolean;checkIn:()=>void;awardHeat:(amount:number,message:string)=>void;open:(f:Feature)=>void;entered:boolean;enter:(name:string)=>void;back:()=>void;identity:ArtistIdentity;openIdentity:()=>void;posts:CommunityPost[];places:LivePlace[];addOfficialPlace:(place:Omit<LivePlace,"id">)=>void;sameShowPosts:SameShowPost[];setSameShowPosts:Dispatch<SetStateAction<SameShowPost[]>>;addPost:(title:string,content:string)=>void;toggleLike:(id:number)=>void;addComment:(id:number,comment:string)=>void;sharePost:(id:number)=>void}) {
  const [showRules,setShowRules]=useState(false);
  const [threadOpen,setThreadOpen]=useState(false);
  const [communityOpen,setCommunityOpen]=useState(false);
  const [communityFeed,setCommunityFeed]=useState("热门");
  const [supportToolTab,setSupportToolTab]=useState("topics");
  const [campaignStorageReady,setCampaignStorageReady]=useState(false);
  const [selectedTaskPost,setSelectedTaskPost]=useState<{title:string;tag:string;body:string;likes:number;comments:number;shares:number}|null>(null);
  const [supportTaskChecks,setSupportTaskChecks]=useState<string[]>(["birthday-like"]);
  const [supportActionRecords,setSupportActionRecords]=useState([
    "10.06 17:42 · 点赞《天外来物》舞台帖 · +2 热爱值",
    "10.06 16:18 · 完整收听演唱会歌单 1 次 · +10 热爱值",
    "10.05 21:06 · 转发深圳站应援公告 · +2 热爱值",
  ]);
  const [composeOpen,setComposeOpen]=useState(false);
  const [activePostId,setActivePostId]=useState<number|null>(null);
  const [postTitle,setPostTitle]=useState("");
  const [postContent,setPostContent]=useState("");
  const [comment,setComment]=useState("");
  const [seatCommunityOpen,setSeatCommunityOpen]=useState(false);
  const [seatVerified,setSeatVerified]=useState(false);
  const [ticketProof,setTicketProof]=useState("");
  const [concertShow,setConcertShow]=useState("深圳站 · 2026.10.11");
  const [seatArea,setSeatArea]=useState("A3区");
  const [seatRow,setSeatRow]=useState("12排");
  const [seatNumber,setSeatNumber]=useState("08座");
  const [showExactSeat,setShowExactSeat]=useState(false);
  const [seatTab,setSeatTab]=useState("同场");
  const [seatMedia,setSeatMedia]=useState<{name:string;kind:string;url:string}[]>([]);
  const [seatPostText,setSeatPostText]=useState("");
  const [seatPostPublic,setSeatPostPublic]=useState(true);
  const [addedSeatFriends,setAddedSeatFriends]=useState<number[]>([]);
  const [expandedMedia,setExpandedMedia]=useState<{url:string;kind:"image"|"video"}|null>(null);
  const [sameShowCommenting,setSameShowCommenting]=useState<number|null>(null);
  const [sameShowComment,setSameShowComment]=useState("");
  const [groupSearch,setGroupSearch]=useState("");
  const [joinedGroups,setJoinedGroups]=useState<number[]>([1]);
  const [creatingGroup,setCreatingGroup]=useState(false);
  const [newGroupName,setNewGroupName]=useState("");
  const data=followedArtists.find(item=>item.name===artist) ?? followedArtists[0];
  const activePost=posts.find(post=>post.id===activePostId) ?? posts[0];
  useEffect(()=>{
    setCampaignStorageReady(false);
    try{
      const raw=window.localStorage.getItem(`liveready-support-${artist}`);
      if(raw){
        const savedState=JSON.parse(raw);
        setSupportTaskChecks(savedState.supportTaskChecks??[]);
        setSupportActionRecords(savedState.supportActionRecords??[]);
        setSeatVerified(Boolean(savedState.seatVerified));
        setConcertShow(savedState.concertShow??"深圳站 · 2026.10.11");
        setSeatArea(savedState.seatArea??"A3区");
        setSeatRow(savedState.seatRow??"12排");
        setSeatNumber(savedState.seatNumber??"08座");
        setShowExactSeat(Boolean(savedState.showExactSeat));
        setAddedSeatFriends(savedState.addedSeatFriends??[]);
      }else{
        setSupportTaskChecks(["birthday-like"]);
        setSupportActionRecords(["10.06 17:42 · 点赞《天外来物》舞台帖 · +2 热爱值","10.06 16:18 · 完整收听演唱会歌单 1 次 · +10 热爱值","10.05 21:06 · 转发深圳站应援公告 · +2 热爱值"]);
        setSeatVerified(false);setAddedSeatFriends([]);
      }
    }catch{}
    setCampaignStorageReady(true);
  },[artist]);
  useEffect(()=>{
    if(!campaignStorageReady)return;
    window.localStorage.setItem(`liveready-support-${artist}`,JSON.stringify({supportTaskChecks,supportActionRecords,seatVerified,concertShow,seatArea,seatRow,seatNumber,showExactSeat,addedSeatFriends}));
  },[campaignStorageReady,artist,supportTaskChecks,supportActionRecords,seatVerified,concertShow,seatArea,seatRow,seatNumber,showExactSeat,addedSeatFriends]);
  if(!entered)return <div className="stack subpage support-picker"><PageTitle title="选择艺人社区" text="每位艺人拥有独立身份、热爱值、昵称与粉丝等级。"/><section className="support-picker-list">{followedArtists.map(item=><button key={item.name} onClick={()=>enter(item.name)}><img src={item.image} alt={item.name} style={{objectPosition:item.position}}/><div><b>{item.name}</b><small>{item.fans}粉丝 · 点击进入专属社区</small></div><ChevronRight/></button>)}</section><section className="heat-explain"><Heart/><div><b>热爱值按艺人分别累计</b><p>签到、听歌、社区互动与线下打卡都会成为你和这位艺人的共同记录。</p></div></section></div>;
  const supportToolTabs=["topics","vote","birthday","album","groups","ranking"].map(id=>featureItems.find(item=>item.id===id)!);
  const campaignConfigs={
    vote:{title:"本周打榜任务",subtitle:`为 ${artist}《${data.song}》完成指定互动`,icon:Vote,color:"green",tasks:[
      {id:"vote-share",kind:"转发",title:"转发官方新歌舞台帖",target:3,current:2,reward:4,link:"#官方舞台首发帖",body:`${artist}《${data.song}》官方舞台正式上线，欢迎在评论区分享最喜欢的现场瞬间。`,metrics:[12860,936,2184]},
      {id:"vote-comment",kind:"评论",title:"评论深圳站打榜集中帖",target:5,current:3,reward:6,link:"#深圳站打榜集中帖",body:"深圳站打榜集中帖：完成评论后请回到任务页进行打卡，禁止无意义刷屏。",metrics:[8621,1286,905]},
      {id:"vote-like",kind:"点赞",title:"点赞本周官方宣传帖",target:10,current:7,reward:5,link:"#本周宣传物料帖",body:"本周宣传物料与舞台返图已更新，点赞、收藏喜欢的内容即可计入任务进度。",metrics:[20864,1682,3260]},
    ]},
    birthday:{title:"生日应援任务",subtitle:`${artist}生日企划 · 大屏与祝福征集`,icon:Cake,color:"pink",tasks:[
      {id:"birthday-share",kind:"转发",title:"转发生日应援总企划",target:2,current:1,reward:4,link:"#生日应援总企划",body:`${artist}生日应援总企划已发布，包含城市大屏、花墙、祝福征集与线下打卡安排。`,metrics:[9860,526,1836]},
      {id:"birthday-comment",kind:"评论",title:"在生日祝福帖留下祝福",target:3,current:2,reward:6,link:"#生日祝福征集帖",body:"写下想对他说的话，精选祝福将出现在生日大屏轮播与线上祝福册中。",metrics:[16820,3862,968]},
      {id:"birthday-like",kind:"点赞",title:"点赞大屏拼团公告",target:5,current:5,reward:5,link:"#深圳生日大屏拼团",body:"深圳生日大屏计划开放打卡，投放时间、地点与最佳拍摄机位将在此持续更新。",metrics:[7280,486,1120]},
    ]},
    ranking:{title:"听歌排行任务",subtitle:`本周个人排名 128 · 已听 286 分钟`,icon:Trophy,color:"blue",tasks:[
      {id:"ranking-listen",kind:"收听",title:`完整播放《${data.song}》及指定歌曲`,target:3,current:2,reward:10,link:"#本周指定听歌清单",body:"本周指定歌曲共3首，完整有效播放后更新个人听歌排行。Demo 使用模拟播放数据。",metrics:[28640,4218,3860]},
      {id:"ranking-save",kind:"收藏",title:"收藏演唱会预习歌单",target:1,current:1,reward:3,link:"#演唱会预习歌单",body:"结合近期巡演曲目整理的预习歌单，完成度会同步至专辑与演唱会歌单进度。",metrics:[18620,892,2780]},
      {id:"ranking-share",kind:"分享",title:"分享本周应援歌单",target:2,current:1,reward:4,link:"#粉丝共建应援歌单",body:"粉丝共同维护的应援歌单，每周根据现场曲目和新歌动态更新。",metrics:[9260,628,1540]},
    ]},
  };
  const checkSupportTask=(id:string,title:string,reward:number)=>{if(supportTaskChecks.includes(id))return;setSupportTaskChecks(current=>[...current,id]);setSupportActionRecords(current=>[`刚刚 · ${title} · +${reward} 热爱值`,...current]);awardHeat(reward,`任务打卡成功，热爱值 +${reward}`)};
  const campaignKey=(supportToolTab==="vote"||supportToolTab==="birthday"||supportToolTab==="ranking")?supportToolTab:null;
  const activeCampaign=campaignKey?campaignConfigs[campaignKey]:null;
  const CampaignIcon=activeCampaign?.icon??Vote;
  const supportAlbums=[
    {name:artist==="薛之谦"?"《金斧子》":`《${data.song}》`,image:data.image,progress:82},
    {name:artist==="薛之谦"?"《媚人》":`${artist}精选专辑`,image:data.image,progress:64},
    {name:`${artist}演唱会歌单`,image:data.image,progress:73},
  ];
  const officialLocations=[
    {publisher:`${artist}工作室`,badge:"工作室认证",name:`${artist}深圳巡演主题快闪`,address:"深圳市福田区中洲湾 C Future City",kind:"快闪打卡地",image:"/places/wangsulong-zhongzhouwan-popup.jpg",copy:"巡演主题装置与限定拍照区已开放，建议工作日下午错峰前往。"},
    {publisher:`${artist}官方后援团`,badge:"后援团认证",name:`${artist}湾区生日应援大屏`,address:"深圳市南山区星河广场东侧",kind:"应援大屏",image:undefined,copy:"大屏每日18:00–22:00轮播，现场可领取限量纪念票根。"},
    {publisher:"品牌合作方",badge:"品牌认证",name:`${artist}同款品牌主题店`,address:"深圳市南山区海德三道品牌旗舰店",kind:"同款店",image:undefined,copy:"门店布置了联名拍照区，营业时间及活动库存以现场为准。"},
  ];
  const groupItems=[{id:1,name:`${artist}官方资讯讨论群`,members:"3,286人",type:"艺人群"},{id:2,name:`${artist}深圳同场群`,members:"286人",type:"活动群"},{id:3,name:`${artist}悉尼同城打卡组`,members:"96人",type:"同城群"},{id:4,name:`${artist}生日应援协作群`,members:"168人",type:"应援小组"}];
  const visibleGroups=groupItems.filter(group=>`${group.name}${group.type}`.toLowerCase().includes(groupSearch.trim().toLowerCase()));
  const rules=[["每日签到","每天1次","+8"],["完成QQ音乐听歌任务","有效播放1次","+10"],["社区评论或分享","每天最多4次","+2"],["演唱会现场打卡","每场活动","+100"],["参加线下应援活动","核验后计入","+50"],["打卡艺人同款地址","每个地点","+20"],["发布优质现场 Repo","审核通过","+15"]];
  const publish=()=>{if(!postTitle.trim()||!postContent.trim())return;addPost(postTitle.trim(),postContent.trim());setPostTitle("");setPostContent("");setActivePostId(null);setComposeOpen(false);setThreadOpen(true)};
  return <div className="stack subpage">
    <button className="support-back" onClick={back}><ChevronLeft/>切换艺人</button>
    <section className={`super-topic-head ${data.tone}`}><img className="topic-artist" src={data.image} alt={artist} style={{objectPosition:data.position}}/><div><small>LIVE READY 艺人社区</small><h1>{artist}</h1><p>{data.fans}粉丝 · 今日签到 6.5万人</p></div><button onClick={openIdentity}><img src={identity.avatar} alt="我的社区头像"/><span>我的</span></button></section>
    <section className="unified-super-topic">
      <nav className="super-topic-tabs unified-topic-tabs support-function-tabs">{supportToolTabs.map(item=><button key={item.id} className={supportToolTab===item.id?"active":""} onClick={()=>setSupportToolTab(item.id)}>{item.title.replace("打榜投票","打榜").replace("动态与话题","动态话题")}</button>)}<button className={supportToolTab==="same-show"?"active":""} onClick={()=>{setSupportToolTab("same-show");setSeatCommunityOpen(true)}}>{seatVerified?`${seatArea}同场`:"找同场"}</button></nav>
      {supportToolTab==="topics"&&<><nav className="official-feed-tabs">{["热门","实时","官方信息"].map(item=><button key={item} className={communityFeed===item?"active":""} onClick={()=>setCommunityFeed(item)}>{item}</button>)}</nav>{communityFeed==="官方信息"?<section className="official-location-feed"><header><div><small>VERIFIED UPDATES</small><h2>官方发布的打卡地点</h2></div><ShieldCheck/></header>{officialLocations.map(item=>{const added=places.some(place=>place.name===item.name);return <article key={item.name}>{item.image?<img src={item.image} alt={item.name}/>:<span><MapPinned/></span>}<div><em><ShieldCheck/>{item.publisher} · {item.badge}</em><b>{item.name}</b><small><MapPin/>{item.address}</small><p>{item.copy}</p></div><button className={added?"added":""} onClick={()=>addOfficialPlace({name:item.name,address:item.address,kind:item.kind,source:"官方收录",valid:true,image:item.image})}>{added?<><Check/>已添加</>:<><Plus/>添加</>}</button></article>})}<p className="official-sync-note"><Map/>添加后将自动收藏，并同步至“现场 → 场馆周边”、地图编号与顺路路线。</p></section>:<><section className="super-topic-notice unified-topic-notice"><Bell/><div><b>{artist}演唱会现场讨论区</b><small>返图、Repo、场馆攻略与同场交流都汇总在当前主页</small></div><button onClick={()=>setCommunityFeed("演唱会")}>查看</button></section><section className="super-topic-chips unified-topic-chips">{["#演唱会现场#","#新歌讨论#","#打卡地#","#高清返图#"].map(item=><button key={item} onClick={()=>setCommunityFeed(item)}>{item}</button>)}</section><section className="super-topic-feed unified-topic-feed">{posts.map((post,index)=><article key={post.id} onClick={()=>{setActivePostId(post.id);setComposeOpen(false);setThreadOpen(true)}}><header><img src={post.avatar} alt="头像"/><div><b>{post.author}<em>LV.{post.level}</em></b><small>{post.time} · QQ音乐社区</small></div><button onClick={event=>event.stopPropagation()}>关注</button></header><p className="topic-label">#{communityFeed.startsWith("#")?communityFeed.slice(1,-1):communityFeed}#</p><h2>{post.title}</h2><p>{post.content}</p>{index===0&&<div className="super-topic-photo-grid"><img src={data.image} alt="现场返图"/><img src="/albums/xuezhiqian-meiren.jpg" alt="演唱会内容"/><img src="/albums/xuezhiqian-jinfuzi.jpg" alt="专辑内容"/></div>}<footer><button onClick={event=>{event.stopPropagation();sharePost(post.id)}}><Share2/>{post.shares||"转发"}</button><button onClick={event=>{event.stopPropagation();setActivePostId(post.id);setComposeOpen(false);setThreadOpen(true)}}><MessageCircle/>{post.comments.length||"评论"}</button><button className={post.liked?"liked":""} onClick={event=>{event.stopPropagation();toggleLike(post.id)}}><Heart fill={post.liked?"currentColor":"none"}/>{post.likes||"赞"}</button></footer></article>)}</section><button className="unified-community-compose" onClick={()=>{setActivePostId(null);setComposeOpen(true);setThreadOpen(true)}}><Plus/>分享此刻，带上 #{artist}超话#</button></>}</>}
      {activeCampaign&&<section className="inline-support-panel inline-campaign-panel"><section className={`campaign-hero ${activeCampaign.color}`}><span><CampaignIcon/></span><div><small>{artist}应援中心</small><h1>{activeCampaign.title}</h1><p>{activeCampaign.subtitle}</p></div><em>{activeCampaign.tasks.filter(task=>supportTaskChecks.includes(task.id)||task.current>=task.target).length}/{activeCampaign.tasks.length}</em></section><section className="campaign-progress-card"><div><b>今日任务进度 · 当前 {points.toLocaleString()} 热爱值</b><span>{Math.round(activeCampaign.tasks.filter(task=>supportTaskChecks.includes(task.id)||task.current>=task.target).length/activeCampaign.tasks.length*100)}%</span></div><i><em style={{width:`${activeCampaign.tasks.filter(task=>supportTaskChecks.includes(task.id)||task.current>=task.target).length/activeCampaign.tasks.length*100}%`}}/></i><p>每项完成后打卡记录，奖励自动计入当前艺人的热爱值。</p></section><section className="campaign-task-list">{activeCampaign.tasks.map(task=>{const completed=supportTaskChecks.includes(task.id)||task.current>=task.target;const current=completed?task.target:task.current;return <article key={task.id} className={completed?"done":""}><header><span>{task.kind}</span><em>+{task.reward} 热爱值</em></header><h2>{task.title}</h2><button className="campaign-post-link" onClick={()=>setSelectedTaskPost({title:task.title,tag:task.link,body:task.body,likes:task.metrics[0],comments:task.metrics[1],shares:task.metrics[2]})}><MessageSquare/>{task.link}<ChevronRight/></button><div className="campaign-task-progress"><p><b>{current}</b> / {task.target} 次</p><i><em style={{width:`${Math.min(100,current/task.target*100)}%`}}/></i></div><button className="campaign-check-button" disabled={completed} onClick={()=>checkSupportTask(task.id,task.title,task.reward)}>{completed?<><Check/>已完成并记录</>:task.id==="ranking-listen"?<><Headphones/>模拟听完1首并领取 +{task.reward}</>:<><Medal/>完成后打卡</>}</button></article>})}</section><section className="campaign-records"><header><div><small>CHECK-IN HISTORY</small><h2>我的应援打卡记录</h2></div><span>{supportActionRecords.length}条</span></header>{supportActionRecords.slice(0,5).map((record,index)=><article key={`${record}-${index}`}><span><Check/></span><p>{record}</p></article>)}</section></section>}
      {supportToolTab==="album"&&<section className="inline-support-panel inline-album-panel"><header><div><small>QQ MUSIC CHECK-IN</small><h2>{artist}专辑与演唱会歌单</h2></div><Headphones/></header><div className="inline-album-grid">{supportAlbums.map(item=><article key={item.name}><img src={item.image} alt={item.name}/><div><b>{item.name}</b><span><small>已听进度</small><strong>{item.progress}%</strong></span><i><em style={{width:`${item.progress}%`}}/></i></div></article>)}</div><p>进度根据 QQ音乐完整播放记录计算；参赛 Demo 使用模拟数据。</p></section>}
      {supportToolTab==="groups"&&<section className="inline-support-panel inline-group-panel"><header><div><small>FAN GROUPS</small><h2>{artist}粉丝群组</h2></div><button onClick={()=>setCreatingGroup(value=>!value)}><Plus/>新建群</button></header><div className="inline-group-search"><Search/><input value={groupSearch} onChange={event=>setGroupSearch(event.target.value)} placeholder="搜索艺人、同城、活动或应援群"/>{groupSearch&&<button onClick={()=>setGroupSearch("")}><X/></button>}</div>{creatingGroup&&<section className="inline-group-create"><input value={newGroupName} onChange={event=>setNewGroupName(event.target.value)} placeholder="输入群组名称"/><button disabled={!newGroupName.trim()} onClick={()=>{setNewGroupName("");setCreatingGroup(false)}}>创建</button></section>}<div className="inline-group-list">{visibleGroups.map(group=>{const joined=joinedGroups.includes(group.id);return <article key={group.id}><span><Users/></span><div><em>{group.type}</em><b>{group.name}</b><small>{group.members} · 今日活跃</small></div><button className={joined?"joined":""} onClick={()=>setJoinedGroups(current=>joined?current.filter(id=>id!==group.id):[...current,group.id])}>{joined?"已加入":"加入"}</button></article>})}</div></section>}
    </section>
    {selectedTaskPost&&<section className="feature-sheet task-post-sheet"><header><button onClick={()=>setSelectedTaskPost(null)}><ChevronLeft/></button><b>指定任务帖</b><button onClick={()=>sharePost(posts[0]?.id||0)}><Share2/></button></header><div className="feature-scroll"><article className="task-linked-post"><header><img src={data.image} alt={artist}/><div><b>{artist}官方应援站</b><small>QQ音乐艺人社区 · 官方任务帖</small></div><em>官方</em></header><span>{selectedTaskPost.tag}</span><h1>{selectedTaskPost.title}</h1><p>{selectedTaskPost.body}</p><div className="task-post-media"><Music2/><div><small>QQ音乐关联内容</small><b>{artist} · {data.song}</b></div><Play fill="currentColor"/></div><footer><button><Share2/>{selectedTaskPost.shares} 转发</button><button><MessageCircle/>{selectedTaskPost.comments} 评论</button><button><Heart/>{selectedTaskPost.likes} 点赞</button></footer></article><section className="task-post-guidance"><ShieldCheck/><div><b>有效互动说明</b><p>请完成真实、有意义的互动；重复刷屏不会计入任务。参赛 Demo 中点击“完成后打卡”模拟官方回传结果。</p></div></section><button className="main-button" onClick={()=>setSelectedTaskPost(null)}>返回任务并打卡</button></div></section>}
    {showRules&&<section className="heat-rule-overlay" onClick={()=>setShowRules(false)}><div className="heat-rule-sheet" onClick={event=>event.stopPropagation()}><header><div><small>{artist}社区</small><h2>热爱值规则</h2></div><button onClick={()=>setShowRules(false)} aria-label="关闭"><X/></button></header><section className="heat-rule-total"><div><small>当前热爱值</small><b>{points}</b></div><span>{artist}超话 LV.{identity.level}</span></section><section className="heat-rule-board">{rules.map(([name,limit,value],index)=><article key={name}><span>{index+1}</span><div><b>{name}</b><small>{limit}</small></div><em>{value}</em></article>)}</section><p className="heat-rule-note">参赛 Demo 使用模拟 QQ音乐播放记录；正式版需在用户授权后接入。线下打卡需完成地点或活动核验。</p></div></section>}
    {communityOpen&&<section className="feature-sheet super-topic-sheet"><header><button onClick={()=>setCommunityOpen(false)}><ChevronLeft/></button><b>{artist}超话</b><button><Search/></button><button onClick={()=>sharePost(posts[0]?.id||0)}><Share2/></button></header><div className="feature-scroll"><section className={`super-topic-cover ${data.tone}`}><img src={data.image} alt={artist} style={{objectPosition:data.position}}/><div><small>明星超话</small><h1>{artist}</h1><p>747万帖子　449万同好</p></div><button onClick={event=>{event.stopPropagation();checkIn()}}>{checked?<><Check/>已签到</>:<>签到 +8</>}</button></section><section className="super-topic-metrics"><span>明星超话</span><span>今日签到5.1万人</span><span>签到人气 No.88</span></section><nav className="super-topic-tabs">{["热门","最新","精华","演唱会","音乐","周边"].map(item=><button key={item} className={communityFeed===item?"active":""} onClick={()=>setCommunityFeed(item)}>{item}</button>)}</nav><section className="super-topic-notice"><Bell/><div><b>{artist}演唱会现场讨论区</b><small>现场返图、Repo与场馆攻略集中交流</small></div><button onClick={()=>setCommunityFeed("演唱会")}>进入</button></section><section className="super-topic-chips">{["#演唱会现场#","#新歌讨论#","#打卡地#","#高清返图#"].map(item=><button key={item} onClick={()=>setCommunityFeed(item)}>{item}</button>)}</section><section className="super-topic-feed">{posts.map((post,index)=><article key={post.id} onClick={()=>{setActivePostId(post.id);setComposeOpen(false);setThreadOpen(true)}}><header><img src={post.avatar} alt="头像"/><div><b>{post.author}<em>LV.{post.level}</em></b><small>{post.time} · 来自QQ音乐</small></div><button onClick={event=>event.stopPropagation()}>关注</button></header><p className="topic-label">#{communityFeed.startsWith("#")?communityFeed.slice(1,-1):communityFeed}#</p><h2>{post.title}</h2><p>{post.content}</p>{index===0&&<div className="super-topic-photo-grid"><img src={data.image} alt="现场返图"/><img src="/albums/xuezhiqian-meiren.jpg" alt="演唱会内容"/><img src="/albums/xuezhiqian-jinfuzi.jpg" alt="专辑内容"/></div>}<footer><button onClick={event=>{event.stopPropagation();sharePost(post.id)}}><Share2/>{post.shares||"转发"}</button><button onClick={event=>{event.stopPropagation();setActivePostId(post.id);setComposeOpen(false);setThreadOpen(true)}}><MessageCircle/>{post.comments.length||"评论"}</button><button className={post.liked?"liked":""} onClick={event=>{event.stopPropagation();toggleLike(post.id)}}><Heart fill={post.liked?"currentColor":"none"}/>{post.likes||"赞"}</button></footer></article>)}</section></div><footer className="super-topic-compose-bar"><button onClick={()=>{setActivePostId(null);setComposeOpen(true);setThreadOpen(true)}}><Plus/>分享此刻，带上 #{artist}超话#</button><span><CircleUserRound/><small>我的</small></span></footer></section>}
    {threadOpen&&<section className="feature-sheet community-thread-sheet"><header><button onClick={()=>setThreadOpen(false)}><ChevronLeft/></button><b>{composeOpen?"发布社区帖子":`${artist}社区热帖`}</b><button onClick={()=>setComposeOpen(value=>!value)}>{composeOpen?<X/>:<Plus/>}</button></header><div className="feature-scroll">{composeOpen?<section className="post-composer"><div><img src={identity.avatar} alt="我的头像"/><p><b>{identity.nickname}</b><em>{artist}超话 LV.{identity.level}</em></p></div><label>帖子标题<input value={postTitle} onChange={event=>setPostTitle(event.target.value)} placeholder="写一个清楚的标题"/></label><label>正文<textarea value={postContent} onChange={event=>setPostContent(event.target.value)} placeholder="分享现场、听歌、应援或追星日常…"/></label><button disabled={!postTitle.trim()||!postContent.trim()} onClick={publish}>发布到{artist}社区</button></section>:activePost&&<><article className="thread-post"><div className="thread-author"><img src={activePost.avatar} alt="头像"/><p><b>{activePost.author}</b><em>{artist}超话 LV.{activePost.level}</em><small>{activePost.time} · 来自QQ音乐</small></p></div><h1>{activePost.title}</h1><p>{activePost.content}</p><div className="thread-actions"><button onClick={()=>sharePost(activePost.id)}><Share2/>{activePost.shares} 转发</button><button><MessageCircle/>{activePost.comments.length} 评论</button><button className={activePost.liked?"liked":""} onClick={()=>toggleLike(activePost.id)}><Heart fill={activePost.liked?"currentColor":"none"}/>{activePost.likes} 点赞</button></div></article><section className="comment-list"><h2>评论</h2>{activePost.comments.map((item,index)=><article key={`${item}-${index}`}><span>{index%2?"云":"星"}</span><div><b>{index%2?"云朵汽水":"星光旅人"}</b><p>{item}</p></div></article>)}</section><section className="comment-box"><input value={comment} onChange={event=>setComment(event.target.value)} placeholder="写下你的评论…"/><button disabled={!comment.trim()} onClick={()=>{addComment(activePost.id,comment.trim());setComment("")}}>发送</button></section></>}</div></section>}
    {seatCommunityOpen&&<SameShowCommunity artist={artist} title={`${artist} · ${concertShow.split(" · ")[0]}同场社区`} verified={seatVerified} setVerified={setSeatVerified} ticketProof={ticketProof} setTicketProof={setTicketProof} show={concertShow} setShow={setConcertShow} area={seatArea} setArea={setSeatArea} row={seatRow} setRow={setSeatRow} seatNumber={seatNumber} setSeatNumber={setSeatNumber} showExactSeat={showExactSeat} setShowExactSeat={setShowExactSeat} tab={seatTab} setTab={setSeatTab} media={seatMedia} setMedia={setSeatMedia} draft={seatPostText} setDraft={setSeatPostText} isPublic={seatPostPublic} setIsPublic={setSeatPostPublic} posts={sameShowPosts} setPosts={setSameShowPosts} identityName={identity.nickname} addedFriends={addedSeatFriends} setAddedFriends={setAddedSeatFriends} onSyncPublic={text=>addPost(`#${artist}${concertShow.replace(" · ","·")}# ${seatArea}现场动态`,text)} onClose={()=>setSeatCommunityOpen(false)} expandedMedia={expandedMedia} setExpandedMedia={setExpandedMedia} commenting={sameShowCommenting} setCommenting={setSameShowCommenting} comment={sameShowComment} setComment={setSameShowComment}/>}
  </div>;
}

function LiveView({artist,built,setBuilt,saved,setSaved,places,venueSeatPosts,setVenueSeatPosts,sameShowPosts,setSameShowPosts,addPlace,markInvalid,toast,open,concertSession,setConcertSession,onCheckin}:{artist:string;built:boolean;setBuilt:(v:boolean)=>void;saved:number[];setSaved:(v:number[])=>void;places:LivePlace[];venueSeatPosts:VenueSeatPost[];setVenueSeatPosts:Dispatch<SetStateAction<VenueSeatPost[]>>;sameShowPosts:SameShowPost[];setSameShowPosts:Dispatch<SetStateAction<SameShowPost[]>>;addPlace:(place:Omit<LivePlace,"id">)=>void;markInvalid:(id:number)=>void;toast:(s:string)=>void;open:(f:Feature)=>void;concertSession:ConcertSession;setConcertSession:(value:ConcertSession)=>void;onCheckin:(record:CheckinRecord)=>void}) {
  const demoArtist=followedArtists.find(item=>item.name===artist) ?? followedArtists[0];
  const [scheduleOpen,setScheduleOpen]=useState(false);
  const [aiTicketOpen,setAiTicketOpen]=useState(false);
  const [aiTicketImage,setAiTicketImage]=useState(concertSession.image);
  const [aiTicketName,setAiTicketName]=useState(concertSession.name);
  const [aiTicketScanning,setAiTicketScanning]=useState(false);
  const [aiTicketParsed,setAiTicketParsedState]=useState(concertSession.parsed);
  const setAiTicketParsed=(value:boolean)=>{setAiTicketParsedState(value);if(!value)setConcertSession({parsed:false,image:"",name:"",verified:false})};
  const [placeSubmitOpen,setPlaceSubmitOpen]=useState(false);
  const [placeName,setPlaceName]=useState("");
  const [placeAddress,setPlaceAddress]=useState("");
  const [placeKind,setPlaceKind]=useState("打卡地");
  const [selectedMapPlaceId,setSelectedMapPlaceId]=useState<number>(places[0]?.id??1);
  const [customPlace,setCustomPlace]=useState("");
  const [customStops,setCustomStops]=useState<{name:string;private:boolean}[]>([]);
  const [privateStop,setPrivateStop]=useState(false);
  const [checkinPlace,setCheckinPlace]=useState<LivePlace|null>(null);
  const [checkinMood,setCheckinMood]=useState("");
  const [checkinNote,setCheckinNote]=useState("");
  const [checkinMedia,setCheckinMedia]=useState<CheckinMediaItem[]>([]);
  const [lastCheckinReward,setLastCheckinReward]=useState<string|null>(null);
  const [sameShowOpen,setSameShowOpen]=useState(false);
  const [sameShowVerified,setSameShowVerified]=useState(concertSession.verified);
  const [ticketProof,setTicketProof]=useState(concertSession.image);
  const [sameShowTab,setSameShowTab]=useState("同场");
  const [sameShowMedia,setSameShowMedia]=useState<{name:string;kind:string;url:string}[]>([]);
  const [sameShowDraft,setSameShowDraft]=useState("");
  const [sameShowPublic,setSameShowPublic]=useState(true);
  const [sameShowExpandedMedia,setSameShowExpandedMedia]=useState<{url:string;kind:"image"|"video"}|null>(null);
  const [sameShowCommenting,setSameShowCommenting]=useState<number|null>(null);
  const [sameShowComment,setSameShowComment]=useState("");
  const [sameShowArea,setSameShowArea]=useState("A3区");
  const [sameShowRow,setSameShowRow]=useState("12排");
  const [sameShowSeat,setSameShowSeat]=useState("08座");
  const [sameShowExactSeat,setSameShowExactSeat]=useState(false);
  const [sameShowFriends,setSameShowFriends]=useState<number[]>([]);
  const [serviceOpen,setServiceOpen]=useState<string|null>(null);
  const [serviceDraft,setServiceDraft]=useState("");
  const [serviceMedia,setServiceMedia]=useState<{url:string;kind:"image"|"video"}[]>([]);
  const [expandedServiceMedia,setExpandedServiceMedia]=useState<{url:string;kind:"image"|"video"}|null>(null);
  const [exchangeHave,setExchangeHave]=useState("");
  const [exchangeWant,setExchangeWant]=useState("");
  const [exchangeMeet,setExchangeMeet]=useState("场馆官方交换区");
  const [serviceComment,setServiceComment]=useState("");
  const [commentingServicePost,setCommentingServicePost]=useState<number|null>(null);
  const [servicePosts,setServicePosts]=useState<Record<string,ServicePost[]>>({
    "同城组队":[{id:1,author:"星星汽水",text:"10月11日深圳北站出发，已有2人，还想找2位同担一起。",likes:36,liked:false,comments:["我从北站出发，可以一起！"],shares:4}],
    "拼车与集合":[{id:2,author:"南风入场",text:"南山地铁站D口15:00集合，走正规平台拼车。",likes:28,liked:false,comments:["已私信集合信息"],shares:3}],
    "物料交换":[{id:3,author:"今天也奔赴",text:"A3入口交换小卡和手幅，可现场看品相。",likes:42,liked:false,comments:["想换右边那张小卡"],shares:6}],
  });
  const [seatViewOpen,setSeatViewOpen]=useState(false);
  const [customVenues,setCustomVenues]=useState<{province:string;city:string;venue:string}[]>([]);
  const [createVenueOpen,setCreateVenueOpen]=useState(false);
  const [newVenueProvince,setNewVenueProvince]=useState("");
  const [newVenueCity,setNewVenueCity]=useState("");
  const [newVenueName,setNewVenueName]=useState("");
  const venueCatalog=useMemo(()=>{const next:Record<string,Record<string,string[]>>=JSON.parse(JSON.stringify(nationalVenueCatalog));customVenues.forEach(item=>{next[item.province]??={};next[item.province][item.city]??=[];if(!next[item.province][item.city].includes(item.venue))next[item.province][item.city].push(item.venue)});return next},[customVenues]);
  const [venueProvince,setVenueProvince]=useState("广东省");
  const [venueCity,setVenueCity]=useState("深圳市");
  const [selectedVenue,setSelectedVenue]=useState("湾区体育中心");
  const [venueSearch,setVenueSearch]=useState("");
  const [seatLayer,setSeatLayer]=useState("内场");
  const [seatZone,setSeatZone]=useState("A1");
  const [seatDraft,setSeatDraft]=useState("");
  const [seatMedia,setSeatMedia]=useState("");
  const [seatMediaUrl,setSeatMediaUrl]=useState("");
  const [seatObstruction,setSeatObstruction]=useState("无遮挡");
  const [seatComment,setSeatComment]=useState("");
  const [commentingSeatPost,setCommentingSeatPost]=useState<number|null>(null);
  const [expandedSeatMedia,setExpandedSeatMedia]=useState<string|null>(null);
  const addCheckinMedia=async(files:FileList|null)=>{
    const selected=Array.from(files??[]);
    if(!selected.length)return;
    const next=await Promise.all(selected.map(file=>new Promise<CheckinMediaItem>((resolve)=>{
      const type:CheckinMediaItem["type"]=file.type.startsWith("video/")?"video":file.type.startsWith("audio/")?"audio":"image";
      if(file.size>8*1024*1024){resolve({name:file.name,type,url:URL.createObjectURL(file)});return}
      const reader=new FileReader();reader.onload=()=>resolve({name:file.name,type,url:String(reader.result||"")});reader.onerror=()=>resolve({name:file.name,type,url:URL.createObjectURL(file)});reader.readAsDataURL(file);
    })));
    setCheckinMedia(current=>[...current,...next]);
    toast(`已选择 ${next.length} 个打卡媒体，可直接预览`);
  };
  useEffect(()=>{const openSeatImage=(event:MouseEvent)=>{const target=event.target as HTMLElement;if(target instanceof HTMLImageElement&&target.classList.contains("shared-seat-photo"))setExpandedSeatMedia(target.src)};document.addEventListener("click",openSeatImage);return()=>document.removeEventListener("click",openSeatImage)},[]);
  useEffect(()=>{const keepUploadedImage=(event:Event)=>{const input=event.target as HTMLInputElement;const file=input.files?.[0];if(!file||!input.closest(".seat-view-publisher")||!file.type.startsWith("image/"))return;const reader=new FileReader();reader.onload=()=>setSeatMediaUrl(String(reader.result||""));reader.readAsDataURL(file)};document.addEventListener("change",keepUploadedImage);return()=>document.removeEventListener("change",keepUploadedImage)},[]);
  const toggle=(id:number)=>setSaved(saved.includes(id)?saved.filter(x=>x!==id):[...saved,id]);
  const selectedMapPlace=places.find(place=>place.id===selectedMapPlaceId)??places[0];
  const routeStops=[...places.filter(place=>place.valid&&saved.includes(place.id)),...customStops.map((stop,index)=>({id:9000+index,name:stop.name,address:stop.private?"仅自己可见":"自定义目的地",kind:stop.private?"私人目的地":"当地景点",source:"私人目的地" as const,valid:true}))];
  const submitPlace=()=>{if(!placeName.trim()||!placeAddress.trim())return;addPlace({name:placeName.trim(),address:placeAddress.trim(),kind:placeKind,source:"社区上传",valid:true});setPlaceName("");setPlaceAddress("");setPlaceSubmitOpen(false);toast("新地点已同步到场馆周边与#打卡地话题")};
  const seatZones:Record<string,string[]>={"内场":["A1","A2","A3","B1","B2"],"看台一层":["101","103","104","108"],"看台二层":["201","204","208","212"],"看台三层":["301","304","308","312"]};
  const selectedVenuePosts=venueSeatPosts.filter(post=>post.venue===selectedVenue);
  const visibleSeatPosts=selectedVenuePosts.filter(post=>post.layer===seatLayer&&post.zone===seatZone);
  const allVenueOptions=Object.entries(venueCatalog).flatMap(([province,cities])=>Object.entries(cities).flatMap(([city,venues])=>venues.map(venue=>({province,city,venue}))));
  const venueSearchResults=venueSearch.trim()?allVenueOptions.filter(item=>`${item.province}${item.city}${item.venue}`.includes(venueSearch.trim())).slice(0,6):[];
  const myVenuePosts=venueSeatPosts.filter(post=>post.author==="Winnie");
  const openVenuePost=(post:VenueSeatPost)=>{const location=allVenueOptions.find(item=>item.venue===post.venue);if(location){setVenueProvince(location.province);setVenueCity(location.city)}setSelectedVenue(post.venue);setSeatLayer(post.layer);setSeatZone(post.zone);setSeatViewOpen(true)};
  const createVenue=()=>{if(!newVenueProvince.trim()||!newVenueCity.trim()||!newVenueName.trim())return;const created={province:newVenueProvince.trim(),city:newVenueCity.trim(),venue:newVenueName.trim()};setCustomVenues(current=>[...current,created]);setVenueProvince(created.province);setVenueCity(created.city);setSelectedVenue(created.venue);setVenueSearch("");setNewVenueProvince("");setNewVenueCity("");setNewVenueName("");setCreateVenueOpen(false);toast(`已创建场馆：${created.venue}`)};
  const updateServicePost=(id:number,update:(post:ServicePost)=>ServicePost)=>setServicePosts(current=>({...current,[serviceOpen??""]:(current[serviceOpen??""]??[]).map(post=>post.id===id?update(post):post)}));
  const updateExchangePost=(id:number,update:(post:ServicePost)=>ServicePost)=>setServicePosts(current=>({...current,"物料交换":(current["物料交换"]??[]).map(post=>post.id===id?update(post):post)}));
  const publishServicePost=()=>{if(!serviceOpen||(!serviceDraft.trim()&&!serviceMedia.length))return;setServicePosts(current=>({...current,[serviceOpen]:[{id:Date.now(),author:"Winnie",text:serviceDraft.trim()||"分享了现场媒体",likes:0,liked:false,comments:[],shares:0,images:serviceMedia.filter(item=>item.kind==="image").map(item=>item.url),videos:serviceMedia.filter(item=>item.kind==="video").map(item=>item.url)},...(current[serviceOpen]??[])]}));setServiceDraft("");setServiceMedia([])};
  const publishExchangePost=()=>{if(!exchangeHave.trim()||!exchangeWant.trim())return;const text=`可交换：${exchangeHave.trim()}｜想要：${exchangeWant.trim()}｜见面地点：${exchangeMeet.trim()||"场馆官方交换区"}`;setServicePosts(current=>({...current,"物料交换":[{id:Date.now(),author:"Winnie",text,likes:0,liked:false,comments:[],shares:0},...(current["物料交换"]??[])]}));setExchangeHave("");setExchangeWant("")};
  const parseTicket=()=>{if(!aiTicketImage)return;setAiTicketScanning(true);window.setTimeout(()=>{setAiTicketScanning(false);setAiTicketParsed(true);setConcertSession({parsed:true,image:aiTicketImage,name:aiTicketName,verified:true});setTicketProof(aiTicketImage);setSameShowVerified(true);setScheduleOpen(true);toast("AI 已识别场次并生成现场准备页")},1200)};
  const finishPlaceCheckin=()=>{if(!checkinPlace)return;const completed=checkinPlace;const now=new Date();onCheckin({id:Date.now(),artist,country:"中国",city:"深圳",place:completed.name,kind:completed.kind,address:completed.address,mood:checkinMood.trim(),note:checkinNote.trim()||"完成了一次现场打卡。",media:checkinMedia,time:now.toLocaleString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false})});setLastCheckinReward(completed.name);setCheckinPlace(null);setCheckinMood("");setCheckinNote("");setCheckinMedia([])};
  return <div className="stack subpage live-reworked">
    <PageTitle title="奔赴现场" text="地图、路线、日程与同场社区。"/>
    <section className={`concert-hub-card ${aiTicketParsed?"ready":""}`}>
      <button className="concert-hub-main" onClick={()=>setAiTicketOpen(true)}><span>{aiTicketParsed?<Check/>:<WandSparkles/>}</span><div><small>{aiTicketParsed?"AI Demo 现场准备 · 同场社区已解锁":"LIVE READY · AI Demo 现场助手"}</small><h2>{aiTicketParsed?`${artist}深圳站 · 10月11日`:"上传出票截图，一键准备现场"}</h2><p>{aiTicketParsed?"湾区体育中心 · A3区 · 距离演出13天":"自动识别场次、场馆与区域，生成路线和同场社区入口"}</p></div><ChevronRight/></button>
      {!aiTicketParsed&&<button className="demo-ticket-shortcut" onClick={()=>{setAiTicketImage(demoArtist.image);setAiTicketName(`${artist}深圳站示例票据.jpg`);setAiTicketParsedState(true);setConcertSession({parsed:true,image:demoArtist.image,name:`${artist}深圳站示例票据.jpg`,verified:true});setTicketProof(demoArtist.image);setSameShowVerified(true);setScheduleOpen(true);toast("已载入示例票据并生成现场准备页")}}>使用示例票据体验（Demo）</button>}
      {aiTicketParsed&&<div className="concert-hub-actions"><button onClick={()=>setAiTicketOpen(true)}><WandSparkles/><span><b>查看准备页</b><small>路线、周边与准备度</small></span></button><button onClick={()=>setSameShowOpen(true)}><TicketCheck/><span><b>进入同场社区</b><small>A3区 · 找同区、组队与交换</small></span><ChevronRight/></button></div>}
    </section>
    <section className={`event-card event-card-expandable ${scheduleOpen?"open":""}`} onClick={()=>setScheduleOpen(value=>!value)} role="button" tabIndex={0}><div className="event-date"><b>11</b><span>OCT<br/>2026</span></div><div><small>{artist} · 下一个日程</small><h2>深圳站 · 湾区体育中心</h2><p><Clock3/>19:30 · 距离演唱会还有 13 天</p></div><span className="ready-pill">{scheduleOpen?"收起":"展开"} <ChevronDown/></span>{scheduleOpen&&<div className="event-expanded"><div><b>2,184</b><span>距离第一次见面</span></div><div><b>13</b><span>距离下一次演唱会</span></div><section><h3>近期活动</h3><p><Calendar/>10.11 深圳站演唱会 · 19:30</p><p><MapPin/>10.13 南山线下应援展 · 14:00</p><p><Bell/>10.22 新专线上签售 · 20:00</p></section></div>}</section>
    <section className="map-card live-map-card">
      <div className="map-top"><b><Navigation/>场馆周边</b><span>深圳 <ChevronDown/></span></div>
      <div className="map-canvas"><i className="road r1"/><i className="road r2"/><i className="river"/><span className="venue-marker"><Star fill="currentColor"/><b>场馆</b></span>{places.filter(place=>place.valid).map((place,index)=><button key={place.id} className={`pin p${index%3+1} ${selectedMapPlaceId===place.id?"active":""}`} style={{transform:`translate(${index*9}px,${index*4}px)`}} onClick={()=>setSelectedMapPlaceId(place.id)} aria-label={`查看地点${index+1}：${place.name}`}>{index+1}</button>)}</div>
      {selectedMapPlace&&<section className="map-selected-place"><span>{Math.max(1,places.filter(place=>place.valid).findIndex(place=>place.id===selectedMapPlace.id)+1)}</span><button className="map-selected-copy" onClick={()=>setCheckinPlace(selectedMapPlace)}><b>{selectedMapPlace.name}</b><small>{selectedMapPlace.address}</small></button><button className={saved.includes(selectedMapPlace.id)?"saved":""} onClick={()=>toggle(selectedMapPlace.id)} aria-label={saved.includes(selectedMapPlace.id)?"取消收藏":"收藏地点"}><Heart fill={saved.includes(selectedMapPlace.id)?"currentColor":"none"}/><small>{saved.includes(selectedMapPlace.id)?"已收藏":"收藏"}</small></button></section>}
      <div className="place-type-legend"><span className="screen"><FileImage/>应援大屏</span><span className="support"><Cake/>线下应援点</span><span className="venue"><Star/>场馆</span><span className="spot"><MapPin/>打卡点</span></div>
      <div className="map-place-strip">{places.map((place,index)=><article key={place.id} className={!place.valid?"invalid":""}><span className="map-place-number">{index+1}</span><button className="place-main" onClick={()=>{setSelectedMapPlaceId(place.id);setCheckinPlace(place)}}>{place.image?<img className="place-real-thumb" src={place.image} alt={`${place.name}真实照片`}/>:<span className={`place-type-icon ${place.kind.includes("大屏")?"screen":place.kind.includes("应援点")?"support":place.kind.includes("场馆")?"venue":"spot"}`}>{place.kind.includes("大屏")?<FileImage/>:place.kind.includes("应援点")?<Cake/>:place.kind.includes("场馆")?<Star/>:<MapPin/>}</span>}<div><b>{place.name}</b><small>IP属地：{place.address}</small><em>{place.kind} · {place.source}</em></div></button><button className={saved.includes(place.id)?"saved":""} onClick={()=>toggle(place.id)} aria-label="收藏地点"><Heart fill={saved.includes(place.id)?"currentColor":"none"}/></button><button onClick={()=>markInvalid(place.id)}>{place.valid?"报错":"恢复"}</button></article>)}</div>
      <div className="map-actions"><button onClick={()=>setPlaceSubmitOpen(value=>!value)}><Plus/>提交新地点</button><span>地图与 #打卡地 实时同步</span></div>
      {placeSubmitOpen&&<section className="place-submit-inline"><input value={placeName} onChange={event=>setPlaceName(event.target.value)} placeholder="地点名称"/><input value={placeAddress} onChange={event=>setPlaceAddress(event.target.value)} placeholder="详细地址 / 地址IP"/><select value={placeKind} onChange={event=>setPlaceKind(event.target.value)}><option>打卡地</option><option>应援大屏</option><option>场馆</option><option>同款店</option><option>当地景点</option><option>线下应援点</option></select><button disabled={!placeName.trim()||!placeAddress.trim()} onClick={submitPlace}>提交并同步</button></section>}
      <section className="inline-route-builder">{lastCheckinReward&&<div className="route-checkin-reward"><Medal/><div><b>{lastCheckinReward} 打卡成功</b><small>已同步到“我的追星日记”和足迹地图</small></div><strong>+30 热爱值</strong></div>}<header><div><b>根据收藏生成顺路路线</b><small>已收藏 {places.filter(place=>saved.includes(place.id)).length} 个地点，点地图或列表旁的爱心即可调整</small></div><Route/></header><div className="custom-stop-row"><input value={customPlace} onChange={event=>setCustomPlace(event.target.value)} placeholder="也可添加当地景点或私人目的地"/><button className={privateStop?"private active":"private"} onClick={()=>setPrivateStop(value=>!value)}><Lock/>{privateStop?"私人":"公开"}</button><button disabled={!customPlace.trim()} onClick={()=>{setCustomStops(current=>[...current,{name:customPlace.trim(),private:privateStop}]);setCustomPlace("")}}><Plus/>加入</button></div>{customStops.length>0&&<div className="custom-stop-chips">{customStops.map((stop,index)=><span key={`${stop.name}-${index}`}>{stop.private?<Lock/>:<MapPin/>}{stop.name}<button onClick={()=>setCustomStops(current=>current.filter((_,i)=>i!==index))}><X/></button></span>)}</div>}<button className="main-button" disabled={!routeStops.length} onClick={()=>{setBuilt(true);toast("已按收藏地点生成顺路路线")}}><Route/>生成顺路路线</button>{!routeStops.length&&<p className="route-empty-hint">先点击地点旁的爱心收藏至少一个地点</p>}{built&&routeStops.length>0&&<section className="route-card embedded-route"><div className="route-head"><span><Route/></span><div><b>深圳追星一日路线</b><small>{routeStops.length}个地点 · 点击任一站即可打卡</small></div><em>已优化</em></div>{routeStops.map((stop,index)=>{const realPlace=places.find(place=>place.id===stop.id);return <button className="route-stop route-stop-button" key={`${stop.name}-${index}`} onClick={()=>realPlace&&setCheckinPlace(realPlace)} disabled={!realPlace}><span>{index+1}</span><p>{`${12+index*2}: ${index?"20":"40"} ${stop.name}`}</p>{realPlace?<><em>去打卡</em><ChevronRight/></>:<em>自定义地点</em>}{index<routeStops.length-1&&<i/>}</button>})}<div className="route-guide-note"><BookOpen/><div><b>攻略已融入路线</b><small>交通、营业时间、拍照机位和避坑提示会随每一站展开。</small></div></div></section>}</section>
    </section>
    <SectionHead title="座位视角" action="同场馆跨艺人共享"/>
    {myVenuePosts.length>0&&<section className="my-venue-views"><header><div><small>MY LIVE VIEWS</small><h2>我的现场视角</h2></div><span>{myVenuePosts.length} 个场馆记录</span></header><div>{myVenuePosts.map(post=><button key={post.id} onClick={()=>openVenuePost(post)}>{post.image?<img src={post.image} alt={`${post.venue}${post.zone}视角`}/>:<div><Camera/></div>}<b>{post.venue}</b><small>{post.layer} · {post.zone}</small></button>)}</div><p><MapPin/>点击任一照片会自动切换到对应场馆和区域</p></section>}
    <section className="venue-selector-card">
      <header><MapPinned/><div><b>全国场馆视角库</b><small>按省 / 市 / 场馆查找；未收录时可立即创建</small></div></header>
      <section className="venue-search-box"><Search/><input value={venueSearch} onChange={event=>setVenueSearch(event.target.value)} placeholder="搜索城市、体育场或体育馆"/>{venueSearch&&<button onClick={()=>setVenueSearch("")}><X/></button>}{venueSearchResults.length>0&&<div>{venueSearchResults.map(item=><button key={`${item.province}-${item.city}-${item.venue}`} onClick={()=>{setVenueProvince(item.province);setVenueCity(item.city);setSelectedVenue(item.venue);setVenueSearch("")}}><MapPin/><span><b>{item.venue}</b><small>{item.province} · {item.city}</small></span></button>)}</div>}</section>
      {venueSearch.trim()&&venueSearchResults.length===0&&<section className="venue-search-empty"><MapPin/><div><b>没有找到“{venueSearch}”</b><small>可以创建新场馆并上传第一个视角</small></div><button onClick={()=>{setNewVenueName(venueSearch);setCreateVenueOpen(true)}}>创建</button></section>}
      <div><label>省份<select value={venueProvince} onChange={event=>{const province=event.target.value;const city=Object.keys(venueCatalog[province])[0];const venue=venueCatalog[province][city][0];setVenueProvince(province);setVenueCity(city);setSelectedVenue(venue)}}>{Object.keys(venueCatalog).map(province=><option key={province}>{province}</option>)}</select></label><label>城市<select value={venueCity} onChange={event=>{const city=event.target.value;setVenueCity(city);setSelectedVenue(venueCatalog[venueProvince][city][0])}}>{Object.keys(venueCatalog[venueProvince]).map(city=><option key={city}>{city}</option>)}</select></label><label>场馆<select value={selectedVenue} onChange={event=>setSelectedVenue(event.target.value)}>{venueCatalog[venueProvince][venueCity].map(venue=><option key={venue}>{venue}</option>)}</select></label></div>
      <button className="create-venue-trigger" onClick={()=>setCreateVenueOpen(value=>!value)}><Plus/>{createVenueOpen?"收起创建":"没有找到？创建新场馆"}</button>
      {createVenueOpen&&<section className="create-venue-form"><input value={newVenueProvince} onChange={event=>setNewVenueProvince(event.target.value)} placeholder="省 / 自治区 / 特别行政区"/><input value={newVenueCity} onChange={event=>setNewVenueCity(event.target.value)} placeholder="城市"/><input value={newVenueName} onChange={event=>setNewVenueName(event.target.value)} placeholder="场馆完整名称"/><button disabled={!newVenueProvince.trim()||!newVenueCity.trim()||!newVenueName.trim()} onClick={createVenue}><MapPin/>创建并选择</button></section>}
      <footer><span>{selectedVenue}</span><b>{selectedVenuePosts.length} 个视角 · {new Set(selectedVenuePosts.map(post=>post.artist)).size} 位艺人</b></footer>
    </section>
    {selectedVenuePosts.length?<section className="seat-scroll">{selectedVenuePosts.slice(0,6).map((post,index)=><article key={post.id} role="button" tabIndex={0} onClick={()=>{setSeatLayer(post.layer);setSeatZone(post.zone);setSeatViewOpen(true)}}>{post.image?<img className="seat-card-photo" src={post.image} alt={`${post.venue}${post.zone}视角`}/>:<div className={`seat-art s${index%3}`}><span>STAGE</span><i/><i/></div>}<b>{post.layer} {post.zone}</b><small>{post.artist} · {post.obstruction}</small></article>)}</section>:<section className="venue-seat-empty"><Camera/><div><b>这个场馆还没有视角</b><p>可以进入上传页，成为第一个分享该场馆视角的人。</p></div><button onClick={()=>setSeatViewOpen(true)}>上传视角</button></section>}
    <SectionHead title="更多现场工具" action="精简入口"/>
    <FeatureHub items={featureItems.filter(item=>item.tab==="live"&&!new Set(["submitpoi","guides","checklist","calendar","repo","team","carpool","exchange","routeplanner","screens","supportpoint"]).has(item.id))} open={open}/>
    {aiTicketOpen&&<section className="feature-sheet ai-ticket-sheet"><header><button onClick={()=>setAiTicketOpen(false)}><ChevronLeft/></button><b>{aiTicketParsed?"我的现场准备页":"AI 识别出票截图"}</b><button onClick={()=>{setAiTicketImage("");setAiTicketName("");setAiTicketParsed(false)}}><Repeat2/></button></header><div className="feature-scroll">{!aiTicketParsed?<><section className="ai-ticket-intro"><span><WandSparkles/></span><div><small>QQ音乐 · LiveReady AI</small><h1>从一张出票截图开始</h1><p>识别艺人、日期、城市、场馆和座位区域，自动生成本场演唱会的准备页面。</p></div></section><label className={`ai-ticket-uploader ${aiTicketImage?"has-image":""}`}>{aiTicketImage?<><img src={aiTicketImage} alt="待识别出票截图"/><span><Check/>已选择 {aiTicketName}</span></>:<><Upload/><b>上传出票截图</b><small>支持 JPG、PNG；请保留场次和区域信息</small></>}<input type="file" accept="image/*" onChange={event=>{const file=event.target.files?.[0];if(file){setAiTicketName(file.name);setAiTicketImage(URL.createObjectURL(file))}}}/></label><section className="ai-privacy-card"><ShieldCheck/><div><b>隐私保护</b><p>截图只用于本次识别；订单号、二维码和具体座位号不会在社区公开展示。</p></div></section>{aiTicketScanning?<section className="ai-ticket-scanning"><i/><b>正在识别出票信息</b><p>读取场次、场馆与区域，并匹配 QQ 音乐艺人资料…</p></section>:<button className="ai-ticket-primary" disabled={!aiTicketImage} onClick={parseTicket}><WandSparkles/>AI 识别并生成现场准备页</button>}</>:<><section className="ai-result-card"><header><span><Check/></span><div><small>识别完成 · 已保护敏感信息</small><h1>{artist} · 深圳站</h1><p>2026年10月11日 19:30</p></div><em>已验证</em></header><div className="ai-result-grid"><p><span>城市</span><b>深圳</b></p><p><span>场馆</span><b>湾区体育中心</b></p><p><span>区域</span><b>A3区</b></p><p><span>具体座位</span><b>默认隐藏</b></p></div></section><section className="ai-ready-progress"><header><div><small>现场准备度</small><b>72%</b></div><span>距离演出还有 13 天</span></header><div><i style={{width:"72%"}}/></div><ul><li className="done"><Check/>场次与座位区域已确认</li><li className="done"><Check/>已关联 {artist} QQ音乐资料</li><li><MapPin/>待生成场馆周边打卡路线</li><li><Users/>同场社区已解锁</li></ul></section><section className="ai-ready-actions"><button onClick={()=>{setSaved([1,2,4,5]);setBuilt(true);setAiTicketOpen(false);window.scrollTo({top:850,behavior:"smooth"});toast("已生成演唱会当天顺路路线")}}><Route/><div><b>生成当天路线</b><small>结合大屏、应援点与入场时间</small></div><ChevronRight/></button><button onClick={()=>{setAiTicketOpen(false);setSameShowOpen(true)}}><Users/><div><b>进入同场社区</b><small>A3区已验证，可看同区动态</small></div><ChevronRight/></button><button onClick={()=>{setAiTicketOpen(false);window.scrollTo({top:350,behavior:"smooth"})}}><MapPinned/><div><b>查看场馆周边</b><small>应援大屏、打卡点与领取位置</small></div><ChevronRight/></button></section><section className="qq-data-link"><Music2/><div><b>QQ音乐数据已关联</b><p>{artist}演唱会歌单已听 82% · 首次收听记录已同步</p></div></section></>}</div></section>}
    {checkinPlace&&<section className="feature-sheet live-checkin-sheet"><header><button onClick={()=>setCheckinPlace(null)}><ChevronLeft/></button><b>地点打卡</b><button><MapPin/></button></header><div className="feature-scroll"><section className={`checkin-map-preview ${checkinPlace.image?"has-photo":""}`}>{checkinPlace.image?<img src={checkinPlace.image} alt={`${checkinPlace.name}真实打卡照片`}/>:<><i className="road r1"/><i className="river"/><span><MapPin fill="currentColor"/></span></>}<div><b>{checkinPlace.name}</b><small>{checkinPlace.address}</small></div></section><section className="checkin-editor"><div className="checkin-reward-preview"><Heart fill="currentColor"/><span><b>完成即同步</b><small>追星日记 + 足迹地图 +30 热爱值</small></span></div><label>心情 Emoji<input value={checkinMood} onChange={event=>setCheckinMood(Array.from(event.target.value).slice(0,4).join(""))} placeholder="手动输入，例如：🥹✨"/></label><label>打卡记录<textarea value={checkinNote} onChange={event=>setCheckinNote(event.target.value)} placeholder="记录此刻的文字…"/></label><label className="checkin-upload"><Upload/><span><b>上传照片 / 视频 / 语音</b><small>选择后立即预览，完成打卡后同步到足迹地图</small></span><input type="file" accept="image/*,video/*,audio/*" multiple onChange={event=>void addCheckinMedia(event.target.files)}/></label>{checkinMedia.length>0&&<div className="checkin-media-list">{checkinMedia.map((item,index)=><article key={`${item.name}-${index}`}>{item.type==="image"?<img src={item.url} alt={item.name}/>:item.type==="video"?<video src={item.url} controls playsInline/>:<div className="checkin-audio"><Mic/><audio src={item.url} controls/></div>}<footer><span>{item.type==="image"?"照片":item.type==="video"?"视频":"语音"} · {item.name}</span><button onClick={()=>setCheckinMedia(current=>current.filter((_,i)=>i!==index))}><X/></button></footer></article>)}</div>}<button disabled={!checkinMood.trim()&&!checkinNote.trim()&&!checkinMedia.length} onClick={finishPlaceCheckin}><Medal/>完成打卡并领取 +30 热爱值</button></section></div></section>}
    {sameShowOpen&&<SameShowCommunity artist={artist} title="深圳站同场社区" verified={sameShowVerified} setVerified={setSameShowVerified} ticketProof={ticketProof} setTicketProof={setTicketProof} show="深圳站 · 2026.10.11" setShow={()=>{}} area={sameShowArea} setArea={setSameShowArea} row={sameShowRow} setRow={setSameShowRow} seatNumber={sameShowSeat} setSeatNumber={setSameShowSeat} showExactSeat={sameShowExactSeat} setShowExactSeat={setSameShowExactSeat} tab={sameShowTab} setTab={setSameShowTab} media={sameShowMedia} setMedia={setSameShowMedia} draft={sameShowDraft} setDraft={setSameShowDraft} isPublic={sameShowPublic} setIsPublic={setSameShowPublic} posts={sameShowPosts} setPosts={setSameShowPosts} identityName="Winnie" addedFriends={sameShowFriends} setAddedFriends={setSameShowFriends} onSyncPublic={()=>toast("已同步到动态与话题")} onClose={()=>setSameShowOpen(false)} expandedMedia={sameShowExpandedMedia} setExpandedMedia={setSameShowExpandedMedia} commenting={sameShowCommenting} setCommenting={setSameShowCommenting} comment={sameShowComment} setComment={setSameShowComment} serviceOpen={setServiceOpen} exchangeHave={exchangeHave} setExchangeHave={setExchangeHave} exchangeWant={exchangeWant} setExchangeWant={setExchangeWant} exchangeMeet={exchangeMeet} setExchangeMeet={setExchangeMeet} servicePosts={servicePosts} setServicePosts={setServicePosts}/>}
    {serviceOpen&&<section className="feature-sheet service-community-sheet"><header><button onClick={()=>{setServiceOpen(null);setCommentingServicePost(null)}}><ChevronLeft/></button><b>{serviceOpen}</b><button><Users/></button></header><div className="feature-scroll"><section className="service-post-composer"><textarea value={serviceDraft} onChange={event=>setServiceDraft(event.target.value)} placeholder={`发布${serviceOpen}信息、图片或注意事项…`}/><div><label><Image/>图片<input type="file" accept="image/*"/></label><label><Video/>视频<input type="file" accept="video/*"/></label><button disabled={!serviceDraft.trim()} onClick={publishServicePost}>发布</button></div></section><section className="interactive-post-feed">{(servicePosts[serviceOpen]??[]).map(post=><article key={post.id}><header><span>{post.author.slice(0,1)}</span><div><b>{post.author}</b><small>深圳站 · 已验证持票用户</small></div></header><p>{post.text}</p><div className="post-social-actions"><button className={post.liked?"liked":""} onClick={()=>updateServicePost(post.id,item=>({...item,liked:!item.liked,likes:item.likes+(item.liked?-1:1)}))}><Heart fill={post.liked?"currentColor":"none"}/>{post.likes}</button><button onClick={()=>setCommentingServicePost(commentingServicePost===post.id?null:post.id)}><MessageCircle/>{post.comments.length}</button><button onClick={()=>updateServicePost(post.id,item=>({...item,shares:item.shares+1}))}><Share2/>{post.shares}</button></div>{post.comments.length>0&&<div className="inline-comments">{post.comments.map((comment,index)=><p key={`${comment}-${index}`}><b>同场用户：</b>{comment}</p>)}</div>}{commentingServicePost===post.id&&<div className="inline-comment-box"><input value={serviceComment} onChange={event=>setServiceComment(event.target.value)} placeholder="写评论…"/><button disabled={!serviceComment.trim()} onClick={()=>{updateServicePost(post.id,item=>({...item,comments:[...item.comments,serviceComment.trim()]}));setServiceComment("");setCommentingServicePost(null)}}>发送</button></div>}</article>)}</section></div></section>}
    {seatViewOpen&&<section className="feature-sheet venue-seat-sheet"><header><button onClick={()=>setSeatViewOpen(false)}><ChevronLeft/></button><b>{selectedVenue} · 座位视角</b><button><Camera/></button></header><div className="feature-scroll"><section className="venue-share-note"><MapPinned/><div><b>场馆历史视角图</b><p>汇总所有用户在 {selectedVenue} 上传的视角，不区分关注艺人或演出场次。</p></div></section><nav className="seat-layer-tabs">{Object.keys(seatZones).map(layer=><button key={layer} className={seatLayer===layer?"active":""} onClick={()=>{setSeatLayer(layer);setSeatZone(seatZones[layer][0])}}>{layer}</button>)}</nav><section className="seat-zone-picker"><h2>选择区域</h2><div>{seatZones[seatLayer].map(zone=><button key={zone} className={seatZone===zone?"active":""} onClick={()=>setSeatZone(zone)}>{zone}</button>)}</div></section><section className="seat-view-publisher"><h2>注册新的 {seatLayer} · {seatZone} 视角</h2><textarea value={seatDraft} onChange={event=>setSeatDraft(event.target.value)} placeholder="写下距离、舞台与大屏视角…"/><select value={seatObstruction} onChange={event=>setSeatObstruction(event.target.value)}><option>无遮挡</option><option>轻微遮挡：前排观众或灯牌</option><option>部分遮挡：音响或设备</option><option>严重遮挡</option></select>{seatMediaUrl&&<img className="seat-upload-preview" src={seatMediaUrl} alt="待上传座位视角"/>}<div><label><Camera/>{seatMedia||"上传视角图片或视频"}<input type="file" accept="image/*,video/*" onChange={event=>{const file=event.target.files?.[0];setSeatMedia(file?.name??"");setSeatMediaUrl(file?URL.createObjectURL(file):"")}}/></label><button disabled={!seatMedia} onClick={()=>{setVenueSeatPosts(current=>[{id:Date.now(),venue:selectedVenue,artist,layer:seatLayer,zone:seatZone,author:"Winnie",text:seatDraft.trim()||"上传了新的座位视角",media:seatMedia||`${artist}社区 · 现场记录`,image:seatMediaUrl,obstruction:seatObstruction,likes:0,liked:false,comments:[],shares:0},...current]);setSeatDraft("");setSeatMedia("");setSeatMediaUrl("");setSeatObstruction("无遮挡");toast(`已上传 ${selectedVenue} ${seatZone} 视角`)}}>注册并发布视角</button></div></section><section className="interactive-post-feed seat-shared-feed">{visibleSeatPosts.length?visibleSeatPosts.map(post=><article key={post.id}><header><span>{post.author.slice(0,1)}</span><div><b>{post.author}<em>{post.artist}社区</em></b><small>{post.layer} · {post.zone} · {selectedVenue}</small></div></header>{post.image?<img className="shared-seat-photo" src={post.image} alt={`${post.zone}座位视角`}/>:<div className="shared-seat-art"><span>STAGE</span><b>{post.zone}</b><small>{post.media}</small></div>}<div className={`obstruction-badge ${post.obstruction==="无遮挡"?"clear":"blocked"}`}><ShieldCheck/>{post.obstruction}</div><p>{post.text}</p><div className="post-social-actions"><button className={post.liked?"liked":""} onClick={()=>setVenueSeatPosts(current=>current.map(item=>item.id===post.id?{...item,liked:!item.liked,likes:item.likes+(item.liked?-1:1)}:item))}><Heart fill={post.liked?"currentColor":"none"}/>{post.likes}</button><button onClick={()=>setCommentingSeatPost(commentingSeatPost===post.id?null:post.id)}><MessageCircle/>{post.comments.length}</button><button onClick={()=>setVenueSeatPosts(current=>current.map(item=>item.id===post.id?{...item,shares:item.shares+1}:item))}><Share2/>{post.shares}</button></div>{post.comments.map((comment,index)=><div className="seat-inline-comment" key={`${comment}-${index}`}><b>场馆同好：</b>{comment}</div>)}{commentingSeatPost===post.id&&<div className="inline-comment-box"><input value={seatComment} onChange={event=>setSeatComment(event.target.value)} placeholder="写评论…"/><button disabled={!seatComment.trim()} onClick={()=>{setVenueSeatPosts(current=>current.map(item=>item.id===post.id?{...item,comments:[...item.comments,seatComment.trim()]}:item));setSeatComment("");setCommentingSeatPost(null)}}>发送</button></div>}</article>):<div className="seat-empty"><Camera/><b>这个区域还没有视角</b><p>成为第一个上传 {seatZone} 真实视角的人。</p></div>}</section></div></section>}
    {expandedSeatMedia&&<div className="media-lightbox" onClick={()=>setExpandedSeatMedia(null)}><button aria-label="关闭图片预览"><X/></button><img src={expandedSeatMedia} alt="展开的场馆视角"/></div>}
  </div>;
}

function SameShowCommunity({artist,title,verified,setVerified,ticketProof,setTicketProof,show,setShow,area,setArea,row,setRow,seatNumber,setSeatNumber,showExactSeat,setShowExactSeat,tab,setTab,media,setMedia,draft,setDraft,isPublic,setIsPublic,posts,setPosts,identityName,addedFriends,setAddedFriends,onSyncPublic,onClose,expandedMedia,setExpandedMedia,commenting,setCommenting,comment,setComment,serviceOpen,exchangeHave,setExchangeHave,exchangeWant,setExchangeWant,exchangeMeet,setExchangeMeet,servicePosts,setServicePosts}:{artist:string;title:string;verified:boolean;setVerified:(value:boolean)=>void;ticketProof:string;setTicketProof:(value:string)=>void;show:string;setShow:(value:string)=>void;area:string;setArea:(value:string)=>void;row:string;setRow:(value:string)=>void;seatNumber:string;setSeatNumber:(value:string)=>void;showExactSeat:boolean;setShowExactSeat:(value:boolean)=>void;tab:string;setTab:(value:string)=>void;media:{name:string;kind:string;url:string}[];setMedia:Dispatch<SetStateAction<{name:string;kind:string;url:string}[]>>;draft:string;setDraft:(value:string)=>void;isPublic:boolean;setIsPublic:(value:boolean)=>void;posts:SameShowPost[];setPosts:Dispatch<SetStateAction<SameShowPost[]>>;identityName:string;addedFriends:number[];setAddedFriends:Dispatch<SetStateAction<number[]>>;onSyncPublic:(text:string)=>void;onClose:()=>void;expandedMedia:{url:string;kind:"image"|"video"}|null;setExpandedMedia:(value:{url:string;kind:"image"|"video"}|null)=>void;commenting:number|null;setCommenting:(value:number|null)=>void;comment:string;setComment:(value:string)=>void;serviceOpen?:(value:string)=>void;exchangeHave?:string;setExchangeHave?:(value:string)=>void;exchangeWant?:string;setExchangeWant?:(value:string)=>void;exchangeMeet?:string;setExchangeMeet?:(value:string)=>void;servicePosts?:Record<string,ServicePost[]>;setServicePosts?:Dispatch<SetStateAction<Record<string,ServicePost[]>>>}) {
  const tabs=serviceOpen?["同场","同区","座位邻居","同行互助","物料交换"]:["同场","同区","座位邻居"];
  const visiblePosts=tab==="同区"?posts.filter(post=>post.area.startsWith(area)):posts;
  const publish=()=>{if(!draft.trim()&&!media.length)return;const text=draft.trim()||`分享了 ${media.length} 个现场瞬间`;const newPost:SameShowPost={id:Date.now(),author:identityName,area:`${area} · ${showExactSeat?`${row}${seatNumber}`:"座位号隐藏"}`,text,images:media.filter(item=>item.kind==="图片").map(item=>item.url),videos:media.filter(item=>item.kind==="视频").map(item=>item.url),likes:0,liked:false,comments:[],shares:0,time:"刚刚"};setPosts(current=>[newPost,...current]);if(isPublic)onSyncPublic(text);setDraft("");setMedia([])};
  const updatePost=(id:number,update:(post:SameShowPost)=>SameShowPost)=>setPosts(current=>current.map(post=>post.id===id?update(post):post));
  const publishExchange=()=>{if(!exchangeHave?.trim()||!exchangeWant?.trim()||!setServicePosts)return;const text=`可交换：${exchangeHave.trim()}｜想要：${exchangeWant.trim()}｜见面地点：${exchangeMeet||"场馆官方交换区"}`;setServicePosts(current=>({...current,"物料交换":[{id:Date.now(),author:identityName,text,likes:0,liked:false,comments:[],shares:0},...(current["物料交换"]??[])]}));setExchangeHave?.("");setExchangeWant?.("")};
  return <section className="feature-sheet same-show-live-sheet">
    <header><button onClick={onClose}><ChevronLeft/></button><b>{verified?title:"验证演唱会座位"}</b><button><ShieldCheck/></button></header>
    <div className="feature-scroll">{!verified?<section className="seat-verify-form"><section className="seat-verify-intro"><TicketCheck/><div><h2>仅持票用户可以进入</h2><p>上传包含场次、区域和座位信息的出票截图。截图只用于验证，不会公开。</p></div></section><label>演唱会场次<select value={show} onChange={event=>setShow(event.target.value)}><option>深圳站 · 2026.10.11</option><option>广州站 · 2026.11.15</option><option>上海站 · 2026.12.06</option></select></label><div className="seat-form-row"><label>区域<input value={area} onChange={event=>setArea(event.target.value)} placeholder="例如 A3区"/></label><label>排数<input value={row} onChange={event=>setRow(event.target.value)} placeholder="例如 12排"/></label><label>座位<input value={seatNumber} onChange={event=>setSeatNumber(event.target.value)} placeholder="例如 08座"/></label></div><label className="ticket-proof-upload">{ticketProof?<img src={ticketProof} alt="出票截图预览"/>:<><Upload/><b>上传含座位的出票截图</b><small>支持 JPG、PNG；截图默认私密</small></>}<input type="file" accept="image/*" onChange={event=>{const file=event.target.files?.[0];if(file)setTicketProof(URL.createObjectURL(file))}}/></label><button className={`seat-privacy-toggle ${showExactSeat?"active":""}`} onClick={()=>setShowExactSeat(!showExactSeat)}><span><Lock/></span><div><b>公开具体座位号</b><small>区域“{area}”始终展示；排号和座位号可选</small></div><em>{showExactSeat?"已开启":"默认关闭"}</em></button><button className="seat-verify-submit" disabled={!ticketProof||!area.trim()} onClick={()=>setVerified(true)}><ShieldCheck/>验证并进入同场社区</button></section>:<>
      <nav className={`same-show-tools-tabs ${serviceOpen?"five":"three"}`}>{tabs.map(item=><button key={item} className={tab===item?"active":""} onClick={()=>setTab(item)}>{item}</button>)}</nav>
      {tab==="座位邻居"?<section className="seat-friend-list">{[[1,"星星汽水",`${area} · 12排10座`,`同排相距2座`],[3,"今天也奔赴",`${area} · 13排06座`,`前后排邻居`]].map(([id,name,seat,note])=>{const added=addedFriends.includes(Number(id));return <article key={String(id)}><span>{String(name).slice(0,1)}</span><div><b>{name}</b><small>{seat}</small><em>{note}</em></div><button className={added?"added":""} onClick={()=>setAddedFriends(current=>added?current.filter(item=>item!==Number(id)):[...current,Number(id)])}>{added?"已添加":"加好友"}</button></article>})}</section>
      :tab==="同行互助"&&serviceOpen?<section className="same-show-service-grid">{[[Users,"同城组队","同城出发 · 找同行同担"],[Car,"拼车与集合","发布安全集合信息"]].map(([Icon,name,meta])=>{const I=Icon as typeof Users;return <button key={String(name)} onClick={()=>serviceOpen(String(name))}><I/><div><b>{String(name)}</b><small>{String(meta)}</small></div><ChevronRight/></button>})}</section>
      :tab==="物料交换"&&serviceOpen?<><section className="same-show-exchange-composer"><header><span><Repeat2/></span><div><h2>本场物料交换</h2><p>建议在官方划定区域当面确认品相。</p></div></header><label>我可以交换<input value={exchangeHave||""} onChange={event=>setExchangeHave?.(event.target.value)} placeholder="限定小卡、现场手幅"/></label><label>我想要<input value={exchangeWant||""} onChange={event=>setExchangeWant?.(event.target.value)} placeholder="想交换的物料"/></label><label>交换地点<select value={exchangeMeet||"场馆官方交换区"} onChange={event=>setExchangeMeet?.(event.target.value)}><option>场馆官方交换区</option><option>A3入口外侧</option><option>南广场服务台旁</option></select></label><button disabled={!exchangeHave?.trim()||!exchangeWant?.trim()} onClick={publishExchange}><Repeat2/>发布交换需求</button></section><section className="interactive-post-feed exchange-post-feed">{(servicePosts?.["物料交换"]??[]).map(post=><article key={post.id}><header><span>{post.author.slice(0,1)}</span><div><b>{post.author}</b><small>已验证持票用户</small></div></header><p>{post.text}</p><div className="post-social-actions"><button onClick={()=>setServicePosts?.(current=>({...current,"物料交换":current["物料交换"].map(item=>item.id===post.id?{...item,liked:!item.liked,likes:item.likes+(item.liked?-1:1)}:item)}))}><Heart fill={post.liked?"currentColor":"none"}/>{post.likes}</button><button><MessageCircle/>{post.comments.length}</button><button onClick={()=>setServicePosts?.(current=>({...current,"物料交换":current["物料交换"].map(item=>item.id===post.id?{...item,shares:item.shares+1}:item)}))}><Share2/>{post.shares}</button></div></article>)}</section></>
      :<><section className="seat-zone-publisher same-show-composer"><h2>{tab==="同区"?`${area}动态`:`${show.split(" · ")[0]}同场动态`}</h2><textarea value={draft} onChange={event=>setDraft(event.target.value)} placeholder="和本场粉丝分享文字、照片或视频…"/><button className={`seat-sync-toggle ${isPublic?"active":""}`} onClick={()=>setIsPublic(!isPublic)}><span>{isPublic?<Check/>:<Lock/>}</span><div><b>同步到动态与话题</b><small>公开时自动带上演唱会场次和日期话题</small></div><em>{isPublic?"公开":"仅本场"}</em></button><div><label><Image/>图片<input type="file" accept="image/*" multiple onChange={event=>{const files=Array.from(event.target.files??[]);setMedia(current=>[...current,...files.map(file=>({name:file.name,kind:"图片",url:URL.createObjectURL(file)}))])}}/></label><label><Video/>视频<input type="file" accept="video/*" multiple onChange={event=>{const files=Array.from(event.target.files??[]);setMedia(current=>[...current,...files.map(file=>({name:file.name,kind:"视频",url:URL.createObjectURL(file)}))])}}/></label><button disabled={!draft.trim()&&!media.length} onClick={publish}>发布</button></div>{media.length>0&&<div className="seat-media-preview">{media.map((item,index)=><button key={`${item.name}-${index}`} onClick={()=>setExpandedMedia({url:item.url,kind:item.kind==="视频"?"video":"image"})}>{item.kind==="图片"?<img src={item.url} alt={item.name}/>:<video src={item.url}/>}<small>{item.name}</small></button>)}</div>}</section>
      <section className="same-show-post-feed">{visiblePosts.map(post=><article key={post.id}><header><span>{post.author.slice(0,1)}</span><div><b>{post.author}<em>已验票</em></b><small>{post.area} · {post.time}</small></div><button>•••</button></header><p>{post.text}</p>{(post.images.length>0||post.videos.length>0)&&<div className={`same-show-media-grid count-${Math.min(3,post.images.length+post.videos.length)}`}>{post.images.map((url,index)=><button key={`${url}-${index}`} onClick={()=>setExpandedMedia({url,kind:"image"})}><img src={url} alt="现场帖子图片"/></button>)}{post.videos.map((url,index)=><button className="video-thumb" key={`${url}-${index}`} onClick={()=>setExpandedMedia({url,kind:"video"})}><video src={url}/><Play fill="currentColor"/></button>)}</div>}<footer><button onClick={()=>updatePost(post.id,item=>({...item,shares:item.shares+1}))}><Share2/>{post.shares||"转发"}</button><button onClick={()=>setCommenting(commenting===post.id?null:post.id)}><MessageCircle/>{post.comments.length||"评论"}</button><button className={post.liked?"liked":""} onClick={()=>updatePost(post.id,item=>({...item,liked:!item.liked,likes:item.likes+(item.liked?-1:1)}))}><Heart fill={post.liked?"currentColor":"none"}/>{post.likes||"赞"}</button></footer>{post.comments.length>0&&<div className="inline-comments">{post.comments.map((item,index)=><p key={`${item}-${index}`}><b>同场用户：</b>{item}</p>)}</div>}{commenting===post.id&&<div className="inline-comment-box"><input value={comment} onChange={event=>setComment(event.target.value)} placeholder="写下评论…"/><button disabled={!comment.trim()} onClick={()=>{updatePost(post.id,item=>({...item,comments:[...item.comments,comment.trim()]}));setComment("");setCommenting(null)}}>发送</button></div>}</article>)}</section></>}
    </>}</div>
    {expandedMedia&&<div className="media-lightbox" onClick={()=>setExpandedMedia(null)}><button aria-label="关闭图片预览"><X/></button>{expandedMedia.kind==="image"?<img src={expandedMedia.url} alt="展开的现场图片"/>:<video src={expandedMedia.url} controls autoPlay/>}</div>}
  </section>;
}

function CreateView({artist,toast,open:_,merchItems,openCollection,orders,setOrders}:{artist:string;toast:(s:string)=>void;open:(f:Feature)=>void;merchItems:MerchItem[];openCollection:()=>void;orders:MallOrder[];setOrders:Dispatch<SetStateAction<MallOrder[]>>}) {
  const [channel,setChannel]=useState<MallChannel>("官方周边");
  const [artistFilter,setArtistFilter]=useState(artist);
  const [searchOpen,setSearchOpen]=useState(false);
  const [query,setQuery]=useState("");
  const [extraProducts,setExtraProducts]=useState<MallProduct[]>([]);
  const [selectedProduct,setSelectedProduct]=useState<MallProduct|null>(null);
  const [cart,setCart]=useState<Record<string,number>>({});
  const [cartOpen,setCartOpen]=useState(false);
  const [checkoutOpen,setCheckoutOpen]=useState(false);
  const [addressOpen,setAddressOpen]=useState(false);
  const [paymentOpen,setPaymentOpen]=useState(false);
  const [paymentChecking,setPaymentChecking]=useState(false);
  const [paymentSuccessOpen,setPaymentSuccessOpen]=useState(false);
  const [ordersOpen,setOrdersOpen]=useState(false);
  const [orderFilter,setOrderFilter]=useState("全部订单");
  const [address,setAddress]=useState({name:"Winnie",phone:"136 8953 4096",detail:"广东省深圳市南山区香山西街南 华侨城天鹅堡一期C栋11C"});
  const [addressDraft,setAddressDraft]=useState(address);
  const [resaleComposer,setResaleComposer]=useState(false);
  const [resaleName,setResaleName]=useState("");
  const [resaleDesc,setResaleDesc]=useState("");
  const [resalePrice,setResalePrice]=useState("");
  const [resaleImage,setResaleImage]=useState("");
  const [resaleShipping,setResaleShipping]=useState("包邮");
  const [resaleLocation,setResaleLocation]=useState("深圳");
  const [purchased,setPurchased]=useState<string[]>([]);
  const [customizing,setCustomizing]=useState(false);
  const [customFront,setCustomFront]=useState("");
  const [customBack,setCustomBack]=useState("");
  const [customSize,setCustomSize]=useState("63×88mm");
  const [customMaterial,setCustomMaterial]=useState("绒面");
  const [customAgreed,setCustomAgreed]=useState(false);
  const ownedResale=useMemo<MallProduct[]>(()=>merchItems.filter(item=>item.selling).map(item=>({id:`owned-${item.id}`,channel:"粉丝闲置",artist:item.artist,name:item.name,price:Number(item.price)||0,image:item.image,badge:"我的闲置",description:`${item.kind}，购买价 ¥${item.price}，由用户上传。`,seller:"Winnie",status:"刚刚发布"})),[merchItems]);
  const products=useMemo(()=>[...mallProducts,...ownedResale,...extraProducts],[ownedResale,extraProducts]);
  const shown=products.filter(item=>item.channel===channel&&(channel==="自制周边"||artistFilter==="全部"||item.artist===artistFilter)&&(!query.trim()||`${item.name}${item.artist}${item.description}`.toLowerCase().includes(query.trim().toLowerCase())));
  const cartItems=products.filter(item=>cart[item.id]);
  const cartCount=Object.values(cart).reduce((sum,count)=>sum+count,0);
  const cartTotal=cartItems.reduce((sum,item)=>sum+item.price*(cart[item.id]||0),0);
  const addCart=(item:MallProduct)=>{setCart(current=>({...current,[item.id]:(current[item.id]||0)+1}));toast(`已加入购物车：${item.name}`)};
  const openOrders=(filter="全部订单")=>{setOrderFilter(filter);setOrdersOpen(true)};
  const finishDemoPayment=()=>{
    setPaymentChecking(true);
    window.setTimeout(()=>{
      const paidItems=cartItems.flatMap(item=>Array.from({length:cart[item.id]||0},()=>item));
      setOrders(current=>[{id:`LR${Date.now()}`,status:"待发货",items:paidItems,total:cartTotal,created:"2026.09.29",action:"提醒发货"},...current]);
      setCart({});setPaymentChecking(false);setPaymentOpen(false);setPaymentSuccessOpen(true);
    },1200);
  };
  const publishResale=()=>{if(!resaleName.trim()||!resalePrice.trim()||!resaleImage)return;const item:MallProduct={id:`resale-${Date.now()}`,channel:"粉丝闲置",artist:artistFilter==="全部"?artist:artistFilter,name:resaleName.trim(),price:Number(resalePrice)||0,image:resaleImage,badge:resaleShipping,description:resaleDesc.trim()||"用户发布的粉丝闲置周边。",seller:"Winnie",status:`${resaleLocation} · 刚刚发布`};setExtraProducts(current=>[item,...current]);setResaleName("");setResaleDesc("");setResalePrice("");setResaleImage("");setResaleComposer(false);toast("闲置发布成功")};
  return <div className="stack subpage mall-page">
    <nav className="mall-channel-tabs">{(["官方周边","自制周边","粉丝闲置"] as MallChannel[]).map(item=><button key={item} className={channel===item?"active":""} onClick={()=>{setChannel(item);setSelectedProduct(null)}}>{item}</button>)}</nav>
    {channel!=="自制周边"?<section className="mall-artist-filter"><div>{[{name:"全部",image:""},...followedArtists].map(item=><button key={item.name} className={artistFilter===item.name?"active":""} onClick={()=>setArtistFilter(item.name)}>{item.image?<img src={item.image} alt={item.name}/>:<span><Star/></span>}<small>{item.name}</small></button>)}</div><button className="mall-search-trigger" onClick={()=>setSearchOpen(value=>!value)} aria-label="搜索商品"><Search/></button></section>:<section className="mall-custom-search-only"><div><Sparkles/><p><b>全品类定制</b><small>自制周边无需选择艺人</small></p></div><button onClick={()=>setSearchOpen(value=>!value)}><Search/>搜索款式</button></section>}
    {searchOpen&&<section className="mall-search-row"><Search/><input autoFocus value={query} onChange={event=>setQuery(event.target.value)} placeholder="搜索周边、艺人或物料"/><button onClick={()=>{setQuery("");setSearchOpen(false)}}><X/></button></section>}
    {channel==="粉丝闲置"&&<section className="resale-safety-note"><ShieldCheck/><p><b>粉丝闲置</b><small>查看卖家信用、细节图与发布时间，建议使用平台担保交易。</small></p><button onClick={openCollection}>管理我的闲置</button></section>}
    {channel==="自制周边"&&<section className="custom-shop-banner"><Sparkles/><div><b>自制物料工坊</b><small>选款式、传正反面图片、确认规格后加入同一个购物车。</small></div></section>}
    <section className={`mall-product-grid ${channel==="粉丝闲置"?"resale":""}`}>{shown.map(item=><article key={item.id} onClick={()=>{setSelectedProduct(item);setCustomizing(false)}}><div><img src={item.image} alt={item.name}/><em>{item.badge}</em></div><b>{item.name}</b><small>{item.artist}{item.seller?` · ${item.seller}`:""}</small><p>{item.status}</p><footer><strong>¥{item.price.toFixed(item.price<10?2:0)}</strong><button onClick={event=>{event.stopPropagation();addCart(item)}} aria-label={`将${item.name}加入购物车`}><ShoppingBag/></button></footer></article>)}</section>
    {!shown.length&&<section className="mall-empty"><Search/><b>暂时没有相关商品</b><p>可以切换艺人或清除搜索关键词。</p></section>}
    {channel==="粉丝闲置"&&<button className="resale-add-fab" onClick={()=>setResaleComposer(true)} aria-label="发布闲置"><Plus/></button>}
    <button className="mall-floating-cart" onClick={()=>setCartOpen(true)}><ShoppingBag/><span>购物车</span><em>{cartCount}</em></button>

    {selectedProduct&&<section className="feature-sheet mall-product-sheet"><header><button onClick={()=>{setSelectedProduct(null);setCustomizing(false)}}><ChevronLeft/></button><b>{customizing?"商品定制":selectedProduct.channel}</b><button onClick={()=>toast("商品链接已复制")}><Share2/></button></header><div className="feature-scroll">{customizing?<>
      <section className="custom-upload-workbench"><p><ShieldCheck/>点击图片上传定制，正反面均可单独设置</p><div><label>{customFront?<img src={customFront} alt="正面设计预览"/>:<><Plus/><b>正面</b><small>上传图片</small></>}<input type="file" accept="image/*" onChange={event=>{const file=event.target.files?.[0];if(file)setCustomFront(URL.createObjectURL(file))}}/></label><label>{customBack?<img src={customBack} alt="反面设计预览"/>:<><Plus/><b>反面</b><small>上传图片</small></>}<input type="file" accept="image/*" onChange={event=>{const file=event.target.files?.[0];if(file)setCustomBack(URL.createObjectURL(file))}}/></label></div></section>
      <section className="custom-options"><h2>尺寸</h2><div>{["63×88mm","93×120mm"].map(item=><button key={item} className={customSize===item?"active":""} onClick={()=>setCustomSize(item)}>{item}</button>)}</div><h2>覆膜材质</h2><div>{["绒面","斜柱镭射膜","素面镭射膜"].map(item=><button key={item} className={customMaterial===item?"active":""} onClick={()=>setCustomMaterial(item)}>{item}</button>)}</div></section>
      <button className={`custom-agreement ${customAgreed?"active":""}`} onClick={()=>setCustomAgreed(value=>!value)}><span>{customAgreed?<Check/>:null}</span>已阅读并同意《物料定制协议》</button>
      <section className="custom-order-bar"><div><small>10份起印</small><b>合计 ¥{(selectedProduct.price*10).toFixed(2)}</b></div><button disabled={!customFront||!customAgreed} onClick={()=>{addCart(selectedProduct);setSelectedProduct(null);setCustomizing(false)}}>加入购物车</button></section>
    </>:<>
      <section className="mall-detail-hero"><img src={selectedProduct.image} alt={selectedProduct.name}/><span>{selectedProduct.badge}</span></section>
      <section className="mall-detail-main"><strong>¥{selectedProduct.price.toFixed(selectedProduct.price<10?2:0)}</strong><h1>{selectedProduct.name}</h1><p>{selectedProduct.description}</p><small>{selectedProduct.status}</small></section>
      {selectedProduct.channel==="官方周边"&&<section className="official-product-info"><div><Medal/><p><b>正版授权 · 正品保障</b><small>商品信息与库存以官方页面为准</small></p></div>{selectedProduct.officialUrl&&<a href={selectedProduct.officialUrl} target="_blank" rel="noreferrer"><Music2/>前往 QQ 音乐官方周边入口<ChevronRight/></a>}</section>}
      {selectedProduct.channel==="自制周边"&&<section className="custom-tier-price"><h2>阶梯价格</h2><div><span><b>¥{selectedProduct.price.toFixed(2)}</b><small>1–20个</small></span><span><b>¥{Math.max(.7,selectedProduct.price-.06).toFixed(2)}</b><small>21–50个</small></span><span><b>¥{Math.max(.65,selectedProduct.price-.11).toFixed(2)}</b><small>51–100个</small></span><span><b>¥{Math.max(.6,selectedProduct.price-.15).toFixed(2)}</b><small>100个以上</small></span></div><p><FileImage/>支持获取刀线图、传图规范与售后说明</p></section>}
      {selectedProduct.channel==="粉丝闲置"&&<section className="resale-seller-card"><span>{selectedProduct.seller?.slice(0,1)}</span><p><b>{selectedProduct.seller}</b><small>卖家信用优秀 · 已完成实名认证</small></p><button onClick={()=>toast("已打开与卖家的聊天")}>聊一聊</button></section>}
      <section className="purchased-record"><div><Package/><p><b>已购信息</b><small>{purchased.includes(selectedProduct.id)?"已记录到“我的 → 已购”":"购买后可在个人页面长期查看"}</small></p></div><button className={purchased.includes(selectedProduct.id)?"done":""} onClick={()=>setPurchased(current=>current.includes(selectedProduct.id)?current:[...current,selectedProduct.id])}>{purchased.includes(selectedProduct.id)?"已标记":"标记已购"}</button></section>
      <div className="mall-detail-spacer"/>
    </>}</div>{!customizing&&<footer className="mall-detail-actions"><button onClick={()=>setCartOpen(true)}><ShoppingBag/><em>{cartCount}</em></button>{selectedProduct.channel==="自制周边"?<button className="primary" onClick={()=>setCustomizing(true)}>开始制作</button>:<><button onClick={()=>addCart(selectedProduct)}>加入购物车</button><button className="primary" onClick={()=>{addCart(selectedProduct);setCartOpen(true)}}>立即购买</button></>}</footer>}</section>}

    {resaleComposer&&<section className="feature-sheet resale-compose-sheet"><header><button onClick={()=>setResaleComposer(false)}><X/></button><b>发布闲置</b><button className="publish-link" disabled={!resaleName.trim()||!resalePrice.trim()||!resaleImage} onClick={publishResale}>发布</button></header><div className="feature-scroll"><section className="resale-compose-card"><label className="resale-cover-upload">{resaleImage?<img src={resaleImage} alt="闲置首图预览"/>:<><Plus/><b>添加优质首图</b><small>让商品更容易被看见</small></>}<input type="file" accept="image/*" onChange={event=>{const file=event.target.files?.[0];if(file)setResaleImage(URL.createObjectURL(file))}}/></label><input value={resaleName} onChange={event=>setResaleName(event.target.value)} placeholder="闲置名称、版本或来源"/><textarea value={resaleDesc} onChange={event=>setResaleDesc(event.target.value)} placeholder="描述品相、购买来源、是否有瑕疵…"/></section><section className="resale-form-list"><label><b>价格</b><span>¥<input inputMode="decimal" value={resalePrice} onChange={event=>setResalePrice(event.target.value)} placeholder="0.00"/></span></label><label><b>发货方式</b><select value={resaleShipping} onChange={event=>setResaleShipping(event.target.value)}><option>包邮</option><option>到付</option><option>同城面交</option></select></label><label><b>所在位置</b><input value={resaleLocation} onChange={event=>setResaleLocation(event.target.value)}/></label></section></div></section>}

    {cartOpen&&<section className="feature-sheet mall-cart-sheet"><header><button onClick={()=>setCartOpen(false)}><ChevronLeft/></button><b>购物车</b><button onClick={()=>setCart({})}><X/></button></header><div className="feature-scroll">{cartItems.length?<section className="mall-cart-list">{cartItems.map(item=><article key={item.id}><img src={item.image} alt={item.name}/><div><em>{item.channel}</em><b>{item.name}</b><small>{item.channel==="自制周边"?item.badge:`${item.artist} · ${item.badge}`}</small><strong>¥{item.price.toFixed(item.price<10?2:0)}</strong></div><span><button onClick={()=>setCart(current=>({...current,[item.id]:Math.max(0,(current[item.id]||0)-1)}))}>−</button><b>{cart[item.id]}</b><button onClick={()=>setCart(current=>({...current,[item.id]:(current[item.id]||0)+1}))}>+</button></span></article>)}</section>:<section className="mall-empty"><ShoppingBag/><b>购物车还是空的</b><p>官方、自制和闲置商品都可以放进这里。</p></section>}</div><footer className="mall-cart-checkout"><div><small>共 {cartCount} 件</small><b>合计：¥{cartTotal.toFixed(2)}</b></div><button disabled={!cartCount} onClick={()=>{setCartOpen(false);setCheckoutOpen(true)}}>结算</button></footer></section>}

    {checkoutOpen&&<section className="feature-sheet checkout-sheet"><header><button onClick={()=>setCheckoutOpen(false)}><ChevronLeft/></button><b>支付订单</b><span/></header><div className="feature-scroll"><section className="checkout-notice"><ShieldCheck/><span>不同渠道商品可能分开发货，请确认收货地址</span></section><button className="checkout-address-card" onClick={()=>{setAddressDraft(address);setAddressOpen(true)}}><MapPin/><div><b>{address.name} <span>{address.phone}</span></b><p>{address.detail}</p></div><ChevronRight/></button><section className="checkout-orders">{cartItems.map(item=><article key={item.id}><header><span>{item.channel}</span><small>{item.channel==="粉丝闲置"?"卖家直发":"平台保障"}</small></header><div><img src={item.image} alt={item.name}/><p><b>{item.name}</b><small>{item.channel==="自制周边"?item.badge:item.artist}</small><strong>¥{item.price.toFixed(item.price<10?2:0)} <em>×{cart[item.id]}</em></strong></p></div></article>)}</section><section className="checkout-summary"><p><span>商品金额</span><b>¥{cartTotal.toFixed(2)}</b></p><p><span>运费</span><b>¥0.00</b></p><p className="total"><span>合计</span><b>¥{cartTotal.toFixed(2)}</b></p></section><p className="demo-pay-note">支付为交互演示，不会产生真实扣款。</p></div><footer className="checkout-footer"><div><small>共 {cartCount} 件</small><b>¥{cartTotal.toFixed(2)}</b></div><button onClick={()=>{setCheckoutOpen(false);setPaymentOpen(true)}}>确认地址并微信支付</button></footer></section>}

    {addressOpen&&<section className="feature-sheet address-sheet"><header><button onClick={()=>setAddressOpen(false)}><ChevronLeft/></button><b>选择收货地址</b><span/></header><div className="feature-scroll"><section className="address-selected"><Check/><div><b>{address.name} <span>{address.phone}</span></b><p>{address.detail}</p><em>默认地址</em></div></section><h2>编辑本次收货信息</h2><section className="address-form"><label><span>收货人</span><input value={addressDraft.name} onChange={event=>setAddressDraft({...addressDraft,name:event.target.value})}/></label><label><span>手机号</span><input inputMode="tel" value={addressDraft.phone} onChange={event=>setAddressDraft({...addressDraft,phone:event.target.value})}/></label><label><span>详细地址</span><textarea value={addressDraft.detail} onChange={event=>setAddressDraft({...addressDraft,detail:event.target.value})}/></label></section><button className="add-address-button"><Plus/>添加新地址</button></div><footer className="address-footer"><button disabled={!addressDraft.name.trim()||!addressDraft.phone.trim()||!addressDraft.detail.trim()} onClick={()=>{setAddress(addressDraft);setAddressOpen(false);toast("收货地址已更新")}}>使用这个地址</button></footer></section>}

    {paymentOpen&&<section className="feature-sheet wechat-pay-sheet"><header><button disabled={paymentChecking} onClick={()=>setPaymentOpen(false)}><X/></button><b>微信支付</b><span/></header><div className="feature-scroll"><section className="wechat-pay-brand"><span>✓</span><b>微信支付</b><small>安全支付 · 演示环境</small></section><section className="wechat-pay-amount"><small>唱赴现场 LiveReady</small><b>¥{cartTotal.toFixed(2)}</b><p>收货人：{address.name}　{address.phone}</p></section><section className="wechat-pay-method"><span>零钱</span><b>推荐 <Check/></b></section>{paymentChecking?<section className="payment-checking"><i/><b>正在返回 LiveReady</b><p>系统正在自动检测支付结果…</p></section>:<button className="wechat-confirm" onClick={finishDemoPayment}>完成微信支付（Demo）</button>}<p className="demo-pay-note">此页面仅模拟微信支付跳转与回调，不会发起真实交易。</p></div></section>}

    {paymentSuccessOpen&&<section className="feature-sheet payment-result-sheet"><div className="payment-result-content"><span><Check/></span><h1>支付成功</h1><p>系统已自动检测到账，订单已进入待发货。</p><b>¥{orders[0]?.total.toFixed(2)}</b><button onClick={()=>{setPaymentSuccessOpen(false);openOrders("待发货")}}>查看我的订单</button><button className="ghost" onClick={()=>setPaymentSuccessOpen(false)}>返回商城</button></div></section>}

    {ordersOpen&&<section className="feature-sheet orders-sheet"><header><button onClick={()=>setOrdersOpen(false)}><ChevronLeft/></button><b>我的订单</b><button><Search/></button></header><nav className="order-tabs">{["全部订单","待支付","待发货","待收货"].map(item=><button key={item} className={orderFilter===item?"active":""} onClick={()=>setOrderFilter(item)}>{item}</button>)}</nav><div className="feature-scroll order-list">{orders.filter(order=>orderFilter==="全部订单"||order.status===orderFilter).map(order=><article className="order-card" key={order.id}><header><div><b>LiveReady 商城</b><small>{order.created} · {order.id}</small></div><em>{order.status}</em></header>{order.items.map((item,index)=><div className="order-item" key={`${order.id}-${item.id}-${index}`}><img src={item.image} alt={item.name}/><p><b>{item.name}</b><small>{item.channel} · {item.channel==="自制周边"?item.badge:item.artist}</small><span>¥{item.price.toFixed(item.price<10?2:0)}　×1</span></p></div>)}<footer><p>共 {order.items.length} 件　合计 <b>¥{order.total.toFixed(2)}</b></p><div><button onClick={()=>toast("订单详情已打开")}>订单详情</button><button className="primary" onClick={()=>toast(`${order.action}申请已提交`)}>{order.action}</button></div></footer></article>)}{!orders.some(order=>orderFilter==="全部订单"||order.status===orderFilter)&&<section className="mall-empty"><Package/><b>这里还没有订单</b><p>选购喜欢的周边后会显示在这里。</p></section>}</div></section>}
  </div>;
}

function ProfileView({orders,resetDemo}:{orders:MallOrder[];resetDemo:()=>void}) {
  const [ordersOpen,setOrdersOpen]=useState(false);
  const [orderFilter,setOrderFilter]=useState("全部订单");
  const visibleOrders=orders.filter(order=>orderFilter==="全部订单"||(orderFilter==="退款售后"?order.status==="已取消":order.status===orderFilter));
  return <div className="stack subpage">
    <section className="qq-profile-card">
      <div className="qq-profile-top"><div className="big-avatar">W<span><Check/></span></div><div><h1>Winnie</h1><p><b>SVIP 7年</b><em>59 勋章</em></p></div><button>会员中心 <ChevronRight/></button></div>
      <div className="qq-profile-actions"><button><Shirt/><span>装扮</span></button><button><Calendar/><span>日签</span></button><button><UserPlus/><span>关注</span></button></div>
    </section>
    <section className="qq-library-grid">{[[Heart,"收藏","515"],[Headphones,"本地","2"],[Radio,"有声","8"],[ShoppingBag,"我的订单",String(orders.length)]].map(([Icon,label,count])=>{const I=Icon as typeof Heart;const purchased=String(label)==="我的订单";return <button key={String(label)} className={purchased?"purchased-entry":""} onClick={()=>{if(purchased){setOrderFilter("全部订单");setOrdersOpen(true)}}}><I/><b>{String(label)}</b><small>{String(count)}</small></button>})}</section>
    <SectionHead title="最近播放" action="全部"/>
    <section className="recent-row">{[["已播歌曲","2500首","r1"],["歌单","演唱会必听","r2"],["专辑","天外来物","r3"]].map(item=><article key={item[0]}><div className={item[2]}><Music2/></div><b>{item[0]}</b><small>{item[1]}</small></article>)}</section>
    <section className="playlist-card"><div className="playlist-tabs"><b>自建歌单 2</b><b className="active">收藏歌单 5</b><Plus/><ChevronRight/></div><article><span className="playlist-cover p1"><Music2/></span><div><b>薛之谦 · 演唱会预习歌单</b><small>最近更新 · 天外来物</small></div></article><article><span className="playlist-cover p2"><Radio/></span><div><b>深夜电台与现场回忆</b><small>最近更新 · 12期</small></div></article></section>
    <SectionHead title="我的追星足迹" action="查看地图"/>
    <section className="footprint"><i/><i/><i/><span className="city c1">北京</span><span className="city c2">上海</span><span className="city c3">深圳</span><span className="city c4">悉尼</span><div><Map/><p><b>已点亮 8 座城市</b><small>跨越 12,842 km 的热爱</small></p></div></section>
    <section className="demo-reset-card"><span><Repeat2/></span><div><b>Demo 演示工具</b><small>进度已自动保存在本机 · 可清空签到、票据、路线与打卡状态</small></div><button onClick={resetDemo}>重新开始</button></section>
    {ordersOpen&&<section className="feature-sheet orders-sheet profile-orders-sheet"><header><button onClick={()=>setOrdersOpen(false)}><ChevronLeft/></button><b>我的订单</b><span/></header><nav className="order-tabs">{["全部订单","待支付","待发货","待收货","退款售后"].map(item=><button key={item} className={orderFilter===item?"active":""} onClick={()=>setOrderFilter(item)}>{item}</button>)}</nav><div className="feature-scroll order-list">{visibleOrders.map(order=><article className="order-card" key={order.id}><header><div><b>LiveReady 商城</b><small>{order.created} · {order.id}</small></div><em>{order.status}</em></header>{order.items.map((item,index)=><div className="order-item" key={`${order.id}-${item.id}-${index}`}><img src={item.image} alt={item.name}/><p><b>{item.name}</b><small>{item.channel} · {item.channel==="自制周边"?item.badge:item.artist}</small><span>¥{item.price.toFixed(item.price<10?2:0)}　×1</span></p></div>)}<footer><p>共 {order.items.length} 件　合计 <b>¥{order.total.toFixed(2)}</b></p><div><button>订单详情</button><button className="primary">{order.action}</button></div></footer></article>)}{!visibleOrders.length&&<section className="mall-empty"><Package/><b>这里还没有订单</b><p>商城购买的周边会显示在这里。</p></section>}</div></section>}
  </div>;
}

function FeatureHub({items,open}:{items:Feature[];open:(feature:Feature)=>void}) {
  return <section className="feature-hub">{items.map(item=>{const Icon=item.icon;const status=getBuildStatus(item.id);return <button key={item.id} onClick={()=>open(item)}><span><Icon/></span><div><b>{item.title}</b><small>{item.desc}</small><em className={`status-badge ${status}`}>{statusText[status]}</em></div><ChevronRight/></button>})}</section>
}

function StatusLegend() {return <section className="status-legend"><div><b>当前开发状态</b><small>点击功能卡可体验已完成的交互流程</small></div><span className="status-badge done">已实现</span><span className="status-badge demo">Demo</span><span className="status-badge pending">待接入</span></section>}

function FeatureSheet({artist,feature,posts,places,addPlace,markInvalid,addPost,done,close,complete}:{artist:string;feature:Feature;posts:CommunityPost[];places:LivePlace[];addPlace:(place:Omit<LivePlace,"id">)=>void;markInvalid:(id:number)=>void;addPost:(title:string,content:string)=>void;done:boolean;close:()=>void;complete:()=>void}) {
  const [draft,setDraft]=useState("");
  const [choice,setChoice]=useState("公开");
  const [mood,setMood]=useState("");
  const [linkedPlace,setLinkedPlace]=useState("星河广场应援大屏");
  const [placeSearch,setPlaceSearch]=useState("");
  const [uploads,setUploads]=useState<{name:string;kind:string;url:string}[]>([]);
  const [groupSearch,setGroupSearch]=useState("");
  const [joinedGroups,setJoinedGroups]=useState<number[]>([1]);
  const [creatingGroup,setCreatingGroup]=useState(false);
  const [newGroupName,setNewGroupName]=useState("");
  const [topicView,setTopicView]=useState("全部");
  const [topicComposerOpen,setTopicComposerOpen]=useState(false);
  const [selectedTopic,setSelectedTopic]=useState("");
  const [selectedTopicPlace,setSelectedTopicPlace]=useState("");
  const [topicPlaceOpen,setTopicPlaceOpen]=useState(false);
  const [topicPlaceName,setTopicPlaceName]=useState("");
  const [topicPlaceAddress,setTopicPlaceAddress]=useState("");
  const [cityView,setCityView]=useState("悉尼");
  const [subscribedCities,setSubscribedCities]=useState(["悉尼","深圳","上海","广州"]);
  const [cityDraft,setCityDraft]=useState("");
  const [cityCategory,setCityCategory]=useState<CityEventCategory>("体育场演唱会");
  const needsInput=["playlist","submitpoi","repo","merchants"].includes(feature.id);
  const isCommerce=["shop","groupbuy","orders","merchants"].includes(feature.id);
  const isPeople=["team","carpool","exchange"].includes(feature.id);
  const groupItems=[{id:1,name:`${artist}官方资讯讨论群`,type:"艺人群",members:"3,286人"},{id:2,name:`${artist}深圳同场群`,type:"活动群",members:"286人"},{id:3,name:`${artist}悉尼同城打卡组`,type:"同城群",members:"96人"},{id:4,name:`${artist}生日应援协作群`,type:"应援小组",members:"168人"}];
  const visibleGroups=groupItems.filter(group=>`${group.name}${group.type}`.toLowerCase().includes(groupSearch.trim().toLowerCase()));
  const artistImage=followedArtists.find(item=>item.name===artist)?.image??"/artists/xuezhiqian.jpg";
  const albumCatalog:Record<string,{albums:{name:string;image:string;progress:number}[];concerts:{name:string;image:string;progress:number}[]}>= {
    "薛之谦":{albums:[{name:"金斧子",image:"/albums/xuezhiqian-jinfuzi.jpg",progress:82},{name:"媚人",image:"/albums/xuezhiqian-meiren.jpg",progress:64},{name:"无数",image:artistImage,progress:46}],concerts:[{name:"天外来物巡回演唱会",image:artistImage,progress:73},{name:"摩天大楼世界巡回演唱会",image:"/albums/xuezhiqian-jinfuzi.jpg",progress:58}]},
    "单依纯":{albums:[{name:"纯妹妹",image:artistImage,progress:86},{name:"珠玉",image:artistImage,progress:69},{name:"勇敢额度",image:artistImage,progress:52}],concerts:[{name:"单依纯巡回演唱会",image:artistImage,progress:76}]},
    "汪苏泷":{albums:[{name:"十万伏特",image:artistImage,progress:79},{name:"克制凶猛",image:artistImage,progress:63},{name:"联名",image:artistImage,progress:48}],concerts:[{name:"十万伏特巡回演唱会",image:artistImage,progress:71}]},
    "i-dle":{albums:[{name:"I feel",image:artistImage,progress:91},{name:"2",image:artistImage,progress:78},{name:"I SWAY",image:artistImage,progress:66}],concerts:[{name:"i-dle WORLD TOUR",image:artistImage,progress:74}]},
  };
  const albumCollection=albumCatalog[artist]??albumCatalog["薛之谦"];
  const syncedTopics=Array.from(new Set(posts.map(post=>post.title.match(/^#.+?#/)?.[0]).filter(Boolean))) as string[];
  const baseTopics=["#官方资讯","#新歌回归","#演唱会现场","#打卡地","#现场Repo","#高清图集","#成员日常","#应援记录"];
  const topicItems=[...baseTopics,...syncedTopics.filter(topic=>!baseTopics.includes(topic))];
  const topicPosts=[
    {topic:"#官方资讯",title:`${artist}新一期综艺官宣，播出时间与观看入口整理`,meta:"官方动态 · 2,861赞",kind:"热门"},
    {topic:"#演唱会现场",title:"深圳站入场路线、座位视角和散场交通合集",meta:"现场攻略 · 1,905赞",kind:"热门"},
    {topic:"#高清图集",title:"新歌概念图高清原图与舞台返图集中收藏",meta:"图片资源 · 1,286赞",kind:"热门"},
    {topic:"#新歌回归",title:"刚刚更新的舞台信息与QQ音乐收听入口",meta:"3分钟前 · 326赞",kind:"实时"},
    {topic:"#成员日常",title:"今日公开行程和节目片段讨论楼",meta:"8分钟前 · 198赞",kind:"实时"},
    {topic:"#应援记录",title:"生日大屏落地进度与线下打卡时间更新",meta:"应援小组 · 896赞",kind:"热门"},
    {topic:"#打卡地",title:"星河广场应援大屏今日打卡指南",meta:"刚刚 · 386赞",kind:"实时",location:"IP属地：深圳市南山区星河广场东侧"},
    {topic:"#现场Repo",title:"深圳站A3区座位视角与入场时间记录",meta:"6分钟前 · 528赞",kind:"热门",location:"IP属地：深圳 · 湾区体育中心"},
    {topic:"",title:"今天循环到这首歌时，突然很期待下一次现场",meta:"15分钟前 · 152赞",kind:"实时"},
    ...places.map(place=>({topic:"#打卡地",title:`${place.name}${place.valid?"打卡信息":"地点信息待更新"}`,meta:`${place.source} · ${place.valid?"可打卡":"已标记失效"}`,kind:"实时",location:`IP属地：${place.address}`})),
    ...posts.map(post=>({topic:post.title.match(/^#.+?#/)?.[0]??"",title:post.title.replace(/^#.+?#\s*/,""),meta:`${post.time} · ${post.likes}赞`,kind:"实时",location:""})),
  ];
  const visibleTopicPosts=topicView==="全部"?topicPosts:topicView==="热门"||topicView==="实时"?topicPosts.filter(post=>post.kind===topicView):topicPosts.filter(post=>post.topic===topicView);
  const cityEventCategories:CityEventCategory[]=["体育场演唱会","体育馆演唱会","Livehouse","音乐节"];
  const cityEventCatalog:Record<string,CityEvent[]>={
    "悉尼":[
      {name:"城市体育场巡演 · 悉尼站",venue:"Accor Stadium",date:"10.18",category:"体育场演唱会",note:"大型户外场 · 订阅开演提醒"},
      {name:"室内巡演 · 悉尼站",venue:"Qudos Bank Arena",date:"11.06",category:"体育馆演唱会",note:"室内馆 · 座位视角可查"},
      {name:"新声专场 Sydney",venue:"The Metro Theatre",date:"11.14",category:"Livehouse",note:"Livehouse · 站席活动"},
      {name:"Harbour Music Weekend",venue:"The Domain",date:"11.22–23",category:"音乐节",note:"音乐节 · 双日阵容"},
    ],
    "深圳":[
      {name:"湾区体育场巡演 · 深圳站",venue:"深圳大运中心体育场",date:"10.19",category:"体育场演唱会",note:"大型户外场 · 交通攻略已收录"},
      {name:"城市室内巡演 · 深圳站",venue:"深圳体育馆",date:"10.25",category:"体育馆演唱会",note:"室内馆 · 座位视角可查"},
      {name:"新声现场 · 深圳专场",venue:"HOU LIVE 深圳",date:"11.02",category:"Livehouse",note:"Livehouse · 站席活动"},
      {name:"湾区秋日音乐节",venue:"深圳湾公园特别舞台",date:"11.15–16",category:"音乐节",note:"音乐节 · 双日阵容"},
    ],
    "上海":[
      {name:"城市体育场巡演 · 上海站",venue:"上海体育场",date:"10.16",category:"体育场演唱会",note:"大型户外场 · 散场路线可查"},
      {name:"室内音乐现场 · 上海站",venue:"梅赛德斯-奔驰文化中心",date:"11.02",category:"体育馆演唱会",note:"室内馆 · 座位视角可查"},
      {name:"秋日电气专场",venue:"MAO Livehouse 上海",date:"11.09",category:"Livehouse",note:"Livehouse · 现场取票"},
      {name:"浦江音乐节",venue:"上海国际音乐村",date:"11.21–22",category:"音乐节",note:"音乐节 · 户外场地"},
    ],
    "广州":[
      {name:"城市体育场巡演 · 广州站",venue:"广东省奥林匹克体育中心体育场",date:"10.20",category:"体育场演唱会",note:"大型户外场 · 入场攻略已收录"},
      {name:"室内巡演 · 广州站",venue:"广州体育馆",date:"11.15",category:"体育馆演唱会",note:"室内馆 · 座位视角可查"},
      {name:"南方新声专场",venue:"太空间 livehouse",date:"11.28",category:"Livehouse",note:"Livehouse · 站席活动"},
      {name:"珠江音乐节",venue:"广州大学城中心湖公园",date:"12.05–06",category:"音乐节",note:"音乐节 · 双日阵容"},
    ],
  };
  const buildCityDemoEvents=(city:string):CityEvent[]=>[
    {name:`城市体育场巡演 · ${city}站`,venue:`${city}体育中心体育场`,date:"10.26",category:"体育场演唱会",note:"大型户外场 · 待接入公开日程"},
    {name:`室内巡演 · ${city}站`,venue:`${city}体育馆`,date:"11.08",category:"体育馆演唱会",note:"室内馆 · 待接入公开日程"},
    {name:`新声现场 · ${city}专场`,venue:`${city} LIVEHOUSE`,date:"11.20",category:"Livehouse",note:"小型现场 · 待接入公开日程"},
    {name:`${city}城市音乐节`,venue:`${city}户外音乐公园`,date:"12.05–06",category:"音乐节",note:"户外音乐节 · 待接入公开日程"},
  ];
  const currentCityEvents=(cityEventCatalog[cityView]??buildCityDemoEvents(cityView)).filter(event=>event.category===cityCategory);
  const addSubscribedCity=()=>{const city=cityDraft.trim().replace(/市$/u,"");if(!city)return;setSubscribedCities(current=>current.includes(city)?current:[...current,city]);setCityView(city);setCityCategory("体育场演唱会");setCityDraft("")};
  const addUploads=(files:FileList|null,kind:string)=>{if(!files)return;setUploads(current=>[...current,...Array.from(files).map(file=>({name:file.name,kind,url:URL.createObjectURL(file)}))])};
  const publishTopicPost=()=>{if(!draft.trim())return;const topicPrefix=selectedTopic?`${selectedTopic} `:"";const locationPrefix=selectedTopicPlace?`📍IP属地：${selectedTopicPlace}\n`:"";addPost(`${topicPrefix}${draft.trim().slice(0,22)}${draft.trim().length>22?"…":""}`,`${locationPrefix}${draft.trim()}`);setDraft("");setSelectedTopic("");setSelectedTopicPlace("");setTopicComposerOpen(false);setTopicView("全部")};
  const journalReady=feature.id!=="journal"||Boolean(mood.trim()||uploads.length||draft.trim());
  return <section className="feature-sheet">
    <header><button onClick={close} aria-label="返回"><ChevronLeft/></button><b>{feature.title}</b><button aria-label="分享"><Share2/></button></header>
    <div className="feature-scroll">
      {feature.id==="album"&&<section className="album-library"><header><div><h2>{artist}听歌打卡</h2><p>进度按照 QQ 音乐完整播放记录计算</p></div><Headphones/></header><section className="album-category"><h3>专辑</h3><div className="album-cover-grid">{albumCollection.albums.map(item=><article key={item.name}><img src={item.image} alt={`${item.name}专辑封面`}/><b>{item.name}</b><div><span>已听 {item.progress}%</span><strong>{item.progress}%</strong></div><i><em style={{width:`${item.progress}%`}}/></i></article>)}</div></section><section className="album-category"><h3>演唱会歌单</h3><div className="album-cover-grid concert-grid">{albumCollection.concerts.map(item=><article key={item.name}><img src={item.image} alt={`${item.name}歌单封面`}/><b>{item.name}</b><div><span>已听 {item.progress}%</span><strong>{item.progress}%</strong></div><i><em style={{width:`${item.progress}%`}}/></i></article>)}</div></section></section>}
      {feature.id==="topics"&&!topicComposerOpen&&<><nav className="topic-feed-tabs">{["全部","热门","实时"].map(item=><button key={item} className={topicView===item?"active":""} onClick={()=>setTopicView(item)}>{item}</button>)}</nav><div className="topic-filter-row"><button className={!topicView.startsWith("#")?"active":""} onClick={()=>setTopicView("全部")}>全部话题</button>{topicItems.map(topic=><button key={topic} className={topicView===topic?"active":""} onClick={()=>setTopicView(topic)}>{topic}</button>)}</div><section className="topic-place-sync"><div><span><MapPinned/></span><p><b>打卡地点共建</b><small>新地点与失效更新会同步到“现场 → 场馆周边”</small></p><button onClick={()=>setTopicPlaceOpen(value=>!value)}>{topicPlaceOpen?"收起":"提交 / 更新"}</button></div>{topicPlaceOpen&&<section><input value={topicPlaceName} onChange={event=>setTopicPlaceName(event.target.value)} placeholder="地点名称"/><input value={topicPlaceAddress} onChange={event=>setTopicPlaceAddress(event.target.value)} placeholder="详细地址 / 地址IP"/><button disabled={!topicPlaceName.trim()||!topicPlaceAddress.trim()} onClick={()=>{addPlace({name:topicPlaceName.trim(),address:topicPlaceAddress.trim(),kind:"打卡地",source:"社区上传",valid:true});setTopicPlaceName("");setTopicPlaceAddress("")}}>提交新地点</button><div>{places.map(place=><span key={place.id}><b>{place.name}</b><small>{place.valid?place.address:"已标记失效"}</small><button onClick={()=>markInvalid(place.id)}>{place.valid?"信息失效":"恢复地点"}</button></span>)}</div></section>}</section><section className="topic-hot-posts topic-direct-feed"><h2>{topicView.startsWith("#")?topicView:`${topicView}动态`}</h2>{visibleTopicPosts.map(post=><article key={`${post.topic}-${post.title}`}><div className="topic-post-copy">{post.topic&&<span>{post.topic}</span>}<b>{post.title}</b>{post.location&&<em><MapPin/> {post.location}</em>}<p>{post.title.includes("现场")?"分享现场信息、座位视角与当时的真实感受。":"来自艺人社区的最新动态，点击查看全文并参与讨论。"}</p><small>{post.meta}</small></div><ChevronRight/></article>)}</section></>}
      {feature.id==="topics"&&topicComposerOpen&&<section className="topic-composer"><header><div><b>发一条动态</b><small>话题可以不添加</small></div><button onClick={()=>{setTopicComposerOpen(false);setDraft("");setSelectedTopic("");setSelectedTopicPlace("")}}><X/></button></header><textarea autoFocus value={draft} onChange={event=>setDraft(event.target.value)} placeholder="分享此刻想说的话、现场记录或追星日常…"/><div className="topic-compose-count">{draft.length}/300</div><section><h3>添加话题（可选）</h3><div><button className={!selectedTopic?"active":""} onClick={()=>setSelectedTopic("")}>不添加话题</button>{topicItems.map(topic=><button key={topic} className={selectedTopic===topic?"active":""} onClick={()=>setSelectedTopic(topic)}>{topic}</button>)}</div></section>{["#打卡地","#现场Repo"].includes(selectedTopic)&&<label className="topic-place-select"><MapPin/><select value={selectedTopicPlace} onChange={event=>setSelectedTopicPlace(event.target.value)}><option value="">选择地址IP（可选）</option>{places.filter(place=>place.valid).map(place=><option key={place.id} value={place.address}>{place.name} · {place.address}</option>)}</select></label>}<button className="topic-publish-button" disabled={!draft.trim()} onClick={publishTopicPost}>发布动态</button></section>}
      {feature.id==="groups"&&<><section className="group-tools"><div className="group-search"><Search/><input value={groupSearch} onChange={event=>setGroupSearch(event.target.value)} placeholder={`搜索${artist}的群组`}/>{groupSearch&&<button onClick={()=>setGroupSearch("")}><X/></button>}</div><button onClick={()=>setCreatingGroup(value=>!value)}><Plus/>新建群</button></section>{creatingGroup&&<section className="group-create"><label>群组名称<input value={newGroupName} onChange={event=>setNewGroupName(event.target.value)} placeholder="例如：深圳站散场同行群"/></label><div><button onClick={()=>{setCreatingGroup(false);setNewGroupName("")}}>取消</button><button disabled={!newGroupName.trim()} onClick={()=>{setCreatingGroup(false);setNewGroupName("")}}>创建群组</button></div></section>}<section className="fan-group-list">{visibleGroups.map(group=>{const joined=joinedGroups.includes(group.id);return <article key={group.id}><span><Users/></span><div><em>{group.type}</em><b>{group.name}</b><small>{group.members} · 今日活跃</small></div><button className={joined?"joined":""} onClick={()=>setJoinedGroups(current=>joined?current.filter(id=>id!==group.id):[...current,group.id])}>{joined?"已加入":"加入"}</button></article>})}{!visibleGroups.length&&<div className="group-empty"><Search/><b>没有找到相关群组</b><p>可以换个关键词，或新建一个群。</p></div>}</section></>}
      {feature.id==="subscribe"&&<><section className="city-concert-head"><div><MapPin/><span><small>根据已添加城市聚合现场</small><b>{cityView}近期演出</b></span></div><button><Navigation/>重新定位</button></section><section className="city-subscribe-adder"><div><Plus/><input value={cityDraft} onChange={event=>setCityDraft(event.target.value)} onKeyDown={event=>{if(event.key==="Enter")addSubscribedCity()}} placeholder="输入城市，例如：成都"/></div><button onClick={addSubscribedCity} disabled={!cityDraft.trim()}>添加城市</button><small>添加后自动按体育场、体育馆、Livehouse 和音乐节整理近期现场</small></section><nav className="city-switch-tabs city-subscription-tabs">{subscribedCities.map(city=><button key={city} className={cityView===city?"active":""} onClick={()=>{setCityView(city);setCityCategory("体育场演唱会")}}>{city}</button>)}</nav><nav className="city-event-category-tabs">{cityEventCategories.map(category=><button key={category} className={cityCategory===category?"active":""} onClick={()=>setCityCategory(category)}>{category}</button>)}</nav><section className="all-artist-concerts">{currentCityEvents.map(event=><article key={`${event.name}-${event.date}`}><span>{event.date}</span><div><em>{event.category}</em><b>{event.name}</b><small>{event.venue} · {event.note}</small></div><button><Bell/>订阅</button></article>)}</section><p className="city-event-demo-note">Demo 展示聚合流程；正式版可接入票务平台、场馆及音乐节公开日程。</p></>}
      {feature.id==="onsite"&&<><section className="repo-guide-head"><Camera/><div><b>来自各艺人 #现场Repo</b><p>自动整理高赞酒店、抢票、交通与入场经验，不受关注艺人限制。</p></div></section><section className="repo-guide-sections">{[["酒店推荐","谦友小北 · 薛之谦社区","湾区体育中心附近住宿合集：步行距离、散场打车和价格对比","1,286赞"],["抢票攻略","纯糖汽水 · 单依纯社区","开票前准备、候补顺序与实名信息检查清单","986赞"],["交通入场","小泷包 · 汪苏泷社区","地铁出口、安检时间和散场避拥堵路线","862赞"],["场馆周边","Neverland星球 · i-dle社区","应援点、便利店、寄存柜和夜间餐饮位置","728赞"]].map(([tag,source,title,likes])=><article key={tag}><span>{tag}</span><div><b>{title}</b><small>{source} · {likes}</small></div><ChevronRight/></article>)}</section></>}
      {feature.id!=="album"&&feature.id!=="topics"&&feature.id!=="groups"&&feature.id!=="subscribe"&&feature.id!=="onsite"&&feature.id!=="journal"&&<section className="feature-details"><h2>{isCommerce?"服务与订单":"正在进行"}</h2>{feature.detail.map((line,index)=><article key={line}><span>{index+1}</span><div><b>{line}</b><small>{index===0?"刚刚更新":index===1?"今日热门":"平台说明"}</small></div>{index===0?<Zap/>:<ChevronRight/>}</article>)}</section>}
      {isPeople&&<section className="people-card"><div className="people-stack"><i>林</i><i>莓</i><i>宇</i><i>+</i></div><div><b>和同好安全同行</b><p>加入后可查看公开集合信息；私聊前请勿透露身份证、住址等敏感信息。</p></div></section>}
      {isCommerce&&<section className="commerce-card"><div><span><Package/></span><div><b>{feature.id==="orders"?"巡演手幅制作订单":"薛之谦深圳站限定手幅"}</b><small>已核验商家 · 支持进度追踪</small></div><strong>{feature.id==="orders"?"制作中":"¥2.80"}</strong></div><p><ShieldCheck/>演示模式：展示完整下单流程，不发起真实付款</p></section>}
      {feature.id==="journal"&&<section className="journal-builder">
        <div className="builder-block"><label>打卡</label><div className="place-search"><Search/><input value={placeSearch} onChange={event=>setPlaceSearch(event.target.value)} placeholder="搜索场馆、大屏、同款店或地址"/>{placeSearch&&<button onClick={()=>setPlaceSearch("")}><X/></button>}</div><div className="place-options">{["星河广场应援大屏","湾区体育中心","薛之谦同款店","春茧体育馆","深圳湾万象城"].filter(place=>!placeSearch||place.includes(placeSearch)).map(place=><button key={place} className={linkedPlace===place?"active":""} onClick={()=>setLinkedPlace(place)}><MapPin/>{place}</button>)}{placeSearch&&!["星河广场应援大屏","湾区体育中心","薛之谦同款店","春茧体育馆","深圳湾万象城"].some(place=>place.includes(placeSearch))&&<button onClick={()=>setLinkedPlace(placeSearch)}><Plus/>标记“{placeSearch}”</button>}</div><div className="journal-place-map"><i className="map-road one"/><i className="map-road two"/><i className="map-river"/><button className="journal-map-mark"><MapPin fill="currentColor"/><span><em>{mood||<Plus/>}</em><b>{linkedPlace}</b><small>点击编辑 Mark</small></span></button></div><small className="map-sync-note"><Map/>保存后同步到“世界足迹 → 城市 → 打卡地点”</small></div>
        <div className="builder-block"><label>心情 Emoji</label><div className="emoji-text-input"><input value={mood} onChange={event=>setMood(Array.from(event.target.value).slice(0,4).join(""))} placeholder="手动输入，例如：🥹✨"/><span>{mood||"🙂"}</span></div><small className="emoji-input-note">可直接输入系统 Emoji，最多 4 个</small></div>
        <div className="builder-block"><label>上传打卡记录</label><label className="journal-upload-main"><Upload/><span><b>选择照片、视频或语音</b><small>可一次上传多个文件</small></span><input type="file" accept="image/*,video/*,audio/*" multiple onChange={event=>addUploads(event.target.files,"记录")}/></label><div className="media-options"><label><Camera/>照片<input type="file" accept="image/*" multiple onChange={event=>addUploads(event.target.files,"照片")}/></label><label><Video/>视频<input type="file" accept="video/*" multiple onChange={event=>addUploads(event.target.files,"视频")}/></label><label><Mic/>语音<input type="file" accept="audio/*" multiple onChange={event=>addUploads(event.target.files,"语音")}/></label><button onClick={()=>setDraft(current=>current||"今天终于抵达了这里，记录这一刻。") }><NotebookPen/>文字</button></div>{uploads.length>0&&<div className="upload-preview-list">{uploads.map((item,index)=><article key={`${item.name}-${index}`}>{item.kind==="照片"||item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)?<img src={item.url} alt={item.name}/>:item.kind==="视频"||item.name.match(/\.(mp4|mov|webm)$/i)?<Video/>:<Mic/>}<div><b>{item.name}</b><small>{item.kind} · 已选择</small></div><button onClick={()=>setUploads(current=>current.filter((_,i)=>i!==index))}><X/></button></article>)}</div>}</div>
        <div className="journal-preview"><span>{mood||<MapPin/>}</span><div><b>{linkedPlace} · 地图 Mark</b><small>已绑定：{mood?"心情 Emoji、":""}{uploads.length}个媒体文件{draft?"、文字记录":""}</small></div></div>
        <textarea value={draft} onChange={event=>setDraft(event.target.value)} placeholder="记录现场声音、画面或当时想说的话…" />
        {done&&<div className="journal-check-badge"><Medal/><div><b>城市打卡者徽章</b><small>本次打卡已计入足迹，热爱值 +40</small></div><span>已获得</span></div>}
      </section>}
      {needsInput&&<section className="publish-box"><label>{feature.id==="submitpoi"?"地点名称与说明":feature.id==="merchants"?"工作室介绍":"写下你想分享的内容"}</label><textarea value={draft} onChange={event=>setDraft(event.target.value)} placeholder={feature.id==="submitpoi"?"例如：星河广场东侧大屏，地铁A口步行3分钟":feature.id==="playlist"?"为歌单写一个主题和介绍":"分享真实、有帮助的内容…"} /><div><button onClick={()=>setChoice(choice==="公开"?"仅自己":"公开")}><Lock/>{choice}</button><span>{draft.length}/200</span></div></section>}
      {feature.id!=="topics"&&<section className="link-reward"><span><Sparkles/></span><div><b>{feature.id==="journal"?"完成打卡获得 40 热爱值":"完成后获得 20 热爱值"}</b><p>线上行为与线下足迹将同步到个人成长记录</p></div></section>}
    </div>
    {feature.id==="topics"?!topicComposerOpen&&<footer><button className="sheet-secondary"><Heart/>收藏</button><button className="sheet-primary" onClick={()=>setTopicComposerOpen(true)}>发一条动态<ChevronRight/></button></footer>:<footer><button className="sheet-secondary"><Heart/>收藏</button><button disabled={!journalReady} className={done?"sheet-primary done":"sheet-primary"} onClick={complete}>{done?<><Check/>已打卡并获得徽章</>:!journalReady?<>请先上传记录</>:<>{feature.id==="journal"?"完成打卡":feature.action}<ChevronRight/></>}</button></footer>}
  </section>
}

function CollectionSheet({artist,items,close,add,toggleSell}:{artist:string;items:MerchItem[];close:()=>void;add:(item:Omit<MerchItem,"id"|"artist">)=>void;toggleSell:(id:number)=>void}) {
  const [name,setName]=useState("");
  const [price,setPrice]=useState("");
  const [kind,setKind]=useState<"官方周边"|"自制周边">("官方周边");
  const [imageUrl,setImageUrl]=useState("");
  const ready=Boolean(name.trim()&&price.trim()&&imageUrl);
  return <section className="feature-sheet collection-sheet"><header><button onClick={close}><ChevronLeft/></button><b>{artist} · 收藏周边</b><button><ShoppingBag/></button></header><div className="feature-scroll">
    <section className="collection-summary"><div><b>{items.length}</b><span>收藏总数</span></div><div><b>{items.filter(x=>x.kind==="官方周边").length}</b><span>官方周边</span></div><div><b>{items.filter(x=>x.kind==="自制周边").length}</b><span>自制周边</span></div><div><b>{items.filter(x=>x.selling).length}</b><span>正在出售</span></div></section>
    <section className="collection-form"><h2>上传一件周边</h2><label className="collection-photo-upload">{imageUrl?<img src={imageUrl} alt="周边预览"/>:<><Camera/><b>上传周边照片</b><small>必填</small></>}<input type="file" accept="image/*" onChange={event=>{const file=event.target.files?.[0];if(file)setImageUrl(URL.createObjectURL(file))}}/></label><label>周边名称<input value={name} onChange={event=>setName(event.target.value)} placeholder="例如：天外来物限定CD"/></label><label>购买价格<div className="price-input"><span>¥</span><input inputMode="decimal" value={price} onChange={event=>setPrice(event.target.value)} placeholder="0.00"/></div></label><div className="kind-choice"><button className={kind==="官方周边"?"active":""} onClick={()=>setKind("官方周边")}>官方周边</button><button className={kind==="自制周边"?"active":""} onClick={()=>setKind("自制周边")}>自制周边</button></div><button disabled={!ready} className="add-collection" onClick={()=>{add({name,price,kind,image:imageUrl,selling:false});setName("");setPrice("");setImageUrl("")}}><Plus/>加入收藏</button></section>
    <SectionHead title="我的收藏" action={`${items.length}件`}/><section className="collection-list">{items.map(item=><article key={item.id}><img src={item.image} alt={item.name}/><div><em>{item.kind}</em><b>{item.name}</b><small>购买价 ¥{item.price}</small></div><button className={item.selling?"selling":""} onClick={()=>toggleSell(item.id)}>{item.selling?"已在商城出售":"我想卖掉"}</button></article>)}</section>
  </div></section>
}

function ArtistIdentitySheet({artist,value,points,checked,done,posts,checkIn,finish,close,save}:{artist:string;value:ArtistIdentity;points:number;checked:boolean;done:boolean[];posts:CommunityPost[];checkIn:()=>void;finish:(index:number)=>void;close:()=>void;save:(value:ArtistIdentity)=>void}) {
  const [draftIdentity,setDraftIdentity]=useState(value);
  const [tasksOpen,setTasksOpen]=useState(false);
  const [rulesOpen,setRulesOpen]=useState(false);
  const [supportRecords,setSupportRecords]=useState<string[]>([]);
  const data=followedArtists.find(item=>item.name===artist)??followedArtists[0];
  useEffect(()=>{
    try{
      const savedState=JSON.parse(window.localStorage.getItem(`liveready-support-${artist}`)||"{}");
      setSupportRecords(savedState.supportActionRecords??[]);
    }catch{setSupportRecords([])}
  },[artist]);
  const tasks=[
    {icon:Headphones,title:`听完 ${artist}《${data.song}》`,meta:"QQ音乐内容入口 · Demo 模拟完整播放1次"},
    {icon:MessageCircle,title:"浏览并评论社区内容",meta:"真实互动一次，今天最多4次"},
    {icon:Share2,title:"分享艺人歌曲或活动",meta:"分享至好友或QQ音乐动态"},
  ];
  const rules=[["每日签到","每天1次","+8"],["完成QQ音乐听歌任务","有效播放1次","+10"],["社区评论或分享","每天最多4次","+2"],["演唱会现场打卡","每场活动","+100"],["参加线下应援活动","核验后计入","+50"],["打卡艺人同款地址","每个地点","+20"]];
  const samplePosts=[
    {title:`#现场Repo# ${artist}演唱会座位视角记录`,meta:"2026.08.16 · 516赞"},
    {title:`#应援记录# ${artist}生日大屏打卡`,meta:"2026.05.02 · 327赞"},
  ];
  const myPosts=[...posts.filter(post=>post.mine).map(post=>({title:post.title,meta:`${post.time} · ${post.likes}赞`})),...samplePosts].slice(0,4);
  const albumProgress:Record<string,{name:string;progress:number}[]>={
    "薛之谦":[{name:"《金斧子》",progress:82},{name:"《媚人》",progress:64},{name:"天外来物巡演歌单",progress:73}],
    "单依纯":[{name:"《纯妹妹》",progress:86},{name:"《珠玉》",progress:69},{name:"巡回演唱会歌单",progress:76}],
    "汪苏泷":[{name:"《十万伏特》",progress:79},{name:"《克制凶猛》",progress:63},{name:"十万伏特巡演歌单",progress:71}],
    "i-dle":[{name:"《I feel》",progress:91},{name:"《2》",progress:78},{name:"WORLD TOUR 歌单",progress:74}],
  };
  const progressItems=albumProgress[artist]??albumProgress["薛之谦"];
  return <section className="feature-sheet identity-sheet artist-my-sheet"><header><button onClick={close}><ChevronLeft/></button><b>我在{artist}社区</b><button onClick={()=>save(draftIdentity)}><Check/></button></header><div className="feature-scroll">
    <section className="identity-cover"><label>{draftIdentity.avatar?<img src={draftIdentity.avatar} alt="社区头像"/>:<CircleUserRound/>}<span><Camera/>更换头像</span><input type="file" accept="image/*" onChange={event=>{const file=event.target.files?.[0];if(file)setDraftIdentity(current=>({...current,avatar:URL.createObjectURL(file)}))}}/></label><div><small>艺人专属身份</small><h1>{draftIdentity.nickname}</h1><em>{artist}超话 LV.{draftIdentity.level}</em></div></section>
    <section className="community-growth-card artist-my-growth"><div className="community-identity community-id-row"><div><img src={draftIdentity.avatar} alt="社区头像"/><p><b>{draftIdentity.nickname}</b><em>{artist}超话 LV.{draftIdentity.level}</em></p></div><button className="heat-rule-trigger" onClick={()=>setRulesOpen(true)}><span><b>{points}</b> 热爱值</span><small>规则 <ChevronRight/></small></button></div><button className="growth-toggle" onClick={()=>setTasksOpen(value=>!value)}><span><small>今天为热爱做点什么</small><b>今日成长任务</b></span><em>{done.filter(Boolean).length}/3 <ChevronDown className={tasksOpen?"open":""}/></em></button>{tasksOpen&&<div className="embedded-growth"><div className="daily-card embedded-daily"><div className="daily-main"><span className="daily-icon"><Heart fill="currentColor"/></span><div><small>连续签到 6 天</small><b>{checked?"今天已点亮":"点亮今日热爱"}</b><span>完成后获得 8 热爱值</span></div><button className={checked?"done":""} onClick={checkIn}>{checked?<Check/>:"+8"}</button></div><div className="daily-progress"><i style={{width:checked?"70%":"58%"}}/><span>{checked?"再完成 1 项解锁限定徽章":"再完成 2 项解锁限定徽章"}</span></div></div><section className="task-list embedded-task-list">{tasks.map((task,index)=>{const Icon=task.icon;return <article key={task.title} className={done[index]?"complete":""}><span><Icon/></span><div><b>{task.title}</b><small>{task.meta}</small><em>+10 热爱值</em></div><button onClick={()=>finish(index)}>{done[index]?<Check/>:"去完成"}</button></article>})}</section></div>}</section>
    <section className="identity-form"><label>社区昵称<input value={draftIdentity.nickname} onChange={event=>setDraftIdentity(current=>({...current,nickname:event.target.value}))}/></label><section className="qq-history-card"><header><span><Music2/></span><div><b>QQ音乐听歌记录</b><small>{artist} · Demo 模拟播放档案</small></div><em>模拟数据</em></header><div className="qq-history-stats"><span><small>首次收听</small><b>{draftIdentity.firstListen}</b></span><span><small>累计听歌</small><b>{draftIdentity.listenHours}</b></span><span><small>最近收听</small><b>{draftIdentity.recentListen}</b></span></div><p>参赛 Demo 使用模拟记录展示产品逻辑；正式版需在用户授权后接入 QQ 音乐数据。</p></section></section>
    <section className="artist-record-overview"><h2>我的社区记录</h2><div><span><MessageSquare/><b>{myPosts.length}</b><small>动态话题</small></span><span><Vote/><b>8</b><small>打榜记录</small></span><span><Cake/><b>3</b><small>生日应援</small></span><span><Medal/><b>{progressItems[0].progress}%</b><small>专辑打卡</small></span></div></section>
    <section className="artist-record-section"><header><div><small>MY POSTS</small><h2>我发过的动态与话题</h2></div><MessageSquare/></header>{myPosts.map((post,index)=><article key={`${post.title}-${index}`}><span>#</span><div><b>{post.title}</b><small>{post.meta}</small></div><ChevronRight/></article>)}</section>
    <section className="artist-record-section"><header><div><small>SUPPORT HISTORY</small><h2>打榜与生日应援记录</h2></div><Heart/></header>{[
      ...(supportRecords.length?supportRecords.slice(0,3):["2026.10.06 · 完成《天外来物》舞台帖转评赞任务 · +12 热爱值","2026.10.05 · 深圳站打榜集中帖完成 5 次有效互动 · +6 热爱值"]),
      "2026.09.28 · 参加生日祝福征集与大屏应援 · +50 热爱值",
    ].map((record,index)=><article key={`${record}-${index}`}><span className={record.includes("生日")?"birthday":"vote"}>{record.includes("生日")?<Cake/>:<Vote/>}</span><div><b>{record}</b><small>{record.includes("生日")?"生日应援记录":"打榜任务记录"}</small></div></article>)}</section>
    <section className="artist-album-records"><header><div><small>ALBUM CHECK-IN</small><h2>专辑与演唱会歌单打卡</h2></div><Headphones/></header>{progressItems.map(item=><article key={item.name}><div><b>{item.name}</b><strong>{item.progress}%</strong></div><i><em style={{width:`${item.progress}%`}}/></i><small>依据 QQ音乐完整播放记录计算（Demo）</small></article>)}</section>
    <section className="identity-level"><Trophy/><div><small>当前粉丝等级</small><b>{artist}超话 LV.{draftIdentity.level}</b><div className="meter"><i style={{width:"77%"}}/></div><p>等级会作为后缀显示在社区昵称旁。</p></div></section><button className="main-button" onClick={()=>save(draftIdentity)}>保存艺人社区身份</button>
  </div>
  {rulesOpen&&<section className="heat-rule-overlay" onClick={()=>setRulesOpen(false)}><div className="heat-rule-sheet" onClick={event=>event.stopPropagation()}><header><div><small>{artist}社区</small><h2>热爱值规则</h2></div><button onClick={()=>setRulesOpen(false)}><X/></button></header><section className="heat-rule-total"><div><small>当前热爱值</small><b>{points}</b></div><span>{artist}超话 LV.{draftIdentity.level}</span></section><section className="heat-rule-board">{rules.map(([name,limit,reward],index)=><article key={name}><span>{index+1}</span><div><b>{name}</b><small>{limit}</small></div><em>{reward}</em></article>)}</section></div></section>}
  </section>
}

function JournalTimelineSheet({checkins,close,openFootprint}:{checkins:CheckinRecord[];close:()=>void;openFootprint:(city:string)=>void}) {
  const savedEntries=checkins.map(item=>({
    id:`checkin-${item.id}`,
    date:item.time.split(" ")[0]||"刚刚",
    time:item.time.split(" ").slice(1).join(" "),
    city:item.city,
    title:`${item.place}打卡`,
    detail:`${item.artist} · ${item.kind} · 心情 ${item.mood||"📍"}`,
    kind:"打卡记录",
  }));
  const history=[
    {id:"shanghai-20260816",date:"2026.08.16",time:"19:30",city:"上海",title:"薛之谦「天外来物」巡回演唱会",detail:"梅赛德斯奔驰文化中心 · 完成现场记录与座位视角上传",kind:"演唱会"},
    {id:"guangzhou-20260502",date:"2026.05.02",time:"14:10",city:"广州",title:"生日应援一日游",detail:"参加天河生日应援展，完成珠江新城户外大屏打卡",kind:"应援活动"},
    {id:"sydney-20260218",date:"2026.02.18",time:"18:40",city:"悉尼",title:"Town Hall 海外应援灯箱",detail:"参加海外粉丝打卡活动，与同好交换纪念小卡",kind:"应援活动"},
    {id:"tokyo-20251203",date:"2025.12.03",time:"16:20",city:"东京",title:"涩谷限定应援墙",detail:"旅行途中完成应援打卡，记录限定布置与现场照片",kind:"打卡记录"},
    {id:"beijing-20250921",date:"2025.09.21",time:"19:00",city:"北京",title:"五棵松体育馆演唱会",detail:"第一次记录万人合唱，保存现场照片与演出感受",kind:"演唱会"},
  ];
  const entries=[...savedEntries,...history];
  return <section className="feature-sheet journal-timeline-sheet">
    <header><button onClick={close} aria-label="返回"><ChevronLeft/></button><b>我的追星时间线</b><span/></header>
    <div className="feature-scroll">
      <section className="timeline-summary"><Clock3/><div><small>MY STAR TIMELINE</small><h1>{entries.length}段追星记录</h1><p>按照准确日期整理演唱会、应援活动与城市打卡。</p></div></section>
      <section className="journal-timeline-list">{entries.map((entry,index)=><article key={entry.id}>
        <div className="timeline-axis"><span>{index+1}</span><i/></div>
        <button onClick={()=>{close();openFootprint(entry.city)}}>
          <header><time>{entry.date}{entry.time&&` · ${entry.time}`}</time><em>{entry.kind}</em></header>
          <h2>{entry.title}</h2><p><MapPin/>{entry.city} · {entry.detail}</p><span>查看该城市足迹 <ChevronRight/></span>
        </button>
      </article>)}</section>
    </div>
  </section>;
}

type FootprintPlace = {name:string;kind:string;time:string;mood:string;note:string;tone:string;media?:CheckinMediaItem[]};
const footprintData: Record<string,Record<string,FootprintPlace[]>> = {
  "中国": {
    "深圳":[
      {name:"星河广场应援大屏",kind:"应援大屏",time:"2026.10.11 14:20",mood:"🤩",note:"第一次看到整面大屏亮起来，和同好一起拍了好多照片。",tone:"screen"},
      {name:"湾区体育中心",kind:"演唱会场馆",time:"2026.10.11 19:30",mood:"🥹",note:"开场灯光亮起的瞬间真的想哭。",tone:"concert"},
      {name:"薛之谦同款咖啡店",kind:"同款店",time:"2026.10.12 11:10",mood:"🥰",note:"点了同款饮品，也盖到了城市限定章。",tone:"cafe"},
    ],
    "上海":[
      {name:"梅赛德斯奔驰文化中心",kind:"演唱会场馆",time:"2026.08.16 19:30",mood:"🤩",note:"第12次现场，延伸台比想象中更近。",tone:"concert"},
      {name:"徐家汇应援屏",kind:"应援大屏",time:"2026.08.16 14:05",mood:"✨",note:"和三个同好交换了手幅。",tone:"screen"},
    ],
    "广州":[
      {name:"天河生日应援展",kind:"生日应援",time:"2026.05.02 14:10",mood:"🥰",note:"集齐七个打卡点，拿到了限定纪念票。",tone:"birthday"},
      {name:"珠江新城户外大屏",kind:"应援大屏",time:"2026.05.02 19:00",mood:"🥹",note:"夜景和大屏一起亮起来特别漂亮。",tone:"screen"},
    ],
    "北京":[{name:"五棵松场馆",kind:"演唱会场馆",time:"2025.09.21 19:00",mood:"😭",note:"第一次看万人合唱，完全舍不得结束。",tone:"concert"}],
    "成都":[{name:"春熙路应援大屏",kind:"应援大屏",time:"2025.07.18 20:10",mood:"✨",note:"夜晚的大屏特别醒目，顺路完成了城市打卡。",tone:"screen"}],
  },
  "澳大利亚": {"悉尼":[{name:"Town Hall 应援灯箱",kind:"海外应援",time:"2026.02.18 18:40",mood:"💚",note:"在海外也遇到了同担，合照留念。",tone:"screen"}]},
  "日本": {"东京":[{name:"涩谷限定应援墙",kind:"应援打卡",time:"2025.12.03 16:20",mood:"✨",note:"旅行中偶遇的惊喜打卡点。",tone:"birthday"}]},
  "韩国": {"首尔":[{name:"弘大生日咖啡",kind:"生日应援",time:"2025.11.02 13:30",mood:"🥰",note:"收到了一套生日小卡。",tone:"cafe"}]},
};

const worldCities = [
  {country:"中国",city:"北京",x:77,y:35},
  {country:"中国",city:"上海",x:81,y:43},
  {country:"中国",city:"深圳",x:78,y:50},
  {country:"中国",city:"广州",x:74,y:49},
  {country:"中国",city:"成都",x:70,y:43},
  {country:"澳大利亚",city:"悉尼",x:88,y:80},
  {country:"日本",city:"东京",x:89,y:39},
  {country:"韩国",city:"首尔",x:84,y:36},
];

function FootprintSheet({initialCity,checkins,close}:{initialCity:string;checkins:CheckinRecord[];close:()=>void}) {
  const initialCountry=Object.keys(footprintData).find(country=>Object.keys(footprintData[country]).includes(initialCity)) ?? "中国";
  const [country,setCountry]=useState(initialCountry);
  const [city,setCity]=useState(initialCity in footprintData[initialCountry]?initialCity:Object.keys(footprintData[initialCountry])[0]);
  const [view,setView]=useState<"world"|"city">("world");
  const liveMemories:FootprintPlace[]=checkins.filter(item=>item.country===country&&item.city===city).map(item=>({name:item.place,kind:item.kind,time:item.time,mood:item.mood||"📍",note:item.note,tone:item.kind.includes("大屏")?"screen":item.kind.includes("场馆")?"concert":"cafe",media:item.media}));
  const places=[...liveMemories,...(footprintData[country][city] ?? [])];
  const [selected,setSelected]=useState(0);
  const openCity=(nextCountry:string,nextCity:string)=>{setCountry(nextCountry);setCity(nextCity);setSelected(0);setView("city")};
  const place=places[Math.min(selected,Math.max(0,places.length-1))];
  return <section className="feature-sheet footprint-sheet">
    <header><button onClick={()=>view==="city"?setView("world"):close()} aria-label="返回"><ChevronLeft/></button><b>{view==="world"?"我的世界足迹":`${city}打卡地图`}</b><button aria-label="地图"><Map/></button></header>
    <div className="feature-scroll">
      {view==="world"?<>
        <section className="footprint-summary"><small>MY STAR MAP</small><h1>8座城市 · {36+checkins.length}个打卡地点</h1><p>地图上的每一个 Mark，都是一次真实抵达。</p></section>
        <section className="world-map-card"><div className="map-caption"><div><b>世界足迹地图</b><small>点击已标记的城市，查看具体打卡坐标</small></div><span><MapPin/>8座城市</span></div><div className="world-map-canvas">
          <svg viewBox="0 0 1000 520" aria-hidden="true"><path d="M63 103l98-64 132 31 69 77-47 65-76 4-39 56-76-30-56-74z"/><path d="M280 300l68 26 39 89-29 81-53-60-38-82z"/><path d="M433 107l80-53 96 28 33 54-54 35-80-9-42 28-48-35z"/><path d="M501 218l103-34 75 53-20 111-56 96-62-51-30-102z"/><path d="M622 85l166-38 128 61-23 99-95 36-53-36-88 21-51-67z"/><path d="M793 353l91-31 71 58-35 88-96 8-48-62z"/></svg>
          {worldCities.map(item=><button key={`${item.country}-${item.city}`} className={`world-mark ${item.city===initialCity?"highlight":""}`} style={{left:`${item.x}%`,top:`${item.y}%`}} onClick={()=>openCity(item.country,item.city)}><MapPin fill="currentColor"/><span>{item.city}</span></button>)}
        </div></section>
        <section className="world-city-list">{Object.entries(footprintData).map(([placeCountry,cities])=><div key={placeCountry}><b>{placeCountry}</b><div>{Object.keys(cities).map(placeCity=><button key={placeCity} onClick={()=>openCity(placeCountry,placeCity)}><MapPin/>{placeCity}<ChevronRight/></button>)}</div></div>)}</section>
      </>:<>
        <section className="city-level-head"><button onClick={()=>setView("world")}><Map/>返回世界地图</button><div><small>{country}</small><h1>{city} · {places.length}个打卡坐标</h1></div></section>
        <section className="footprint-map-detail"><div className="map-caption"><div><b>{city}打卡地图</b><small>点击地图坐标查看当时的照片与心情</small></div><span><MapPin/>已打卡</span></div><div className="city-map-canvas"><i className="map-road one"/><i className="map-road two"/><i className="map-river"/>{places.map((item,index)=><button key={item.name} className={`place-pin pin-${index+1} ${selected===index?"active":""}`} onClick={()=>setSelected(index)}><MapPin fill="currentColor"/><span>{item.name}</span></button>)}</div></section>
        {place&&<section className="place-memory-card"><div className={`memory-photo ${place.tone} ${place.media?.some(item=>item.url)?"has-real-media":""}`}>{place.media?.find(item=>item.type==="image"&&item.url)?<img src={place.media.find(item=>item.type==="image"&&item.url)!.url} alt={`${place.name}打卡照片`}/>:place.media?.find(item=>item.type==="video"&&item.url)?<video src={place.media.find(item=>item.type==="video"&&item.url)!.url} controls playsInline/>:<><Camera/><span>{place.media?.length?"已保存打卡媒体":"暂无上传媒体"}</span></>}</div><div className="memory-copy"><div><span className="memory-mood">{place.mood}</span><div><small>{place.kind}</small><h2>{place.name}</h2></div></div><p>{place.note}</p><time><Clock3/>{place.time}</time>{place.media&&place.media.length>0&&<div className="memory-media">{place.media.some(item=>item.type==="image")&&<span><Image/>照片 {place.media.filter(item=>item.type==="image").length}</span>}{place.media.some(item=>item.type==="video")&&<span><Video/>视频 {place.media.filter(item=>item.type==="video").length}</span>}{place.media.some(item=>item.type==="audio")&&<span><Mic/>语音 {place.media.filter(item=>item.type==="audio").length}</span>}</div>}{place.media?.filter(item=>item.type==="audio"&&item.url).map((item,index)=><audio className="memory-audio" key={`${item.name}-${index}`} src={item.url} controls/>)}</div></section>}
      </>}
    </div>
  </section>
}

function SearchPanel({query,setQuery,results,close,select}:{query:string;setQuery:(v:string)=>void;results:Result[];close:()=>void;select:(r:Result)=>void}) {
  return <section className="search-panel">
    <div className="search-top"><button onClick={close}><ChevronLeft/></button><div><Search/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索 LiveReady 全部内容"/>{query&&<button onClick={()=>setQuery("")}><X/></button>}</div><button className="cancel" onClick={close}>取消</button></div>
    {!query&&<><div className="search-label">大家都在搜</div><div className="hot-words">{["深圳演唱会攻略","A3区视角","薛之谦","应援大屏","巡演手幅"].map(x=><button key={x} onClick={()=>setQuery(x)}>{x}</button>)}</div><div className="search-label">搜索范围</div><div className="scope-grid"><span><Music2/>歌曲</span><span><Star/>艺人</span><span><Map/>攻略</span><span><MapPin/>地点</span><span><Palette/>物料</span><span><Users/>社区</span></div></>}
    {query&&<div className="search-results"><div className="search-label">找到 {results.length} 条结果</div>{results.map(item=>{const Icon=item.icon;return <button key={item.title} onClick={()=>select(item)}><span><Icon/></span><div><b>{item.title}</b><small>{item.meta}</small></div><em>{item.type}</em><ChevronRight/></button>})}{!results.length&&<div className="empty-search"><Search/><b>没有找到相关内容</b><p>试试搜索艺人、歌曲、城市或地点名称</p></div>}</div>}
  </section>;
}

function MiniPlayer({playing,toggle}:{playing:boolean;toggle:()=>void}) {return <div className="mini-player"><span className="album"><i/><Music2/></span><div><b>天外来物 — 薛之谦</b><small>QQ音乐音源交互 Demo</small></div><button className="heart"><Heart fill="currentColor"/></button><button className="play" onClick={toggle}>{playing?<Pause fill="currentColor"/>:<Play fill="currentColor"/>}</button></div>}
function SectionHead({title,action,onAction}:{title:string;action:string;onAction?:()=>void}) {return <div className="section-head"><h2>{title}</h2><button onClick={onAction}>{action} <ChevronRight size={15}/></button></div>}
function PageTitle({title,text}:{title:string;text:string}) {return <div className="page-title"><h1>{title}</h1><p>{text}</p></div>}

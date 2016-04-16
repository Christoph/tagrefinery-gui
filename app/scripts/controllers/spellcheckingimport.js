'use strict';

/**
 * @ngdoc function
 * @name tagrefineryGuiApp.controller:SpellcheckingimportCtrl
 * @description
 * # SpellcheckingimportCtrl
 * Controller of the tagrefineryGuiApp
 */
angular.module('tagrefineryGuiApp')
  .controller('SpellcheckingimportCtrl', ["$scope", "socket", "uiGridConstants", "stats", function ($scope, socket, uiGridConstants, stats) {

    // Get instance of the class
    var that = this;
    that.default = "a,abandon,ability,able,abortion,about,above,abroad,absence,absolute,absolutely,abstract,abuse,academic,accept,acceptable,access,accident,accommodation,accompany,accomplish,accord,account,accurate,accuse,achieve,achievement,acknowledge,acquire,acquisition,across,act,action,active,activity,actor,actual,actually,ad,adapt,add,addition,additional,address,adequate,adjust,adjustment,administration,admire,admit,adopt,adult,advance,advantage,adventure,advertise,advertisement,advice,advise,adviser,advocate,affair,affect,afford,afraid,after,afternoon,again,against,age,agency,agenda,agent,aggressive,ago,agree,agreement,agricultural,ahead,aid,aim,air,aircraft,airline,alarm,album,alcohol,alive,all,allege,allow,ally,almost,alone,along,alongside,already,alright,also,alter,alternative,although,altogether,always,amaze,amendment,among,amount,analysis,analyst,analyze,ancient,and,anger,angle,angry,animal,announce,announcement,annual,another,answer,anticipate,anxiety,anxious,any,anybody,anymore,anyone,anything,anyway,anywhere,apart,apartment,apologize,apparent,apparently,appeal,appear,appearance,application,apply,appoint,appointment,appreciate,approach,appropriate,approval,approve,approximately,architecture,area,argue,argument,arise,arm,army,around,arrange,arrangement,arrest,arrival,arrive,art,article,artist,as,ashamed,aside,ask,assess,assessment,asset,assign,assist,assistance,assistant,associate,association,assume,assumption,assure,at,athlete,atmosphere,attach,attachment,attack,attempt,attend,attendance,attention,attitude,attract,attraction,attractive,attribute,audience,aunt,author,automatically,autumn,available,average,avoid,award,aware,awareness,away,awful,baby,back,background,bad,badly,bag,balance,ball,ban,band,bank,bar,barely,barrier,base,basic,basically,basis,bath,battle,be,beach,bear,beat,beautiful,beauty,because,become,bed,bedroom,beer,before,begin,behave,behavior,behind,belief,believe,bell,belong,below,belt,bend,beneath,benefit,beside,besides,bet,between,beyond,bias,bid,big,bike,bill,billion,bin,bind,biological,bird,birth,bit,bite,black,blame,bless,blind,block,blood,bloody,blow,blue,board,boat,body,bomb,bond,bone,book,boom,boost,boot,border,bore,borrow,boss,both,bother,bottle,bottom,boundary,bowl,box,boy,brain,branch,brand,bread,break,breakfast,breast,breath,breathe,breed,bridge,brief,briefly,bright,brilliant,bring,broad,broadcast,brother,brown,brush,budget,build,bunch,burden,burn,burst,bury,bus,business,busy,but,button,buy,buyer,by,cable,cake,calculate,call,calm,camera,camp,campaign,can,cancel,cancer,cap,capability,capable,capacity,capital,capture,car,carbon,card,care,career,careful,carefully,carpet,carry,case,cash,cast,castle,cat,catalog,catch,category,cause,celebrate,celebration,cell,cent,center,central,century,ceremony,certain,certainly,chain,chair,chairman,challenge,chamber,champion,championship,chance,change,channel,chapter,character,characteristic,characterize,charge,charity,charm,chart,chase,chat,cheap,check,cheek,cheese,chemical,chest,chicken,chief,child,childhood,chip,chocolate,choice,choose,church,cigarette,circle,circumstance,cite,citizen,city,civil,civilian,claim,class,classic,classical,clause,clean,clear,clearly,climate,climb,clinical,clock,close,closely,clothes,clothing,cloud,club,cluster,coach,coal,coast,coat,code,coffee,coin,cold,collapse,colleague,collect,collection,college,color,column,combination,combine,come,comedy,comfort,comfortable,command,comment,commercial,commission,commit,commitment,committee,common,communicate,communication,community,company,compare,comparison,compensation,compete,competition,competitive,competitor,complain,complaint,complete,completely,complex,complexity,complicate,component,compose,composition,compound,comprehensive,comprise,compromise,compute,computer,concentrate,concentration,concept,concern,concert,conclude,conclusion,concrete,condition,conduct,confidence,confident,confirm,conflict,confuse,confusion,connect,connection,consequence,consequently,conservative,consider,considerable,consideration,consist,consistent,constant,constantly,constitute,constraint,construct,construction,consult,consultant,consume,consumer,contact,contain,contemporary,content,contest,context,continue,continuous,contract,contrast,contribute,contribution,control,controversial,convention,conventional,conversation,convert,convince,cook,cool,cooperation,cope,copy,core,corner,corporate,corporation,correct,correspond,cost,cough,could,council,counsel,count,counter,country,county,couple,course,court,cousin,cover,coverage,cow,crack,craft,crash,crazy,cream,create,creation,creative,creature,credit,crew,crime,criminal,crisis,criterion,critic,critical,criticism,criticize,crop,cross,crowd,crucial,cry,cultural,culture,cup,curious,currency,current,currently,curtain,curve,custom,customer,cut,cycle,dad,daily,damage,damn,dance,danger,dangerous,dare,dark,darkness,data,database,date,daughter,day,dead,deal,dealer,dear,death,debate,debt,decade,decide,decision,declare,decline,decrease,dedicate,deep,deeply,defeat,defend,defense,deficit,define,definitely,definition,degree,delay,delight,deliver,delivery,demand,democracy,democratic,demonstrate,demonstration,density,deny,department,depend,dependent,deposit,depress,depression,depth,derive,describe,description,desert,deserve,design,designer,desire,desk,despite,destroy,destruction,detail,detect,determination,determine,develop,development,device,devote,dialog,die,diet,differ,difference,different,differently,difficult,difficulty,dig,digital,dimension,dinner,direct,direction,directly,director,dirty,disagree,disappear,disappoint,disaster,discipline,discount,discover,discovery,discuss,discussion,disease,dish,disk,dismiss,disorder,display,dispute,distance,distant,distinct,distinction,distinguish,distribute,district,disturb,diversity,divide,division,divorce,do,doctor,document,dog,dollar,domestic,dominate,door,double,doubt,down,dozen,draft,drag,drama,dramatic,dramatically,draw,dream,dress,drink,drive,driver,drop,drug,dry,due,during,dust,duty,each,ear,early,earn,earth,ease,easily,east,eastern,easy,eat,economic,economy,edge,edit,edition,editor,educate,education,educational,effect,effective,effectively,efficiency,efficient,effort,egg,either,elderly,elect,election,electric,electricity,electronic,element,eliminate,else,elsewhere,e-mail,embarrass,embrace,emerge,emergency,emotion,emotional,emphasis,emphasize,empire,employ,employee,employer,employment,empty,enable,encounter,encourage,end,enemy,energy,engage,engine,engineer,enhance,enjoy,enormous,enough,ensure,enter,enterprise,entertain,entertainment,entire,entirely,entitle,entrance,entry,envelope,environment,environmental,episode,equal,equally,equation,equipment,equivalent,era,error,escape,especially,essay,essential,establish,establishment,estate,estimate,ethnic,evaluate,evaluation,even,evening,event,eventually,ever,every,everybody,everyday,everyone,everything,everywhere,evidence,evil,evolution,evolve,exact,exactly,exam,examination,examine,example,exceed,excellent,except,exception,excess,exchange,excite,excitement,exclude,excuse,executive,exercise,exhaust,exhibit,exhibition,exist,existence,expand,expansion,expect,expectation,expenditure,expense,expensive,experience,experiment,experimental,expert,explain,explanation,explore,export,expose,exposure,express,expression,extend,extension,extensive,extent,external,extra,extract,extraordinary,extreme,extremely,eye,face,facility,fact,factor,factory,fade,fail,failure,fair,fairly,faith,faithfully,fall,false,familiar,family,famous,fan,fancy,fantastic,far,farm,farmer,fascinate,fashion,fast,fat,father,fault,favor,favorite,fear,feature,federal,fee,feed,feel,fellow,female,fence,festival,few,fiction,field,fifteen,fifty,fight,figure,file,fill,film,filter,final,finally,finance,financial,find,fine,finger,finish,fire,firm,firmly,first,firstly,fish,fit,fix,flag,flash,flat,flexible,flight,float,flood,floor,flow,flower,fly,focus,fold,folk,follow,food,fool,foot,football,for,force,forecast,foreign,forest,forever,forget,form,formal,format,formation,former,formula,forth,fortunate,fortune,forward,found,foundation,fragment,frame,framework,free,freedom,freeze,frequency,frequent,frequently,fresh,friend,friendly,friendship,frighten,from,front,fruit,fuel,fulfill,full,fully,fun,function,functional,fund,fundamental,funny,furniture,further,furthermore,future,gain,gallery,game,gap,garden,gas,gate,gather,gay,gaze,gear,gender,gene,general,generally,generate,generation,genetic,gentle,gentleman,gently,genuine,gesture,get,giant,gift,girl,give,glad,glance,glass,global,go,goal,god,gold,golden,golf,good,govern,government,governor,grab,grade,gradually,graduate,grain,grammar,grand,grandmother,grant,grass,grateful,gray,great,greatly,green,greet,grin,ground,group,grow,growth,guarantee,guard,guess,guest,guide,guideline,guilty,guitar,gun,guy,habit,hair,half,hall,hand,handle,hang,happen,happiness,happy,harbor,hard,hardly,harm,hat,hate,have,he,head,health,healthy,hear,heart,heat,heavily,heavy,height,hell,hello,help,helpful,hence,her,here,hero,herself,hesitate,hi,hide,high,highlight,highly,hill,him,himself,hint,hire,his,historian,historic,historical,history,hit,hold,holder,hole,holiday,home,honest,honor,hook,hope,hopefully,horrible,horse,hospital,host,hot,hotel,hour,house,household,how,however,huge,human,humor,hunger,hunt,hurry,hurt,husband,hypothesis,I,ice,idea,ideal,identify,identity,if,ignore,ill,illegal,illness,illustrate,illustration,image,imagination,imagine,immediate,immediately,immigrant,implement,implementation,implication,imply,import,importance,important,impose,impossible,impress,impression,impressive,improve,improvement,in,incentive,inch,incident,include,income,incorporate,increase,increasingly,indeed,independence,independent,index,indicate,indication,individual,industrial,industry,infant,infection,inflation,influence,inform,information,initial,initially,initiative,injure,injury,inner,innocent,innovation,input,inquiry,inside,insight,insist,inspire,install,instance,instead,institution,institutional,instruction,instrument,insurance,insure,integrate,intellectual,intelligence,intend,intense,intention,interaction,interest,interior,internal,international,interpret,interpretation,intervention,interview,into,introduce,introduction,invent,invest,investigate,investigation,investment,investor,invitation,invite,involve,involvement,iron,island,isolate,issue,it,item,its,itself,jacket,jail,job,join,joint,joke,journal,journalist,journey,joy,judge,judgment,jump,jury,just,justice,justify,keen,keep,key,kick,kid,kill,kind,king,kiss,kitchen,knee,knife,knock,know,knowledge,label,labor,laboratory,lack,lady,lake,land,landscape,language,large,largely,last,late,latter,laugh,laughter,launch,law,lawyer,lay,layer,lazy,lead,leader,leadership,league,lean,leap,learn,least,leather,leave,lecture,left,leg,legal,legislation,lend,length,less,lesson,let,letter,level,liability,liberal,library,license,lie,life,lift,light,like,likely,limit,limitation,line,link,lip,liquid,list,listen,listener,literally,literary,literature,little,live,load,loan,local,locate,location,lock,log,logic,long,look,loose,lose,loss,lot,loud,love,lovely,lover,low,luck,lucky,lunch,luxury,machine,mad,magazine,magic,mail,main,mainly,maintain,maintenance,major,majority,make,maker,male,man,manage,management,manager,manner,manufacture,manufacturer,many,map,march,margin,mark,market,marriage,marry,mass,massive,master,match,mate,material,mathematics,matter,mature,maximum,may,maybe,mayor,me,meal,mean,meanwhile,measure,measurement,meat,mechanism,medical,medicine,medium,meet,member,membership,memory,mental,mention,menu,mere,merely,mess,message,metal,meter,method,middle,might,mile,military,milk,mind,mine,minimum,minister,minor,minority,minute,mirror,miss,mission,mistake,mix,mixture,mobile,mode,model,moderate,modern,modify,module,mom,moment,money,monitor,month,monthly,mood,moon,moral,more,moreover,morning,mortgage,most,mostly,mother,motion,motivate,motivation,motor,mount,mountain,mouse,mouth,move,movement,movie,much,multiple,murder,muscle,museum,music,musical,musician,must,mutual,my,myself,mystery,name,narrative,narrow,nation,national,native,natural,naturally,nature,near,nearby,nearly,necessarily,necessary,neck,need,negative,neglect,negotiate,negotiation,neighbor,neighborhood,neither,nerve,nervous,net,network,never,nevertheless,new,newly,news,newspaper,next,nice,night,no,nobody,noise,none,nor,normal,normally,north,northern,nose,not,note,nothing,notice,notion,noun,novel,now,nowadays,nowhere,nuclear,number,numerous,nurse,object,objective,obligation,observation,observe,obvious,obviously,occasion,occasionally,occupy,occur,ocean,odd,of,off,offense,offer,office,officer,official,often,oil,okay,old,on,once,one,online,only,onto,open,opera,operate,operation,operator,opinion,opponent,opportunity,oppose,opposite,opposition,option,or,orange,order,ordinary,organic,organization,organize,origin,original,originally,other,otherwise,ought,our,ourselves,out,outcome,outline,output,outside,over,overall,overcome,overseas,owe,own,owner,ownership,pace,pack,package,page,pain,paint,pair,pale,panel,panic,paper,paragraph,parallel,parent,park,part,participant,participate,participation,particular,particularly,partly,partner,partnership,party,pass,passage,passenger,passion,past,path,patient,pattern,pause,pay,payment,peace,peak,peer,pen,penalty,pension,people,per,perceive,percent,percentage,perception,perfect,perfectly,perform,performance,perhaps,period,permanent,permission,permit,person,personal,personality,personally,personnel,perspective,persuade,phase,phenomenon,philosophy,phone,photo,photograph,phrase,physical,piano,pick,picture,piece,pig,pile,pilot,pink,pipe,pitch,place,plain,plan,plane,planet,plant,plastic,plate,platform,play,player,pleasant,please,pleasure,plenty,plot,plus,pocket,poem,poet,poetry,point,police,policy,political,politician,politics,poll,pollution,pool,poor,pop,popular,population,port,portion,portrait,pose,position,positive,possess,possession,possibility,possible,possibly,post,pot,potato,potential,potentially,pound,pour,poverty,power,powerful,practical,practice,praise,pray,precise,precisely,predict,prefer,preference,pregnancy,pregnant,premise,preparation,prepare,presence,present,presentation,preserve,president,presidential,press,pressure,presumably,pretend,pretty,prevent,previous,previously,price,pride,primarily,primary,prime,principal,principle,print,printer,prior,priority,prison,prisoner,private,privilege,prize,pro,probability,probably,problem,procedure,proceed,process,produce,producer,product,production,profession,professional,professor,profile,profit,program,progress,project,promise,promote,promotion,prompt,proof,proper,properly,property,proportion,proposal,propose,prospect,protect,protection,protein,protest,proud,prove,provide,province,provision,psychological,pub,public,publication,publisher,pull,pump,pupil,purchase,pure,purpose,pursue,push,put,qualification,qualify,quality,quantity,quarter,question,quick,quickly,quiet,quietly,quite,quote,race,racial,radical,radio,rail,rain,raise,random,range,rank,rapid,rapidly,rare,rarely,rat,rate,rather,ratio,raw,reach,react,reaction,read,reader,ready,real,reality,realize,really,rear,reason,reasonable,reasonably,recall,receive,recent,recently,reckon,recognition,recognize,recommend,recommendation,record,recover,recovery,recruit,red,reduce,reduction,refer,reference,reflect,reflection,reform,refugee,refuse,regard,regardless,region,regional,register,registration,regret,regular,regularly,regulate,regulation,reject,relate,relation,relationship,relative,relatively,relax,release,relevant,reliable,relief,religion,religious,rely,remain,remark,remarkable,remember,remind,remote,remove,rent,repair,repeat,replace,reply,report,reporter,represent,representation,representative,reputation,request,require,requirement,rescue,research,researcher,reserve,resident,resign,resist,resistance,resolution,resolve,resort,resource,respect,respectively,respond,response,responsibility,responsible,rest,restaurant,restore,restrict,restriction,result,retail,retain,retire,retirement,return,reveal,revenue,reverse,review,revise,revolution,reward,rice,rich,rid,ride,right,ring,rise,risk,rival,river,road,rock,role,roll,romantic,roof,room,root,rough,roughly,round,route,routine,row,royal,ruin,rule,run,rural,rush,sad,safe,safety,sail,sake,salary,sale,salt,same,sample,sanction,sand,satisfaction,satisfy,save,say,scale,scan,scare,scene,schedule,scheme,scholar,school,science,scientific,scientist,scope,score,scream,screen,sea,seal,search,season,seat,second,secondary,secondly,secret,secretary,section,sector,secure,security,see,seed,seek,seem,segment,select,selection,self,sell,send,senior,sense,sensitive,sentence,separate,sequence,series,serious,seriously,servant,serve,server,service,session,set,settle,settlement,several,severe,sex,sexual,shade,shadow,shake,shall,shape,share,shareholder,sharp,she,sheep,sheet,shelf,shell,shelter,shift,shine,ship,shirt,shock,shoe,shoot,shop,shore,short,shot,should,shoulder,shout,show,shower,shut,sick,side,sigh,sight,sign,signal,significance,significant,significantly,silence,silent,silly,silver,similar,similarly,simple,simply,since,sing,singer,single,sink,sir,sister,sit,site,situate,situation,size,ski,skill,skin,skirt,sky,slave,sleep,slice,slide,slight,slightly,slip,slope,slow,slowly,small,smart,smell,smile,smoke,smooth,snap,snow,so,social,society,soft,software,soil,soldier,solid,solution,solve,some,somebody,somehow,someone,something,sometimes,somewhat,somewhere,son,song,soon,sorry,sort,soul,sound,source,south,southern,space,spare,speak,speaker,special,specialist,specialize,species,specific,specifically,specify,speech,speed,spell,spend,spin,spirit,split,sponsor,sport,spot,spread,spring,square,stability,stable,staff,stage,stain,stair,stake,stamp,stand,standard,star,stare,start,state,statement,station,statistic,status,stay,steady,steal,steel,stem,step,stick,still,stimulate,stir,stock,stomach,stone,stop,storage,store,storm,story,straight,strain,strange,stranger,strategy,stream,street,strength,strengthen,stress,stretch,strict,strike,string,strip,stroke,strong,strongly,structural,structure,struggle,student,studio,study,stuff,stupid,style,subject,submit,subsequent,subsequently,substance,substantial,substitute,succeed,success,successful,successfully,such,sudden,suddenly,suffer,sufficient,sugar,suggest,suggestion,suit,suitable,sum,summarize,summary,summer,sun,supplement,supplier,supply,support,supporter,suppose,sure,surely,surface,surgery,surprise,surprisingly,surround,survey,survival,survive,suspect,suspend,sustain,swear,sweep,sweet,swim,swing,switch,symbol,symptom,system,table,tackle,tail,take,tale,talent,talk,tall,tank,tap,tape,target,task,taste,tax,taxi,tea,teach,teacher,team,tear,technical,technique,technology,teenager,telephone,television,tell,temperature,temporary,tend,tendency,tender,tennis,tension,tent,term,terrible,territory,terrorist,test,text,than,thank,that,the,theater,their,them,theme,themselves,then,theoretical,theory,therapy,there,therefore,these,they,thick,thin,thing,think,thirst,this,those,though,threat,threaten,throat,through,throughout,throw,thus,ticket,tie,tight,till,time,tiny,tip,tire,tissue,title,to,today,together,tomorrow,tone,tongue,tonight,too,tool,tooth,top,topic,total,totally,touch,tough,tour,tourism,tourist,toward,tower,town,toy,trace,track,trade,tradition,traditional,traffic,trail,train,transfer,transform,transition,translate,transport,transportation,trap,travel,treat,treatment,tree,trend,trial,trick,trigger,trip,troop,trouble,truck,true,truly,trust,truth,try,tube,tune,turn,twice,twin,twist,type,typical,typically,ugly,ultimately,unable,uncertainty,uncle,unclear,under,undergo,underlie,understand,undertake,unemployment,unfortunately,uniform,union,unique,unit,unite,universal,universe,university,unknown,unless,unlike,unlikely,until,unusual,up,update,upon,upper,upset,urban,urge,us,use,useful,user,usual,usually,valley,valuable,value,van,variable,variation,variety,various,vary,vast,vegetable,vehicle,venture,verb,version,versus,very,vessel,veteran,via,vice,victim,victory,video,view,village,violence,violent,virtually,virus,visible,vision,visit,visitor,visual,vital,voice,volume,voluntary,volunteer,vote,voter,wage,wait,wake,walk,wall,wander,want,war,warm,warn,wash,waste,watch,water,wave,way,we,weak,weakness,wealth,wealthy,weapon,wear,weather,web,wed,week,weekend,weekly,weigh,weight,weird,welcome,welfare,well,west,western,wet,what,whatever,wheel,when,whenever,where,whereas,wherever,whether,which,while,whilst,whisper,white,who,whole,whom,whose,why,wide,widely,wife,wild,will,win,wind,window,wine,wing,winner,winter,wipe,wire,wise,wish,with,withdraw,within,without,witness,woman,wonder,wonderful,wood,wooden,word,work,worker,world,worry,worth,would,wound,wrap,write,writer,wrong,yard,year,yellow,yes,yesterday,yet,yield,you,young,your,yourself,youth,zero,zone";

    that.touched = false;
    $scope.dataS = [];

    ////////////////////////////////////////////////
    // Socket functions
    ////////////////////////////////////////////////

    socket.on('spellDictionaryParams', function (data) {
      $scope.dataS.length = 0;

      _.map(data, function (d) {
        $scope.dataS.push({word: d});
      });

      stats.writeSpell("Number of Dictionary Words", $scope.dataS.length);
    });

    that.applyWatch = $scope.$on("apply", function() {
      if(that.touched)
      {
        socket.emit("applySpellImportedData", JSON.stringify($scope.dataS));

        stats.writeSpell("Number of Dictionary Words", $scope.dataS.length);

        that.touched = false;
      }
    });

     that.noWatch = $scope.$on("noSpellT", function() {
      if($scope.dataS.length != 0) {
        that.clear();

        socket.emit("applySpellImportedData", JSON.stringify($scope.dataS));

        stats.writeSpell("Number of Dictionary Words", $scope.dataS.length);

        that.touched = false;
      }
    });

    that.defaultWatch = $scope.$on("dSpellT", function() {
      that.clear();

      _.map(that.default.split(","), function (d) {
        $scope.dataS.push({word: d});
      });

      socket.emit("applySpellImportedData", JSON.stringify($scope.dataS));

      stats.writeSpell("Number of Dictionary Words", $scope.dataS.length);

      that.touched = false;
    });

    $scope.$on('$destroy', function() {
      that.applyWatch();
      that.noWatch();
      that.defaultWatch();

      socket.removeAllListeners('spellDictionaryParams');

      $scope.dataS.length = 0;
    });

    that.clear = function()
    {
      $scope.dataS.length = 0;

      that.touched = true;
    };

    that.getFile = function(file)
    {
      $scope.$apply(function() {
        $scope.gridApi.importer.importFile( file );
      })
    };

    ////////////////////////////////////////////////
    // Grid
    ////////////////////////////////////////////////

    // Grid
    $scope.gridOptions = {
      enableGridMenu: false,
      showGridFooter: true,
      enableColumnMenus: false,
      enableFiltering: true,
      data: 'dataS',
      importerDataAddCallback: function (grid, newObjects) {
        $scope.dataS.length = 0;
        $scope.dataS = $scope.dataS.concat(newObjects);
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
        $scope.gridApi.core.refresh();
        that.touched = true;
      },
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
      },
      columnDefs: [
        {field: 'word', minWidth: 100, width: "*"}
      ]
    };

  }]);

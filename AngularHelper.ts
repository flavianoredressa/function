import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {NativeStorage} from "@ionic-native/native-storage";
import {Network} from "@ionic-native/network";




export class AngularHelper{
    drink = "drink";
    food = "food";

    store = "store";

    burn = "burn";
    organic = "organic";
    progressive = "progressive";
    super1 = "super";
    timetech = "timetech";
    tribaltech = "tribaltech";
    secret = "secret";

    chatAt = "chatAt"
    aux : FirebaseListObservable<any>;
    auxTrend : FirebaseListObservable<any>;
    myData:any;

    burnUp = [];
    timetechUp = [];
    tribaltechUp = [];
    organicUp = [];
    super1Up = [];
    progressiveUp = [];
    secretUp = [];
    chatActive:any;
    mensagem = new Array<{
        position: string,
        content: string,
        time: string,
    }>();
    trends1 = new Array<{
        dj: string,
        count: number,
        position:number
    }>();

    trends = new Array<{
        dj: string,
        count: number,
        position:number
    }>();


    dataS :any;
    userId:any;
   // auxid ="7NxM7";
    auxid ="";

    constructor(private af: AngularFireDatabase,private _nativeStorage:NativeStorage,private network: Network){
    this._nativeStorage.getItem("idUser").then(user =>{
      this.userId = user;
     this.auxid = user.id;
    });


        this.trendInit();

    }

    setData(type){
        let data=[];
        this.aux = this.af.list("/"+type);
        this.aux.subscribe((d)=>{
            data = d;
            if(data == null || data.length<1){return}
            for(let i=0;i<d.length;i++){
                data[i].s = false;
            }
        });

        this._nativeStorage.getItem(type).then(
            (dataR) => {

                for(let i=0;i<data.length;i++){

                    let a = dataR.find(item =>{
                        return item.name == data[i].name && item.time == data[i].time
                    });

                    if(a != null){
                        data[i].s = a.s;
                    }

                }

                if(data.length > 0){


                    this._nativeStorage.setItem(type,data).then(
                        () => {
                            console.log('logx: Stored item! ' + JSON.stringify(data)) ;
                            this.myData = data;
                            //console.log("set:"+JSON.stringify(data));
                        },
                        error => {
                            console.error('logx: Error storing item'+JSON.stringify(error));
                            this.myData = data;

                        }
                    );
                }
            },
            error => {
                console.error('logx: Error storing item'+JSON.stringify(error));
                if(data.length > 0){

                    this._nativeStorage.setItem(type,data).then(
                        () => {
                            console.log('logx: Stored item! ' + JSON.stringify(data)) ;
                            //console.log("set:"+JSON.stringify(data));
                            this.myData = data;

                        },
                        error => {
                            console.error('logx: Error storing item'+JSON.stringify(error));
                            this.myData = data;

                        }
                    );
                }
            });





    }

    sinc(type){
        if(this.network.type == 'none' || this.network.type == '2g'){
            this._nativeStorage.getItem(type).then((data)=>{
                this.myData = data;
            })
        }else{
            this.aux = this.af.list("/"+type);
            this.aux.$ref.on('value',s =>{
                let data = s.val();

                if(data == null || data.length<1){
                    this._nativeStorage.getItem(type).then((data)=>{
                        this.myData = data;
                    })

                    return;
                }


                for(let i=0;i<data.length;i++){
                    data[i].s = false;
                }

                this._nativeStorage.getItem(type).then(
                    (dataR) => {

                        for(let i=0;i<data.length;i++){

                            let a = dataR.find(item =>{
                                return item.name == data[i].name && item.time == data[i].time
                            });

                            if(a != null){
                                data[i].s = a.s;
                            }

                        }
                        if(data.length > 0) {

                            this._nativeStorage.setItem(type, data).then(
                                () => {
                                    console.log('logx: Stored item! ' + JSON.stringify(data));
                                    //console.log("set:"+JSON.stringify(data));
                                    this.myData = data;

                                },
                                error => {
                                    console.error('logx: Error storing item' + JSON.stringify(error));
                                    this.myData = data;

                                }
                            );
                        }
                    },
                    error => {
                        console.error('logx: Error storing item'+JSON.stringify(error));
                        if(data.length > 0) {

                            this._nativeStorage.setItem(type, data).then(
                                () => {
                                    console.log('logx: Stored item! ' + JSON.stringify(data));
                                    //console.log("set:"+JSON.stringify(data));
                                    this.myData = data;

                                },
                                error => {
                                    console.error('logx: Error storing item' + JSON.stringify(error));
                                    this.myData = data;

                                }
                            );
                        };
                    });





            })


            //     this.setData(type)


        }



    }

    sincDF(type){
        if(this.network.type == 'none' || this.network.type == '2g'){
            this._nativeStorage.getItem(type).then((data)=>{
                this.myData = data;
            })
        }else{
            this.aux = this.af.list("/"+type);
            this.aux.$ref.on('value',s => {

                let a = s.val();
                let data=[];

                if(type == "drink"){

                    data[0] = a["Acoólicos"];
                    data[0].$key ="Acoólicos";

                    data[1] = a["Combos Especiais"];
                    data[1].$key ="Combos Especiais";

                    data[2] = a["Não Acoólicos"];
                    data[2].$key ="Não Acoólicos";

                }else{
                    data[0] = a["JPL Burgers"];
                    data[0].$key ="JPL Burgers";

                    data[1] = a["Nebraska"];
                    data[1].$key ="Nebraska";

                }

console.log("logx data[0]"+data[0].length);
                if(data.length > 0 && data[0].length >0){


                this._nativeStorage.setItem(type,data).then(
                    () => {
                        console.log('logx: Stored item! ' + JSON.stringify(data)) ;
                        //console.log("set:"+JSON.stringify(data));
                        this.myData = data;

                    },
                    error => {
                        console.error('logx: Error storing item'+JSON.stringify(error));
                        this.myData = data;

                    }
                );
                }

            })


        }



    }

    saveData(type){

        try{
            console.log("logx: datamydata"+JSON.stringify(this.myData));
            let s = this.dataS;
            console.log("logx: datamydataSSSSSSSS"+JSON.stringify(s));

            let o = 0;
            for(let i=0;i<this.myData.length;i++){

                 o = 0;
                if(this.myData[i].s){
                    o = 1;
                }


                console.log("logx:1")
                let a = s.find(item =>{return item.dj == this.myData[i].name && item.id == this.auxid;});
                console.log("logx a:-------------->"+ JSON.stringify(a));
                if(a == null ){
                    console.log("logx:2");

                    this.auxTrend.push({
                        id:this.auxid,
                        dj:this.myData[i].name,
                        active:o
                    })
                }else{

                    console.log("logx:4");

                    this.auxTrend.update(a.$key,{active:o});

                }

            }

            console.log("logx:11")
        }catch (e){

        }



            this._nativeStorage.setItem(type,this.myData).then(
           () => {
               console.log("logx:12")

           console.log('logx: Stored item! ' + JSON.stringify(this.myData)) ;
               //console.log("set:"+JSON.stringify(data));
           },
           error => {
               console.log("logx:13")

               console.error('logx: Error storing item'+JSON.stringify(error));
           }
       );



    }



    lineUp(){
        this._nativeStorage.getItem(this.burn).then((data)=>{

            this.burnUp = data.filter(item=>{return item.s==true})

        })

        this._nativeStorage.getItem(this.organic).then((data)=>{

            this.organicUp = data.filter(item=>{return item.s==true})

        })

        this._nativeStorage.getItem(this.progressive).then((data)=>{

            this.progressiveUp = data.filter(item=>{return item.s==true})

        })

        this._nativeStorage.getItem(this.super1).then((data)=>{

            this.super1Up= data.filter(item=>{return item.s==true})

        })

        this._nativeStorage.getItem(this.tribaltech).then((data)=>{

            this.tribaltechUp = data.filter(item=>{return item.s==true})

        })

        this._nativeStorage.getItem(this.timetech).then((data)=>{

            this.timetechUp = data.filter(item=>{return item.s==true})

        })

        this._nativeStorage.getItem(this.secret).then((data)=>{

            this.secretUp = data.filter(item=>{return item.s==true})

        })



    }

    chatIsActive(callback){
        if(this.network.type == 'none' || this.network.type == '2g'){
            callback(false);
        }else{
            this.aux = this.af.list("/"+this.chatAt);
            this.aux.$ref.on('value',s =>{
                console.log(s.val())
                if(s.val() == 1){
                    callback(true);
                }else{
                    callback(false);
                }
            })
        }
    }

    getChat(callback){
        this.mensagem = new Array<{
            position: string,
            content: string,
            time: string,
        }>();
        this.aux = this.af.list("/chat");
        this.aux.$ref.on('value',s =>{

            this.aux.subscribe(t=>{
                let datas = t;
                this.mensagem = new Array<{
                    position: string,
                    content: string,
                    time: string,
                }>();
               //  this._nativeStorage.getItem("idUser").then(user=>{

                console.log(datas)

                for (let data of datas){
                    if(data.id == this.auxid){
                        this.mensagem.push({
                            position:"right",
                            content:data.msg,
                            time:data.time
                        })

                    }else{
                        this.mensagem.push({
                            position:"left",
                            content:data.msg,
                            time:data.time
                        })
                    }

                }
           // })



            })
            callback();
        })
    }

    sendChat(msg,data){
        this.aux = this.af.list("/chat");
        //this._nativeStorage.getItem("idUser").then(user=>{

            this.aux.push({
                id:this.auxid,
                msg:msg,
                time:data
            })
        //})


    }



    getTrend(){
        this.auxTrend = this.af.list("/trends");

        this.auxTrend.$ref.on('value',s =>{

            this.auxTrend.subscribe(t=>{
                for(let i=0;i<t.length;i++){

                    let a = this.trends1.filter(item =>{
                        return item.dj == t[i].dj;
                    });

                    if( a.length < 1){
                         let b = t.filter(item =>{
                            return item.dj == t[i].dj && item.active == 1;
                        });
                        this.trends1.push({dj:t[i].dj,count:b.length,position:0})
                    }

                }

                this.trends1.sort((a,b)=>{

                    if(a.count>b.count){
                        return -1;
                    }
                    if(b.count>a.count){
                        return 1;
                    }

                    return 0;
                })

                for(let i=0;i<this.trends1.length;i++){
                    this.trends1[i].position = i+1;
                    if(this.trends1[i].count == 0){continue;}
                    this.trends.push(this.trends1[i]);
                    if(i == 20){break;}
                }


            })


        })




    }

    auxTry = 0;

    trendInit(){
        this.auxTrend = this.af.list("/trends");
        console.log("logx:132")

        this.auxTrend.subscribe((s)=>{
            console.log("logx:135")

            //console.log("logx: tam:"+this.myData.length + " - > >>>>>>>>>")
            this.dataS =s;
        })

    }





     makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


}
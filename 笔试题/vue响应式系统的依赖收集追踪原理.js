//订阅者
class Dep{
    constructor(){
        this.subs = [];
    }

    addSub(){
        this.subs.push(sub);
    }

    notify(){
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}

//观察者
class Watcher{
    constructor(){
        /* 在new一个Watcher对象时将该对象赋值给Dep.target，在get中会用到 */
        Dep.target = this;
    }

    update(){
        console.log('视图更新啦')
    }
}

function observer(value){
    if(!value || (typeof value !== 'object')){
        return;
    }
    Object.keys(value).forEach(key => {
        //劫持data里的每个属性，给每个属性设置getter/setter方法
        defineReactive(value, key, value[key]);
    })
}


function defineReactive(obj,key,val){
    let dep = new Dep();
    Object.defineProperty(obj, key, {
        enumerable:true,
        configurable:true,
        get: function reactiveGetter(){
            /* 将Dep.target（即当前的Watcher对象存入dep的subs中） */
            dep.addSub(Dep.target);
            return val;
        },
        set: function reactiveSetter(newVal){
            console.log('setter', newVal)
            if(newVal === val) return;
            val = newVal;
            /* 在set的时候触发dep的notify来通知所有的Watcher对象更新视图 */
            dep.notify();
        }
    })
}

class Vue {
    constructor(options){
        this._data = options.data;
        observer(this._data);
        /* 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象 */
        new Watcher();
        /* 在这里模拟render的过程，为了触发test属性的get函数 */
        console.log('render~', this._data.name);
    }
}

let o = new Vue({
    data:{
        name:'lvbowen',
    }
})
o._data.name = 'yeqiu';

Dep.target = null;
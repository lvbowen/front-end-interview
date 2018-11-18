function observer(value){
    if(!value || (typeof value !== 'object')){
        return;
    }
    Object.keys(value).forEach(key => {
        //劫持data里的每个属性，给每个属性设置getter/setter方法
        defineReactive(value, key, value[key]);
    })
}

function cb(val){
    console.log('视图更新了', val);
}

function defineReactive(obj,key,val){
    Object.defineProperty(obj, key, {
        enumerable:true,
        configurable:true,
        get: function reactiveGetter(){
            console.log('getter', val)
            return val;
        },
        set: function reactiveSetter(newVal){
            console.log('setter', newVal)
            if(newVal === val) return;
            val = newVal;
            cb(newVal);
        }
    })
}

class Vue {
    constructor(options){
        this._data = options.data;
        observer(this._data);
    }
}

let o = new Vue({
    data:{
        test:'test',
        name:'lvbowen',
        arr:['a','b','c'],
        obj:{
            age:100
        }
    }
})

o._data.name = 'yeqiu';
setTimeout(() => {
    o._data.test = 'new test';
    o._data.arr[3] = 'bb';
    o._data.obj.age = 101;
}, 3000)
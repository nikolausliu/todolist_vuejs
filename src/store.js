const STORAGE_KEY = 'todoList';
export default {
    set: function(val){
        localStorage.setItem(STORAGE_KEY,JSON.stringify(val));
    },
    get: function(){
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    },
    removeAll: function(){
        localStorage.removeItem(STORAGE_KEY);
    },
    removeOne: function(index){ // 要移除项的索引
        var getStorage = JSON.parse(localStorage.getItem(STORAGE_KEY));
        // 注意：splice的返回值是被删除的项组成的数组
        var modiStorage = getStorage.splice(index,1);                   
        // 所以这里应该设置被改变过的原数组
        this.set(getStorage);
    },
    clear: function(){
        localStorage.clear();
    }
}
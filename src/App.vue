<template>
  <div id="app">
    <nav>
      <div class="container clearfix">
        <label for="title">{{ title }}</label>
        <input type="text" id="title" v-model="newItem" @keyup.enter="addItem" :placeholder="placeholder">
      </div>
    </nav>
  
    <div class="container main">
      <dl>
        <dt>
          <span>
            任务列表
            <small v-show="items.length">
              <span>{{ hasNotFinishedLen }}</span>个任务未完成</small>
          </span>
          <button @click="clearList" v-show="items.length">
            <i class="fa fa-trash-o" aria-hidden="true"></i>
          </button>
        </dt>
        <dd v-show="!items.length">您还没有添加任何任务</dd>
        <dd class="clearfix" v-for="(item,index) in items" :class="{isFinished: item.isFinished}">
          <input type="checkbox" @click="toggleFinish(item)" :checked="item.isFinished">
          <p @dblclick="editItem(item)">{{ item.label }}</p>
          <button @click="delItem(item)" :key="item"></button>
          <input type="text" v-model="item.label" v-show="item.editStatus" v-focus="item.editStatus" @keyup.enter="editDone(item)" @blur="editDone(item)" @keyup.esc="editCancel(item)">
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import Store from './store'

var filter = {
  all: function (items) {
    return items;
  },
  finished: function (items) {
    return items.filter(function (item) {
      return item.isFinished;
    })
  },
  unfinished: function () {
    return items.filter(function (item) {
      return !item.isFinished;
    })
  }
}

export default {
  data: function () {
    return {
      title: 'TODOLIST',
      placeholder: 'Input here and press enter',
      items: Store.get() || [],
      newItem: '',
      tempLabel: ''   // 用来记录编辑时的临时值
    }
  },
  methods: {
    addItem: function () {
      var _this = this;
      this.items.push({
        label: _this.newItem,
        isFinished: false,
        editStatus: false   // 是否处于可编辑状态
      });
      // Store.set(this.items); // 对items经行了watch，这一步就可以省略了
      this.newItem = '';
    },
    toggleFinish: function (item) {
      item.isFinished = !item.isFinished;
    },
    delItem: function (item) {
      var index = this.items.indexOf(item);
      Store.removeOne(index);
      this.items = Store.get() || [];
    },
    editItem: function (item) {
      item.editStatus = true;
      this.tempLabel = item.label;    // 把label值暂存，以便editCancel时使用
    },
    editDone: function (item) {
      item.editStatus = false;
      this.tempLabel = '';    // 编辑完成，重新把临时值清空
    },
    editCancel: function (item) {
      item.editStatus = false;
      item.label = this.tempLabel;    // 取消编辑时，把item.label用临时值重置
    },
    clearList: function () {
      Store.removeAll();
      this.items = Store.get() || [];
    }
  },
  computed: {
    hasNotFinishedLen: function () {
      return this.items.filter(function (item) {
        return !item.isFinished
      }).length
    }
  },
  watch: {
    items: {
      handler: function (items) {
        Store.set(items);
      },
      deep: true  // 深检测
    }
  },
  directives: {   // 自定义指令，也可以全局注册：Vue.directive(name,config)
    'focus': {
      update: function (el) {
        el.focus(); // 被绑定元素所在模板更新时，让绑定元素获取焦点
      }
    }
  }
}
</script>

<style>
@import "http://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

* {
  margin: 0;
}

body {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  background: #fbfbfb;
}

.clearfix:after {
  display: block;
  content: '';
  height: 0;
  visibility: hidden;
  clear: both;
}

button {
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
}

i.fa {
  color: #41b883;
  font-size: 20px;
}

nav {
  background: #41b883;
  margin-bottom: 20px;
}

nav label {
  display: block;
  float: left;
  box-sizing: border-box;
  cursor: pointer;
  color: #fff;
  height: 50px;
  padding: 15px 15px;
  font-size: 18px;
  line-height: 20px;
}

nav input {
  display: inline-block;
  width: 300px;
  box-sizing: border-box;
  margin: 8px 0;
  height: 34px;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
  -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
  -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
}

.container {
  width: 600px;
  margin: 0 auto;
}

dt {
  font-weight: bold;
  margin-bottom: 20px;
}

dt small {
  margin-left: 20px;
  font-weight: normal;
}

dt button {
  float: right;
}

dd {
  position: relative;
  padding: 10px 10px 15px 10px;
  background: #fff;
  border-bottom: 1px solid #eee;
}

dd input[type=checkbox] {
  float: left;
  width: 20px;
  height: 20px;
  margin: 2px 20px 2px 0;
}

dd p {
  float: left;
  width: 75%;
  line-height: 24px;
  height: 24px;
}

dd button {
  float: right;
  width: 20px;
  height: 24px;
  font-size: 20px;
  color: #41b883;
}

dd button:hover {
  color: #35495e;
}

dd button:after {
  content: '×'
}

dd:hover {
  background: #fbfbfb;
}

dd.isFinished p {
  color: #ddd;
  text-decoration: line-through;
}

dd input[type=text] {
  position: absolute;
  left: 50px;
  font-size: 16px;
}

@media screen and (max-width: 768px) {
  .container {
    width: 80%;
    box-sizing: border-box;
  }
}

@media screen and (max-width: 414px) {
  .container {
    width: 100%;
    box-sizing: border-box;
  }
  .main {
    padding: 10px;
  }
  nav label {
    width: 32%;
  }
  nav input {
    width: 66%;
  }
}

@media screen and (max-width: 320px) {
  nav label {
    width: 34%;
  }
  nav input {
    width: 62%;
  }
}
</style>

import { createApp } from 'vue'
// 从一个单文件组件中导入根组件
import App from './App.vue'
import './main.css'

const createRootNode = function(){
    let rootNode = document.createElement('div')
    let attrID = document.createAttribute('id')
    attrID.value = 'speechless'
    rootNode.setAttributeNode(attrID)
    document.body.append(rootNode)
}

createRootNode()

const app = createApp(App)
app.mount('#speechless')
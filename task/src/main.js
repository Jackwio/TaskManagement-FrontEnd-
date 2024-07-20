//整個應用的路口文件，即:腳手架在運行的時候，是從該文件的第一行代碼執行 

//引入Vue
import {createApp} from 'vue'
import App from './App'  //suffix為.vue可以省略。App為一人之下，萬人之上的組件
// Vue.config.productionTip=false 

// 建立vm
const app = createApp(App)
app.mount('#app')
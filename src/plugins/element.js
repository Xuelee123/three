import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import Timeline from './timeline/index.js'


import TimelineItem from  './timeline-item/index.js'

import { 
  MenuItem,
  Submenu,
  Menu,
  Form, 
  FormItem, 
  Button, 
  Input, 
  Message, 
  Container,
  Header, 
  Aside, 
  Main,
  Breadcrumb, 
  BreadcrumbItem,
  Card, 
  Col, 
  Row,
  Table, 
  TableColumn,
  Switch, 
  Tooltip,
  Pagination,
  Dialog, 
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Tabs,
  TabPane,
  Alert,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload,

} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Alert)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)


Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
//将confirm挂载到全局中去
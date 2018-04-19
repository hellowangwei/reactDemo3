import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import config from './../../config'
import './summary.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


// antd组件部分
import { Layout, Tabs, Button, Alert, Input, Tag, Row, Col, Spin, Tooltip, Affix, Badge, Icon,Pagination ,Cascader,Tree,Card,Popconfirm,Form} from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;

const TreeNode = Tree.TreeNode;
const { CheckableTag } = Tag;
const Search = Input.Search;
// 自定义组件

class Login extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        user_mobile:'',
        user_pass:'',
        error:'',
    }
    componentDidMount() {
        /*处理数据*/
        let token = this.getData('token')
        let url=config.host+'/user/test'
        let data = {
            'token':token
        }
        axios.post(url,data)
            .then((response)=>{
                if(response.data.user_info){
                    window.location.href = window.location.origin+'/question/';
                }else{
                    this.clean()
                }
            })
            .catch((err)=>{
                console.log(err);
            });

    }
    handleSubmit = (e) => {
        e.preventDefault();
        let url=config.host+'/user/login'

        let data = {
            'username':this.state.user_mobile,
            'password':this.state.user_pass
        }
        axios.post(url,data)
            .then((response)=>{
            console.log(response.data)
                if(response.data.success){
                    this.setData('token',response.data.token)
                    window.location.href = window.location.origin+'/question/';
                }else{
                    this.clean()
                    this.setState({error:response.data.error})
                }
            })
            .catch((err)=>{
                console.log(err);
            });


    }
    userChange = (e) => {
        let {user_mobile } = this.state
        user_mobile =e.target.value
        this.setState({user_mobile})
    }
    passwordChange = (e) => {
        let {user_pass } = this.state
        user_pass =e.target.value
        this.setState({user_pass})

    }
    clean() {
        console.log('清除所有cookie');

        let cookies = document.cookie.split(';');
        if (cookies.length > 0) {
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i];
                let eqPos = cookie.indexOf('=');
                let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=' + this.path;
            }
        }
    }
    getData(key) {
        let cookies = window.document.cookie.split(';');
        for (let i = 0, item = cookies[i]; item; item = cookies[++i]) {
            let [name, value] = item.split('=');
            if (key == name.trim()) {
                return unescape(value);
            }
        }

        console.log(`从未设置过key为${key}的Cookie`);
    }

    setData(key, value, expires_in = 36000) {
        let expires = new Date();
        expires.setTime(expires.getTime() + expires_in * 1000);

        let cookieValue = `${key}=${escape(value)};expires=${expires.toGMTString()};path=${this.path}`;

        window.document.cookie = cookieValue;
    }
    render() {
        let {error,user_mobile,user_pass} = this.state
        return (
            <div style={{textAlign:'center'}}>

                <Card style={{width:300,background:'rgba(255, 255, 255, 0.8)',margin:'150px auto'}}>
                    <Form onSubmit={ this.handleSubmit } className="login-form">
                        { !!error && <div style={{color:'#f50',lineHeight:'1.5'}}>{error}</div> }
                        <FormItem>

                                <Input addonBefore={<Icon type="user" />} value={user_mobile} placeholder="手机号" onChange={this.userChange}/>

                        </FormItem>
                        <Input style={{display:'none'}} />
                        <FormItem>

                                <Input addonBefore={<Icon type="lock" />} value={user_pass} type="password" placeholder="密码"  onChange={this.passwordChange}/>

                        </FormItem>
                        <FormItem>

                            <Button style={{width:'100%'}} type="primary" htmlType="submit" className="login-form-button">
                                登陆
                            </Button>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        )
    }
}

export default Login
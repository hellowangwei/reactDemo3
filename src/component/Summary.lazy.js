import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import config from './../../config'
import './summary.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


// antd组件部分
import { Layout, Tabs, Button, Alert, Input, Tag, Row, Col, Spin, Tooltip, Affix, Badge, Icon,Pagination ,Cascader,Tree,Card,Popconfirm,message} from 'antd';
const { Header, Footer, Sider, Content } = Layout;

const TreeNode = Tree.TreeNode;
const { CheckableTag } = Tag;
const Search = Input.Search;
// 自定义组件
const typeFillter=[
    "all",
    "判断",
    "填空",
    "归类",
    "排序",
    "生活情境题",
    "解决问题",
    "计算",
    "连线",
    "选择",
    "选择填空",
]
const subjectFillter=[
    "数学",
    "英语",
    "语文",

]
const ENTypeFillter = [
    "all",
    "img",
    "sentence",
    "word",
]
const CHTypeFillter = [
    "all",
    "判断",
    "单选",
    "填空",
    "归类",
    "排序",
    "连线",
    "选词填空",
    "阅读理解",

]


class Summary extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        subject:'数学',
        books: [],
        sections_id:'',
        page:1,
        type:'all',
        sections: [],
        questions: {},
        token:false,
        questions_count:{},

    }
    componentDidMount() {
        /*处理数据*/
        let token = this.getData('token')

        axios(config.host+'/api/v1/books',{}).then((response)=>{
            this.setState({books:response.data.books,token,questions_count:response.data.questions_count,})
        })
            .catch((err)=>{
                console.log(err);
            });;



    }

    //{value: "1", label: "人教版", children: Array(6)}
    CascaderOptions = (data)=>{//下拉选择器数据转换
        let options = {}
        data.forEach(item=>{
            if(options[item.version]){
                options[item.version].children.push({ value: item.id, label: item.name })
            }else{
                options[item.version]={ value: item.version, label: item.version,children:[]}
                options[item.version].children.push({ value: item.id, label: item.name })
            }
        })

        return Object.keys(options).map(d=>options[d])
    }

    onAssistChange=(val)=>{
        let subject = this.state.subject
        if(subject=='英语'){
            subject = 'en'
        }
        else if(subject=='语文'){
            subject = 'ch'
        }else{
            subject = 'math'
        }
        axios(config.host+`/api/v1/books/${val[1]}/sections?subject=${subject}`,{}).then((response)=>{
            this.setState({sections:response.data})
        })
            .catch((err)=>{
                console.log(err);
            });

    }
    getQuestion = ()=>{//获得题目列表
        let {sections_id, page, type} = this.state
        let params={
            page,
            type,
        }
        let subject = this.state.subject
        if(subject=='英语'){
            subject = 'en'
        }
        else if(subject=='语文'){
            subject = 'ch'
        }else{
            subject = 'math'
        }
        let url = config.host+`/api/v1/sections/${sections_id}/questions?subject=${subject}`
        axios(url,{params})
            .then((response)=>{
                this.setState({questions:response.data})
            })
            .catch((err)=>{
                console.log(err);
            });


    }
    handleTreeSelect= (val)=>{//章节点击
        let sections_id = val
        let page = 1;
        this.setState({sections_id,page})
        setTimeout(()=>{
            this.getQuestion();
        },0)

    }
    filterClick= (val)=>{//筛选题目
        let type = val
        let page = 1;
        this.setState({type,page})
        setTimeout(()=>{
            this.getQuestion();
        },0)
    }
    subjectClick= (val)=>{//学科筛选
        this.setState({subject:val,books:[]})
        setTimeout(()=>{
            let subject = this.state.subject
            if(subject=='英语'){
                subject = 'en'
            }
            else if(subject=='语文'){
                subject = 'ch'
            }else{
                subject = 'math'
            }
            axios(config.host+`/api/v1/books?subject=${subject}`,{}).then((response)=>{
                let type = 'all'
                let page = 1;

                let sections_id=''
                let sections= []
                let questions= {}
                this.setState({books:response.data.books,token,questions_count:response.data.questions_count,type,page,sections_id,sections,questions,})

            }).catch((err)=>{
                console.log(err);
            });

        },0)
        let token = this.getData('token')



    }
    pageChange =  (val)=>{
        let page = val
        this.setState({page})
        setTimeout(()=>{
            this.getQuestion();
        },0)
    }
    delQuestion = (v)=>{//删除题目
        let data = {
            token:this.state.token
        }
        let subject = this.state.subject
        if(subject=='英语'){
            subject = 'en'
        }
        else if(subject=='语文'){
            subject = 'ch'
        }else{
            subject = 'math'
        }
        axios.delete(config.host+`/api/v1/question/${v}?subject=${subject}`,{data:data})
            .then((response)=>{
                if(response.data.success){
                    message.info('删除成功')
                    this.setState({questions_count:response.data.questions_count,})
                    this.getQuestion();
                }else{
                    message.error('删除失败')
                }
            })
            .catch((err)=>{
                console.log(err);
            });

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
    createHtml = str => ({ __html: str ? str : `&nbsp;` });

    loop = data => data.map((item) => {
        if (item.list) {
            return (
                <TreeNode key={ item.id }  title = { <div title={(item.u_name||'')+item.s_name+`(${item.questions_count})`} dangerouslySetInnerHTML = { this.createHtml(item.id+(item.u_name||'')+item.s_name+`(${item.questions_count})`) }/> }>
                    {loop(item.list)}
                </TreeNode>
            );
        }
        return <TreeNode key={''+item.id} title = { <div title={(item.u_name||'')+item.s_name+`(${item.questions_count})`} dangerouslySetInnerHTML = { this.createHtml(item.id+(item.u_name||'')+item.s_name+`(${item.questions_count})`) }/> } />;
    });
    render() {
        const {subject,books,sections,questions,total,type,page,token,sections_id,questions_count} = this.state
        return (
            <div>

                <Col span={6} style={{overflow:'hidden'}}>
                    {
                        <Row style={{marginTop:'50px'}}>
                            <Col span={6} style={{fontSize:"14px", fontWeight:"600"}}>
                                学科：
                            </Col>
                            <Col span={18} style={{maxHeight:150, overflow:"auto"}}>
                                {
                                    subjectFillter.map((v,k)=>
                                        <Tooltip key = { k } placement="topLeft" title={ `` }>
                                            <Tag className={`${ subject === v ? 'selected' : ''} `} style={{marginBottom:10}} color="cyan-inverse" onClick={ () => this.subjectClick(v) }>
                                                { v }
                                            </Tag>
                                        </Tooltip>

                                    )
                                }
                            </Col>
                        </Row>
                    }
                    <div style={{padding:'20px'}}>
                        <Cascader
                            allowClear={ false }
                            // defaultValue = { defaultValue }
                            style={ {width:'100%'} }
                            options={ books.length ? this.CascaderOptions(books) : [] }
                            onChange={ this.onAssistChange }
                            placeholder="Please select" />

                        {

                            <Tree
                                // onCheck={ handleTreeCheck }
                                onSelect = { this.handleTreeSelect }
                            >
                                {this.loop(sections)}
                            </Tree>

                        }
                    </div>

                </Col>


                <Col span={18}>
                    <div style={{margin:'80px 0 0 0',textAlign:'right',fontSize:'16px',fontWeight:'700px'}}>
                        {
                            <div>
                                <span style={{margin:'0 80px 0 0',textAlign:'right'}}>总题数：{questions_count.total}</span>
                                <span style={{margin:'0 80px 0 0',textAlign:'right'}}>删除数：{questions_count.deleted}</span>
                                <span style={{margin:'0 80px 0 0',textAlign:'right'}}>剩余数：{questions_count.remain}</span>
                            </div>
                        }
                    </div>
                    <div style={{margin:'80px 0'}}>
                        {
                            <Row style={{marginBottom:'20px'}}>
                                <Col span={2} style={{fontSize:"14px", fontWeight:"600"}}>
                                    题型：
                                </Col>
                                <Col span={22} style={{maxHeight:150, overflow:"auto"}}>
                                    {
                                        this.state.subject=='英语'&&
                                        ENTypeFillter.map((v,k)=>
                                            <Tooltip key = { k } placement="topLeft" title={ `` }>
                                                <Tag className={`${ type === v ? 'selected' : ''} `} style={{marginBottom:10}} color="cyan-inverse" onClick={ () => this.filterClick(v) }>
                                                    { v }
                                                </Tag>
                                            </Tooltip>

                                        )
                                    }
                                    {
                                        this.state.subject=='数学'&&
                                        typeFillter.map((v,k)=>
                                            <Tooltip key = { k } placement="topLeft" title={ `` }>
                                                <Tag className={`${ type === v ? 'selected' : ''} `} style={{marginBottom:10}} color="cyan-inverse" onClick={ () => this.filterClick(v) }>
                                                    { v }
                                                </Tag>
                                            </Tooltip>

                                        )
                                    }
                                    {
                                        this.state.subject=='语文'&&
                                        CHTypeFillter.map((v,k)=>
                                            <Tooltip key = { k } placement="topLeft" title={ `` }>
                                                <Tag className={`${ type === v ? 'selected' : ''} `} style={{marginBottom:10}} color="cyan-inverse" onClick={ () => this.filterClick(v) }>
                                                    { v }
                                                </Tag>
                                            </Tooltip>

                                        )
                                    }

                                </Col>
                            </Row>
                        }
                    </div>
                    <div id={'questions'} style={{overflow:'hidden',position:'relative'}}>
                        {
                            questions.data &&
                            questions.data.map(
                                (val, key) =>
                                    <div key={key}  style={{marginBottom:'20px'}}>
                                        <Card className="questionWrap" key={key} title={
                                            <div style={{background:'rgb(167, 188, 226)'}}>

                                                <span>题目ID：{val.id}</span>
                                                <span
                                                    style={{marginLeft: '15px'}}>题型：{val.q_type}</span>

                                                <span style={{marginLeft:'100px'}}>章节序号：{sections_id}</span>
                                                <span style={{marginLeft:'200px'}}>序号：{(page-1)*20+key + 1}</span>
                                            </div>
                                        }>
                                            <div style={{position:'relative',paddingRight:'100px'}}>
                                                <div>
                                                    {
                                                        <div
                                                            dangerouslySetInnerHTML={this.createHtml(val.content)}></div>
                                                    }

                                                    {   val.options&&val.options.length&&
                                                    <div>
                                                        <div style={{fontWeight:'900',fontSize:'16px'}}>选项：</div>
                                                        {
                                                            val.options.map(
                                                                (v,k)=>
                                                                    <div key={k}  style={{display:'inline-block',marginRight:'50px'}}>
                                                                        <div>选项{k+1}</div>
                                                                        <div
                                                                            dangerouslySetInnerHTML={this.createHtml(v.replace(/<!-- -->/ig,'&nbsp&nbsp&nbsp&nbsp&nbsp'))}></div>
                                                                    </div>
                                                            )
                                                        }
                                                    </div>

                                                    }
                                                    {
                                                        val.answers&&
                                                        <div>
                                                            <div style={{fontWeight:'900',fontSize:'16px'}}> 答案：</div>
                                                            <div
                                                                dangerouslySetInnerHTML={this.createHtml(val.answers)}></div>
                                                        </div>

                                                    }
                                                    {
                                                        <div>
                                                            <div style={{fontWeight:'900',fontSize:'16px'}}>解析：</div>
                                                            <div
                                                                dangerouslySetInnerHTML={this.createHtml(val.analysis)}></div>
                                                        </div>

                                                    }

                                                </div>

                                                {   token&&
                                                <div className="control" style={{position:'absolute',top:'100px',right:'10px'}}>
                                                    <Popconfirm title="确认删除此题吗？"
                                                                onConfirm={() => this.delQuestion(val.id)}
                                                                okText="确定" cancelText="取消">
                                                        <Button type="danger">删除</Button>
                                                    </Popconfirm>
                                                </div>
                                                }
                                            </div>

                                        </Card>
                                    </div>
                            )


                        }

                    </div>
                    <Footer>
                        {
                            questions.pagination &&
                            <Pagination
                                showQuickJumper
                                pageSize={+20}
                                // showSizeChanger
                                total={+questions.pagination.total_questions}
                                onChange={ this.pageChange }
                                // onShowSizeChange = { this.onShowSizeChange }
                                current={page}
                            />
                        }

                    </Footer>
                </Col>

            </div>
        )
    }
}

export default Summary
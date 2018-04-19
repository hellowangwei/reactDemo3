import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import config from './../../config'
import './img.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';



// antd组件部分
import { Layout, Button, Select, Input, Tag,Modal, Row, Col, Spin,Card,message,Pagination,Upload,Icon} from 'antd';


const { Header, Footer, Sider, Content } = Layout;

const { CheckableTag } = Tag;
const Search = Input.Search;
const Option = Select.Option;

// 自定义组件


const props = {
    name: 'file',
    action: config.host+'/api-img/upload_img_zip',
    // headers: {
    //     authorization: 'authorization-text',
    // },
    showUploadList:false,
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};


//
// $('.inner_audio', this.refs.viewer) && $('.inner_audio', this.refs.viewer).off().on('click', () => {
//     $('.math_reading', this.refs.viewer)[0].play();
//     $('.inner_audio', this.refs.viewer).addClass('inner-audio-play');
// });



class ImageView extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        page:1,
        search: '',
        images: [],
        token:false,
        filter:'0',
        pagination:false,
        questions:[],
        viewQuestion:false,
        imgViewSwitch:false,
        imgView:'',
    }
    componentDidMount() {
        /*处理数据*/
        let token = this.getData('token')

        this.getList()

    }

    getList = ()=>{//获得图片列表
        setTimeout(()=>{
            let {search, page, filter} = this.state
            let params={
                page,
                needs:~~filter,
            }
            if(search!==''){
                params.img_id=search
            }
            // let url = config.host+`/api-img/images?page=${2}&img_id=${1}&needs=${30}`
            let url = config.host+`/api-img/images`
            axios(url,{params})
                .then((response)=>{
                    this.setState({images:response.data.data,pagination:response.data.pagination})
                })
                .catch((err)=>{
                    console.log(err);
                });
        },0)

    }



    pageChange =  (val)=>{
        let page = val
        this.setState({page})
        this.getList();
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

    filter=(val)=>{
        this.setState({filter:val})
        this.getList()
    }
    onSearch=(val)=>{
        this.setState({page:1,})
        this.getList()
    }
    viewQuestion=(id)=>{
        let url = config.host+`/api-img/img_ques/${id}/`
        this.setState({loading:true,questions:[],imgList:[],viewQuestion:true,})
        axios(url)
            .then((response)=>{
                this.setState({questions:response.data,loading:false})
            })
            .catch((err)=>{
                console.log(err);
                message.error('网络错误')
            });
    }

    viewImg=(id)=>{
        let url = config.host+`/api-img/ques_img/${id}/`
        this.setState({imgList:[]})
        axios(url)
            .then((response)=>{
                this.setState({imgList:response.data})
            })
            .catch((err)=>{
                console.log(err);
                message.error('网络错误')
            });
    }

    showImg=(id)=>{
        this.setState({imgView:id,imgViewSwitch:true})
    }
    closeQuestion=()=>{
        this.setState({viewQuestion:false})
        this.closeAudio()
    }

    closeAudio = ()=>{
        let audios = document.querySelectorAll('audio')
        audios.forEach((audio)=>{
            if(audio!==null){
                if(audio.paused)                     {
                }else{
                    audio.pause();// 这个就是暂停
                }
            }
        })

    }
    audioOnclick = (className)=>{
        let audio = document.querySelector(`.${className}`)
            if(audio!==null){
                if(audio.paused) {
                    this.closeAudio()
                    audio.play();// 这个就是暂停
                }else{
                    audio.pause();// 这个就是暂停
                }
            }

    }
    render() {
        const {page,token,images,pagination,questions,loading,imgList} = this.state
        console.log(images)
        return (
            <div style={{width:1250,margin:'0 auto',paddingTop:'50px'}}>
                <div>
                    <Input
                        placeholder="输入关键字"
                        style={{width:220,marginRight:10}}
                        value={this.state.search}
                        onChange={(e)=>this.setState({search:e.target.value})}

                    />
                    <Button style={{fontSize: 12,marginRight:'120px'}} type="primary" onClick={this.onSearch}>搜索</Button>

                    <label style={{width:'70px',display:'inline-block'}} htmlFor="search_type">尺寸筛选 ：</label>
                    <Select value={this.state.filter} style={{ width: 120 }} onChange={this.filter} id="search_type">
                        <Option value="0">全部</Option>
                        <Option value="10">只小图</Option>
                        <Option value="20">只大图</Option>
                        <Option value="30">大图和小图</Option>
                    </Select>

                    <div style={{marginLeft:100,display:'inline-block'}}>
                        <Upload {...props}>
                            <Button>
                                <Icon type="upload" /> 上传图片包
                            </Button>
                        </Upload>

                    </div>

                </div>
                <Modal width={1000} footer={null} title="查看图片题目" visible={this.state.viewQuestion} onCancel={this.closeQuestion}>
                    <div style={{position:'relative'}}>
                        <div style={{minHeight:100,width:'75%',posision:'relative'}}>
                            <Spin spinning={loading}>
                                {
                                    questions &&
                                    questions.map(
                                        (val, key) =>
                                            <div key={key}  style={{marginBottom:'20px'}}>
                                                <Card className="questionWrap" key={key} title={
                                                    <div style={{background:'rgb(167, 188, 226)'}}>

                                                        <span>题目ID：{val.id}</span>
                                                        <span
                                                            style={{marginLeft: '15px'}}>题型：{val.ques_type}</span>
                                                        <Button style={{marginLeft:250}} onClick={()=>{this.viewImg(val.id)}}>查看</Button>
                                                    </div>
                                                }>
                                                    <div style={{position:'relative',paddingRight:'100px'}}>
                                                        <div>
                                                            {
                                                                val.listen_url&&
                                                                <div style={{border:'3px solid red',margin:'10px 0'}} onClick={()=>{this.audioOnclick('audio'+val.id)}}>
                                                                    <audio src={val.listen_url} className={'audio'+val.id} controls="controls">您的浏览器不支持
                                                                    </audio>
                                                                </div>
                                                            }

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
                            </Spin>

                        </div>
                        <div style={{minHeight:100,width:'23%',position:'absolute',right:0,top:0}}>
                            {
                                imgList&&imgList.map(
                                    (val, key) =>
                                        <div key={key}  style={{marginBottom:'20px'}}>
                                            <Card className="questionWrap" key={key} title={
                                                <div style={{background:'rgb(167, 188, 226)'}}>
                                                    <span>图片ID：{val.img_id}</span>
                                                </div>
                                            }>
                                                <div style={{position:'relative',paddingRight:'100px'}}>
                                                    <img src={val.old_img_url} alt=""/>
                                                </div>

                                            </Card>
                                        </div>
                                )
                            }

                        </div> 
                    </div>
                    
                </Modal>
                <div style={{marginTop:'50px',fontSize:'17px',color:'#888'}}>
                    <Modal className={'imgModal'} footer={null} header={null} visible={this.state.imgViewSwitch} onCancel={()=>this.setState({imgViewSwitch:false})}>
                        <div style={{lineHeight:0}}>
                            <img src={this.state.imgView} className={'imgView'}  onClick={()=>this.setState({imgViewSwitch:false})}/>
                        </div>
                    </Modal>
                    {

                        images&&images.length&&
                        images.map((val,key)=>
                        <div key={key} style={{overflow:'hidden',height:'380px',marginTop:30,border:'1px solid #bbb',borderRadius:3}}>
                        <div style={{width:310,float:'left',overflow:'hidden',border:'1px solid #eee',height:'100%',padding:'0 5px'}}>
                            <div style={{textAlign:'left',paddingLeft:'20px',lineHeight:'50px'}}>图片id： <span style={{fontWeight:'700',color:'#000'}}>&nbsp;{val.img_id}</span></div>
                            <div   style={{width:'300px',height:'270px',display:'block'}}>
                                <img onClick={()=>{this.showImg(val.old_img_url)}} src={val.old_img_url}  style={{width:'300px',maxHeight:'270px'}}/>
                            </div>
                            <div style={{textAlign:'center'}}>
                                <Button type={'primary'} onClick={()=>{this.viewQuestion(val.img_id)}}>查看</Button>
                            </div>
                        </div>

                        <div style={{width:230,float:'left',overflow:'hidden',border:'1px solid #eee',height:'100%',padding:'0 4px'}}>
                            <div style={{textAlign:'center',lineHeight:'50px'}}>新小图-
                                {
                                (val.needs==10||val.needs==30)?
                                    <Tag color="#108ee9">需要</Tag>
                                    :
                                    <span>不需要</span>
                                }
                            </div>
                            {
                                val.new_img_small!==''?
                                    <img src={val.new_img_small}  style={{width:'220px',height:'165px'}}/>
                                    :

                                    (val.needs==10||val.needs==30)?
                                        <div style={{display:'block',width:'220px',height:'165px',background:'rgb(206,232,249)'}}><span style={{float:'left',fontSize:24,margin:'60px 0 0 85px'}}>需要</span></div>
                                        :
                                        <div style={{display:'block',width:'220px',height:'165px',background:'#eee'}}><span style={{float:'left',fontSize:24,margin:'60px 0 0 70px'}}>不需要</span></div>

                            }


                            <div style={{textAlign:'center',marginTop:'113px'}}>220 * 165</div>

                        </div>
                        <div style={{width:708,float:'left',overflow:'hidden',border:'1px solid #eee',height:'100%',padding:'0 4px'}}>
                            <div style={{textAlign:'center',lineHeight:'50px'}}>新大图-
                                {
                                    (val.needs==20||val.needs==30)?
                                        <Tag color="#108ee9">需要</Tag>
                                    :
                                     <span>不需要</span>

                                }
                                </div>

                            {
                                val.new_img_large!==''?
                                    <img src={val.new_img_large}  style={{width:'698px',height:'278px'}}/>
                                    :

                                    (val.needs==20||val.needs==30)?
                                        <div style={{display:'block',width:'698px',height:'278px',background:'rgb(206,232,249)'}}><span style={{float:'left',fontSize:24,margin:'110px 0 0 315px'}}>需要</span></div>
                                        :
                                        <div style={{display:'block',width:'698px',height:'278px',background:'#eee'}}><span style={{float:'left',fontSize:24,margin:'110px 0 0 315px'}}>不需要</span></div>

                            }
                            <div style={{textAlign:'center'}}>698 * 278</div>
                        </div>




                        </div>
                        )
                    }



                </div>


                    <Footer>
                        {
                            pagination &&
                            <Pagination
                                showQuickJumper
                                pageSize={+20}
                                // showSizeChanger
                                total={pagination.total_questions}
                                onChange={ this.pageChange }
                                // onShowSizeChange = { this.onShowSizeChange }
                                current={page}
                            />
                        }

                    </Footer>
                </div>

        )
    }
}

export default ImageView
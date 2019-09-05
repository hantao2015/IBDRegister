 import React,{Component} from 'react'
import { List ,Tag,Divider,Table, message} from 'antd';
import  './EditNotice.less';
import http from '../../../utils/api';
const noticeId = "620475440053";

  class EditNotice extends React.Component{
    state = {
        data:[{}]
    }
    componentDidMount = async() => {
       await this.getData();
    }
    getData = async() => {
        let res;
        try {
            res = await http().getTable({
                resid:noticeId
            })
            // if(res.data.error === 0){
                this.setState({
                    data:res.data.data
                })
                console.log("re",res.data.data)
            // }
        } catch (error) {
            
        }
    }

    render(){
        const {data} = this.state;
        const columns = [
            {
              title: '序号',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '标题',
              dataIndex: 'title',
              key: 'title',
              render: text => <a>{text}</a>,
            },
            {
              title: '消息内容',
              dataIndex: 'content',
              key: 'content',
            },
            {
              title: '发布者',
              dataIndex: 'doctor',
              key: 'doctor',
            },
            {
              title: '文件',
              dataIndex: 'file',
              key: 'file',
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
            },
            // {
            //   title: 'Tags',
            //   key: 'tags',
            //   dataIndex: 'tags',
            //   render: tags => (
            //     <span>
            //       {tags.map(tag => {
            //         let color = tag.length > 5 ? 'geekblue' : 'green';
            //         if (tag === 'loser') {
            //           color = 'volcano';
            //         }
            //         return (
            //           <Tag color={color} key={tag}>
            //             {tag.toUpperCase()}
            //           </Tag>
            //         );
            //       })}
            //     </span>
            //   ),
            // },
            {
              title: '操作',
              key: 'action',
              render: (text, record) => (
                <span>
                  <a>查看</a>
                  <Divider type="vertical" />
                  <a>修改</a>
                  <Divider type="vertical" />
                  <a>发布</a>
                </span>
              ),
            },
          ];
        return (
            <Table className='EditNotice' columns={columns}  dataSource={data} />
        )
    }

  }
  export default EditNotice;
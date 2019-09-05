 import React,{Component} from 'react'
import { List ,Tag,Divider,Table, message} from 'antd';
import  './ApproveList.less';
import http from '../../../utils/api';
const applyProjectId = "620475440053";

  class ApproveList extends React.Component{
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
                resid:applyProjectId
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
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              render: text => <a>{text}</a>,
            },
            {
              title: '申请时间',
              dataIndex: 'applyTime',
              key: 'applyTime',
            },
            {
              title: '所属单位',
              dataIndex: 'hospital',
              key: 'hospital',
            },
            {
              title: '申请人',
              dataIndex: 'doctor',
              key: 'doctor',
            },
            {
              title: '研究类型',
              dataIndex: 'studyType',
              key: 'studyType',
            },
            {
              title: '负责人',
              dataIndex: 'doctor',
              key: 'doctor',
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
                  <a>建议</a>
                </span>
              ),
            },
          ];
        return (
            <Table className='EditNotice' columns={columns}  dataSource={data} />
        )
    }

  }
  export default ApproveList;
import React, { Component } from "react";
import {
  List,
  Tag,
  Divider,
  Table,
  message,
  Form,
  Button,
  Checkbox,
  Spin,
  Modal,
  Input
} from "antd";
import "./ApproveList.less";
import http from "../../../utils/api";
const applyDataBaseId = "620384838453";
const { TextArea } = Input;

class ApproveList extends React.Component {
  state = {
    data: [{}],
    record: {},
    page: "listPage",
    spin: false,
    visible: false
  };
  componentDidMount = async () => {
    await this.getData();
  };
  getData = async () => {
    this.setState({
      spin: true
    });
    let res;
    try {
      res = await http().getTable({
        resid: applyDataBaseId
      });
      if (res.data.error === 0) {
        this.setState({
          data: res.data.data
        });
      }
    } catch (error) {}
    this.setState({
      spin: false
    });
  };
  onCheck = record => {
    this.setState({
      page: "checkPage",
      record
    });
  };
  onBack = () => {
    this.setState({
      page: "listPage"
    });
  };
  onPassOrReject = async type => {
    http().clearCache()
    let res;
    let data;
    if (type === 1) {
       data = [
        {
          ...this.state.record,
          isPass: "Y"
        }
      ];
    } else {
       data = [
        {
          ...this.state.record,
          isPass: "N"
        }
      ];
    }
    try {
      res = await http().modifyRecords({
        resid: applyDataBaseId,
        data
      });
      if (res.data.Error === 0) {
        message.success("操作成功");
      }
      this.setState({
        page: "listPage"
      });
      await this.getData();
    } catch (error) {
      message.error(error.message);
    }
  };
  render() {
    const { data, record, page, spin, visible } = this.state;
    const options = [
      { label: "单中心研究", value: "单中心研究" },
      { label: "多中心研究", value: "多中心研究" },
      { label: "第三方研究", value: "第三方研究" },
      { label: "所有研究", value: "所有研究" }
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const checkPage = (
      <Form {...formItemLayout} className="approveList-form">
        {page === "checkPage" ? (
          <Button
            icon={"rollback"}
            type="primary"
            onClick={this.onBack}
            className="approveList-btn"
          >
            返回
          </Button>
        ) : null}
        <div className="approveList-btns">
          {record.isPass ? null : (
            <React.Fragment>
              {" "}
              <Button
                className="approveList-btn"
                type="primary"
                onClick={() => {
                  this.onPassOrReject(1);
                }}
              >
                同意
              </Button>
              <Button
                className="approveList-btn"
                type="danger"
                onClick={() => {
                  this.onPassOrReject(2);
                }}
              >
                拒绝
              </Button>
            </React.Fragment>
          )}
        </div>
        <h1>参与CHASE-IBD数据库建设申请表</h1>
        <h3>申请医疗单位</h3>
        <Form.Item label={<span>申请人&nbsp;</span>}>
          <span>{record.doctor}</span>
        </Form.Item>
        <Form.Item label={<span>所属单位&nbsp;</span>}>
          <span>{record.hospital}</span>
        </Form.Item>
        <Form.Item label={<span>职称&nbsp;</span>}>
          <span>{record.post}</span>
        </Form.Item>
        <Form.Item label={<span>联系电话&nbsp;</span>}>
          <span>{record.phoneNumber}</span>
        </Form.Item>
        <Form.Item label={<span>E-mail&nbsp;</span>}>
          <span>{record.email}</span>
        </Form.Item>
        <Form.Item label={<span>IBD治疗团队名单&nbsp;</span>}>
          <span>{record.teamPeople}</span>&nbsp;&nbsp;
          <span>{record.teamPeople2}</span>&nbsp;&nbsp;
          <span>{record.teamPeople3}</span>&nbsp;&nbsp;
        </Form.Item>
        <Form.Item label={<span>选择参与数据库研究&nbsp;</span>}>
          <Checkbox.Group
            options={options}
            defaultValue={record.studyType}
            onChange={this.onChangeCheckbox}
          />
        </Form.Item>
        <h3>贵院目前患者数量</h3>

        <Form.Item label={<span>CD患者数量&nbsp;</span>}>
          <span>{record.CDPatientNumber}</span>
        </Form.Item>
        <Form.Item label={<span>UC患者数量&nbsp;</span>}>
          <span>{record.UCPatientNumber}</span>
        </Form.Item>
        <Form.Item label={<span>医师执照&nbsp;</span>}>
          <img
            src={record.doctorPhoto}
            alt="avatar"
            style={{ backgroundSize: "100%" }}
          />
        </Form.Item>
      </Form>
    );
    const columns = [
      {
        title: "序号",
        dataIndex: "name",
        key: "name",
        width:150
      },
      // {
      //   title: 'Name',
      //   dataIndex: 'name',
      //   key: 'name',
      //   render: text => <a>{text}</a>,
      // },
      {
        title: "申请人",
        dataIndex: "doctor",
        key: "doctor",
        width:150
      },
      {
        title: "申请时间",
        dataIndex: "applyTime",
        key: "applyTime",
        width:150
      },
      {
        title: "所属单位",
        dataIndex: "hospital",
        key: "hospital",
        width:150
      },
      {
        title: "研究类型",
        dataIndex: "studyType",
        key: "studyType",
        width:150
      },
      {
        title: "审批状态",
        dataIndex: "approveStatus",
        key: "approveStatus",
        width:150,
        render:data =>{
         return  <Tag color={data === '通过'?"geekblue" :data === '拒绝'?"red":"green"} >
          {data}
        </Tag>
        }
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
        title: "操作",
        key: "action",
        width:150,
        render: (text, record) => (
          <span>
            <a
              onClick={() => {
                this.onCheck(record);
              }}
            >
              查看/建议
            </a>
          </span>
        )
      }
    ];
    return (
      <div className="approveList">
        {page === "listPage" ? (
          <Spin spinning={spin}>
            <Table
              key="1"
              className="approveList-table"
              columns={columns}
              dataSource={data}
              scroll={{ x: 1000, y: 'calc(100vh - 220px)' }} 
            />
          </Spin>
        ) : (
          checkPage
        )}
      </div>
    );
  }
}
export default ApproveList;

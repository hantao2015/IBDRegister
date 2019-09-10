import React, { Component } from "react";
import {
  List,
  Tag,
  Divider,
  Table,
  message,
  Popconfirm,
  Button,
  Form,
  Input,
  Spin,
  Modal,
  
} from "antd";
import "./EditNotice.less";
import ApplyDataBase from "../ApplyDataBase";
import http from "../../../utils/api";
import TextArea from "antd/lib/input/TextArea";
const noticeId = "620317621824";
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
const columns = props => {
  const { onEdit,onPublish,data } = props;
  return [
    {
      title: "序号",
      dataIndex: "name",
      key: "name",
      width:150
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      width:250,
      render: text => <a>{text}</a>
    },
    {
      title: "消息内容",
      dataIndex: "content",
      key: "content",
      width:400
    },
    {
      title: "发布者",
      dataIndex: "doctor",
      key: "doctor",
      width:150
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: data => (
            // <span>
            //   {/* {tags.map(tag => {
            //     let color = tag.length > 5 ? 'geekblue' : 'green';
            //     if (tag === 'loser') {
            //       color = 'volcano';
            //     } */}
            //     {data.map((item) => {
                  <Tag color={data === '已发布'?"geekblue":"green"} >
                    {data}
                  </Tag>
            //     })}
            //  </span>
          ),
          width:150
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <span>
          <a
            onClick={() => {
              onEdit(record);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a onClick={() => {
            onPublish(record)
          }}>发布</a>
        </span>
      )
    }
  ];
};

class EditNotice extends React.Component {
  state = {
    data: [],
    record: {},
    page: "listPage", //当前页面
    spin: false, //是否显示加载
    visible: false, //是否显示添加模态框
    editVisible: false //是否显示查看模态框
  };
  handleCancel = () => {
    this.setState({
      visible: false,
      editVisible: false
    });
  };
  save = async (e, type) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.onSubmit(values, type);
      }
    });
  };
  //保存数据，如果 传入type是1 ，表示添加。type是2 的话表示 修改。
  onSubmit = async (values, type) => {
    let res;
    if (type === 1) {
      let data = [values];
      try {
        res = await http().addRecords({
          resid: noticeId,
          data
        });
        if(res.data.Error === 0){
          message.success("添加成功")
          this.setState({
            visible: false
          });
          await this.getData();
        }
      } catch (error) {
        message.error(error.message);
      }
    } else {
      let data = [{ ...values, REC_ID: this.state.record.REC_ID }];
      try {
        res = await http().modifyRecords({
          resid: noticeId,
          data
        });
        if (res.data.Error === 0) {
          message.success("修改成功");
          this.setState({
            editVisible: false
          });
          await this.getData();
        }
      } catch (error) {
        message.error(error.message);
      }
    }
  };

  publish = () => {
    this.setState({
      page: "listPage"
    });
  };
  onPublish = async(record) => {
    record.isPublish = 'Y'
    let res;
    try {
      res = await http().modifyRecords({
        resid:noticeId,
        data:[record]
      })
      if(res.data.Error === 0){
        message.success("发布成功")
        await this.getData();
      }
    } catch (error) {
      
    }
  }
  renderContent = () => {
    let page = this.state.page;
    switch (page) {
      case "listPage":
        return this.renderListPage();
      case "addPage":
        return this.renderAddPage();
      case "checkPage":
        return this.renderCheckPage();
    }
  };
  renderListPage = () => {
    let data = this.state.data;
    let { spin, record } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="editNotice">
        <Button type="primary" className="editNotice-add" onClick={this.onAdd}>
          添加新通知
        </Button>
        <Spin spinning={spin}>
          <Table
            key="3"
            className="editNotice-table"
            columns={columns({
              onEdit: record => {
                this.onEdit(record);
              },
              onPublish:record=>{
                this.onPublish(record)
              },data:data},)
            }
            scroll={{ x: 1000, y: 'calc(100vh - 260px)'  }} 
            dataSource={data}
          />
          <Modal
            title="添加新通知"
            visible={this.state.visible}
            width={700}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            destroyOnClose={true}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                取消
              </Button>,
              <Button key="submit" type="primary" onClick={()=>{
                this.save(1)
              }}>
                保存
              </Button>,
              <Button key="submit" type="primary" onClick={this.publish}>
                发布
              </Button>
            ]}
          >
            <Form {...formItemLayout} className="editNotice-form">
              {/* <h1>消息编辑</h1> */}
              <Form.Item
                className="editNotice-form-item"
                label={<span>标题&nbsp;</span>}
              >
                {getFieldDecorator("title", {
                  rules: [
                    {
                      required: true,
                      message: "请输入标题",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item
                className="editNotice-form-item"
                label={<span>消息内容&nbsp;</span>}
              >
                {getFieldDecorator("content", {
                  rules: [
                    {
                      required: true,
                      message: "请输入消息内容",
                      whitespace: true
                    }
                  ]
                })(<TextArea className="editNotice-form-item-textarea" />)}
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="修改通知"
            visible={this.state.editVisible}
            width={700}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            destroyOnClose={true}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                取消
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  this.save(2);
                }}
              >
                保存
              </Button>
            ]}
          >
            <Form {...formItemLayout} className="editNotice-form">
              {/* <h1>消息编辑</h1> */}
              <Form.Item
                className="editNotice-form-item"
                label={<span>标题&nbsp;</span>}
              >
                {getFieldDecorator("title", {
                  rules: [
                    {
                      required: true,
                      message: "请输入标题",
                      whitespace: true
                    }
                  ],
                  initialValue: record.title
                })(<Input />)}
              </Form.Item>
              <Form.Item
                className="editNotice-form-item"
                label={<span>消息内容&nbsp;</span>}
              >
                {getFieldDecorator("content", {
                  rules: [
                    {
                      required: true,
                      message: "请输入消息内容",
                      whitespace: true
                    }
                  ],
                  initialValue: record.content
                })(<TextArea className="editNotice-form-item-textarea" />)}
              </Form.Item>
            </Form>
          </Modal>
        </Spin>
      </div>
    );
  };
  // renderCheckPage = () => {
  //   const { getFieldDecorator } = this.props.form;
  //   let record = this.state.record;
  //   return (
  //     <div className="editNotice">
  //       <Button type="primary" className="editNotice-add" onClick={this.onBack}>
  //         返回
  //       </Button>

  //     </div>
  //   );
  // };
  // renderAddPage = () => {
  //   const { getFieldDecorator } = this.props.form;
  //   return (
  //     <div className="editNotice">
  //       <Button type="primary" className="editNotice-add" onClick={this.onBack}>
  //         返回
  //       </Button>

  //     </div>
  //   );
  // };
  componentDidMount = async () => {
    await this.getData();
  };
  getData = async () => {
    let res;
    this.setState({
      spin: true
    });
    try {
      res = await http().getTable({
        resid: noticeId
      });
      // if(res.data.error === 0){
      this.setState({
        data: res.data.data
      });
      // }
    } catch (error) {}
    this.setState({
      spin: false
    });
  };
  onAdd = () => {
    this.setState({
      // page: "addPage",
      visible: true
    });
  };
  onBack = () => {
    this.setState({
      page: "listPage"
    });
  };
  onEdit = record => {
    this.setState({
      editVisible: true,
      record
    });
  };
  render() {
    const { data, record, page } = this.state;

    return this.renderContent();
  }
}
export default Form.create()(EditNotice);

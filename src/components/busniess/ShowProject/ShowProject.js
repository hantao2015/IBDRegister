import React, { Component } from "react";
import { Modal, Tag, Button, Table, message, Spin, Form, Input } from "antd";
import "./ShowProject.less";
import http from "../../../utils/api";
const applyProjectId = "620475440053";
const suggestId = "621432069832";
const { TextArea } = Input;

class ShowProject extends React.Component {
  state = {
    data: [{}],
    page: "listPage",
    spin: false,
    record: {},
    visible: false
  };
  componentDidMount = async () => {
    http().clearCache();
    await this.getData();
  };
  componentWillUnmount() {
    // 卸载异步操作设置状态
    this.setState = (state, callback) => {
      return;
    };
  }
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
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  onSuggest = () => {
    this.setState({
      visible: true
    });
  };
  submitSuggest = async e => {
    const { record } = this.state;
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      let res;
      let data = [
        {
          suggest: values.suggest,
          projectId: record.REC_ID
        }
      ];
      try {
        res = await http().addRecords({
          resid: suggestId,
          data
        });
        if (res.data.Error === 0) {
          message.success("添加成功");
        }
      } catch (error) {
        message.error(error.message);
      }
      this.setState({
        visible: false
      });
    });
  };
  getData = async () => {
    this.setState({
      spin: true
    });
    let res;
    try {
      res = await http().getTable({
        resid: applyProjectId
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

  render() {
    const { data, spin, page } = this.state;
    const columns = [
      {
        title: "序号",
        dataIndex: "number",
        key: "number",
        width: 80
      },
      {
        title: "申请时间",
        dataIndex: "applyTime",
        key: "applyTime",
        width: 150
      },
      {
        title: "课题名称",
        dataIndex: "task",
        key: "hospital",
        width: 150
      },
      {
        title: "申请人",
        dataIndex: "doctor",
        key: "doctor",
        width: 150
      },
      {
        title: "审批状态",
        dataIndex: "status",
        key: "status",
        width: 150,
        render: data => {
          return (
            <Tag
              color={
                data === "通过" ? "geekblue" : data === "拒绝" ? "red" : "green"
              }
            >
              {data}
            </Tag>
          );
        }
      }
    ];
    return (
      <div className="approveProjectList">
        {page === "listPage" ? (
          <Spin spinning={spin}>
            <Table
              key="2"
              className="approveProjectList-table"
              columns={columns}
              dataSource={data}
              scroll={{ x: 1000, y: "calc(100vh - 220px)" }}
            />
          </Spin>
        ) : null}
      </div>
    );
  }
}
export default Form.create()(ShowProject);
